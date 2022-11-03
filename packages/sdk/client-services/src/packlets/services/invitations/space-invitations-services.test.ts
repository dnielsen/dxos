//
// Copyright 2022 DXOS.org
//

import assert from 'assert';
import { expect } from 'chai';

import { asyncChain, Trigger } from '@dxos/async';
import { Stream } from '@dxos/codec-protobuf';
import { log } from '@dxos/log';
import { Invitation, InvitationService } from '@dxos/protocols/proto/dxos/client/services';

import { ServiceContext } from '../service-context';
import { closeAfterTest, createIdentity, createPeers } from '../testing';
import { SpaceInvitationProxy } from './space-invitations-proxy';
import { SpaceInvitationServiceImpl } from './space-invitations-services';

// TODO(burdon): TestBuilder.
// TODO(burdon): Test with createLinkedPorts
// TODO(burdon): Error states.
// TODO(burdon): Stream observable API.

describe('services/space-invitation-service', function () {
  it('creates party and invites peer', async function () {
    const [peer1, peer2] = await asyncChain<ServiceContext>([createIdentity, closeAfterTest])(createPeers(2));

    assert(peer1.spaceManager);
    assert(peer1.spaceInvitations);
    const service: InvitationService = new SpaceInvitationServiceImpl(peer1.spaceManager, peer1.spaceInvitations);

    const space1 = await peer1.spaceManager.createSpace();
    const invitation: Invitation = {
      spaceKey: space1.key
    };

    const states: Invitation.State[] = [];
    const success = new Trigger<Invitation>();

    {
      const stream: Stream<Invitation> = service.createInvitation(invitation);
      stream.subscribe(
        (invitation: Invitation) => {
          expect(invitation.spaceKey).to.deep.eq(space1.key);
          states.push(invitation.state!);
          console.log('>>', invitation);
          switch (invitation.state) {
            case Invitation.State.CONNECTING: {
              peer2.acceptInvitation(invitation);
              break;
            }
            case Invitation.State.SUCCESS: {
              success.wake(invitation);
              break;
            }
          }
        },
        (err) => {
          // TODO(burdon): Test error case.
          if (err) {
            log.error(err);
          }
        }
      );
    }

    {
      const invitation = await success.wait();
      expect(invitation.state).to.eq(Invitation.State.SUCCESS);
      expect(states).to.deep.eq([Invitation.State.CONNECTING, Invitation.State.CONNECTED, Invitation.State.SUCCESS]);
    }
  });

  /**
   * Life of an invitation:
   *
   * Host
   *
   *  Client => [ Observable ] <= [ Proxy.createInvitation ]
   *    <RPC Stream>
   *      [ ServiceImpl ] => [ Observable ] => [ SpaceInvitationClient.presentAdmissionOffer ]
   *        <RPC Stream>
   *          [ InvitationServiceServer.presentAdmissionCredentials ]
   *
   * Guest
   *
   *  Client => [ Observable ] => [ Proxy.acceptInvitation ]
   *    <RPC Stream>
   *      [ ServiceImpl ] => [ Observable ] => [ SpaceInvitationClient.presentAdmissionOffer ]
   *        <RPC Stream>
   *          [ InvitationServiceServer.presentAdmissionCredentials ]
   *
   */
  it('creates party and cancels invitation', async function () {
    const [peer1, peer2] = await asyncChain<ServiceContext>([createIdentity, closeAfterTest])(createPeers(2));

    assert(peer1.spaceManager);
    assert(peer1.spaceInvitations);
    const service: InvitationService = new SpaceInvitationServiceImpl(peer1.spaceManager, peer1.spaceInvitations);
    const space1 = await peer1.spaceManager.createSpace();

    const cancelled = new Trigger<Invitation>();

    const proxy = new SpaceInvitationProxy(service);
    const observable = proxy.createInvitation(space1.key);
    observable.subscribe({
      onConnecting: (invitation: Invitation) => {
        peer2.acceptInvitation(invitation);
      },
      onConnected: (invitation: Invitation) => {
        void observable.cancel();
        // void service.cancelInvitation({ invitationId: invitation.invitationId! });
      },
      onSuccess: (invitation: Invitation) => {
        throw new Error('Succeeded before being cancelled.');
      },
      onCancelled: (invitation: Invitation) => {
        cancelled.wake(invitation);
      },
      onTimeout: (error: Error) => {
        throw error;
      },
      onError: (error: Error) => {
        throw error;
      }
    });

    // TODO(burdon): Check done.
    const invitation = await cancelled.wait();
    console.log(invitation);
  });
});
