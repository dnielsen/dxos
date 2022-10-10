//
// Copyright 2022 DXOS.org
//

import { DevtoolsHost } from '@dxos/protocols/proto/dxos/devtools';

import { useClient } from '../client/index.js';

export const useDevtools = (): DevtoolsHost => {
  const client = useClient();
  return client.services.DevtoolsHost;
};
