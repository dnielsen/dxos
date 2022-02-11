//
// Copyright 2022 DXOS.org
//

import React from "react";

import { MentionEditor } from "../src";

export default {
  title: "devtools/MentionEditor",
};

const initialCommandsList = [
  {
    label: "select",
    id: "select",
  },
  {
    label: "children",
    id: "children",
  },
  {
    label: "links",
    id: "links",
  },
  {
    label: "parent",
    id: "parent",
  },
  {
    label: "source",
    id: "source",
  },
  {
    label: "target",
    id: "target",
  },
  {
    label: "filter",
    id: "filter",
  },
];

export const Primary = () => {
  return (
    <div>
      <MentionEditor placeholder="Start quering!" commands={initialCommandsList} />
    </div>
  );
};
