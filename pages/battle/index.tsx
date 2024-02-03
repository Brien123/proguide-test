import React from "react";
import { DashBoardLayOut } from "../../components/layout/layout";
import type { ReactElement } from "react";
import MyImage from "../../components/images/imageDiv";
import { CentralisedBody, CoolButton, ProfileBtn } from "../../components/utilityComponents";
var Pro = require("../../components/images/books.svg");

const Battle =  ()=>{
    return(
        <div className="p-2 container">
            
            
            <CentralisedBody>
                <p className="arima">
                    Coming Soon...
                </p>
            </CentralisedBody>
        </div>
    )

}
Battle.getLayout = function getLayout(page: ReactElement) {
    return <DashBoardLayOut headerTxt="Battle Ground">{page}</DashBoardLayOut>;
  };

export default Battle;