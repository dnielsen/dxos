//
// Copyright 2022 DXOS.org
//

import { resolve } from 'path';

export const DOCS_PATH = resolve(__dirname, '../docs');

export const PINNED_PACKAGES = ['@dxos/client', '@dxos/react-client'];

<<<<<<< HEAD
export const API_SECTIONS = ['values', 'enums', 'types', 'interfaces', 'classes', 'functions'];
=======
export const API_SECTIONS = [
  'types',
  'interfaces',
  'classes',
  'functions'
];
>>>>>>> fee4ebd72 (wip docs generation)

export const API_PACKAGE_IGNORE = ['README.md']