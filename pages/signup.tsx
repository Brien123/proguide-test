import React, { useContext, useEffect, useState } from "react";
import type { ReactElement } from "react";
import Layout, {loaderShow} from "../components/layout/layout";
import type { NextPageWithLayout } from "./_app";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";

import {
  CentralisedBody,
  InputTextField,
  AxiosGetData
} from "../components/utilityComponents";
import SignUpImg from "../components/images/sinup.svg";
import Link from "next/link";
import {serverRes, baseURL} from '../types';
import axios from "axios";



const SignUp = () => {
  const router = useRouter();
  const showLoader = useContext(loaderShow);

  const query = router.query;
  //console.log(query.key);
  const [username, updateUsername] = useState<string>("");
  const [onSubmitForm, updateOnSubmit] = useState<boolean>(false);
  const [serverResponse, updateServerResponse] = useState<serverRes>({success:false, data:{ message:'no', data:{id:'default', type:'student'}}});
  const [selectType, updateSelect] = useState<null|string>(null);
  const [email, updateEmail] = useState<string>("");
  const [phone, updatePhone] = useState<number>(0);
 

  const changeSubmitStat = ()=>{
    updateOnSubmit(true);
  }
 
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=> {
    
    e.preventDefault();
    console.log('submit')
    if( selectType === null && query.key === undefined){
      alert("Please Select an Option under 'Tell Us who you are?");
    }else{
      //showLoader.updateLoadState(showLoader.loadState);
      updateOnSubmit(true);
      let val;
      selectType === null?val = query.key: val = selectType;
      let refVal;
      query.ref == undefined? refVal = null : refVal = query.ref;
  
    const formValues = {
      name: username,
      email: email,
      number: phone,
      referral: refVal,
      type: val,
    };
  AxiosGetData(baseURL+'signUp.php', 'post', formValues).then(res=>{
 console.log(res.data);
 if(res.data.success){
  updateServerResponse(res.data);
  updateOnSubmit(false);
 }else{
  toast.error('Error:'+res.data.data.message,{
    position:toast.POSITION.TOP_RIGHT
  })
 }
  }).catch(error=>{
    alert('An Error Occurred')
    if(axios.isCancel(error)){
    alert('TimeOut Exceeded')

      console.log('request was Cancelled');
    }
  })
  
  ;
   
  }
    }  

    useEffect(()=>{
      console.log("response");
      console.log(serverResponse);
      if(serverResponse.success){
        localStorage.setItem('id',serverResponse.data.data.id);
      localStorage.setItem('type',serverResponse.data.data.type);
        router.push('./dashboard');
      }else if(serverResponse.success == false){
        if(serverResponse.data.message !== 'no'){
          alert(serverResponse.data.message);
        }else{
          console.log(serverResponse.data.message)
        }
        
        updateOnSubmit(false);
  
      }else{
        console.log(serverResponse.data.message);
      }
      
      
      
    },[serverResponse]);


    

    
 
 

 
      {/*

 
      
      */}
  
 

  return (
    <>
    <ToastContainer/>
      <form onSubmit={handleSubmit}>
        <InputTextField
          labelName="Username"
          typeName="text"
          iconType="fa fa-user"
          onChangeFxn={(event) => updateUsername(event.currentTarget.value)}
        />
        <InputTextField
          labelName="Email"
          typeName="email"
          iconType="fa fa-envelope"
          onChangeFxn={(event) => updateEmail(event.currentTarget.value)}
        />

<InputTextField
          labelName="Phone Number"
          typeName="number"
          iconType="fa fa-phone"
          onChangeFxn={(event) => updatePhone(parseInt(event.currentTarget.value))}
        />
        
        {/*<InputTextField
          labelName="Password"
          typeName="password"
          iconType="fa fa-key"
          onChangeFxn={(event) => updatePassword(event.currentTarget.value)}
  />*/}
        <br/>
        { query.key == undefined ?
        <div className="input-group shadow-sm">
          <select className="form-select" aria-label="Default select example" style={{height:'60px'}} onChange={(event) => updateSelect(event.currentTarget.value)} required >
            <option>Please tell me who you are...</option>
            <option value="student">A Student</option>
            <option value="teacher">A Teacher</option>
            <option value="parent">A Parent</option>
          </select>
        </div>:<p></p>
        }<center>
          <button
            style={{
              fontFamily: "Arima",
              backgroundColor: "#FFAC1C",
              color: "white",
            }}
            type="submit"
            className=" p-2 btn  mt-4 border-0 rounded w-100 shadow-lg "
            disabled={onSubmitForm}
           
          >
            {!onSubmitForm?'Sign Up':<>Loading...<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></>}
          </button>
        </center>
        <div className="d-flex p-0 justify-content-center ">
          <p className=" caption px-300">
            I already have an account,{" "}
            <Link href="./login" style={{textDecoration: 'none'}}>
              <b>Login</b>
            </Link>
          </p>
        </div>
      </form>
    </>
  );
};

SignUp.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout imgLink={SignUpImg} textHeader="Create an Account">
      {page}
    </Layout>
  );
};

export default SignUp;
