import React, {useEffect, useState} from "react";
import type { ReactElement } from 'react';
import Layout from '../components/layout/layout';
import type { NextPageWithLayout } from './_app';
import { useRouter } from "next/router";
import { AxiosGetData, CentralisedBody, InputTextField } from "../components/utilityComponents";
import { Form, Col, Row, Button, InputGroup, FormGroup } from "react-bootstrap";
import { InputText } from "../components/text-input/text-input";
import MyImage from "../components/images/imageDiv";
import SignUpImg from '../components/images/login.svg';
import Link from "next/link";
import {baseURL, serverRes} from '../types';



const LoginForm = () => {
  
  const router = useRouter();
  const query = router.query;
  const [username, updateUsername] = useState< string >('');
  const [onSubmitForm, updateOnSubmit] = useState<boolean>(false);
  const [password, updatePassword] = useState< string >('');
  const [email, updateEmail] = useState< string >('');
  const [serverResponse, updateserverResponse] = useState<serverRes>({success:false, data:{ message:'no fetch yet', data:{id:'default', type:'student'}}});
  const [selectType, updateSelect] = useState<null|string>(null);

  const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    const formValues = {name: username, type: selectType, email: email};
    updateOnSubmit(true);
    AxiosGetData( baseURL+'login.php', 'post', formValues).then(res=>{
 console.log(res.data);
 updateserverResponse(res.data);
  }).catch(err=>{
    alert('An Error Occured')
    updateOnSubmit(false);
  })
  }

  useEffect(()=>{
    console.log("I RAN");
    if(serverResponse.success){
      localStorage.setItem('id',serverResponse.data.data.id);
    localStorage.setItem('type',serverResponse.data.data.type);
      router.push('./dashboard');
    }else if(serverResponse.success == false && serverResponse.data.data.id != 'default'){
      alert(serverResponse.data.message);
      updateOnSubmit(false);

    }else{
      console.log(serverResponse.data.message);
    }
  },[serverResponse]);
  return (
    <>
   

            <form onSubmit={handleSubmit} >
            
           <InputTextField labelName="Username" typeName="text" iconType="fa fa-user" onChangeFxn={event=>
             updateUsername(event.currentTarget.value) 
            }/>
            <InputTextField
          labelName="Email"
          typeName="email"
          iconType="fa fa-envelope"
          onChangeFxn={(event) => updateEmail(event.currentTarget.value)}
        />
            <br />


<div className="input-group shadow-sm">
          <select className="form-select" aria-label="Default select example" style={{height:'60px'}} onChange={(event) => updateSelect(event.currentTarget.value)} required >
            <option>Please are you Logging In as...</option>
            <option value="student">A Student</option>
            <option value="teacher">A Teacher</option>
            <option value="parent">A Parent</option>
          </select>
        </div>
          
           <center>

           {
          onSubmitForm?
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
              backgroundColor: "#FFAC1C",
              color: "white",
            }}
            type="submit"
            className=" p-2 btn  mt-4 border-0 rounded w-100 shadow-lg "
           
          >
            Log In
          </button>}
           </center>
           <div className='d-flex p-0 justify-content-center '>
                            <p className=' caption px-300'>Do not Have an Account? <Link href="./signup"><b>Sign Up Now</b></Link></p>
                        </div>
            </form>

    </>
  );
};

LoginForm.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout imgLink={SignUpImg} textHeader="Log In your Account">
      {page}
    </Layout>
  )
}

export default LoginForm;
