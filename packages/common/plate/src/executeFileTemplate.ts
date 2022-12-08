//
// Copyright 2022 DXOS.org
//
import path from 'path';

import { loadModule, LoadModuleOptions } from './loadModule';

import { File, getFileType, MaybePromise, promise } from './file';
import { Config } from './config';
import { z } from 'zod';

/** Include all template files that end with .t.ts or .t.js */
export const TEMPLATE_FILE_INCLUDE = /(.*)\.t\.[tj]s$/;
/** Do not process files that are compilation noise like .map and .t.d.ts */
export const TEMPLATE_FILE_IGNORE = [/\.t\.d\./, /\.map$/];

export const isTemplateFile = (file: string) =>
  TEMPLATE_FILE_INCLUDE.test(file) && !TEMPLATE_FILE_IGNORE.some((pattern) => pattern.test(file));

export const getOutputNameFromTemplateName = (s: string): string => {
  const e = TEMPLATE_FILE_INCLUDE.exec(s);
  const out = e?.[1];
  return out ?? s;
};

export type LoadTemplateOptions = LoadModuleOptions;

const loadTemplate = async <I = any>(p: string, options?: LoadTemplateOptions): Promise<TemplateFunction<I> | null> => {
  if (!isTemplateFile(p)) {
    throw new Error(`only *.t.ts or *.t.js template files are supported. attempted: ${p}`);
  }
  const module = await loadModule(p, options);
  const fn = module?.default ?? module;
  return typeof fn === 'function' ? fn : typeof fn === 'string' ? () => fn : null;
};

export type ExecuteFileTemplateOptions<TInput = {}> = LoadTemplateOptions & {
  templateFile: string;
  templateRelativeTo?: string;
  outputDirectory: string;
  input?: TInput;
  overwrite?: boolean;
  inherited?: TemplatingResult;
};

export type TemplateContext<TInput = {}> = ExecuteFileTemplateOptions<TInput> & {
  input: TInput;
  defaultOutputFile: string;
};

export type TemplateResultMetadata = {
  templateFile?: string;
};

export type TemplatingResult<R = any> = File<R, TemplateResultMetadata>[];

export type TemplateFunctionResult<R = any> = null | string | File<R, TemplateResultMetadata>[];

export const defineTemplate = <TInput = any>(
  fun: TemplateFunction<TInput extends Config<infer U> ? z.infer<U> : TInput>
) => fun;

export type Functor<TInput = void, TOutput = void> = (input: TInput) => MaybePromise<TOutput>;

// a template file .t.ts exports this as default:
export type TemplateFunction<TInput = void> = Functor<TemplateContext<TInput>, TemplateFunctionResult>;

export const executeFileTemplate = async <TInput>(
  options: ExecuteFileTemplateOptions<TInput>
): Promise<TemplatingResult> => {
  const { templateFile, outputDirectory, templateRelativeTo, overwrite } = options;
  const absoluteTemplateRelativeTo = path.resolve(templateRelativeTo ?? '');
  const templateFullPath = path.join(absoluteTemplateRelativeTo, templateFile);
  const templateFunction = await loadTemplate(templateFullPath, options);
  if (!templateFunction) {
    return [];
  }
  const relativeOutputPath = getOutputNameFromTemplateName(templateFullPath).slice(absoluteTemplateRelativeTo.length);
  const nominalOutputPath = path.join(outputDirectory, relativeOutputPath);
  try {
    const templateContext = {
      input: {},
      ...options,
      defaultOutputFile: nominalOutputPath,
      inherited: options.inherited,
      ...(templateRelativeTo
        ? { templateRelativeTo: absoluteTemplateRelativeTo }
        : { templateRelativeTo: path.dirname(templateFullPath) })
    };
    const result = await promise(templateFunction(templateContext));
    return result === null
      ? []
      : typeof result === 'string'
      ? [
          new (getFileType(nominalOutputPath))({
            content: result,
            path: nominalOutputPath,
            ...(typeof overwrite !== 'undefined' ? { overwrite: !!overwrite } : {}),
            metadata: {
              templateFile
            }
          })
        ]
      : result.map((outfile) => {
          if (overwrite === false) {
            outfile.allowOverwrite = false;
          }
          outfile.metadata.templateFile = templateFile;
          return outfile;
        });
  } catch (err) {
    console.error(`problem in template ${templateFullPath}`);
    throw err;
  }
};
