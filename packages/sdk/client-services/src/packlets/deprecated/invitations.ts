//
// Copyright 2020 DXOS.org
//

import { defaultSecretProvider, defaultSecretValidator, SecretProvider, SecretValidator } from '@dxos/credentials';

//
// TODO(burdon): Deprecated pending new invitations.
//

/**
 * Defines a way for peers to authenticate each other through a side channel.
 */
export interface InvitationAuthenticator {
  secretProvider?: SecretProvider;
  secretValidator: SecretValidator;
}

export const defaultInvitationAuthenticator: Required<InvitationAuthenticator> = {
  secretProvider: defaultSecretProvider,
  secretValidator: defaultSecretValidator
};

/**
 * @deprecated
 */
export interface InvitationOptions {
  /**
   * A function to be called when the invitation is closed (successfully or not).
   */
  onFinish?: ({ expired }: { expired?: boolean }) => void;

  /**
   * Date.now()-style timestamp of when this invitation should expire.
   */
  expiration?: number;
}

/**
 * @deprecated
 */
export type InviterInvitation = {
  invitationCode: string;
  secret: Uint8Array | undefined;
};

/**
 * @deprecated
 */
export type InviteeInvitation = {
  secret?: Uint8Array | undefined; // Can be undefined initially, then set after receiving secret from the inviter.
  secretTrigger?: () => void; // Is triggered after supplying the secret.
};

/**
 * @deprecated
 */
export type InviterInvitations = InviterInvitation[];

/**
 * @deprecated
 */
export type InviteeInvitations = Map<string, InviteeInvitation>;
