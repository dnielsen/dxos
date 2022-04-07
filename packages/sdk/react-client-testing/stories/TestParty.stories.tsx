//
// Copyright 2022 DXOS.org
//

import React from 'react';

import { ChevronRight as ExpandIcon, ExpandMore as CollapseIcon } from '@mui/icons-material';
import { TreeItem, TreeView } from '@mui/lab';

import { Item } from '@dxos/client';
import { ObjectModel } from '@dxos/object-model';
import { ClientProvider, ProfileInitializer, useSelection } from '@dxos/react-client';

import { useTestParty } from '../src';

export default {
  title: 'react-client-testing/TestParty'
};

// TODO(kaplanski): Factor out this component from devtools.
const ItemNode = ({ item }: {item: Item<ObjectModel> }) => {
  const children = item.select().children().query().entities;

  return (
    <TreeItem nodeId={item.id} label={item.type}>
      {children.map((child) => (
        <ItemNode key={child.id} item={child} />
      ))}
    </TreeItem>
  );
};

const Story = () => {
  const party = useTestParty();
  const items = useSelection(party?.select().filter(item => !item.parent), []) ?? [];

  return (
    <TreeView
      defaultCollapseIcon={<CollapseIcon />}
      defaultExpandIcon={<ExpandIcon />}
      sx={{
        flex: 1,
        maxWidth: 300,
        overflowY: 'auto'
      }}
    >
      {items?.map(item => (
        <ItemNode
          key={item.id}
          item={item}
        />
      ))}
    </TreeView>
  );
};

export const Primary = () => {
  return (
    <ClientProvider>
      <ProfileInitializer>
        <Story />
      </ProfileInitializer>
    </ClientProvider>
  );
};