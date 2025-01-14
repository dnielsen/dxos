//
// Copyright 2022 DXOS.org
//

import expect from 'expect';

import { asyncTimeout } from '@dxos/async';
import { MockFeedWriter } from '@dxos/feed-store/testing';
import { PublicKey } from '@dxos/keys';
import { MutationMetaWithTimeframe } from '@dxos/protocols';
import { describe, test } from '@dxos/test';
import { Timeframe } from '@dxos/timeframe';

import { Model } from './model';
import { StateManager } from './state-manager';
import { TestListModel } from './testing';

// feedA < feedB
const feedA = PublicKey.fromHex('0x0000000000000000000000000000000000000000000000000000000000000001');
const feedB = PublicKey.fromHex('0x0000000000000000000000000000000000000000000000000000000000000002');

const createId = () => PublicKey.random().toHex();

describe('StateManager', () => {
  test('construct readonly and apply mutations', () => {
    const stateManager = new StateManager(TestListModel.meta.type, TestListModel, createId(), {}, feedA, null);

    expect(stateManager.model).toBeInstanceOf(TestListModel);
    expect(stateManager.model).toBeInstanceOf(Model);
    expect(stateManager.modelMeta).toEqual(TestListModel.meta);
    expect(stateManager.model.messages).toEqual([]);

    stateManager.processMessage(createMeta(feedA, 0), TestListModel.meta.mutationCodec.encode({ data: 'message1' }));
    expect(stateManager.model.messages).toEqual([{ data: 'message1' }]);

    stateManager.processMessage(createMeta(feedA, 1), TestListModel.meta.mutationCodec.encode({ data: 'message2' }));
    expect(stateManager.model.messages).toEqual([{ data: 'message1' }, { data: 'message2' }]);
  });

  describe('snapshot and restore', () => {
    test('with model snapshots - TestListModel', () => {
      const stateManager = new StateManager(TestListModel.meta.type, TestListModel, createId(), {}, feedA, null);

      stateManager.processMessage(createMeta(feedA, 0), TestListModel.meta.mutationCodec.encode({ data: 'message1' }));
      const snapshot = stateManager.createSnapshot();

      stateManager.processMessage(createMeta(feedA, 1), TestListModel.meta.mutationCodec.encode({ data: 'message2' }));
      expect(stateManager.model.messages).toEqual([{ data: 'message1' }, { data: 'message2' }]);

      stateManager.resetToSnapshot(snapshot);
      expect(stateManager.model.messages).toEqual([{ data: 'message1' }]);
    });

    test('with framework snapshots - TestListModel', () => {
      const stateManager = new StateManager(TestListModel.meta.type, TestListModel, createId(), {}, feedA, null);

      stateManager.processMessage(createMeta(feedA, 0), TestListModel.meta.mutationCodec.encode({ data: 'message1' }));
      const snapshot = stateManager.createSnapshot();

      stateManager.processMessage(createMeta(feedA, 1), TestListModel.meta.mutationCodec.encode({ data: 'message2' }));
      expect(stateManager.model.messages).toEqual([{ data: 'message1' }, { data: 'message2' }]);

      stateManager.resetToSnapshot(snapshot);
      expect(stateManager.model.messages).toEqual([{ data: 'message1' }]);
    });
  });

  test('write loop', async () => {
    const feedWriter = new MockFeedWriter<Uint8Array>();
    const stateManager = new StateManager(TestListModel.meta.type, TestListModel, createId(), {}, feedA, feedWriter);
    feedWriter.written.on(([message, meta]) =>
      stateManager.processMessage(
        {
          feedKey: meta.feedKey,
          memberKey: PublicKey.random(),
          seq: meta.seq,
          timeframe: new Timeframe()
        },
        message
      )
    );

    await stateManager.model.sendMessage('message1');

    expect(stateManager.model.messages).toEqual([{ data: 'message1' }]);
  });

  test('late initialization', () => {
    const stateManager = new StateManager<TestListModel>(
      TestListModel.meta.type,
      undefined,
      createId(),
      {},
      feedA,
      null
    );
    expect(stateManager.initialized).toBe(false);
    expect(stateManager.modelType).toEqual(TestListModel.meta.type);

    stateManager.processMessage(createMeta(feedA, 0), TestListModel.meta.mutationCodec.encode({ data: 'message1' }));
    stateManager.initialize(TestListModel);
    expect(stateManager.initialized).toBe(true);
    expect(stateManager.model).toBeInstanceOf(TestListModel);
    expect(stateManager.model.messages).toEqual([{ data: 'message1' }]);

    stateManager.processMessage(createMeta(feedA, 1), TestListModel.meta.mutationCodec.encode({ data: 'message2' }));
    expect(stateManager.model.messages).toEqual([{ data: 'message1' }, { data: 'message2' }]);
  });

  test('update event gets triggered', async () => {
    const stateManager = new StateManager(TestListModel.meta.type, TestListModel, createId(), {}, feedA, null);

    const gotUpdate = stateManager.model.update.waitForCount(1);
    stateManager.processMessage(createMeta(feedA, 0), TestListModel.meta.mutationCodec.encode({ data: 'message1' }));

    await asyncTimeout(gotUpdate, 100, new Error('timeout'));
  });

  describe('optimistic mutations', () => {
    test('single mutation gets applied synchronously', async () => {
      const feedWriter = new MockFeedWriter<Uint8Array>();
      const stateManager = new StateManager(TestListModel.meta.type, TestListModel, createId(), {}, feedA, feedWriter);
      feedWriter.written.on(([message, meta]) =>
        stateManager.processMessage(
          {
            feedKey: meta.feedKey,
            memberKey: PublicKey.random(),
            seq: meta.seq,
            timeframe: new Timeframe()
          },
          message
        )
      );

      const promise = stateManager.model.sendMessage('message1');
      expect(stateManager.model.messages).toEqual([{ data: 'message1' }]);

      await promise;
      expect(stateManager.model.messages).toEqual([{ data: 'message1' }]);
    });

    test('two optimistic mutations queued together', async () => {
      const feedWriter = new MockFeedWriter<Uint8Array>();
      const stateManager = new StateManager(TestListModel.meta.type, TestListModel, createId(), {}, feedA, feedWriter);
      feedWriter.written.on(([message, meta]) =>
        stateManager.processMessage(
          {
            feedKey: meta.feedKey,
            memberKey: PublicKey.random(),
            seq: meta.seq,
            timeframe: new Timeframe()
          },
          message
        )
      );

      const promise1 = stateManager.model.sendMessage('message1');
      const promise2 = stateManager.model.sendMessage('message2');
      expect(stateManager.model.messages).toEqual([{ data: 'message1' }, { data: 'message2' }]);

      await promise1;
      expect(stateManager.model.messages).toEqual([{ data: 'message1' }, { data: 'message2' }]);

      await promise2;
      expect(stateManager.model.messages).toEqual([{ data: 'message1' }, { data: 'message2' }]);
    });

    test('with reordering', async () => {
      const feedWriter = new MockFeedWriter<Uint8Array>(feedB);
      const stateManager = new StateManager(TestListModel.meta.type, TestListModel, createId(), {}, feedA, feedWriter);
      feedWriter.written.on(([message, meta]) =>
        stateManager.processMessage(
          {
            feedKey: meta.feedKey,
            memberKey: PublicKey.random(),
            seq: meta.seq,
            timeframe: new Timeframe()
          },
          message
        )
      );

      const promise = stateManager.model.sendMessage('message1');
      expect(stateManager.model.messages).toEqual([{ data: 'message1' }]);

      // Send a message that will be ordered first.
      stateManager.processMessage(createMeta(feedA, 0), TestListModel.meta.mutationCodec.encode({ data: 'message2' }));
      expect(stateManager.model.messages).toEqual([{ data: 'message2' }, { data: 'message1' }]);

      await promise;
      expect(stateManager.model.messages).toEqual([{ data: 'message2' }, { data: 'message1' }]);
    });
  });
});

const createMeta = (feedKey: PublicKey, seq: number): MutationMetaWithTimeframe => ({
  feedKey,
  memberKey: feedKey,
  seq,
  timeframe: new Timeframe()
});
