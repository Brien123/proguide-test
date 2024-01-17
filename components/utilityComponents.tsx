import React, { ReactElement } from "react";
import Link from "next/link";
import axios from 'axios';
import axiosRetry from 'axios-retry';
import MyImage from "./images/imageDiv";
import { Headerprops, notificationProps, centerprops, inputprops, Testimonyprops, navprops, navbtnprops, BoxProps, quicklinksprops } from "../types";
import { propTypes } from "react-bootstrap/esm/Image";
import { StaticImageData } from "next/image";

const CentralisedBody = ({children, addClasses}: centerprops)=>{
    return(
        <div className={`d-flex justify-content-center align-items-center ${addClasses}` }>
            {children}
        </div>
    );
}

const InputTextField = ({labelName, typeName, iconType, inputVal, onChangeFxn}: inputprops)=>{
    return (
        <>
     <label htmlFor="basic-url" className="form-label">{labelName}</label>
     
     <div className="input-group">
  

       {iconType == ''?<p></p>:<span className="input-group-text" id="addon-wrapping"><i className={iconType}></i> </span>

        }
    
 
  <input type={typeName} className="form-control" value={inputVal} onChange={onChangeFxn} placeholder={labelName} aria-label="Username" aria-describedby="addon-wrapping" style={{height:'50px'}} required/>
</div>

</>

    );
}

const AxiosGetData = async (link: string, type: string, dataObj: object, parameter?: object) =>{
var returned: object;
    axiosRetry(axios, {
        retries: 3,
        shouldResetTimeout: true,
        retryCondition: (_error) => true // retry no matter what
      });
      console.log('sent me ')
      const reqData = await axios({
        method: type,
        url: link,
        params: parameter,
        data: JSON.stringify(dataObj),
        timeout: 10000
      });

    return reqData;

  
}

const Testimonials = ({testimony, name}: Testimonyprops)=>{
    return(
        <div className="container w-100 m-3 shadow-lg rounded prata ">
                <i className="fa-solid fa-quote-left fa-3x orangedefault"></i><br />
                       
                        <blockquote className="blockquote text-center">
                            <p className="mb-0">{testimony}</p>
                            <br/><footer className="blockquote-footer"> <cite title="Source Title">{name}</cite></footer>
                        </blockquote>

                        
                </div>
    );
}

const SaveChats  = (chats: string, link: string)=>{
    
    AxiosGetData(link, 'POST' , JSON.parse(chats)).then(res=>{
        if(res.data.success){
            console.log('Saved Chats Successfully');
            
        }else{
//console.log('Error Occured Saving')
console.log(res.data)
        }
    }).catch(err=>{
       
        console.log('error'+err.message);
    })
  
}

const NavItem = ({name, url}: navprops)=>{
    return(
        <div className="navItem arima  p-3">
            <Link href={url}  style={{ textDecoration: 'none' ,color: 'inherit'}}>
                {name}
            </Link>

        </div>
    );
}

const NavItemBtn = ({name, url, classes}: navbtnprops)=>{
    return(
        <div className=" arima  p-3">
            <Link href={url}  style={{ textDecoration: 'none'}}>
                <button className={`btn ${classes}`}>
                    {name}
                </button>
            </Link>

        </div>
    );
}


export const Box = ({name, image, link}:BoxProps)=>{
    return(
        <Link href={link} style={{ textDecoration: 'none' ,color: '#0d6efd'}}>
            <div className="col-12 p-1" >
                <div className="rounded p-1 text-center" style={{ border: '1px solid #0d6efd' }}>
                    <MyImage url={image} classes='w-50 h-50' h={50}/>
                    
                    <p className='text-color'>{name}</p>
                </div>
            </div>
        </Link>
    );
}

type questionBtnProps= {
    verified: boolean,
    imgLink: StaticImageData ,
    url: string,
    name: string
}
export const QuestionBox = ({verified, imgLink, url, name}: questionBtnProps)=>{
    return(
        <div className="col-6 p-2" >
            <div className="shadow-lg rounded p-1">
              <div className=" position-relative">
                {
                    verified?<span className={`position-absolute top-0 start-0  badge bg-success p-2 text-white rounded`}>
                    verified
                  </span>:<span className={`position-absolute top-0 start-0  badge bg-danger p-2 text-white rounded`}>
                  unverified
                </span> 
                }
                
                <MyImage url={imgLink} classes="img-fluid" />
              </div>
              <br />
              <div className="p-1 text-center ">
                <span className="arima">{name}</span>
                <br />
                <Link href={url}>
                <button className="btn btn-info arima text-white p-1">
                  View Course
                </button>
                </Link>
                
              </div>
            </div>
          </div>
    )
}

const QuickLinks = ({url, name}:quicklinksprops )=>{
    return (
        <div className=" p-3 arima">
                    <Link href={url} style={{ textDecoration: 'none' ,color: 'inherit'}}>
                       {name}
                    </Link>
                </div>
    );
}

type btnprops = {
    bgColor:string,
    textColor:string,
    displayTxt:string,
    url:string,
    children?: React.ReactNode ,
    disable?: boolean
}

const CoolButton = ({bgColor,textColor,displayTxt,url, children, disable=false}:btnprops) =>{
    return(
        <Link href={url} style={{ textDecoration: 'none' }}>
        <button
            style={{
              fontFamily: "Arima",
              backgroundColor: bgColor,
              color: textColor,
            }}
            disabled={disable}
            
            className=" p-2 btn border-0 rounded w-100 shadow-lg"
           
          >
            {displayTxt}&nbsp;
            {children}
          </button>
          
          </Link>
    );
}
type profilebtnprops = {
    iconStr: string,
    colorStr: string,
    txt: string,
   
    link: string | object
}

