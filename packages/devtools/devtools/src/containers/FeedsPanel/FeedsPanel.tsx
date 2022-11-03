//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useMemo, useState } from 'react';

import { PublicKey } from '@dxos/keys';
import { useDevtools, useParties, useStream } from '@dxos/react-client';

import { KeySelect, MessageTable, Panel } from '../../components';

export const FeedsPanel = () => {
  const devtoolsHost = useDevtools();
  const parties = useParties();
  const [selectedspaceKey, setSelectedspaceKey] = useState<PublicKey>();
  const [selectedFeed, setSelectedFeed] = useState<PublicKey>();

  const { parties: remoteParties } = useStream(() => devtoolsHost.subscribeToParties({}), {});
  const partyFeeds = useMemo(
    () => remoteParties?.find(({ key }) => selectedspaceKey && key?.equals(selectedspaceKey))?.feeds ?? [],
    [remoteParties, selectedspaceKey]
  );

  // TODO(wittjosiah): FeedMessageBlock.
  const [messages, setMessages] = useState<any[]>([]);
  const { blocks } = useStream(
    () => devtoolsHost.subscribeToFeedBlocks({ spaceKey: selectedspaceKey, feedKey: selectedFeed }),
    {},
    [selectedspaceKey, selectedFeed]
  );

  useEffect(() => {
    if (blocks) {
      setMessages([...messages, ...blocks]);
    }
  }, [blocks]);

  const handlePartyChange = (key: PublicKey | undefined) => {
    setSelectedspaceKey(key);
    setSelectedFeed(undefined);
    setMessages([]);
  };

  const handleFeedChange = (feedKey: PublicKey | undefined) => {
    setSelectedFeed(feedKey);
    setMessages([]);
  };

  return (
    <Panel
      controls={
        <>
          <KeySelect
            id='party-select'
            label='Party'
            keys={parties.map(({ key }) => key)}
            selected={selectedspaceKey}
            onChange={handlePartyChange}
          />
          <KeySelect
            id='feed-select'
            label='Feed'
            keys={partyFeeds}
            selected={selectedFeed}
            onChange={handleFeedChange}
          />
        </>
      }
    >
      <MessageTable messages={messages} />
    </Panel>
  );
};
