import React, { useEffect } from "react";
import { AppHeaderDiv } from "../utilityComponents";

const MobileHeader = (child: React.ReactNode)=>{
    useEffect(()=>{
        var accountType = localStorage.getItem('type');
        console.log(accountType);
        
    },[])

   //
   return(
    <h1>hi
    {child}
    </h1>
   )
}

export default MobileHeader;