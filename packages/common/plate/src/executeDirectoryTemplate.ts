//
// Copyright 2022 DXOS.org
//
import flatten from 'lodash.flatten';
import minimatch from 'minimatch';
import * as path from 'path';
import readDir from 'recursive-readdir';

import {
  executeFileTemplate,
  TemplatingResult,
  isTemplateFile,
  TEMPLATE_FILE_IGNORE,
  LoadTemplateOptions,
  TemplateResultMetadata
} from './executeFileTemplate';
import { File } from './file';
import { logger } from './logger';
import { runPromises } from './runPromises';
import { Config, loadConfig, unDefault } from './config';
import { inquire } from './zodInquire';
import { includeExclude } from './includeExclude';

export type ExecuteDirectoryTemplateOptions<TInput> = LoadTemplateOptions &
  Config & {
    templateDirectory: string;

    outputDirectory: string;
    input?: Partial<TInput>;

    parallel?: boolean;
    verbose?: boolean;
    overwrite?: boolean;
    interactive?: boolean;
  };

export const executeDirectoryTemplate = async <TInput>(
  options: ExecuteDirectoryTemplateOptions<TInput>
): Promise<TemplatingResult> => {
  const { templateDirectory, outputDirectory } = options;
  const mergedOptions = {
    parallel: true,
    verbose: false,
    interactive: true,
    ...(await loadConfig(templateDirectory, { verbose: options?.verbose })),
    ...options
  };
  const { parallel, verbose, inherits, interactive, overwrite, inputShape, include, exclude, ...restOptions } =
    mergedOptions;
  const debug = logger(verbose);
  debug(mergedOptions);
  let input = mergedOptions.input;
  if (inputShape) {
    const parse = unDefault(inputShape).safeParse(input);
    if (!parse.success && !interactive) throw new Error(parse.error.toString());
    if (!parse.success) {
      const inquired = await inquire(inputShape, {
        defaults: input
      });
      const inquiredParsed = inputShape.safeParse(inquired);
      if (!inquiredParsed.success) throw new Error(inquiredParsed.error.toString());
      input = inquiredParsed.data as TInput;
    }
  }
  debug({ input });
  inherits && debug(`executing inherited template ${inherits}`);
  const inherited = inherits
    ? await executeDirectoryTemplate({
        ...options,
        templateDirectory: path.resolve(templateDirectory, inherits),
        interactive: false,
        input
      })
    : undefined;
  debug(`executing directory template ${templateDirectory}`);
  const allFiles = await readDir(templateDirectory);
  const filteredFiles = includeExclude(allFiles, {
    include,
    exclude,
    transform: (s) => s.replace(templateDirectory, '').replace(/^\//, '')
  });
  const ignoredFiles = allFiles.filter((f) => filteredFiles.indexOf(f) < 0);
  const templateFiles = filteredFiles.filter(isTemplateFile);
  const regularFiles = filteredFiles.filter((file) => !isTemplateFile(file));
  debug(`${ignoredFiles.length} ignored files:`);
  debug(ignoredFiles.join('\n'));
  debug(`${templateFiles.length} template files:`);
  debug(templateFiles.join('\n'));
  debug(`${regularFiles.length} regular files:`);
  debug(regularFiles.join('\n'));
  debug('executing template files ...');
  const templatingPromises = templateFiles?.map((t) => {
    const templateFile = path.relative(templateDirectory, t);
    return executeFileTemplate({
      ...restOptions,
      templateFile,
      templateRelativeTo: templateDirectory,
      input,
      inherited: inherits ? inherited?.filter((result) => result.metadata.templateFile === templateFile) : undefined,
      overwrite
    });
  });
  const runner = runPromises({
    before: (_p, i) => {
      debug(`${templateFiles[Number(i)]} ....`);
    },
    after: (_p, i) => {
      debug(`${templateFiles[Number(i)]} done`);
    }
  });
  const templateOutputs = await (parallel
    ? runner.inParallel(templatingPromises)
    : runner.inSequence(templatingPromises));
  const stringPath = (p: string | string[]) => (typeof p === 'string' ? p : path.join(...p));
  const isOverwrittenByTemplateOutput = (f: string): boolean => {
    return templateOutputs.some((files) => files.some((file) => !!file && stringPath(file.path) === f));
  };
  debug(`template ${templateDirectory} done`);
  return [
    ...regularFiles
      ?.filter((f) => !isOverwrittenByTemplateOutput(f))
      .map(
        (r) =>
          new File<string, TemplateResultMetadata>({
            path: path.join(outputDirectory, r.slice(templateDirectory.length).replace(/\/$/, '')),
            copyFrom: r,
            overwrite
          })
      ),
    ...flatten(templateOutputs)
  ];
};
