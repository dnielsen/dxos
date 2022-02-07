//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import debug from 'debug';
import pify from 'pify';

import { Event, trigger } from '@dxos/async';
import { createId } from '@dxos/crypto';
import { timed } from '@dxos/debug';
import { EchoEnvelope, FeedWriter, ItemID, ItemType, mapFeedWriter } from '@dxos/echo-protocol';
import { Model, ModelFactory, ModelMessage, ModelType } from '@dxos/model-factory';

import { UnknownModelError } from '../errors';
import { DefaultModel } from './default-model';
import { Entity } from './entity';
import { Item } from './item';
import { Link } from './link';

const log = debug('dxos:echo:item-manager');

export interface ModelConstructionOptions {
  itemId: ItemID
  modelType: ModelType
  initialMutations?: ModelMessage<Uint8Array>[],
  modelSnapshot?: Uint8Array,
}

export interface ItemConstructionOptions extends ModelConstructionOptions {
  itemType: ItemType | undefined,
  parentId?: ItemID,
}

export interface LinkConstructionOptions extends ModelConstructionOptions {
  itemType: ItemType | undefined,
  source: ItemID;
  target: ItemID;
}

/**
 * Manages the creation and indexing of items.
 */
export class ItemManager {
  /**
   * Fired immediately after any update in the entities.
   *
   * If the information about which entity got updated is not required prefer using `debouncedItemUpdate`.
   */
  readonly update = new Event<Entity<any>>();

  /**
   * Update event.
   * Contains a list of all entities changed from the last update.
   */
  readonly debouncedUpdate: Event<Entity<any>[]> = debounceEntityUpdateEvent(this.update);

  /**
   * Map of active items.
   * @private
   */
  private readonly _entities = new Map<ItemID, Entity<any>>();

  /**
   * Map of item promises (waiting for item construction after genesis message has been written).
   * @private
   */
  private readonly _pendingItems = new Map<ItemID, (item: Entity<any>) => void>();

  /**
   * @param _modelFactory
   * @param _writeStream Outbound `dxos.echo.IEchoEnvelope` mutation stream.
   */
  constructor (
    private readonly _modelFactory: ModelFactory,
    private readonly _writeStream?: FeedWriter<EchoEnvelope>
  ) {}

  get entities () {
    return this._entities;
  }

  get items (): Item<any>[] {
    return Array.from(this._entities.values()).filter((entity): entity is Item<any> => entity instanceof Item);
  }

  get links (): Link<any>[] {
    return Array.from(this._entities.values()).filter((entity): entity is Link<any> => entity instanceof Link);
  }

  /**
   * Creates an item and writes the genesis message.
   * @param {ModelType} modelType
   * @param {ItemType} [itemType]
   * @param {ItemID} [parentId]
   * @param initProps
   */
  @timed(5_000)
  async createItem (
    modelType: ModelType,
    itemType?: ItemType,
    parentId?: ItemID,
    initProps?: any // TODO(burdon): Remove/change to array of mutations.
  ): Promise<Item<Model<unknown>>> {
    assert(this._writeStream);
    assert(modelType);

    if (!this._modelFactory.hasModel(modelType)) {
      throw new UnknownModelError(modelType);
    }

    let mutation: Uint8Array | undefined;
    if (initProps) {
      const meta = this._modelFactory.getModelMeta(modelType);
      if (!meta.getInitMutation) {
        throw new Error('Model does not support initializer.');
      }
      mutation = meta.mutation.encode(await meta.getInitMutation(initProps));
    }

    // Pending until constructed (after genesis block is read from stream).
    const [waitForCreation, callback] = trigger<Entity<any>>();

    const itemId = createId();
    this._pendingItems.set(itemId, callback);

    // Write Item Genesis block.
    log('Item Genesis:', itemId);
    await this._writeStream.write({
      itemId,
      genesis: {
        itemType,
        modelType
      },
      itemMutation: parentId ? { parentId } : undefined,
      mutation
    });

    // Unlocked by construct.
    log('Pending Item:', itemId);
    const item = await waitForCreation();
    assert(item instanceof Item);
    return item;
  }

