//
// Copyright 2021 DXOS.org
//

import crypto from 'crypto';

import { Protocol } from '@dxos/protocol';


const waitOneWayMessage: any = {};
waitOneWayMessage.promise = new Promise((resolve) => {
  waitOneWayMessage.resolve = resolve;
});

const topic = crypto.randomBytes(32);
// const onInit = jest.fn();

const createUser1Protocol = (): Protocol => {
  const protocol1 = new Protocol()
    .setSession({ user: 'user1' })
    .setHandshakeHandler(async () => {
      console.log('proto 1 handshake')
    })
    .init(topic);

  return protocol1;
};

const createUser2Protocol = (): Protocol => {
  return new Protocol()
    .setSession({ user: 'user2' })
    .setHandshakeHandler(async () => {
      console.log('proto 2 handshake')
    })
    .init(topic);
};

export const createProtocols = () => {
  const protocol1 = createUser1Protocol();
  const protocol2 = createUser2Protocol();

  protocol1.error.on((err: any) => console.log('protocol1', err));
  protocol2.error.on((err: any) => console.log('protocol2', err));

  return { protocol1, protocol2 };
};
