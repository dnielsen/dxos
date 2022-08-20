//
// Copyright 2020 DXOS.org
//

import { ProjectConfiguration, workspaceRoot } from '@nrwl/devkit';
import { existsSync } from 'fs';
import { dirname, join } from 'path';
import pb from 'protobufjs';

export type ProtoResolver = (origin: string, target: string) => string | null;

const createProtoResolver = async (
  original: ProtoResolver,
  projects?: { [projectName: string]: ProjectConfiguration }
): Promise<ProtoResolver> => {
  return function (this: any, origin, target) {
    const classicResolved = original.call(this, origin, target);
    if (classicResolved && existsSync(classicResolved)) {
      return classicResolved;
    }

    if (projects) {
      const projectName = target.startsWith('@') ? target.split('/')[1] : target.split('/')[0];
      const projectPath = projects[projectName].root;
      const targetPath = join(...(target.startsWith('@') ? target.split('/').slice(2) : target.split('/').slice(1)));
      return join(workspaceRoot, projectPath, targetPath);
    }

    let config: any;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      config = require(join(target, 'package.json'));
    } catch {
      config = undefined;
    }

    if (config) {
      if (typeof config.protobuf !== 'string') {
        throw new Error(`Package "${target}" does not expose "protobuf" file.`);
      }

      return require.resolve(join(target, config.protobuf), { paths: [dirname(origin)] });
    } else {
      return require.resolve(target, { paths: [dirname(origin)] });
    }
  };
}

export const registerResolver = async (projects?: { [projectName: string]: ProjectConfiguration }) => {
  const resolver = await createProtoResolver(pb.Root.prototype.resolvePath, projects);
  pb.Root.prototype.resolvePath = resolver;
};
