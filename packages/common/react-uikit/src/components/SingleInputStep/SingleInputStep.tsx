//
// Copyright 2022 DXOS.org
//

import cx from 'classnames';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  Button,
  Group,
  GroupProps,
  Input,
  InputProps,
  InputSize
} from '@dxos/react-ui';

import { TKey } from '../../types';
import { Loading } from '../Loading';

export interface SingleInputStepProps
  extends Omit<GroupProps, 'label' | 'onChange'> {
  rootLabelTKey: TKey
  inputLabelTKey: TKey
  onChange: (value: string) => void
  pending?: boolean
  onBack?: () => void
  backTKey?: TKey
  onNext: () => void
  nextTKey?: TKey
  loadingTKey?: TKey
  inputPlaceholderTKey?: string
  inputProps?: Omit<InputProps, 'label' | 'placeholder'>
}

export const SingleInputStep = ({
  rootLabelTKey,
  inputLabelTKey,
  onChange,
  pending,
  onBack,
  backTKey = 'back label',
  onNext,
  nextTKey = 'next label',
  loadingTKey = 'generic loading label',
  inputPlaceholderTKey,
  inputProps,
  ...groupProps
}: SingleInputStepProps) => {
  const { t } = useTranslation();
  return (
    <Group
      elevation={5}
      label={{
        level: 1,
        className: 'mb-2 text-3xl',
        children: t(rootLabelTKey)
      }}
      {...groupProps}
      className={cx('p-5 rounded-xl', groupProps.className)}
      aria-live='polite'
    >
      <Input
        size={InputSize.lg}
        label={t(inputLabelTKey)}
        {...inputProps}
        {...(inputPlaceholderTKey && { placeholder: t(inputPlaceholderTKey) })}
        {...(pending && { disabled: true })}
        onChange={onChange}
      />
      <div role='none' className='flex gap-4 justify-end items-center'>
        <div role='none' className={cx(!pending && 'hidden')}>
          <Loading
            labelTKey={loadingTKey}
            className='p-0 ml-0'
          />
        </div>
        {onBack && (
          <Button onClick={onBack} {...(pending && { disabled: true })}>
            {t(backTKey)}
          </Button>
        )}
        <Button
          variant='primary'
          onClick={onNext}
          {...(pending && { disabled: true })}
        >
          {t(nextTKey)}
        </Button>
      </div>
    </Group>
  );
};
