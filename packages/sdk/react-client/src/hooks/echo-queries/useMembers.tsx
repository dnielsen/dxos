//
// Copyright 2020 DXOS.org
//

import { useEffect, useState } from 'react';

import { Party, PartyMember } from '@dxos/echo-db';

export const useMembers = (party: Party | undefined) => {
  const [members, setMembers] = useState<PartyMember[]>([]);

  useEffect(() => {
    if (!party) {
      return;
    }
    const result = party.queryMembers();
    setMembers(result.value);

    return result.subscribe(() => {
      // TODO(wittjosiah): Result not triggering update when name loads.
      // https://github.com/dxos/protocols/issues/372
      const update = setInterval(() => {
        const newMembers = party.queryMembers().value;
        const isNameFilled = newMembers.every(m => m.displayName);
        setMembers(newMembers);
        if (isNameFilled) {
          clearInterval(update);
        }
      }, 1000);
    });
  }, [party && party.key.toString()]);

  return members;
};