const ProfileBtn = ({iconStr, colorStr, txt, link}:profilebtnprops)=>{
    return(
        <Link href={link} style={{ textDecoration: 'none' }}>
       
        <div className="p-2 " style={{color:'black'}}>
                <i className={`fa ${iconStr}`} style={{color:colorStr}}></i>
                &nbsp;&nbsp;{txt} 
                <i className='fa fa-greater-than ' style={{color:'#FFAC1C', position:'absolute', left: '80%'}}></i>
                    <hr />
                </div>
                </Link>
    )
}

const AppHeaderDiv = ({img,children,order}: Headerprops) =>{
    return(
        <div
        className="container-fluid text-white"
        style={{ minHeight: "22vh" }}
      >
        <div className="row  shadow-lg testbg rounded p-3">
          <div className={`col-5 h-100 order-${order}`}>
            <MyImage classes="h-100 w-100" url={img} />
          </div>
          <div className="col-7 arima p-2 d-flex flex-column justify-content-between">
            {children}
          </div>
        </div>
      </div>

    );
}

const LoginPrompt = ()=>{
    return(
        <div className="container rounded shadow-lg p-3" style={{zIndex:'5'}}>
            <p className="text-center">
                <i className="fa fa-lock fa-3x" style={{color:'#eea849'}}></i>
            </p>
        <div className="display-5">Ooops!... </div>
        <div className=" text-muted ">Seems you&apos;ve not yet created an Account or Logged In...<br/><br/>
        <CoolButton bgColor='#eea849' displayTxt='Create An Account/Login' textColor='white' url='/signup'/>
        </div>
      </div>
    )
}

type navigationBtnprops = {
    classes: string,
    text: string,
    url: string,
    disable?: boolean
}
const NavigableButton = ({classes, text, url, disable}: navigationBtnprops) =>{
    return(
        <a href={url} style={{ textDecoration: 'none'}} target="_blank" rel="noopener noreferrer">
        <button className={`btn ${classes}`} disabled={disable}><small>{text}</small></button>
        </a>
    )
}

const NotificationBox = ({header, textMsg, postTime, color, child}:notificationProps)=>{
    return(
        <div className="p-2 border-bottom">
                <p className="arima fs-5 ">
                    <i className="fa fa-circle bo" style={{color: color}}></i> &nbsp;
                    {header}
                </p>
                <span style={{fontSize: '14px'}} className="nunito">
                    {textMsg}
                </span><br/>
                <small>{postTime}</small><br/>
                {child}
               
            </div>
    )
}
type QuestionsBoxprops = {
    link: string,
    img?: string | StaticImageData,
    ctitle: string,
    ccode: string,
    questype: string,
    verify: number,
    year: number
}
const QuestionsBox = ({link, img, ctitle, ccode, questype, verify, year }:QuestionsBoxprops)=>{
    return(
        <Link href={link} style={{textDecoration:'none', color:'inherit'}}>
        <div className="p-1">
          <div className="row rounded border shadow-lg">
            <div className='col-4'>
                {
                    img === undefined? <></>:<MyImage classes='h-100 w-100' url={img}/>
                }
              
            </div>
            <div className='col-8 p-2 prata'>
              {ccode}:<br/> {ctitle}<br/>
              {year}<br/>
              <div className="row " >
                <div className="col-12 p-1 col-sm-4 "><span className="p-1 bg-warning text-white rounded">{questype}</span></div>
                {
                verify?<div className="col-12 p-1 col-sm-4 "><span className="p-1 bg-success text-white rounded"><i className='fa fa-check'></i> <small>verified</small></span></div>
                :<div className="col-12 p-1 col-sm-4 "><span className="p-1 bg-danger text-white rounded"><i className='fa fa-close'></i> <small>unverified</small></span></div>
                
                }
              </div>
            </div>
          </div>
        </div>
        </Link>
    )
}

const UploadSolution = ({ccode, ctitle, solution, cID, onClickFxn, onChangeFxn}:{
    ccode: string,
    cID: string,
    ctitle: string,
    solution: null | string,
    onClickFxn: (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>void,
    onChangeFxn: (e:React.ChangeEvent<HTMLInputElement>)=>void
})=>{
    return(
        <div className="p-1">
        <div className="row rounded border shadow-sm">
          <div className='col-8 p-2 prata'>
            {ccode}:<br/> {ctitle}<br/>
          </div>
          <div className="col-4 d-flex justify-content-center align-items-center border">
         
         
            {
                solution == null?
                <button className=" btn btn-outline-primary " id={cID} onClick={onClickFxn}>Upload &nbsp; 
                <input
                className="form-check-input"
                name="selectBtnGroup"
                type="radio"
                value={cID}
                onChange={onChangeFxn}
              />
              </button>:
                <button className="btn btn-outline-warning " id={cID} onClick={onClickFxn}> Update&nbsp;
                <input
                className="form-check-input"
                name="selectBtnGroup"
                value={cID}
                type="radio"
                onChange={onChangeFxn}
              />
                </button>
            }
             
            </div>
        </div>
      </div>
    )

}

export{
    CentralisedBody,
    NotificationBox,
    Testimonials,
    QuickLinks,
    QuestionsBox,
    NavItem,
    NavItemBtn
    ,InputTextField,
    AxiosGetData,
    AppHeaderDiv,
    ProfileBtn,
    CoolButton,
    LoginPrompt,
    NavigableButton,
    SaveChats,
    UploadSolution
}