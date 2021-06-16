//
// Copyright 2021 DXOS.org
//

import { sleep } from '@dxos/async';
import React, { useEffect, useState } from 'react';

import { createProtocols } from './protocols';

/**
 * Join two protocol streams together.
 */
export const ProtocolStreams = () => {
  const [, setProtocols] = useState<ReturnType<typeof createProtocols> | undefined>(undefined);
  useEffect(() => {
    const protocols = createProtocols();
    setProtocols(protocols);

    protocols.protocol1.stream.pipe(protocols.protocol2.stream).pipe(protocols.protocol1.stream);

    console.log(protocols)

    setTimeout(async () => {
      console.log('start close')

      await protocols.protocol1.close();
    }, 1000)
  }, []);

  return (
    <div>Protocol streams.</div>
  );
};

export default {
  title: 'Protocols/protocol-streams',
  component: ProtocolStreams
};
