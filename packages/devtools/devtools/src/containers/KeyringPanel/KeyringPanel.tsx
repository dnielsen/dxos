//
// Copyright 2020 DXOS.org
//

import React from 'react';

import { useDevtools, useStream } from '@dxos/react-client';

import { KeyTable } from '../../components/index.js';

export const KeyringPanel = () => {
  const devtoolsHost = useDevtools();

  const { keys } = useStream(() => devtoolsHost.subscribeToKeyringKeys({}), {});
  if (keys === undefined) {
    return null;
  }

  return (
    <KeyTable keys={keys} />
  );
};
