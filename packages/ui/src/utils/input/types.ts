import type React from 'react';

import type { Input, OnInputParams } from '@repo/ds';

export type InputProps = React.ComponentProps<typeof Input>;

export type PersistInputProps = Omit<InputProps, 'list'> & {
  list?: Array<unknown>;
}

export type CurrentValueParams = {
  type: InputProps['type'];
  name?: string;
  item?: unknown;
}

export type handleOnInputParams = OnInputParams & {
  type: InputProps['type'];
  list?: Array<unknown>;
}