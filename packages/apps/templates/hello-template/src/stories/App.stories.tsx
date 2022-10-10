//
// Copyright 2022 DXOS.org
//

import React from 'react';

import { ClientProvider } from '@dxos/react-client';
import { ProfileInitializer } from '@dxos/react-client-testing';

import { App } from '../App.js';
import { ONLINE_CONFIG } from './config.js';

export default {
  title: 'HelloWorld/App'
};

export const Primary = () => (
  <ClientProvider config={ONLINE_CONFIG}>
    <ProfileInitializer>
      <App />
    </ProfileInitializer>
  </ClientProvider>
);
