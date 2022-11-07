//
// Copyright 2022 DXOS.org
//

import { Box } from 'ink';
import React, { FC, useState } from 'react';

import { InvitationEncoder, Invitation } from '@dxos/client';
import { PublicKey } from '@dxos/keys';
import { useClient, useParty } from '@dxos/react-client';

import { ActionStatus, PartyInfo, StatusState, TextInput } from '../../components';
import { Panel } from '../util';

export const Join: FC<{
  onJoin?: (partyKey: PublicKey) => void;
}> = ({ onJoin }) => {
  const client = useClient();
  const [focused, setFocused] = useState(false);
  const [invitationCode, setInvitationCode] = useState<string>();
  const [secret, setSecret] = useState<string>();
  const [invitation, setInvitation] = useState<Invitation>();
  const [status, setStatus] = useState<StatusState>();
  const [partyKey, setPartyKey] = useState<PublicKey>();
  const party = useParty(partyKey);

  // Sample code for testing.
  // 2Jfg6YbVr56jMcKBfXefCkSfvAG73UIJYft2ORDOlNof0iAPCqNrvLH6A1lsZKVO9VGKzKzZlU60yjrlvNIfCsUdihG0sJsLesWHBSbyOs2flkEbQPaxPucsuBxalb7J5nGow5Dcn8rERUqOQEIBkve5hzATC60y9rooOnCflZ7k5MIOFjM7KZt7kkmGyOcNumzK0jayOV882TfEZuYrCOM0zilOnDDTZaOACEEMotiWYForVzdb9QtxnpxYcwbSdfZQeGTdZTSjTy9VYAwo0FYoDCNlpXSwCBto1vgJ2JV6kjFb9TLyN4SGbv0CHhkD6JziDHVk7vxo5ebll2P4psfSuLaw7Xxj9xRRnj2dxUp3yg5s4051fpRhli6b4D6tNKwgcEAtnSeRzazrArM85

  const handleDecode = () => {
    try {
      // TODO(burdon): Detect and parse URL.
      // Decode JSON with both token and secret.
      const invitation = InvitationEncoder.decode(invitationCode!);
      // TODO(burdon): Errors not caught
      const observable = client.echo.acceptInvitation(invitation);
      // await invitationObservable(observable);
      // void handleSubmit(invitation, secret);
    } catch (err) {
      try {
        // Decode regular token.
        // const stripped = descriptor!.replace(/[\W]/g, '');
        // const invitation = client.echo.acceptInvitation(InvitationEncoder.decode(stripped));
        // setInvitation(invitation);
      } catch (err) {
        setStatus({ error: err as Error });
      }
    }
  };

  const handleSubmit = async (invitation: Invitation, secret: string) => {
    try {
      setStatus({ processing: 'Authenticating...' });
      // TODO(burdon): Exceptions not propagated to here (e.g., IDENTITY_NOT_INITIALIZED, ERR_GREET_CONNECTED_TO_SWARM_TIMEOUT)
      //  https://github.com/dxos/dxos/issues/1423
      // await invitation!.authenticate(Buffer.from(secret));
      // const party = await invitation!.getParty();
      // setInvitation(undefined);
      // setStatus({ success: 'OK' });
      // setPartyKey(party.key);
      // onJoin?.(party.key);
    } catch (err) {
      setStatus({ error: err as Error });
    }
  };

  return (
    <Panel highlight={focused}>
      {!status?.error && !status?.success && (
        <TextInput
          focus={!invitation}
          placeholder='Enter invitation code.'
          value={invitationCode ?? ''}
          onChange={setInvitationCode}
          onSubmit={handleDecode}
          onFocus={setFocused}
        />
      )}

      {invitation && !status?.processing && (
        <Box marginTop={1}>
          <TextInput
            focus={invitation && !status?.processing}
            placeholder='Enter verification code (enter 0000).'
            value={secret ?? ''}
            onChange={setSecret}
            onSubmit={() => handleSubmit(invitation!, secret!)}
            onFocus={setFocused}
          />
        </Box>
      )}

      {party && <PartyInfo party={party} />}

      <ActionStatus status={status} marginTop={1} />
    </Panel>
  );
};
