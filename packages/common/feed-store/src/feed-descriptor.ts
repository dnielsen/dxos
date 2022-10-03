//
// Copyright 2019 DXOS.org
//

import defaultHypercore from 'hypercore';
import assert from 'node:assert';
import pify from 'pify';
import { callbackify } from 'util';

import { Lock } from '@dxos/async';
import { sha256, verifySignature, Signer } from '@dxos/crypto';
import { PublicKey } from '@dxos/keys';
import type { Directory } from '@dxos/random-access-storage';

import type { HypercoreFeed, Hypercore } from './hypercore-types';
import type { ValueEncoding } from './types';

interface FeedDescriptorOptions {
  directory: Directory
  key: PublicKey
  hypercore: Hypercore
  secretKey?: Buffer
  valueEncoding?: ValueEncoding
  disableSigning?: boolean
  signer?: Signer
}

/**
 * FeedDescriptor
 *
 * Abstract handler for an Hypercore instance.
 */
export class FeedDescriptor {
  private readonly _directory: Directory;
  private readonly _key: PublicKey;
  private readonly _secretKey?: Buffer;
  private readonly _valueEncoding?: ValueEncoding;
  private readonly _hypercore: Hypercore;
  private readonly _lock: Lock;
  private readonly _disableSigning: boolean;
  private readonly _signer?: Signer;

  private _feed: HypercoreFeed | null;

  constructor (options: FeedDescriptorOptions) {
    const {
      directory,
      key,
      secretKey,
      valueEncoding,
      hypercore = defaultHypercore,
      disableSigning = false,
      signer
    } = options;
    assert(!signer || !secretKey, 'Cannot use signer and secretKey at the same time.');
    assert(!signer || !disableSigning, 'Signing cannot be disabled when signer is provided');

    this._directory = directory;
    this._valueEncoding = valueEncoding;
    this._hypercore = hypercore;
    this._key = key;
    this._secretKey = secretKey;
    this._disableSigning = !!disableSigning;
    this._signer = signer;

    this._lock = new Lock();

    this._feed = null;
  }

  // TODO(dmaretskyi): Rename to `hypercore` to avoid code spelling `feed.feed`.
  get feed (): HypercoreFeed {
    assert(this._feed, 'Feed is not initialized');
    return this._feed;
  }

  get opened () {
    return !!(this._feed && this._feed.opened && !this._feed.closed);
  }

  get key () {
    return this._key;
  }

  get secretKey () {
    return this._secretKey;
  }

  get valueEncoding () {
    return this._valueEncoding;
  }

  get writable () {
    return !!this._signer;
  }

  /**
   * Open an Hypercore feed based on the related feed options.
   *
   * This is an atomic operation, FeedDescriptor makes
   * sure that the feed is not going to open again.
   */
  async open (): Promise<HypercoreFeed> {
    if (this.opened) {
      return this.feed;
    }

    await this._lock.executeSynchronized(async () => {
      await this._open();
    });
    return this.feed;
  }

  /**
   * Close the Hypercore referenced by the descriptor.
   */
  async close () {
    if (!this.opened) {
      return;
    }

    await this._lock.executeSynchronized(async () => {
      await pify(this._feed?.close.bind(this._feed))();
    });
  }

  /**
   * Defines the real path where the Hypercore is going
   * to work with the RandomAccessStorage specified.
   */

  private _createStorage (dir = ''): (name: string) => HypercoreFile {
    return (name) => {
      const file = this._directory.createOrOpenFile(`${dir}/${name}`);
      // Separation between our internal File API and Hypercore's.
      return {
        read: callbackify(file.read.bind(file)),
        write: callbackify(file.write.bind(file)),
        del: callbackify(file.truncate.bind(file)),
        stat: callbackify(file.stat.bind(file)),
        close: callbackify(file.close.bind(file)),
        destroy: callbackify(file.delete.bind(file))
      } as HypercoreFile;
    };
  }

  private async _open () {
    const storage = this._createStorage(this._key.toString());

    // Keys generated by keyring are 65 bytes long, but hypercore expects 32 bytes.
    // We hash the signing key to get a 32 bytes key.
    // NOTE: This might cause a bug where descriptor.key !== descriptor.feed.key.
    // TODO(dmaretskyi): Replace sha256 from hypercore-crypto with a web-crypto equivalent.
    const key = sha256(this._key.toHex());

    this._feed = this._hypercore(
      storage,
      key,
      {
        // TODO(dmaretskyi): Can we just pass undefined. We might need this for hypercore to consider this feed as writable.
        secretKey: this._signer ? Buffer.from('secret') : undefined,
        valueEncoding: this._valueEncoding,
        crypto: {
          sign: (data: any, secretKey: any, cb: any) => {
            assert(this._signer, 'Signer was not provided to the writable feed (writable feeds without injected signer are deprecated).');
            callbackify(this._signer!.sign.bind(this._signer!))(this._key, data, (err, res) => {
              if (err) {
                cb(err);
                return;
              }
              cb(null, Buffer.from(res));
            });
          },
          verify: async (data: any, signature: any, key: any, cb: any) => {
            callbackify(verifySignature)(this._key, data, signature, cb);
          }
        }
      }
    );

    // Request the feed to eagerly download everything.
    this._feed.download(undefined as any);

    await pify(this._feed.ready.bind(this._feed))();
  }

  append (message: any): Promise<number> {
    assert(this._feed);
    return pify(this._feed.append.bind(this._feed))(message);
  }
}

export default FeedDescriptor;

/**
 * File API that hypercore uses to read/write from storage.
 */
interface HypercoreFile {
  read(offset: number, size: number, cb?: (err: Error | null, data?: Buffer) => void): void
  write(offset: number, data: Buffer, cb?: (err: Error | null) => void): void
  del(offset: number, size: number, cb?: (err: Error | null) => void): void
  stat(cb: (err: Error | null, data?: { size: number }) => void): void
  close(cb?: (err: Error | null) => void): void
  destroy(cb?: (err: Error | null) => void): void
}
