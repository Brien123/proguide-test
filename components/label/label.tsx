import React from 'react';
import classnames from 'classnames';
import { inputlabel } from '../../types/index';

export const Label = (props: inputlabel): JSX.Element | null => {
    const { className, label, htmlFor } = props;

    if (!label || label ===''){
        return null;
    }

    return (
        <label className ={classnames('small fw-light',className)} htmlFor={htmlFor}>
            {label}
        </label>
    );
}

export default Label