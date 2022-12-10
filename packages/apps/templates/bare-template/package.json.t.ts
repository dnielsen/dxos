//
// Copyright 2022 DXOS.org
//
import { defineTemplate } from '@dxos/plate';
import { getDxosRepoInfo } from './utils.t/getDxosRepoInfo';
import config from './config.t';

export default defineTemplate<typeof config>(async ({ input }) => {
  const { name, react, monorepo } = input;
  const { version: dxosVersion, patchedDependencies } = await getDxosRepoInfo();
  const version = monorepo ? dxosVersion : '0.1.0';
  const depVersion = monorepo ? `workspace:*` : dxosVersion;
  const reactDeps = { '@dxos/react-client': depVersion, react: '^18.2.0', 'react-dom': '^18.2.0' };
  const reactDevDeps = { '@types/react': '^18.0.21', '@types/react-dom': '^18.0.6', '@vitejs/plugin-react': '^2.0.1' };
  const packageJson = {
    name,
    version: version,
    private: true,
    description: `${name} - a DXOS application`,
    scripts: {
      build: 'NODE_OPTIONS="--max-old-space-size=4096" tsc --noEmit && vite build',
      deploy: 'NODE_OPTIONS="--max-old-space-size=4096" dx app publish',
      preview: 'vite preview',
      serve: 'vite'
    },
    dependencies: {
      '@dxos/client': depVersion,
      '@dxos/config': depVersion,
      ...(react ? reactDeps : {})
    },
    devDependencies: {
      '@dxos/cli': depVersion,
      typescript: '^4.8.4',
      vite: '3.2.5',
      ...(react ? reactDevDeps : {})
    },
    ...(!monorepo
      ? {
          pnpm: {
            patchedDependencies
          }
        }
      : {})
  };
  const result = JSON.stringify(packageJson, null, 2);
  return result;
});

// export type Input = {
//   monorepo?: boolean
//   name: string
// }

// {
//   "name": "@dxos/bare-template",
//   "version": "0.1.13",
//   "private": true,
//   "description": "Application template with only the essentials.",
//   "homepage": "https://dxos.org",
//   "bugs": "https://github.com/dxos/dxos/issues",
//   "repository": "github:dxos/dxos",
//   "license": "MIT",
//   "author": "DXOS.org",
//   "scripts": {
//     "build": "tsc --noEmit && vite build",
//     "deploy": "dx app publish",
//     "preview": "vite preview",
//     "serve": "vite"
//   },
//   "dependencies": {
//     "@dxos/client": "workspace:*",
//     "@dxos/config": "workspace:*"
//   },
//   "devDependencies": {
//     "@dxos/cli": "workspace:*",
//     "@dxos/vite-plugin": "workspace:*",
//     "typescript": "^4.8.4",
//     "vite": "3.0.9"
//   }
// }

// const template: TemplateFunction<Input> = ({ input }) => /* javascript */ `{
//   "name": "${input.name}",
//   "version": "${packageJson.version}",
//   "private": true,
//   "description": "Application template with only the essentials.",
//   ${input.monorepo ? `
//   "homepage": "https://dxos.org",
//   "bugs": "https://github.com/dxos/dxos/issues",
//   "repository": "github:dxos/dxos",
//   "license": "MIT",
//   "author": "DXOS.org",
//   ` : ''}"scripts": {
//     "build": "tsc --noEmit && vite build",
//     "deploy": "dx app publish",
//     "preview": "vite preview",
//     "serve": "vite"
//   },
//   "dependencies": {
//     "@dxos/client": "${input.monorepo ? 'workspace:*' : packageJson.version}",
//     "@dxos/config": "${input.monorepo ? 'workspace:*' : packageJson.version}"
//   },
//   "devDependencies": {
//     "@dxos/cli": "${input.monorepo ? 'workspace:*' : packageJson.version}",
//     "@dxos/vite-plugin": "${input.monorepo ? 'workspace:*' : packageJson.version}",
//     "typescript": "^4.8.4",
//     "vite": "3.0.9"
//   }${input.monorepo ? '' : `,
//   "pnpm": {
//     "patchedDependencies": {
//       "vite@3.0.9": "patches/vite@3.0.9.patch"
//     }
//   }`}
// }`;

// export default template;
