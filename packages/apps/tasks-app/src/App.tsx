//
// Copyright 2022 DXOS.org
//

import { ErrorBoundary } from '@sentry/react';
import React, { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { useRegisterSW } from 'virtual:pwa-register/react';

import { fromHost, fromIFrame } from '@dxos/client';
import { Config, Defaults, Dynamics } from '@dxos/config';
import { log } from '@dxos/log';
import {
  ErrorProvider,
  Fallback,
  FatalError,
  GenericFallback,
  ServiceWorkerToast,
  translations
} from '@dxos/react-appkit';
import { ClientProvider } from '@dxos/react-client';

import { UiKitProvider } from '@dxos/react-uikit';
import { captureException } from '@dxos/sentry';
import { Routes } from './Routes';

import tasksTranslations from './translations';

log.config({
  filter: process.env.LOG_FILTER ?? 'sdk:debug,warn',
  prefix: process.env.LOG_BROWSER_PREFIX
});

const configProvider = async () => new Config(await Dynamics(), Defaults());

export const App = () => {
  const {
    offlineReady: [offlineReady, _setOfflineReady],
    needRefresh: [needRefresh, _setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisterError: (err) => {
      captureException(err);
      log.error(err);
    }
  });
  
  return (
    <UiKitProvider
      appNs='halo'
      resourceExtensions={[translations, tasksTranslations]}
      fallback={<Fallback message='Loading...' />}
    >
      <ErrorProvider>
        {/* TODO(wittjosiah): Hook up user feedback mechanism. */}
        <ErrorBoundary fallback={({ error }) => <FatalError error={error} />}>
          <ClientProvider
            config={configProvider}
            services={(config) => (process.env.DX_VAULT === 'false' ? fromHost(config) : fromIFrame(config))}
            fallback={<GenericFallback />}
          >
            <HashRouter>
              <Routes />
              {needRefresh ? (
                <ServiceWorkerToast {...{ variant: 'needRefresh', updateServiceWorker }} />
              ) : offlineReady ? (
                <ServiceWorkerToast variant='offlineReady' />
              ) : null}
            </HashRouter>
          </ClientProvider>
        </ErrorBoundary>
      </ErrorProvider>
    </UiKitProvider>
  );
};
