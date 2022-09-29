//
// Copyright 2020 DXOS.org
//

import assert from 'node:assert';

import { createPartyInvitationMessage } from '@dxos/credentials';
import { todo } from '@dxos/debug';
import { FeedWriter } from '@dxos/feed-store';
import { Credential } from '@dxos/halo-protocol';
import { PublicKey } from '@dxos/keys';
import { NetworkManager } from '@dxos/network-manager';
import { InvitationDescriptor as InvitationDescriptorProto } from '@dxos/protocols/proto/dxos/echo/invitation';

import { InvitationDescriptor } from '../invitations';
import { PartyStateProvider } from '../pipeline';
import { CredentialsSigner } from '../protocol/credentials-signer';
import { defaultInvitationAuthenticator, InvitationAuthenticator, InvitationOptions } from './common';
import { GreetingResponder } from './greeting-responder';

/**
 * Groups together all invitation-related functionality for a single party.
 */
export class InvitationFactory {
  constructor (
    private readonly _partyProcessor: PartyStateProvider,
    private readonly _genesisFeedKey: PublicKey,
    private readonly _credentialsSigner: CredentialsSigner,
    private readonly _credentialsWriter: FeedWriter<Credential>,
    private readonly _networkManager: NetworkManager
  ) {}

  get isHalo () {
    // The PartyKey of the HALO is the Identity key.
    return this._credentialsSigner.getIdentityKey().publicKey.equals(this._partyProcessor.partyKey);
  }

  async createOfflineInvitation (publicKey: PublicKey) {
    assert(!this.isHalo, 'Offline invitations to HALO are not allowed.');

    const invitationMessage = createPartyInvitationMessage(
      this._credentialsSigner.signer,
      this._partyProcessor.partyKey,
      publicKey,
      this._credentialsSigner.getIdentityKey(),
      todo() // this._credentialsSigner.getDeviceSigningKeys()
    );

    // await this._credentialsWriter.write(invitationMessage);

    return new InvitationDescriptor(
      InvitationDescriptorProto.Type.OFFLINE,
      this._partyProcessor.partyKey.asBuffer(),
      invitationMessage.payload.signed.payload.id
    );
  }

  /**
   * Creates an invitation for a remote peer.
   */
  async createInvitation (
    authenticationDetails: InvitationAuthenticator = defaultInvitationAuthenticator, options: InvitationOptions = {}) {
    assert(this._networkManager);
    const responder = new GreetingResponder(
      this._networkManager,
      this._partyProcessor,
      this._genesisFeedKey,
      this._credentialsSigner,
      todo() // this._credentialsWriter
    );

    const { secretValidator, secretProvider } = authenticationDetails;
    const { onFinish, expiration } = options;

    const swarmKey = await responder.start();
    const invitation = await responder.invite(secretValidator, secretProvider, onFinish, expiration);

    return new InvitationDescriptor(
      InvitationDescriptorProto.Type.INTERACTIVE,
      swarmKey,
      invitation,
      this.isHalo ? this._partyProcessor.partyKey : undefined
    );
  }

  getOfflineInvitation (invitationId: Buffer) {
    return this._partyProcessor.getOfflineInvitation(invitationId);
  }
}
