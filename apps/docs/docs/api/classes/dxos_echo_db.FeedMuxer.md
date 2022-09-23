---
id: "dxos_echo_db.FeedMuxer"
title: "Class: FeedMuxer"
sidebar_label: "FeedMuxer"
custom_edit_url: null
---

[@dxos/echo-db](../modules/dxos_echo_db.md).FeedMuxer

Manages the inbound and outbound message streams for an individual party.
Reads messages from individual feeds and splits them into ECHO and HALO streams.

## Constructors

### constructor

• **new FeedMuxer**(`_partyProcessor`, `_feedStorIterator`, `_timeframeClock`, `_feedWriter?`, `_options?`)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `_partyProcessor` | [`CredentialProcessor`](../interfaces/dxos_echo_db.CredentialProcessor.md) & [`PartyStateProvider`](../interfaces/dxos_echo_db.PartyStateProvider.md) | Processes HALO messages to update party state. |
| `_feedStorIterator` | `FeedStoreIterator` | Inbound messages from the feed store. |
| `_timeframeClock` | [`TimeframeClock`](dxos_echo_db.TimeframeClock.md) | Tracks current echo timestamp. |
| `_feedWriter?` | `FeedWriter`<`FeedMessage`\> | Outbound messages to the writeStream feed. |
| `_options` | `Options` |  |

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:55](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L55)

## Properties

### \_echoProcessor

• `Private` **\_echoProcessor**: `undefined` \| [`EchoProcessor`](../modules/dxos_echo_db.md#echoprocessor)

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:46](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L46)

___

### \_errors

• `Private` `Readonly` **\_errors**: `Event`<`Error`\>

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:32](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L32)

___

### \_isOpen

• `Private` **\_isOpen**: `boolean` = `false`

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:34](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L34)

___

### \_outboundEchoStream

• `Private` **\_outboundEchoStream**: `undefined` \| `FeedWriter`<`EchoEnvelope`\>

Messages to write into pipeline (e.g., mutations from model).

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:39](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L39)

___

### \_outboundHaloStream

• `Private` **\_outboundHaloStream**: `undefined` \| `FeedWriter`<`Message`\>

Halo message stream to write into pipeline.

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:44](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L44)

## Accessors

### errors

• `get` **errors**(): `Event`<`Error`\>

#### Returns

`Event`<`Error`\>

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:95](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L95)

___

### isOpen

• `get` **isOpen**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:79](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L79)

___

### outboundEchoStream

• `get` **outboundEchoStream**(): `undefined` \| `FeedWriter`<`EchoEnvelope`\>

#### Returns

`undefined` \| `FeedWriter`<`EchoEnvelope`\>

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:87](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L87)

___

### outboundHaloStream

• `get` **outboundHaloStream**(): `undefined` \| `FeedWriter`<`Message`\>

#### Returns

`undefined` \| `FeedWriter`<`Message`\>

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:91](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L91)

___

### readOnly

• `get` **readOnly**(): `boolean`

#### Returns

`boolean`

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:83](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L83)

## Methods

### close

▸ **close**(): `Promise`<`void`\>

Close all streams.

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:180](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L180)

___

### open

▸ **open**(): `Promise`<`undefined` \| `FeedWriter`<`EchoEnvelope`\>\>

Create inbound and outbound pipielines.
https://nodejs.org/api/stream.html#stream_stream_pipeline_source_transforms_destination_callback

Feed
  Transform(FeedBlock => IEchoStream): Party processing (clock ordering)
    ItemDemuxer
      Transform(dxos.echo.IEchoEnvelope => dxos.IFeedMessage): update clock
        Feed

#### Returns

`Promise`<`undefined` \| `FeedWriter`<`EchoEnvelope`\>\>

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:113](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L113)

___

### setEchoProcessor

▸ **setEchoProcessor**(`processor`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `processor` | [`EchoProcessor`](../modules/dxos_echo_db.md#echoprocessor) |

#### Returns

`void`

#### Defined in

[packages/echo/echo-db/src/pipeline/feed-muxer.ts:99](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/echo-db/src/pipeline/feed-muxer.ts#L99)