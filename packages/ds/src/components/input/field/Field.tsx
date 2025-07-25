import React, { forwardRef } from 'react';

import { type TInputType, joinClass } from '../../../utils';

import './Field.scss';

interface ContentProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    type: TInputType;
    rows?: number;
}

const Field = forwardRef<HTMLInputElement | HTMLTextAreaElement, ContentProps>((
    { rows, type, className, ...props },
    ref
) => {
    const inputElementClassNameList = joinClass([
        'ds-input-content__field',
        className,
    ]);

    const inputElementProps = {
        type,
        className: inputElementClassNameList,
        ...props,
    }

    return type === 'textarea'
        ? (<textarea ref={ref as React.Ref<HTMLTextAreaElement>} {...inputElementProps} rows={rows}/>)
        : (<input ref={ref as React.Ref<HTMLInputElement>} {...inputElementProps}/>)
})
Field.displayName = 'Content';

export default Field;