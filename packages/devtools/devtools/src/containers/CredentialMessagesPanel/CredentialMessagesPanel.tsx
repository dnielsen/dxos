//
// Copyright 2020 DXOS.org
//

import React, { useState } from 'react';

import { PublicKey } from '@dxos/keys';
import { useDevtools, useParties, useStream } from '@dxos/react-client';
import { JsonTreeView } from '@dxos/react-components';

import { KeySelect, Panel } from '../../components';

export const CredentialMessagesPanel = () => {
  const [selectedspaceKey, setSelectedspaceKey] = useState<PublicKey>();
  const parties = useParties();
  const devtoolsHost = useDevtools();

  const { messages } = useStream(() => devtoolsHost.subscribeToCredentialMessages({ spaceKey: selectedspaceKey }), {}, [
    selectedspaceKey
  ]);

  return (
    <Panel
      controls={
        <KeySelect
          label='Party'
          keys={parties.map(({ key }) => key)}
          selected={selectedspaceKey}
          onChange={(key) => setSelectedspaceKey(key)}
        />
      }
    >
      <JsonTreeView size='small' data={messages} />
    </Panel>
  );
};
