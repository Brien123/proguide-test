import { type } from "os";
import React, { useState } from "react";
type btnprops = {
    txt: string,
    bgColor: string,
    txtColor: string,
    disabledBtn?: boolean,
    endLoad?: boolean
}
const LoadBtn = ({txt,bgColor,txtColor,disabledBtn,endLoad}:btnprops)=>{
    const [isClicked, updateIsClicked] = useState(false);
    if(typeof endLoad !== 'undefined' ){
        updateIsClicked(endLoad);
    }
    return(
        
            isClicked?
            <button
              style={{
                fontFamily: "Arima",
                backgroundColor: "#FFAC1C",
                color: "white",
              }}
              type="button"
              className=" p-2 btn  mt-4 border-0 rounded w-100 shadow-lg "
             
            >
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              Loading...
            </button>
            :
            <button
              style={{
                fontFamily: "Arima",
                backgroundColor: bgColor,
                color: txtColor,
              }}
              type="submit"
              className=" p-2 btn  mt-4 border-0 rounded w-100 shadow-lg "
              onClick={()=>{updateIsClicked(true)}}
              disabled={disabledBtn}
             
            >
              {txt}
            </button>
    );
}

export default LoadBtn;