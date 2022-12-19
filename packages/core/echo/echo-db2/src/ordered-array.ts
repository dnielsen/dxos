//
// Copyright 2022 DXOS.org
//

import { OrderedList } from '@dxos/object-model';

import { unproxy } from './common';
import { EchoObject } from './object';

export class OrderedArray<T extends EchoObject> implements Array<T> {
  private _object?: EchoObject;
  private _property?: string;
  private _orderedList?: OrderedList;
  private _uninitialized?: T[] = [];

  [unproxy]: OrderedArray<T> = this;

  static get [Symbol.species]() {
    return Array;
  }

  constructor(items: T[] = []) {
    this._uninitialized = [...items];

    return new Proxy(this, {
      get: (target, property, receiver) => {
        if (typeof property === 'number') {
          return this._get(property);
        } else {
          return Reflect.get(target, property, receiver);
        }
      },
      set: (target, property, value, receiver) => {
        if (typeof property === 'number') {
          this._set(property, value);
          return true;
        } else {
          return Reflect.set(target, property, value, receiver);
        }
      }
    });
  }

  [n: number]: T;
  get length(): number {
    if (!this._orderedList) {
      return this._uninitialized!.length;
    } else {
      return this._orderedList.values.length;
    }
  }

  toString(): string {
    throw new Error('Method not implemented.');
  }

  toLocaleString(): string {
    throw new Error('Method not implemented.');
  }

  pop(): T | undefined {
    throw new Error('Method not implemented.');
  }

  concat(...items: ConcatArray<T>[]): T[];
  concat(...items: (T | ConcatArray<T>)[]): T[];
  concat(...items: unknown[]): T[] {
    throw new Error('Method not implemented.');
  }

  join(separator?: string | undefined): string {
    throw new Error('Method not implemented.');
  }

  reverse(): T[] {
    throw new Error('Method not implemented.');
  }

  shift(): T | undefined {
    throw new Error('Method not implemented.');
  }

  slice(start?: number | undefined, end?: number | undefined): T[] {
    throw new Error('Method not implemented.');
  }

  sort(compareFn?: ((a: T, b: T) => number) | undefined): this {
    throw new Error('Method not implemented.');
  }

  splice(start: number, deleteCount?: number | undefined): T[];
  splice(start: number, deleteCount: number, ...items: T[]): T[];
  splice(start: unknown, deleteCount?: unknown, ...rest: unknown[]): T[] {
    throw new Error('Method not implemented.');
  }

  unshift(...items: T[]): number {
    throw new Error('Method not implemented.');
  }

  indexOf(searchElement: T, fromIndex?: number | undefined): number {
    throw new Error('Method not implemented.');
  }

  lastIndexOf(searchElement: T, fromIndex?: number | undefined): number {
    throw new Error('Method not implemented.');
  }

  every<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): this is S[];
  every(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean;
  every(predicate: unknown, thisArg?: unknown): boolean {
    throw new Error('Method not implemented.');
  }

  some(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): boolean {
    throw new Error('Method not implemented.');
  }

  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void {
    throw new Error('Method not implemented.');
  }

  map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
    return Array.from(this[Symbol.iterator]()).map(callbackfn, thisArg);
  }

  filter<S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
  filter(predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
  filter<S extends T>(predicate: unknown, thisArg?: unknown): T[] | S[] {
    throw new Error('Method not implemented.');
  }

  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
  reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue: T): T;
  reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;
  reduce<U>(callbackfn: unknown, initialValue?: unknown): T | U {
    throw new Error('Method not implemented.');
  }

  reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T): T;
  reduceRight(
    callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T,
    initialValue: T
  ): T;

  reduceRight<U>(
    callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U,
    initialValue: U
  ): U;

  reduceRight<U>(callbackfn: unknown, initialValue?: unknown): T | U {
    throw new Error('Method not implemented.');
  }

  find<S extends T>(
    predicate: (this: void, value: T, index: number, obj: T[]) => value is S,
    thisArg?: any
  ): S | undefined;

  find(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
  find<S extends T>(predicate: unknown, thisArg?: unknown): T | S | undefined {
    throw new Error('Method not implemented.');
  }

  findIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number {
    throw new Error('Method not implemented.');
  }

  fill(value: T, start?: number | undefined, end?: number | undefined): this {
    throw new Error('Method not implemented.');
  }

  copyWithin(target: number, start: number, end?: number | undefined): this {
    throw new Error('Method not implemented.');
  }

  entries(): IterableIterator<[number, T]> {
    throw new Error('Method not implemented.');
  }

  keys(): IterableIterator<number> {
    throw new Error('Method not implemented.');
  }

  values(): IterableIterator<T> {
    throw new Error('Method not implemented.');
  }

  includes(searchElement: T, fromIndex?: number | undefined): boolean {
    throw new Error('Method not implemented.');
  }

  flatMap<U, This = undefined>(
    callback: (this: This, value: T, index: number, array: T[]) => U | readonly U[],
    thisArg?: This | undefined
  ): U[] {
    throw new Error('Method not implemented.');
  }

  flat<A, D extends number = 1>(this: A, depth?: D | undefined): FlatArray<A, D>[] {
    throw new Error('Method not implemented.');
  }

  at(index: number): T | undefined {
    throw new Error('Method not implemented.');
  }

  [Symbol.iterator](): IterableIterator<T> {
    if (!this._orderedList) {
      return this._uninitialized![Symbol.iterator]();
    } else {
      return this._orderedList.values.map((id) => this._object!._database!.getObjectById(id) as T).values();
    }
  }

  [Symbol.unscopables](): {
    copyWithin: boolean;
    entries: boolean;
    fill: boolean;
    find: boolean;
    findIndex: boolean;
    keys: boolean;
    values: boolean;
  } {
    throw new Error('Method not implemented.');
  }

  push(...items: T[]) {
    if (!this._orderedList) {
      this._uninitialized!.push(...items);
    } else {
      for (const item of items) {
        console.log('pushing', item[unproxy]._id);
        if (this._orderedList!.values.length === 0) {
          this._orderedList!.init([item[unproxy]._id]);
        } else {
          this._orderedList!.insert(this._orderedList.values.at(-1)!, item[unproxy]._id);
        }
        console.log(this._orderedList);
      }
    }
    return this.length;
  }

  _bind(object: EchoObject, property: string) {
    this._object = object;
    this._property = property;
    this._orderedList = new OrderedList(this._object!._item!.model, this._property!);
    this._orderedList.refresh();
    return this;
  }

  private _get(index: number): T | undefined {
    if (!this._orderedList) {
      return this._uninitialized![index];
    } else {
      return this._getModel(index);
    }
  }

  private _set(index: number, value: T) {
    if (!this._orderedList) {
      this._uninitialized![index] = value;
    } else {
      this._setModel(index, value);
    }
  }

  private _getModel(index: number): T | undefined {
    const id = this._orderedList!.values[index];
    if (!id) {
      return undefined;
    }
    return this._object!._database!.getObjectById(id) as T | undefined;
  }

  private _setModel(index: number, value: T) {
    const prev = this._orderedList?.values[index - 1]!; // TODO(dmaretskyi): bug here.
    this._orderedList!.insert(value[unproxy]._id, prev);
  }
}
