//
// Copyright 2022 DXOS.org
//

import { Box, Text } from 'ink';
import React, { FC } from 'react';

import { Party } from '@dxos/client';
import { useMembers } from '@dxos/react-client';

export const PartyInfo: FC<{
  party: Party
}> = ({
  party
}) => {
  const members = useMembers(party);

  return (
    <Box flexDirection='column' borderStyle='single' borderColor='#333'>
      <Text color='blue'>Party</Text>
      <Box>
        <Text color='blue'>  Title: </Text>
        <Text>{party.getProperty('title')}</Text>
      </Box>
      <Box>
        <Text color='blue'>  Public Key: </Text>
        <Text>{party.key.toHex()}</Text>
      </Box>

      <Text color='blue'>  Members:</Text>
      {members.map(member => (
        <Text key={member.publicKey.toHex()}>  - {member.displayName}</Text>
      ))}
    </Box>
  );
};