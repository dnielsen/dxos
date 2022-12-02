import * as tsnode from 'ts-node';

export const isCodeModule = (file: string) => /\.[tj]sx?$/.test(file);

export type LoadModuleOptions = {
  compilerOptions?: object;
  moduleLoaderFunction?: (m: string) => any;
};

export const loadModule = async (p: string, options?: LoadModuleOptions) => {
  if (!isCodeModule(p)) {
    throw new Error(`only ts or js files can be loaded. attempted: ${p}`);
  }
  if (/\.tsx?$/.test(p)) {
    tsnode.register({
      transpileOnly: true,
      swc: true,
      skipIgnore: true,
      compilerOptions: {
        strict: false,
        target: 'es5',
        module: 'commonjs',
        ...options?.compilerOptions
      }
    });
  }
  const loader = options?.moduleLoaderFunction ?? ((m: string) => import(m));
  return loader(p);
};

export const safeLoadModule = async (p: string, options?: LoadModuleOptions) => {
  try {
    return {
      module: await loadModule(p, options),
      success: true
    };
  } catch (err) {
    return { error: err, success: false };
  }
};
