//
// Copyright 2021 DXOS.org
//

import assert from 'assert';
import { fromB58String, toB58String } from 'multihashes';
import { inspect } from 'util';

import { Multihash } from '../interfaces';

export class CID {
  static fromB58String (str: string): CID {
    return new CID(fromB58String(str));
  }

  // eslint-disable-next-line no-use-before-define
  static from (value: CIDLike): CID {
    if (value instanceof Uint8Array) {
      return new CID(value);
    } else if (typeof value === 'string') {
      return CID.fromB58String(value);
    } else if (value instanceof CID) {
      return value;
    } else {
      throw new Error('Invalid CID source.');
    }
  }

  constructor (
    public readonly value: Uint8Array
  ) {
    assert(value.length === 34, 'Invalid CID length.');
  }

  equals (other: CIDLike) {
    return Buffer.from(this.value).equals(Buffer.from(CID.from(other).value));
  }

  /**
   * Encode to base-58.
   */
  toB58String () {
    return toB58String(this.value);
  }

  /**
   * Called when the class is stringified.
   */
  toString () {
    return this.toB58String();
  }

  /**
   * Called when the class is printed using `console.log`.
   */
  [inspect.custom] () {
    return this.toB58String();
  }

  /**
   * Called when the class is converted to JSON, for example with `JSON.stringify`.
   */
  toJSON () {
    return this.toString();
  }
}

export type CIDLike = CID | Uint8Array | Multihash | string
