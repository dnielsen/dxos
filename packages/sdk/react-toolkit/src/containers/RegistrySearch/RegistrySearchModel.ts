//
// Copyright 2021 DXOS.org
//

import { useMemo } from 'react';

import { Event } from '@dxos/async';
import { SearchModel, SearchResult } from '@dxos/react-components';
import { CID, RegistryClient, RegistryType, Resource } from '@dxos/registry-client';

export type SearchFilter = (resource: Resource) => boolean

export const useRegistrySearchModel = (
  registry: RegistryClient,
  filters: SearchFilter[] = [],
  deps: any[] = []
) => {
  return useMemo(() => new RegistrySearchModel(registry, filters), deps);
};

export const getTypeName = ({ type }: RegistryType) => {
  const parts = type.messageName.split('.');
  return parts[parts.length - 1];
};

export const createTypeFilter = (types: CID[]) => (resource: Resource) => {
  return types.some(type => resource.type && type.equals(resource.type));
};

export const createResourceFilter = (domainExp: RegExp, resourceExp: RegExp) => (resource: Resource) => {
  return domainExp.exec(resource.name.authority.toString()) && resourceExp.exec(resource.name.path);
};

/**
 * Filterable resource search model.
 */
// TODO(burdon): Create tests.
// TODO(burdon): Move to registry-client?
export class RegistrySearchModel implements SearchModel<Resource> {
  private readonly _update = new Event<SearchResult<Resource>[]>();
  private _results: SearchResult<Resource>[] = [];
  private _text?: string = undefined;
  private _types: RegistryType[] = [];

  constructor (
    private readonly _registry: RegistryClient,
    private _filters: SearchFilter[] = []
  ) {}

  get types () {
    return this._types;
  }

  get results () {
    return this._results;
  }

  subscribe (callback: (results: SearchResult<Resource>[]) => void) {
    return this._update.on(callback);
  }

  async initialize () {
    this._types = await this._registry.getTypeRecords();
    this.doUpdate();
  }

  setText (text?: string) {
    this._text = text;
    this.doUpdate();
  }

  setFilters (filters: SearchFilter[]) {
    this._filters = filters;
    this.doUpdate();
  }

  doUpdate () {
    setImmediate(async () => {
      // TODO(burdon): Push predicates (e.g., type).
      let resources = await this._registry.getResources({ text: this._text });
      if (this._filters.length) {
        resources = resources.filter(resource => {
          // Exclude if any filter fails.
          return !this._filters.some(filter => !filter(resource));
        });
      }

      this._results = resources.map(resource => {
        const type = this._types.find(type => resource.type && resource.type.equals(type.cid));
        return ({
          id: resource.name.toString(),
          type: type ? getTypeName(type) : undefined,
          text: resource.name.toString(),
          value: resource
        });
      });

      this._results = this._results.sort((a, b) => {
        let sort = 0;
        if (a.type && b.type) {
          sort = a.type < b.type ? -1 : a.type > b.type ? 1 : 0;
        }
        if (sort === 0) {
          sort = a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
        }
        return sort;
      });

      this._update.emit(this._results);
    });
  }
}