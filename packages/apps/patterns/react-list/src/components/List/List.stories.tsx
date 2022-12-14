//
// Copyright 2022 DXOS.org
//

import '@dxosTheme';
import React from 'react';

import { PublicKey } from '@dxos/client';
import { log } from '@dxos/log';
import { ObjectModel } from '@dxos/object-model';
import { useAsyncEffect } from '@dxos/react-async';
import { useSelection, useSpace } from '@dxos/react-client';
import { ClientSpaceDecorator } from '@dxos/react-client/testing';
import { Loading } from '@dxos/react-uikit';

import { LIST_TYPE } from '../../model';
import { templateForComponent } from '../../testing';
import { List, ListProps } from './List';

log.config({ filter: 'react-client:debug,react-list:debug,warn' });

export default {
  title: 'react-list/List',
  component: List,
  argTypes: {}
};

const Template = (args: Omit<ListProps, 'itemId' | 'spaceKey'> & { spaceKey?: PublicKey; id?: number }) => {
  const space = useSpace(args.spaceKey);
  const { data: [item] = [] } = useSelection(space?.database.select({ type: LIST_TYPE }));

  useAsyncEffect(async () => {
    if (args.id === 0) {
      await space?.database.createItem({
        model: ObjectModel,
        type: LIST_TYPE
      });
    }
  }, [space]);

  return (
    <main className='max-is-lg mli-auto pli-7 mbs-7'>
      {item && space ? <List {...args} itemId={item.id} spaceKey={space?.key} /> : <Loading label='Loading…' />}
    </main>
  );
};

export const Default = templateForComponent(Template)({});
Default.args = {};
Default.decorators = [ClientSpaceDecorator()];
