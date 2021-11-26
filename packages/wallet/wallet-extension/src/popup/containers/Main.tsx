//
// Copyright 2020 DXOS.org
//

import React, { useEffect, useState } from 'react';

import { Button } from '@mui/material';

import { keyPairFromSeedPhrase } from '@dxos/crypto';
import { useClient, useProfile } from '@dxos/react-client';
import { RegistrationDialog, RegistrationDialogProps } from '@dxos/react-framework';

const Main = () => {
  const client = useClient();
  const [parties, setParties] = useState<any[]>([]);
  const profile = useProfile();
  const [error, setError] = useState<Error | undefined>(undefined);
  const [inProgress, setInProgress] = useState(false);

  useEffect(() => {
    const partyStream = client.services.PartyService.SubscribeParties();
    partyStream.subscribe(response => setParties(response.parties ?? []), error => setError(error));
    return () => partyStream.close();
  }, []);

  const handleCreateProfile: RegistrationDialogProps['onComplete'] = async (seed, username) => {
    setInProgress(true);
    try {
      const keypair = keyPairFromSeedPhrase(seed);
      await client.halo.createProfile({ ...keypair, username });
    } catch (e: any) {
      console.error(e);
      setError(e);
    } finally {
      setInProgress(false);
    }
  };

  const handleReset = async () => {
    setInProgress(true);
    try {
      await client.halo.reset();
      window.location.reload();
    } catch (e: any) {
      console.error(e);
      setError(e);
    } finally {
      setInProgress(false);
    }
  };

  const handleCreateParty = async () => {
    setInProgress(true);
    try {
      await client.services.PartyService.CreateParty();
    } catch (e: any) {
      console.error(e);
      setError(e);
    } finally {
      setInProgress(false);
    }
  };

  if (error) {
    return (
    <>
      <p>Something went wrong.</p>
      <details>{String(error)}</details>
    </>
    );
  }

  if (!client.initialized) {
    return <p>Connecting to the DXOS Wallet Extension...</p>;
  }

  if (!profile) {
    return (
      <RegistrationDialog
        open
        modal={false}
        onComplete={handleCreateProfile}
        onRestore={null as any}
        // onJoinHalo={() => setJoinHaloDialog(true)} // TODO(rzadp): Uncomment after ProfileService is implemented fully.
      />
    );
  }

  return (
    <div style={{ minWidth: 400 }}>
      <p>Hello, {profile.username ?? profile.publicKey.toString()}</p>
      <p>{profile.publicKey.toString()}</p>
      <Button disabled={inProgress} onClick={handleReset} variant='outlined'>Reset</Button>

      <Button disabled={inProgress} onClick={handleCreateParty} variant='outlined'>Create party</Button>
      <p>You have {parties.length} parties.</p>
    </div>
  );
};

export default Main;