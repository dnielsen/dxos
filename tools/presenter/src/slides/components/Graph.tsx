//
// Copyright 2022 DXOS.org
//

import React, { useMemo } from 'react';

import { SVG, SVGContextProvider, Zoom } from '@dxos/gem-core';
import { Graph as GemGraph, Markers, convertTreeToGraph, createTree, TestGraphModel } from '@dxos/gem-spore';

// console.log(Client);
export const Graph = () => {
  const model = useMemo(() => new TestGraphModel(convertTreeToGraph(createTree({ depth: 3 }))), []);

  return (
    <SVGContextProvider>
      <SVG>
        <Markers />
        <Zoom extent={[2, 4]}>
          <GemGraph model={model} drag arrows />
        </Zoom>
      </SVG>
    </SVGContextProvider>
  );
};
