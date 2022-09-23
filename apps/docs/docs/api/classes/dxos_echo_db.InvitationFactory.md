---
id: "dxos_echo_db.InvitationFactory"
title: "Class: InvitationFactory"
sidebar_label: "InvitationFactory"
custom_edit_url: null
---

[@dxos/echo-db](../modules/dxos_echo_db.md).InvitationFactory

Groups together all invitation-related functionality for a single party.

## Constructors

### constructor

• **new InvitationFactory**(`_partyProcessor`, `_genesisFeedKey`, `_credentialsSigner`, `_credentialsWriter`, `_networkManager`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_partyProcessor` | [`PartyStateProvider`](../interfaces/dxos_echo_db.PartyStateProvider.md) |
| `_genesisFeedKey` | `PublicKey` |
| `_credentialsSigner` | [`CredentialsSigner`](dxos_echo_db.CredentialsSigner.md) |
| `_credentialsWriter` | `FeedWriter`<`Message`\> |
| `_networkManager` | `NetworkManager` |

#### Defined in

[packages/echo/echo-db/src/invitations/invitation-factory.ts:22](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/invitation-factory.ts#L22)

## Accessors

### isHalo

• `get` **isHalo**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/echo/echo-db/src/invitations/invitation-factory.ts:30](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/invitation-factory.ts#L30)

## Methods

### createInvitation

▸ **createInvitation**(`authenticationDetails?`, `options?`): `Promise`<[`InvitationDescriptor`](dxos_echo_db.InvitationDescriptor.md)\>

Creates an invitation for a remote peer.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `authenticationDetails` | [`InvitationAuthenticator`](../interfaces/dxos_echo_db.InvitationAuthenticator.md) | `defaultInvitationAuthenticator` |
| `options` | [`InvitationOptions`](../interfaces/dxos_echo_db.InvitationOptions.md) | `{}` |

#### Returns

`Promise`<[`InvitationDescriptor`](dxos_echo_db.InvitationDescriptor.md)\>

#### Defined in

[packages/echo/echo-db/src/invitations/invitation-factory.ts:58](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/invitation-factory.ts#L58)

___

### createOfflineInvitation

▸ **createOfflineInvitation**(`publicKey`): `Promise`<[`InvitationDescriptor`](dxos_echo_db.InvitationDescriptor.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `publicKey` | `PublicKey` |

#### Returns

`Promise`<[`InvitationDescriptor`](dxos_echo_db.InvitationDescriptor.md)\>

#### Defined in

[packages/echo/echo-db/src/invitations/invitation-factory.ts:35](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/invitation-factory.ts#L35)

___

### getOfflineInvitation

▸ **getOfflineInvitation**(`invitationId`): `undefined` \| `SignedMessage`

#### Parameters

| Name | Type |
| :------ | :------ |
| `invitationId` | `Buffer` |

#### Returns

`undefined` \| `SignedMessage`

#### Defined in

[packages/echo/echo-db/src/invitations/invitation-factory.ts:83](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/invitation-factory.ts#L83)