//
// Copyright 2021 DXOS.org
//

import type { Schema } from '../schema';

// eslint-disable-next-line camelcase
export type WithTypeUrl<T extends {}> = T & { __type_url: string };

export const anySubstitutions = {
  'google.protobuf.Any': {
    encode: (value: WithTypeUrl<{}>, schema: Schema<any>): any => {
      if (typeof value.__type_url !== 'string') {
        throw new Error('Cannot encode google.protobuf.Any without proper __type_url field set');
      }

      const codec = schema.tryGetCodecForType(value.__type_url);
      const data = codec.encode(value);
      return {
        type_url: value.__type_url,
        value: data
      };
    },
    decode: (value: any, schema: Schema<any>): WithTypeUrl<any> => {
      const codec = schema.tryGetCodecForType(value.type_url);
      const data = codec.decode(value.value);
      return {
        ...data,
        __type_url: value.type_url
      };
    }
  }
};

export const newAnySubstitutions = {
  'google.protobuf.Any': {
    encode: (value: any, schema: Schema<any>): any => {
      if (typeof value['@type'] !== 'string') {
        throw new Error('Cannot encode google.protobuf.Any without proper "@type" field set');
      }

      const codec = schema.tryGetCodecForType(value['@type']);
      const data = codec.encode(value);
      return {
        type_url: value['@type'],
        value: data
      };
    },
    decode: (value: any, schema: Schema<any>): any => {
      const codec = schema.tryGetCodecForType(value.type_url!);
      const data = codec.decode(value.value!);
      return {
        '@type': value.type_url,
        ...data
      };
    }
  }
};