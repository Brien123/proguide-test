import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MyImage from "../components/images/imageDiv";
import Tick from "../components/images/tick.svg";
import Cross from "../components/images/x.svg";
import { AxiosGetData, CentralisedBody, SaveChats } from "../components/utilityComponents";
import { baseURL } from "../types";

const Status = () => {
    const [apk, updateapk] = useState(''); 
    const [btnText, updateTxt] = useState('View Transcript Status'); 
    const [pText, updatePTxt] = useState('View Transcript Status'); 
    const [btnClicked, setBtnClicked] = useState(false);
    var router = useRouter();
    var queryString = router.query;
    useEffect(()=>{
        var apkId = localStorage.getItem('apkID');
       
        if(apkId != undefined){
            updateapk(apkId);
        }

        
       
        
        
        
    },[]);

    useEffect(()=>{
      if(queryString.topUp !== undefined){
        updatePTxt(`Account was Credited with ${queryString.topUp} XAF !`);
        updateTxt('Back To Dashboard')
      }
    },[router])
  
 

  
  const handleRequest=(transID: string|string[]|undefined, apkID: string, topUp?:string|string[]|undefined )=>{
    setBtnClicked(true);

    if(topUp !== undefined){
      router.push('/test');
    }
    if(typeof transID == 'string'){
      //alert(transID);
     var formValues = {
        matnum: transID,
        id: apkID,
        type:'update'
      };
      AxiosGetData('https://www.studentproguide.site/php/transcript.php', 'post', formValues).then(res=>{
        console.log(res.data);
       router.push('/dashboard');
      }).catch(error=>{
        console.log(error);
      });
      
    }else{
      console.log(typeof queryString.transID)
          alert('Error! Please report to admin errorcode:123x04');
    }
   

  }
 

  return (
    <CentralisedBody addClasses="p-3">
      <div className="container rounded shadow-lg p-3">
        <div className="h-80 p-4  text-center">
          <MyImage
            url={queryString.stat == "false" ? Cross : Tick}
            classes="img-fluid "
          />
        </div>
        <center>
          
            {queryString.stat == "false" ? (
              <>
              <span>
              <p className="text-danger fs-3">Payment Failed</p>
              </span>
              <button className="btn btn-danger" onClick={()=>{handleRequest(queryString.transID,apk,queryString.topUp)}} >
            Oops An Error Occured. Contact Admin
        </button>
              </>
              
            ) : (
              <>
              
              <span>
              <p className="text-success fs-3">Success</p>
              </span>
              <p>
                {pText}
              </p>
              <button className="btn btn-success" onClick={()=>{handleRequest(queryString.transID,apk,queryString.topUp)}} disabled={btnClicked}>
              {btnClicked?'Loading..':<>{btnText}</>}
          </button>
          </>
            )}
          
        
       
        
        </center>
       
      </div>
    </CentralisedBody>
  );
};

export default Status;
