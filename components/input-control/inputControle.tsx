import React from 'react'
import { inputcontrole } from '../../types';


export const InputControl = (props: inputcontrole): JSX.Element => {
    const {
        id,
        className,
        children,
        required,
        type,
        status,
        errors,
        valid,

    } = props;

    return (
        <div id={`input-controle-${id}`}>
            {children}
        </div>
    )
}