import React from 'react';
import classnames from 'classnames'
import { infotext } from '../../types';


export const Info = (props: infotext): JSX.Element | null => {
    const { className, label } = props;

    if(!label || label === ''){
        return null;
    }

    return(
        <small className = {classnames('info',className)}>{label}</small>
    );
}