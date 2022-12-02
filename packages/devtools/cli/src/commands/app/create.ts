//
// Copyright 2022 DXOS.org
//

import { Flags } from '@oclif/core';
import { exec } from 'node:child_process';
import { mkdir, copyFile, rm } from 'node:fs/promises';
import { promisify } from 'node:util';
import { cwd } from 'process';

import { executeDirectoryTemplate } from '@dxos/plate';

import { BaseCommand } from '../../base-command';

export const APP_TEMPLATES = [
  'hello',
  'bare',
  'tasks'
];

export default class Create extends BaseCommand {
  static override description = 'Create a DXOS project.';

  static override args = [
    {
      name: 'name',
      required: true,
      description: 'Name of the project'
    }
  ];

  static override flags = {
    ...BaseCommand.flags,
    tag: Flags.string({
      description: 'Git tag or branch of the DXOS repo to checkout.'
    }),
    template: Flags.string({
      char: 't',
      description: 'Template to use when creating the project.',
      default: 'hello',
      options: APP_TEMPLATES
    })
  };

  async run(): Promise<any> {
    const { args, flags } = await this.parse(Create);
    const { name } = args;
    const { tag = `v${this.config.version}`, template } = flags;

    // TODO(wittjosiah): Cross-platform.
    const tmpDirectory = `/tmp/dxos-app-create-${Date.now()}`;
    const templateDirectory = `${tmpDirectory}/packages/apps/templates/${template}-template`;
    const outputDirectory = `${cwd()}/${name}`;

    try {
      this.log('Cloning template from Github...');
      await promisify(exec)(`
        git clone --filter=blob:none --no-checkout git@github.com:dxos/dxos.git ${tmpDirectory} &&
          cd ${tmpDirectory} &&
          git sparse-checkout set --cone tsconfig.json patches packages/apps/templates/${template}-template &&
          git checkout ${tag}
      `);

      this.log('Preparing template...');

      // Copy vite patch.
      await mkdir(`${templateDirectory}/patches`);
      await copyFile(`${tmpDirectory}/patches/vite@3.0.9.patch`, `${templateDirectory}/patches/vite@3.0.9.patch`);

      // Remove unneccessary files.
      // await rm(`${templateDirectory}/project.json`);
      // await rm(`${templateDirectory}/tsconfig.plate.json`);

      this.log('Creating app...');

      // TS templating.
      const result = await executeDirectoryTemplate({
        templateDirectory,
        outputDirectory,
        verbose: false,
        input: {
          monorepo: false,
          name
        }
      });
      await Promise.all(result.map((file) => file.save()));

      this.log(`App created. To get started run the following commands:\n\n  cd ${name}\n  pnpm install\n  pnpm serve`);
    } catch (err: any) {
      this.log(`Unable to create: ${err.message}`);
      this.error(err, { exit: 1 });
    } finally {
      await rm(tmpDirectory, { recursive: true, force: true });
    }
  }
}
