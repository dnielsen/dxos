//
// Copyright 2021 DXOS.org
//

import React, { useEffect } from 'react';

import { ClientProvider, useClient } from '../src/index.js';
import { ClientPanel } from './helpers/index.js';

export default {
  title: 'react-client/ClientProvider'
};

const TestApp = () => {
  const client = useClient();

  useEffect(() => {
    setImmediate(async () => {
      await client.halo.createProfile({ username: 'test-user' });
    });
  }, []);

  return (
    <ClientPanel client={client} />
  );
};

export const Primary = () => (
  <ClientProvider>
    <TestApp />
  </ClientProvider>
);

export const Secondary = () => (
  <ClientProvider config={() => ({})}>
    <TestApp />
  </ClientProvider>
);
