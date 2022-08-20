//
// Copyright 2022 DXOS.org
//

import { ProjectConfiguration } from '@nrwl/devkit';
import { resolve } from 'path';

import { logger } from './logger';
import { ModuleSpecifier } from './module-specifier';
import { parseAndGenerateSchema } from './type-generator';

export const build = async ({
  outdir,
  proto,
  substitutions,
  projects
}: {
  outdir: string
  proto: string[]
  substitutions?: string
  projects: {
    [projectName: string]: ProjectConfiguration
  }
}) => {
  const substitutionsModule = substitutions ? ModuleSpecifier.resolveFromFilePath(substitutions, process.cwd()) : undefined;
  const protoFilePaths = proto.map((file: string) => resolve(process.cwd(), file));
  const outdirPath = resolve(process.cwd(), outdir);

  logger.logCompilationOptions(substitutionsModule, protoFilePaths, outdirPath);

  await parseAndGenerateSchema(substitutionsModule, protoFilePaths, outdirPath, projects);
};