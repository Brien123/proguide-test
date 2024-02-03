import * as React from 'react';
import { choices } from '../../types';
import { Children } from 'react';
import styles from "./radio-group-input.module.css"



const Choicebox: React.FC<choices> = ({ id, options, name }) => {

  return (
      <div id={id} className={`${styles.radioToolbar} `} >
      
        {
        options.map(option => 
          <>
          <input name={name} id={option} type="radio" className={`  `} />
          <label htmlFor={option} className="p-2"> {option}</label>
          </>
           
        )}
      </div>

  );
}

export default Choicebox