  @timed(5_000)
  async createLink (
    modelType: ModelType, itemType: ItemType | undefined, source: ItemID, target: ItemID, initProps?: any
  ): Promise<Link<any, any, any>> {
    assert(this._writeStream);
    assert(modelType);

    if (!this._modelFactory.hasModel(modelType)) {
      throw new UnknownModelError(modelType);
    }

    let mutation: Uint8Array | undefined;
    if (initProps) {
      const meta = this._modelFactory.getModelMeta(modelType);
      if (!meta.getInitMutation) {
        throw new Error('Tried to provide initialization params to a model with no initializer');
      }
      mutation = meta.mutation.encode(await meta.getInitMutation(initProps));
    }

    // Pending until constructed (after genesis block is read from stream).
    const [waitForCreation, callback] = trigger<Entity<any>>();

    const itemId = createId();
    this._pendingItems.set(itemId, callback);

    // Write Item Genesis block.
    log('Item Genesis:', itemId);
    await this._writeStream.write({
      itemId,
      genesis: {
        itemType,
        modelType,
        link: { source, target }
      },
      mutation
    });

    // Unlocked by construct.
    log('Pending Item:', itemId);
    const link = await waitForCreation();
    assert(link instanceof Link);
    return link;
  }

  private async _constructModel ({
    modelType, itemId, modelSnapshot, initialMutations
  }: ModelConstructionOptions): Promise<Model<any>> {
    // TODO(burdon): Skip genesis message (and subsequent messages) if unknown model. Build map of ignored items.
    if (!this._modelFactory.hasModel(modelType)) {
      throw new UnknownModelError(modelType);
    }

    const modelMeta = this._modelFactory.getModelMeta(modelType);

    //
    // Convert model-specific outbound mutation to outbound envelope message.
    //
    const outboundTransform = this._writeStream && mapFeedWriter<unknown, EchoEnvelope>(mutation => ({
      itemId,
      mutation: modelMeta.mutation.encode(mutation)
    }), this._writeStream);

    // Create the model with the outbound stream.
    const model: Model<any> = this._modelFactory.createModel(modelType, itemId, outboundTransform);
    assert(model, `Invalid model: ${modelType}`);

    if (modelSnapshot) {
      if (model instanceof DefaultModel) {
        model.snapshot = modelSnapshot;
      } else {
        assert(modelMeta.snapshotCodec, 'Model snapshot provided but the model does not support snapshots.');
        await model.restoreFromSnapshot(modelMeta.snapshotCodec.decode(modelSnapshot));
      }
    }

    // Process initial mutations.
    if (initialMutations) {
      for (const mutation of initialMutations) {
        await model.processMessage(mutation.meta, modelMeta.mutation.decode(mutation.mutation));
      }
    }

    return model;
  }

  /**
   * Adds new entity to the tracked set. Sets up events and notifies any listeners waiting for this entity to be constructed.
   */
  private _addEntity (entity: Entity<any>) {
    assert(!this._entities.has(entity.id));
    this._entities.set(entity.id, entity);
    log('New entity:', String(entity));

    if (!(entity.model instanceof DefaultModel)) {
      // Notify Item was udpated.
      // TODO(burdon): Update the item directly?
      this.update.emit(entity);

      // TODO(telackey): Unsubscribe?
      entity.subscribe(() => {
        this.update.emit(entity);
      });
    }

    // Notify pending creates.
    this._pendingItems.get(entity.id)?.(entity);
  }

  /**
   * Constructs an item with the appropriate model.
   * @param itemId
   * @param modelType
   * @param itemType
   * @param readStream - Inbound mutation stream (from multiplexer).
   * @param [parentId] - ItemID of the parent of this Item (optional).
   * @param initialMutations
   * @param modelSnapshot
   */
  @timed(5_000)
  async constructItem ({
    itemId,
    modelType,
    itemType,
    parentId,
    initialMutations,
    modelSnapshot
  }: ItemConstructionOptions): Promise<Item<any>> {
    assert(itemId);
    assert(modelType);

    const parent = parentId ? this._entities.get(parentId) : null;
    if (parentId && !parent) {
      throw new Error(`Missing parent: ${parentId}`);
    }
    assert(!parent || parent instanceof Item);

    const model = await this._constructModel({
      itemId,
      modelType,
      initialMutations,
      modelSnapshot
    });

    const item = new Item(this, itemId, itemType, model, this._writeStream, parent);
    this._addEntity(item);

    return item;
  }

