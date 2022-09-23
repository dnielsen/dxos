---
id: "dxos_object_model.ObjectProperties"
title: "Interface: ObjectProperties"
sidebar_label: "ObjectProperties"
custom_edit_url: null
---

[@dxos/object-model](../modules/dxos_object_model.md).ObjectProperties

Defines generic object accessor.

## Implemented by

- [`ObjectModel`](../classes/dxos_object_model.ObjectModel.md)

## Methods

### get

▸ **get**(`key`, `defaultValue?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `defaultValue?` | `unknown` |

#### Returns

`any`

#### Defined in

[packages/echo/object-model/src/object-model.ts:69](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/object-model/src/object-model.ts#L69)

___

### set

▸ **set**(`key`, `value`): `Promise`<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `unknown` |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/echo/object-model/src/object-model.ts:70](https://github.com/dxos/protocols/blob/6f4c34af3/packages/echo/object-model/src/object-model.ts#L70)