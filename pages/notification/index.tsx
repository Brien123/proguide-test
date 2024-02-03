import React, { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { DashBoardLayOut } from "../../components/layout/layout";
import { NotificationBox } from "../../components/utilityComponents";
import Link from "next/link";

const Notifications = ()=>{
    const [logIn, setLogIn] = useState(false);
    const [transcriptApk, settrans] = useState(false);

    useEffect(()=>{
        let userID = localStorage.getItem('id');
        let apkID = localStorage.getItem('apkID');
        //alert(userID)
        if(apkID != null ){
            
            settrans(true);
        }

    },[])
    
    return (
        <div className="container-fluid p-2 ">
            {
                logIn? <>
                <NotificationBox color="red" child={<Link href="/login"><button className="btn btn-info text-white">
                    Log In 
                </button></Link>} header="Oops Please Login or Create an Account" textMsg="Please it appears you have not yet 
                created an account or Logged In yet. Please do so below o enjoy full functionalities of ProGuide"  />
                
                
                </>:<p></p>
            } {
                transcriptApk? <>
                <NotificationBox header="Pending Transcript Application" textMsg="We Got your Back"  />
                
                
                </>:<p></p>
            }
            <NotificationBox header="Welcome to ProGuide" textMsg="We are thrilled to have you onboard" postTime="Today"/>

        </div>
    )
}

Notifications.getLayout = function getLayout(page: ReactElement) {
    return <DashBoardLayOut headerTxt="Notifications">{page}</DashBoardLayOut>;
  };
export default Notifications;


