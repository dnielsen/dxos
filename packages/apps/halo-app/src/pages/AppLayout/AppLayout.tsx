//
// Copyright 2022 DXOS.org
//

import { AddressBook, Command, DeviceMobileCamera, Planet, SignOut } from 'phosphor-react';
import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useParty, useProfile } from '@dxos/react-client';
import { NavMenu, NavMenuSeparatorProps, useTranslation, Presence } from '@dxos/react-uikit';

import { useSafeSpaceKey } from '../../hooks';

const iconAttributes = { className: 'h-5 w-5' };

export const AppLayout = () => {
  const { t } = useTranslation('halo');
  const profile = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const { space: spaceHex } = useParams();
  const spaceKey = useSafeSpaceKey(spaceHex);
  const space = useParty(spaceKey);

  const centerMenuItems = [
    {
      label: t('lock label'),
      icon: <SignOut mirrored {...iconAttributes} />,
      pathName: '/'
    },
    {
      separator: true
    } as NavMenuSeparatorProps,
    {
      label: t('spaces label'),
      icon: <Planet {...iconAttributes} />,
      pathName: '/spaces'
    },
    {
      label: t('contacts label'),
      icon: <AddressBook {...iconAttributes} />,
      pathName: '/contacts'
    },
    {
      label: t('apps label'),
      icon: <Command {...iconAttributes} />,
      pathName: '/apps'
    },
    {
      label: t('devices label'),
      icon: <DeviceMobileCamera {...iconAttributes} />,
      pathName: '/devices'
    }
  ];

  return (
    <div role='none' className='mt-24'>
      <div role='none' className='fixed top-5 left-10 right-10 flex justify-center gap-2 px-6'>
        <NavMenu
          items={centerMenuItems.map((navMenuItem) =>
            'separator' in navMenuItem
              ? navMenuItem
              : {
                  triggerLinkProps: { href: `#${navMenuItem.pathName}` },
                  children: (
                    <div className='flex items-center gap-1'>
                      {navMenuItem.icon}
                      <span>{navMenuItem.label}</span>
                    </div>
                  ),
                  ...(navMenuItem.pathName.length > 1 &&
                    location.pathname.startsWith(navMenuItem.pathName) && {
                      active: true
                    })
                }
          )}
          className='hidden md:flex grow-0 shrink'
        />

        <NavMenu
          items={centerMenuItems.map((navMenuItem) =>
            'separator' in navMenuItem
              ? navMenuItem
              : {
                  triggerLinkProps: { href: `#${navMenuItem.pathName}` },
                  children: navMenuItem.icon,
                  tooltip: {
                    align: 'center',
                    tooltipLabelsTrigger: true,
                    content: navMenuItem.label,
                    sideOffset: 8
                  },
                  ...(navMenuItem.pathName.length > 1 &&
                    location.pathname.startsWith(navMenuItem.pathName) && {
                      active: true
                    })
                }
          )}
          className='flex md:hidden grow-0 shrink'
        />
      </div>

      <div role='none' className='fixed top-[1.625rem] right-5'>
        <Presence
          profile={profile!}
          party={space}
          className='flex-none'
          size={10}
          sideOffset={4}
          onClickManageProfile={() => navigate('/identity')}
        />
      </div>

      <Outlet />
    </div>
  );
};
