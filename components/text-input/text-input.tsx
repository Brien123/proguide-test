import React, { useState } from 'react';
import classnames from 'classnames';
import { Info } from '../input-info/input-info';
import { Label } from '../label/label';
import { InputControl } from '../input-control/inputControle';
import { inputfieldWithIcon } from '../../types';
import styles from "./text-input.module.css";
import Script from 'next/script';


export const InputText = (props: inputfieldWithIcon): JSX.Element => {
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
    icon
  } = props;

  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const toggleIcon = () => {
    setPasswordShown(!passwordShown);
  };

  if (type === "password") {
    return (
      <InputControl
        id={id}
        type={type}
        status={status}
        className={classnames(className)}
        errors={errors}
        valid={valid}
        name={name}
        value={value}
      >
        <div className='row '>
          <div className={`d-flex me-4 align-items-center col-1 `}>
          <span
              className={`myIcon h5  align-self-center ${icon}`}>
            </span>

          </div>
          <div className={` form-floating d-flex col-9 ${styles.inputfieldBox}`}>

            

            <input
              className={`form-control border-0  input-sm`}
              id={name}
              name={name}
              placeholder={label}
              type={passwordShown ? "text" : "password"}              
              autoFocus={true}
              onChange={onChange}
              value = {value}
              required={required}
              {...{ noValidate: true }}
            />

{ type==="password"? <i className="myIcon h7 icon align-self-center fi-rr-eye-crossed"  onClick={togglePassword}></i> :<i className="myIcon h7 icon align-self-center fi-rr-eye"  onClick={togglePassword}></i> }

            <label htmlFor={name}>{label}</label>
          </div>
        </div>
      </InputControl>
    )

  }
  return (
    <InputControl
      id={id}
      type={type}
      status={status}
      className={classnames(className)}
      errors={errors}
      valid={valid}
      name={name}
      value={value}

    >

<div className='row'>
          <div className={`d-flex me-4 align-items-center col-1 `}>
          <span
              className={`myIcon h5 icon align-self-center ${icon}`}>
            </span>

          </div>
          <div className={` form-floating d-flex col-9 ${styles.inputfieldBox}`}>

          <input
            className={`form-control  border-0`}
            id={name}
            name={name}
            value = {value}
            onChange={onChange}
            placeholder={label}
            type={type}
            autoFocus={true}
            required={required}
            {...{ noValidate: true }}
          />
          <label htmlFor={name}>{label}</label>
        </div>
      </div>
    </InputControl>
  )

}