  /**
   * Constructs an item with the appropriate model.
   * @param readStream - Inbound mutation stream (from multiplexer).
   * @param parentId - ItemID of the parent of this Item (optional).
   */
  @timed(5_000)
  async constructLink ({
    itemId,
    modelType,
    itemType,
    initialMutations,
    modelSnapshot,
    source,
    target
  }: LinkConstructionOptions): Promise<Link<any>> {
    assert(itemId);
    assert(modelType);

    const model = await this._constructModel({
      itemId,
      modelType,
      initialMutations,
      modelSnapshot
    });

    const sourceItem = this.getItem(source);
    const targetItem = this.getItem(target);

    const link = new Link(this, itemId, itemType, model, {
      sourceId: source,
      targetId: target,
      source: sourceItem,
      target: targetItem
    });

    if (sourceItem) {
      sourceItem._links.add(link);
    }
    if (targetItem) {
      targetItem._refs.add(link);
    }

    this._addEntity(link);

    return link;
  }

  /**
   * Process a message directed to a specific model.
   * @param itemId Id of the item containing the model.
   * @param message Encoded model message
   */
  async processModelMessage (itemId: ItemID, message: ModelMessage<Uint8Array>) {
    const item = this._entities.get(itemId);
    assert(item);

    const decoded = item.modelMeta.mutation.decode(message.mutation);

    await item.model.processMessage(message.meta, decoded);
    this.update.emit(item);
  }

  /**
   * Retrieves a item from the index.
   * @param itemId
   */
  getItem<M extends Model<any> = any> (itemId: ItemID): Item<M> | undefined {
    const entity = this._entities.get(itemId);
    if (entity) {
      assert(entity instanceof Item);
    }
    return entity;
  }

  getItemsWithDefaultModels (): Entity<DefaultModel>[] {
    return Array.from(this._entities.values()).filter(item => item.model instanceof DefaultModel);
  }

  /**
   * Recursive method to unlink and remove items from the active set.
   * @param itemId
   */
  deconstructItem (itemId: ItemID) {
    const item = this._entities.get(itemId);
    assert(item);

    this._entities.delete(itemId);

    if (item instanceof Item) {
      if (item.parent) {
        item.parent._children.delete(item);
      }

      for (const child of item.children) {
        this.deconstructItem(child.id);
      }

      for (const ref of item.refs) {
        ref._link!.target = undefined;
      }

      for (const link of item.links) {
        link._link!.source = undefined;
      }
    }
  }

  /**
   * Reconstruct an item with a default model when that model becomes registered.
   * New model instance is created and streams are reconnected.
   */
  async reconstructItemWithDefaultModel (itemId: ItemID) {
    const item = this._entities.get(itemId);
    assert(item);
    assert(item.model instanceof DefaultModel);

    // Disconnect the stream.
    await pify(item.model.processor.end.bind(item.model.processor))();

    item._setModel(await this._constructModel({
      itemId,
      modelType: item.model.originalModelType,
      initialMutations: item.model.mutations,
      modelSnapshot: item.model.snapshot
    }));

    this.update.emit(item);
  }
}

/**
 * Returns a new event that groups all of the updates emitted during single tick into a single event emission.
 */
function debounceEntityUpdateEvent (event: Event<Entity<any>>): Event<Entity<any>[]> {
  const debouncedEvent = new Event<Entity<any>[]>();

  let firing = false;

  const emittedSinceLastFired = new Set<Entity<any>>();
  debouncedEvent.addEffect(() => event.on(arg => {
    emittedSinceLastFired.add(arg);
    if (!firing) {
      firing = true;
      setTimeout(() => {
        firing = false;
        const args = Array.from(emittedSinceLastFired);
        emittedSinceLastFired.clear();
        debouncedEvent.emit(args);
      }, 0);
    }
  }));

  return debouncedEvent;
}