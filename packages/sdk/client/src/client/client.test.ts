//
// Copyright 2020 DXOS.org
//

import assert from 'assert';
import expect from 'expect';
import { it as test } from 'mocha';
import waitForExpect from 'wait-for-expect';

import { promiseTimeout, sleep, waitForCondition } from '@dxos/async';
import { ConfigObject } from '@dxos/config';
import { generateSeedPhrase, keyPairFromSeedPhrase, PublicKey } from '@dxos/crypto';
import { throwUnhandledRejection } from '@dxos/debug';
import { InvitationDescriptor } from '@dxos/echo-db';
import { TestModel } from '@dxos/model-factory';
import { ObjectModel } from '@dxos/object-model';
import { createBundledRpcServer, createLinkedPorts, createRpcServer } from '@dxos/rpc';
import { afterTest } from '@dxos/testutils';

import { clientServiceBundle } from '../interfaces';
import { Client } from './client';
import { schema } from '../proto/gen';

describe('Client', () => {
  function testSuite (createClient: () => Promise<Client>) {
    describe('initialization', () => {
      test('initialize and destroy', async () => {
        const client = await createClient();
        await client.initialize();
        await client.destroy();
      }).timeout(200);

      test('initialize and destroy are idempotent', async () => {
        const client = await createClient();
        await client.initialize();
        await client.initialize();
        expect(client.initialized).toBeTruthy();

        await client.destroy();
        await client.destroy();
        expect(client.initialized).toBeFalsy();
      });
    });

    describe('profile', () => {
      test('creates a profile', async () => {
        const client = await createClient();

        await client.initialize();
        afterTest(() => client.destroy());

        const profile = await client.halo.createProfile({ username: 'test-user' });

        expect(profile).toBeDefined();
        expect(profile?.username).toEqual('test-user');

        expect(client.halo.profile).toBeDefined();
      }).timeout(500);

      test('creating profile twice throws an error', async () => {
        const client = await createClient();
        await client.initialize();
        afterTest(() => client.destroy());

        await client.halo.createProfile({ username: 'test-user' });
        expect(!!client.halo.profile).toBeTruthy();

        await expect(client.halo.createProfile({ username: 'test-user' })).rejects.toThrow();
        expect(!!client.halo.profile).toBeTruthy();
      });

      test('Recovers a profile with a seed phrase', async () => {
        const client = await createClient();
        await client.initialize();
        afterTest(() => client.destroy());

        const seedPhrase = generateSeedPhrase();
        const keyPair = keyPairFromSeedPhrase(seedPhrase);

        const profile = await client.halo.createProfile({ ...keyPair, username: 'test-user' });

        expect(profile).toBeDefined();
        expect(profile?.username).toEqual('test-user');

        expect(client.halo.profile).toBeDefined();

        const recoveredClient = await createClient();
        await recoveredClient.initialize();
        afterTest(() => recoveredClient.destroy());

        await recoveredClient.halo.recoverProfile(seedPhrase);
        await waitForCondition(() => !!recoveredClient.halo.profile, 2000);

        expect(recoveredClient.halo.profile).toBeDefined();
        expect(recoveredClient.halo.profile!.publicKey).toEqual(client.halo.profile!.publicKey);
        expect(recoveredClient.halo.profile!.username).toEqual('test-user');
      }).timeout(2000);
    });

    describe('party invitations', () => {
      const prepareInvitations = async () => {
        const inviter = await createClient();
        await inviter.initialize();
        afterTest(() => inviter.destroy());

        const invitee = await createClient();
        await invitee.initialize();
        afterTest(() => invitee.destroy());

        await inviter.halo.createProfile({ username: 'inviter' });
        await invitee.halo.createProfile({ username: 'invitee' });

        return { inviter, invitee };
      };

      test('creates and joins a Party invitation', async () => {
        const { inviter, invitee } = await prepareInvitations();

        const party = await inviter.echo.createParty();
        const invitation = await party.createInvitation();
        invitation.error.on(throwUnhandledRejection);
        const inviteeParty = await invitee.echo.acceptInvitation(invitation.descriptor).getParty();

        expect(inviteeParty.key).toEqual(party.key);

        const members = party.queryMembers().value;
        expect(members.length).toEqual(2);
      }).timeout(5000);

      test('invitation callbacks are fired', async () => {
        const { inviter, invitee } = await prepareInvitations();

        const party = await inviter.echo.createParty();
        const invitation = await party.createInvitation();

        const connectedFired = invitation.connected.waitForCount(1);
        // Simulate invitation being serialized. This effectively removes the pin from the invitation.
        const reencodedDescriptor = InvitationDescriptor.fromQueryParameters(invitation.descriptor.toQueryParameters());
        const acceptedInvitation = invitee.echo.acceptInvitation(reencodedDescriptor);
        await connectedFired;

        const finishedFired = invitation.finished.waitForCount(1);
        acceptedInvitation.authenticate(invitation.secret);
        await finishedFired;

        const inviteeParty = await acceptedInvitation.getParty();
        expect(inviteeParty.key).toEqual(party.key);
      }).timeout(5000);

      test('creates and joins an offline Party invitation', async () => {
        const { inviter, invitee } = await prepareInvitations();

        const party = await inviter.echo.createParty();
        assert(invitee.halo.profile);
        const invitation = await party.createInvitation({ inviteeKey: invitee.halo.profile.publicKey });
        expect(invitation.descriptor.secret).toBeUndefined();
        invitation.error.on(throwUnhandledRejection);
        const inviteeParty = await invitee.echo.acceptInvitation(invitation.descriptor).getParty();

        expect(inviteeParty.key).toEqual(party.key);

        const members = party.queryMembers().value;
        expect(members.length).toEqual(2);
      }).timeout(5000);

      test('creates and joins more than 1 Party', async () => {
        const { inviter, invitee } = await prepareInvitations();

        for (let i = 0; i < 3; i++) {
          const party = await inviter.echo.createParty();
          const invitation = await party.createInvitation();
          invitation.error.on(throwUnhandledRejection);
          const inviteeParty = await invitee.echo.acceptInvitation(invitation.descriptor).getParty();

          expect(inviteeParty.key).toEqual(party.key);
        }
      }).timeout(5000);
    });

    describe('HALO invitations', () => {
      const prepareInvitations = async () => {
        const inviter = await createClient();
        await inviter.initialize();
        afterTest(() => inviter.destroy());

        const invitee = await createClient();
        await invitee.initialize();
        afterTest(() => invitee.destroy());

        await inviter.halo.createProfile({ username: 'inviter' });
        expect(inviter.halo.profile).not.toBeUndefined();

        return { inviter, invitee };
      };

      test('creates and joins a HALO invitation', async () => {
        const { inviter, invitee } = await prepareInvitations();
        expect(invitee.halo.profile).toBeUndefined();

        const invitation = await inviter.halo.createInvitation();
        invitation.error.on(throwUnhandledRejection);
        await invitee.halo.acceptInvitation(invitation.descriptor).wait();

        expect(invitee.halo.profile).not.toBeUndefined();
      }).timeout(5000);

      test('DXNS Account is synced between devices', async () => {
        const { inviter, invitee } = await prepareInvitations();

        const DXNSAccount = 'd3abd23e3f36a61a9e5d58e4b6286f89649594eedbd096b3a6e256ca1fe4c147';
        await inviter.halo.setGlobalPreference('DXNSAccount', DXNSAccount);

        const invitation = await inviter.halo.createInvitation();
        await invitee.halo.acceptInvitation(invitation.descriptor).wait();

        await waitForExpect(async () => {
          expect(await invitee.halo.getGlobalPreference('DXNSAccount')).toEqual(DXNSAccount);
        });

        // The preference can be changed and synced back.
        await invitee.halo.setGlobalPreference('DXNSAccount', '123');
        await waitForExpect(async () => {
          expect(await inviter.halo.getGlobalPreference('DXNSAccount')).toEqual('123');
        }, 10_000, 100);
      }).timeout(10_000);
    });

    describe('data', () => {
      test('create party and item', async () => {
        const client = await createClient();
        await client.initialize();
        afterTest(() => client.destroy());

        await client.halo.createProfile();
        const party = await client.echo.createParty();

        const item = await party.database.createItem({ model: ObjectModel });
        await item.model.setProperty('foo', 'bar');

        expect(item.model.getProperty('foo')).toEqual('bar');
      });

      test('set party properties', async () => {
        const client = await createClient();
        await client.initialize();
        afterTest(() => client.destroy());

        await client.halo.createProfile();
        const party = await client.echo.createParty();

        await party.setTitle('test-party');
        const title = party.getProperty('title');
        expect(title).toEqual('test-party');
      });

      test('Properly creates multiple items in a party', async () => {
        const client = await createClient();
        await client.initialize();
        afterTest(() => client.destroy());

        await client.halo.createProfile();
        const party = await client.echo.createParty();

        const item1 = await party.database.createItem({ model: ObjectModel, type: 'test' });
        await item1.model.setProperty('prop1', 'x');
        const item2 = await party.database.createItem({ model: ObjectModel, type: 'test' });
        await item2.model.setProperty('prop1', 'y');

        expect(item1.model.getProperty('prop1')).toEqual('x');
      });
    });

    describe('networking', () => {
      test.only('client calls an RPC on the other client', async () => {
        const topic = PublicKey.random()

        const provider = await createClient();
        await provider.initialize()
        afterTest(() => provider.destroy())
        provider.network.joinSwam({
          topic,
          peerId: topic,
          topology: {
            type: 'star',
            centralPeer: topic,
          },
          onConnection: ({ port }) => {
           port.subscribe(data => {
             if(Buffer.from(data).toString() === 'ping') {
               port.send(Buffer.from('pong'));
             }
           })
          }
        })

        const client = await createClient();
        await client.initialize()
        afterTest(() => client.destroy())
        const { port } = await client.network.dial(topic);

        const pong = new Promise<void>(resolve => {
          port.subscribe(data => {
            if(Buffer.from(data).toString() === 'pong') {
              resolve();
            }
          })
        })
        port.send(Buffer.from('ping'));
        await promiseTimeout(pong, 100, new Error('Timeout'));
      })
    })
  }

  describe('local', () => {
    testSuite(async () => {
      return new Client();
    });
  });

  describe('remote', () => {
    testSuite(async () => {
      const [proxyPort, hostPort] = createLinkedPorts();

      const hostClient = new Client();
      await hostClient.initialize();
      afterTest(() => hostClient.destroy());

      const server = createBundledRpcServer({
        services: clientServiceBundle,
        handlers: hostClient.services,
        port: hostPort
      });
      void server.open(); // This blocks until the other client connects.
      afterTest(() => server.close());

      return new Client({ }, { rpcPort: proxyPort });
    });
  });

  test('late-register models after refresh', async () => {
    const config: ConfigObject = {
      version: 1,
      runtime: {
        client: {
          storage: {
            persistent: true,
            path: `/tmp/dxos-${Date.now()}`
          }
        }
      }
    };

    {
      const client = new Client(config);
      await client.initialize();
      client.registerModel(TestModel);
      await client.halo.createProfile({ username: 'test-user' });
      const party = await client.echo.createParty();
      const item = await party.database.createItem({ model: TestModel, type: 'test' });
      await item.model.setProperty('prop', 'value1');

      await client.destroy();
    }

    {
      const client = new Client(config);
      await client.initialize();
      await waitForCondition(() => !!client.halo.profile);
      await sleep(10); // Make sure all events were processed.

      client.registerModel(TestModel);

      const party = client.echo.queryParties().first;
      const selection = party.database.select({ type: 'test' }).query();
      await selection.update.waitForCondition(() => selection.result.length > 0);

      const item = selection.expectOne();

      expect(item.model.getProperty('prop')).toEqual('value1');

      await item.model.setProperty('prop', 'value2');
      expect(item.model.getProperty('prop')).toEqual('value2');

      await client.destroy();
    }
  });
});
