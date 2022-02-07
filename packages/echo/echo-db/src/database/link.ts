//
// Copyright 2020 DXOS.org
//

import assert from 'assert';

import { ItemID, ItemType } from '@dxos/echo-protocol';
import { Model } from '@dxos/model-factory';

import { Entity } from './entity';
import { Item } from './item';
import { ItemManager } from './item-manager';

export interface LinkData {
  sourceId: ItemID
  targetId: ItemID
  source?: Item<any> // TODO(burdon): Separate type if items are not set?
  target?: Item<any>
}

/**
 * Link variant of an item. Link two objects together. Can hold a custom model.
 */
export class Link<M extends Model<any>, L extends Model<any> = any, R extends Model<any> = any> extends Entity<M> {
  /**
   * @internal
   */
  _link: LinkData;

  constructor (
    itemManager: ItemManager,
    itemId: ItemID,
    itemType: ItemType | undefined,
    model: M,
    link: LinkData
  ) {
    super(
      itemManager,
      itemId,
      itemType,
      model
    );
    this._link = link;
  }

  get isLink (): true {
    return true;
  }

  get sourceId (): ItemID {
    return this._link.sourceId;
  }

  get targetId (): ItemID {
    return this._link.targetId;
  }

  get source (): Item<L> {
    assert(this._link.source, 'Dangling link');
    return this._link.source;
  }

  get target (): Item<R> {
    assert(this._link.target, 'Dangling link');
    return this._link.target;
  }

  /**
   * @internal
   */
  _isDangling () {
    return !this._link.source || !this._link.target;
  }
}