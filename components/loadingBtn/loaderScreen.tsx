import React from "react";
import MyImage from "../images/imageDiv";
import { CentralisedBody } from "../utilityComponents";

const LoaderScreen = ()=>{
    return(
        
            <div className="p-3"  style={{height:'100vh'}}>
                <CentralisedBody >
                    <MyImage url={require('../images/pro+logo.png')} classes='img-fluid w-50'/>
                    
                </CentralisedBody><br/>
                <span className="arima ">
                        <p className="text-center"><u><strong>Did You know?</strong></u></p> that just by studying 30 mins a day you will be able to read all the books in the largest
                        Library in 1 academic year...
                    </span>
            </div>
       
    )
}

export default LoaderScreen;