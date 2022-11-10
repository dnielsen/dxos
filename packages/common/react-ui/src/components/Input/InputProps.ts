//
// Copyright 2022 DXOS.org
//

import { ComponentProps, ReactNode } from 'react';

import { MessageValence } from '../../props';

export type InputSize = 'md' | 'lg' | 'pin';

export interface InputProps extends Omit<ComponentProps<'input'>, 'value' | 'onChange' | 'size' | 'ref'> {
  label: ReactNode;
  labelVisuallyHidden?: boolean;
  description?: ReactNode;
  descriptionVisuallyHidden?: boolean;
  initialValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  size?: InputSize;
  validationMessage?: ReactNode;
  validationValence?: MessageValence;
  length?: number;
}
