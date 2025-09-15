import React from 'react';

import { Input } from '@repo/ds';
import { ValidatorMessage } from '@repo/services';


type InputProps = React.ComponentProps<typeof Input>;

export type InputGroupItem = & InputProps & {
    show: boolean;
    needType: boolean;
    isCreate?: boolean;
    isVariable?: boolean;
};

export type InputGroup = {
    id: string;
    inputs: Array<InputGroupItem>;
    className?: string;
};

type TPersistInput =
    | 'id'
    | 'paid'
    | 'type'
    | 'value'
    | 'month'
    | 'supplier'
    | 'january'
    | 'january_paid'
    | 'february'
    | 'february_paid'
    | 'march'
    | 'march_paid'
    | 'april'
    | 'april_paid'
    | 'may'
    | 'may_paid'
    | 'june'
    | 'june_paid'
    | 'july'
    | 'july_paid'
    | 'august'
    | 'august_paid'
    | 'september'
    | 'september_paid'
    | 'october'
    | 'october_paid'
    | 'november'
    | 'november_paid'
    | 'december'
    | 'december_paid'
    | 'instalment_number'
    | 'description';

export type PersistForm = {
    valid: boolean;
    fields: Record<TPersistInput, string | boolean | undefined>;
    errors: Record<TPersistInput, ValidatorMessage | undefined>;
    message?: string;
}