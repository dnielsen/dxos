//
// Copyright 2020 DXOS.org
//

import React from 'react';

import Button from '@material-ui/core/Button';

import { useDevtoolsHost } from '../contexts';

export default function StorageTab () {
  const devtoolsHost = useDevtoolsHost();

  async function handleReset () {
    if (window.confirm('RESET ALL DATA (CANNOT BE UNDONE)?')) {
      await devtoolsHost.ResetStorage({});
    }
  }

  return (
    <div style={{ padding: 8 }}>
      <Button variant='outlined' size='small' onClick={handleReset}>Reset storage</Button>
    </div>
  );
}