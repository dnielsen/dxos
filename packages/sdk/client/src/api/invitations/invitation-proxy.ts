//
// Copyright 2021 DXOS.org
//

import assert from 'assert';

import { Event, trigger } from '@dxos/async';
import { Stream } from '@dxos/codec-protobuf';
import { throwUnhandledRejection } from '@dxos/debug';
import { InvitationDescriptor, InvitationDescriptorType } from '@dxos/echo-db';
import { RpcClosedError } from '@dxos/rpc';

import { AuthenticateInvitationRequest, InvitationRequest as InvitationRequestProto, InvitationState, RedeemedInvitation as RedeemedInvitationProto } from '../../proto/gen/dxos/client';
import { InvitationRequest } from './invitation-request';

export interface CreateInvitationRequestOpts {
  stream: Stream<InvitationRequestProto>
}

export interface HandleInvitationRedemptionOpts {
  stream: Stream<RedeemedInvitationProto>,
  invitationDescriptor: InvitationDescriptor,
  onAuthenticate: (request: AuthenticateInvitationRequest) => Promise<void>
}

export interface HandleInvitationRedemptionResult {
  waitForFinish: () => Promise<RedeemedInvitationProto>,
  authenticate: (secret: Uint8Array) => void
}

export class InvitationProxy {
  readonly activeInvitations: InvitationRequest[] = [];
  readonly invitationsUpdate = new Event();

  protected async createInvitationRequest ({ stream }: CreateInvitationRequestOpts): Promise<InvitationRequest> {
    return new Promise((resolve, reject) => {
      const connected = new Event();
      const finished = new Event();
      const error = new Event<Error>();
      let invitation: InvitationRequest;

      connected.on(() => this.invitationsUpdate.emit());

      stream.subscribe(invitationMsg => {
        if (!invitation) {
          assert(invitationMsg.descriptor, 'Missing invitation descriptor.');
          const descriptor = InvitationDescriptor.fromProto(invitationMsg.descriptor);
          invitation = new InvitationRequest(descriptor, connected, finished, error);
          invitation.canceled.on(() => this._removeInvitation(invitation));

          this.activeInvitations.push(invitation);
          this.invitationsUpdate.emit();
          resolve(invitation);
        }

        if (invitationMsg.state === InvitationState.CONNECTED && !invitation.hasConnected) {
          connected.emit();
        }

        if (invitationMsg.state === InvitationState.SUCCESS) {
          finished.emit();
          this._removeInvitation(invitation);
          stream.close();
        }

        if (invitationMsg.state === InvitationState.ERROR) {
          assert(invitationMsg.error, 'Unknown error.');
          const err = new Error(invitationMsg.error);
          reject(err);
          error.emit(err);
        }
      }, error => {
        if (error) {
          console.error(error);
          reject(error);
          // TODO(rzadp): Handle retry.
        }
      });
    });
  }

  protected _removeInvitation (invitation: InvitationRequest) {
    const index = this.activeInvitations.findIndex(activeInvitation => activeInvitation === invitation);
    this.activeInvitations.splice(index, 1);
    this.invitationsUpdate.emit();
  }

  static handleInvitationRedemption (
    { stream, invitationDescriptor, onAuthenticate }: HandleInvitationRedemptionOpts
  ): HandleInvitationRedemptionResult {
    const [getInvitationProcess, resolveInvitationProcess] = trigger<RedeemedInvitationProto>();
    const [waitForFinish, resolveFinish] = trigger<RedeemedInvitationProto>();

    stream.subscribe(async process => {
      resolveInvitationProcess(process);

      if (process.state === InvitationState.SUCCESS) {
        resolveFinish(process);
      } else if (process.state === InvitationState.ERROR) {
        assert(process.error);
        const error = new Error(process.error);
        // TODO(dmaretskyi): Should result in an error inside the returned Invitation, rejecting the promise in Invitation.wait().
        throwUnhandledRejection(error);
      }
    }, error => {
      if (error && !(error instanceof RpcClosedError)) {
        // TODO(dmaretskyi): Should result in an error inside the returned Invitation, rejecting the promise in Invitation.wait().
        throwUnhandledRejection(error);
      }
    });

    const authenticate = async (secret: Uint8Array) => {
      if (invitationDescriptor.type === InvitationDescriptorType.OFFLINE) {
        throw new Error('Cannot authenticate offline invitation.');
      }

      const invitationProcess = await getInvitationProcess();

      await onAuthenticate({
        processId: invitationProcess.id,
        secret
      });
    };

    if (invitationDescriptor.secret && invitationDescriptor.type === InvitationDescriptorType.INTERACTIVE) {
      // Authenticate straight away, if secret is already provided.
      void authenticate(invitationDescriptor.secret);
    }

    return {
      authenticate,
      waitForFinish
    };
  }
}