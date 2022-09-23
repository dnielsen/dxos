---
id: "dxos_echo_db.HaloRecoveryInitiator"
title: "Class: HaloRecoveryInitiator"
sidebar_label: "HaloRecoveryInitiator"
custom_edit_url: null
---

[@dxos/echo-db](../modules/dxos_echo_db.md).HaloRecoveryInitiator

Class to facilitate making a unsolicited connections to an existing HALO Party to ask for entrance.
If successful, regular Greeting will follow authenticated by the Identity key (usually recovered from
seed phrase).

TODO(telackey): DoS mitigation

## Constructors

### constructor

• **new HaloRecoveryInitiator**(`_networkManager`, `_credentialsSigner`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `_networkManager` | `NetworkManager` |
| `_credentialsSigner` | [`CredentialsSigner`](dxos_echo_db.CredentialsSigner.md) |

#### Defined in

[packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts:49](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts#L49)

## Properties

### \_greeterPlugin

• `Optional` **\_greeterPlugin**: `GreetingCommandPlugin`

#### Defined in

[packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts:46](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts#L46)

___

### \_peerId

• `Optional` **\_peerId**: `Buffer`

#### Defined in

[packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts:47](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts#L47)

___

### \_state

• **\_state**: [`GreetingState`](../enums/dxos_echo_db.GreetingState.md)

#### Defined in

[packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts:45](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts#L45)

## Accessors

### state

• `get` **state**(): [`GreetingState`](../enums/dxos_echo_db.GreetingState.md)

#### Returns

[`GreetingState`](../enums/dxos_echo_db.GreetingState.md)

#### Defined in

[packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts:56](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts#L56)

## Methods

### claim

▸ **claim**(): `Promise`<[`InvitationDescriptor`](dxos_echo_db.InvitationDescriptor.md)\>

Executes a 'CLAIM' command for an offline invitation.  If successful, the Party member's device will begin
interactive Greeting, with a new invitation and swarm key which will be provided to the claimant.
Those will be returned in the form of an InvitationDescriptor.

#### Returns

`Promise`<[`InvitationDescriptor`](dxos_echo_db.InvitationDescriptor.md)\>

#### Defined in

[packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts:98](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts#L98)

___

### connect

▸ **connect**(`timeout?`): `Promise`<`void`\>

Initiate a connection to some Party member node.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `timeout` | `number` | `DEFAULT_TIMEOUT` | Connection timeout (ms). |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts:64](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts#L64)

___

### createSecretProvider

▸ **createSecretProvider**(): `SecretProvider`

#### Returns

`SecretProvider`

#### Defined in

[packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts:144](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts#L144)

___

### destroy

▸ **destroy**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts:136](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts#L136)

___

### disconnect

▸ **disconnect**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts:130](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts#L130)

___

### createHaloInvitationClaimHandler

▸ `Static` **createHaloInvitationClaimHandler**(`identityKey`, `invitationManager`): (`message`: `any`, `remotePeerId`: `Buffer`, `peerId`: `Buffer`) => `Promise`<`WithTypeUrl`<`ClaimResponse`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `identityKey` | `PublicKey` |
| `invitationManager` | [`InvitationFactory`](dxos_echo_db.InvitationFactory.md) |

#### Returns

`fn`

▸ (`message`, `remotePeerId`, `peerId`): `Promise`<`WithTypeUrl`<`ClaimResponse`\>\>

##### Parameters

| Name | Type |
| :------ | :------ |
| `message` | `any` |
| `remotePeerId` | `Buffer` |
| `peerId` | `Buffer` |

##### Returns

`Promise`<`WithTypeUrl`<`ClaimResponse`\>\>

#### Defined in

[packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts:159](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/invitations/halo-recovery-initiator.ts#L159)