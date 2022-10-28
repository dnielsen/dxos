//
// Copyright 2022 DXOS.org
//

import '@dxosTheme';
import { Alien, FlyingSaucer, Planet } from 'phosphor-react';
import React from 'react';

import { getSize } from '../../styles';
import { templateForComponent } from '../../testing';
import { NavMenu, NavMenuProps } from './NavMenu';

export default {
  title: 'react-ui/NavMenu',
  component: NavMenu
};

const Template = (props: NavMenuProps) => {
  return <NavMenu {...props} />;
};

export const Default = templateForComponent(Template)({ items: [] });
Default.args = {
  items: [
    {
      triggerLinkProps: { href: '#Hello' },
      children: 'Hello',
      active: true
    },
    {
      children: 'How’s it going?',
      content: (
        <div className='w-[21rem] lg:w-[23rem] p-3'>
          <div className='grid grid-cols-6 gap-4'>
            <div className='col-span-2 w-full bg-gray-100 dark:bg-gray-900 p-4 rounded-md'></div>

            <div className='col-span-4 w-full flex flex-col space-y-3 bg-gray-100 dark:bg-gray-900 p-4 rounded-md'>
              <div className='w-full bg-white dark:bg-gray-700 h-12 rounded-md'></div>
              <div className='w-full bg-white dark:bg-gray-700 h-12 rounded-md'></div>
              <div className='w-full bg-white dark:bg-gray-700 h-12 rounded-md'></div>
              <div className='w-full bg-white dark:bg-gray-700 h-12 rounded-md'></div>
            </div>
          </div>
        </div>
      )
    },
    {
      triggerLinkProps: { href: '#Goodbye' },
      tooltip: {
        content: 'More info about Goodbye',
        sideOffset: 8
      },
      children: 'Goodbye'
    }
  ]
};

export const Compact = () => (
  <NavMenu
    variant='compact'
    items={[
      {
        triggerLinkProps: { href: '#Alien' },
        children: <Alien className={getSize(5)} />,
        active: true
      },
      {
        triggerLinkProps: { href: '#Saucer' },
        children: <FlyingSaucer className={getSize(5)} />
      },
      {
        triggerLinkProps: { href: '#Planet' },
        children: <Planet className={getSize(5)} />
      }
    ]}
    className='fixed top-0 left-0 right-0 justify-center'
  />
);
