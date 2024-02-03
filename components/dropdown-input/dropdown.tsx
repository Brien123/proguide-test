import classnames from 'classnames';
import * as React from 'react';
import { choices, dropdowninput } from '../../types/index';
import { InputControl } from '../input-control/inputControle';
import { Label } from '../label/label';
import styles from "./dropdown-input.module.css"


export const Dropdown = (props: dropdowninput):JSX.Element => {
  const {
    id,
    className,
    required,
    value,
    onChange,
    label,
    type,
    name,
    status,
    info,
    errors,
    valid,
    options
  } = props;

    
    const age: string = ''
    /* 
              {options.map(option => <MenuItem key = {option} value={option}>{option}</MenuItem>)} 
 */
    return(
      <InputControl 
      id={id}
      type = {type}
      status = {status}
      className = {classnames(className)}
      errors = {errors}
      valid = {valid}
      name = {name}
      >
        <Label 
            htmlFor={id || name } 
            label = {label}
        />
        <input type={"checkbox"}></input>
        <select className={`form-select mb-3 select-dropdown ${styles.dropdownField}`} aria-label="">
        {options.map(option => <option key = {option} value={option}>{option}</option>)} 
          </select>
    </InputControl>
    );
    }
    
export default Dropdown


