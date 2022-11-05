//
// Copyright 2020 DXOS.org
//

// TODO(burdon): Remove (create wrapper class).
export { generateSeedPhrase } from '@dxos/credentials';

export {
  TYPE_SCHEMA,
  Entity,
  Item,
  Link,
  Database,
  Selection,
  SelectionResult,
  ItemFilterDeleted,
  ResultSet,
  Schema,
  SchemaDef,
  SchemaField,
  SchemaRef
} from '@dxos/echo-db';
export { PublicKey } from '@dxos/keys';
// TODO(burdon): Export form `@dxos/echo-db`.
export { ItemID, ObjectModel, OrderedList } from '@dxos/object-model';
export { Profile } from '@dxos/protocols/proto/dxos/client';

// TODO(burdon): Remove.
// export { ClientServicesHost, ClientServices, createNetworkManager } from '@dxos/client-services';
// export { KeyRecord, KeyType } from '@dxos/protocols/proto/dxos/halo/keys';
// export { SignRequest, SignResponse } from '@dxos/protocols/proto/dxos/client';

// TODO(burdon): Cherry-pick developer-facings APIs.
export * from './packlets/client';
export * from './packlets/devtools';
