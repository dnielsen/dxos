//
// Copyright 2020 DXOS.org
//

import React from 'react';
import ReactDOM from 'react-dom';

import { ClientProvider, ProfileInitializer } from '@dxos/react-client';

import { App } from './App';

(() => {
  ReactDOM.render(
    <ClientProvider>
      <ProfileInitializer>
        <App />
      </ProfileInitializer>
    </ClientProvider>,
    document.getElementById('root')
  );
})();