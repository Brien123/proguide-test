import React, { useEffect, useState , useContext, useRef} from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AxiosGetData, LoginPrompt, NavigableButton, SaveChats } from "../components/utilityComponents";
import { baseURL, hostname } from "../types";
import { GetServerSideProps } from "next";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import type { ReactElement } from "react";
import { DashBoardLayOut } from "../components/layout/layout";
import { NextPageWithLayout, userData } from "./_app";
import { ToastContainer, toast } from "react-toastify";

const questionURL = hostname+"Question/";
const solutionURL = hostname+"Solution/";

type showSolsProps = {
  success: boolean,
  data:{
    sols: boolean,
    reason: string
  }
}
type serverRes5 = {
  pageData:{
    success: boolean;
    data:{
      questions:{
        files:string[] 
      }  | string;
      solutions:{
        directory: {guideID: string}[],
        files:string[]
      }| string;
    }| string
    
  };
  
};


const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 1,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 1,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

const MaterialView = ({pageData} : serverRes5)=>{
    var router = useRouter();
var queryString = router.query;
const [materials, setMaterials] = useState<serverRes5>({pageData});
const [currentSlide, setSlide]=useState(0);
const [showSolution, setShowSolution] = useState<showSolsProps>({success: false, data:{
  sols: false,
  reason: 'Still Loading...'
}})
var userCred = useContext(userData)
const userID = useRef<string| null >('');
useEffect(()=>{
toast.success('PLEASE SWIPE TO CHANGE VIEW',{
  position:toast.POSITION.TOP_RIGHT
});

if(localStorage.getItem('chats') !== null){
  var savedChatsInMem = localStorage.getItem('chats');
  if(savedChatsInMem !== null){ 
    SaveChats(savedChatsInMem,baseURL+'livechat.php');
    console.log('sent save')
  }
}

},[])

// record the user viewing this course
useEffect(()=>{
 

  var uID = localStorage.getItem('id');
  userID.current = uID;
if(uID == null || uID == undefined){
  return ()=>{<LoginPrompt/>};
}
var qID = queryString.question
if(qID == undefined || qID == undefined){
  // dont record
}
var formValues = {
  userID: uID,
  question: qID,
  type:'recordView'
}

var formValues2 = {
  userID: uID,
  question: qID,
  type:'checkStatus'
}
  AxiosGetData(baseURL+"questions.php", "POST", formValues)
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err);
    alert('An Error Occured');
  });

  AxiosGetData(baseURL+"questions.php", "POST", formValues2)
  .then((res) => {
  console.log(res.data);
    setShowSolution(res.data)
  })
  .catch((err) => {
    console.log(err);
    alert('An Error Occured');
  });
  var uID = localStorage.getItem('id');
  if(uID == null || uID == undefined){
    return ()=>{<LoginPrompt/>};
  }
 
  
  
  
    },[])

    return(
    <>
    <ToastContainer/>
    <div className="container-fluid">
      <div className="container-fluid m-2 text-white fs-3">
        <div className="row bg-info border shadow-lg arima">
          <div className={`col-4  p-3 rounded text-center ${currentSlide == 0?'borderBottom':''}`}>
            Question
          </div>
          <div className={`col-4  p-3 rounded text-center ${currentSlide == 1?'borderBottom':''}`}>  
            Solution
          </div>
          <div className={`col-4  p-3 rounded text-center ${currentSlide == 2?'borderBottom':''}`}>
            Chat
          </div>
      
        </div>
      </div>
    
    
       
        
          {
            userCred.userID == null || userCred.userID == '' || userCred.userID == undefined ?
            <LoginPrompt />:
            <Carousel responsive={responsive} arrows={false} itemAriaLabel="Image-aria-label" afterChange={(previousSlide, state)=>{
              setSlide(state.currentSlide);
            }}>
           <div className="border  container-fluid" style={{minHeight:'80vh'}}>
          {
           typeof pageData.data !== 'string'?
          typeof  pageData.data.questions !== 'string'?
          
          pageData.data.questions.files.map(elmt=>{
            return(
              <img alt="question image" src={`${questionURL}${elmt}`} key={Math.floor(Math.random() * 1000) + 1} className="img-fluid" />
            )
          })
          :<p className="text-center fs-3">{pageData.data.questions}</p>

           :<p className="text-center fs-3">{pageData.data}</p>
          }
          </div>
          <div className="border  container-fluid" style={{height:'80vh'}}>
          <div style={{position:'fixed',width:'100%',height:'100%'}}>
       
       </div>
       { showSolution.data.sols?<></>:
          <div className="backgroundBlur">
          <div className="p-2 rounded shadow-lg arima text-white text-center orangebg">
          <strong>BONUS!!!</strong><br/>
            Make Payment and Get Full View To this Solution<br/>
            <p>
             
              In case You Got any worries or concerns, you can talk with Tutor who solved the Question by just swiping right
            </p>
            <NavigableButton classes="p-2 prata btn btn-primary" text="Make Payment 500 XAF" url={`https://www.studentproguide.site/php/topup.php?userID=${userID.current}&pay=50&module=qs&material=${queryString.question}`} disable={false}/>
            
          </div>
         </div>

       }
            
          {
           typeof pageData.data !== 'string'?
          typeof  pageData.data.solutions !== 'string'?
          
          pageData.data.solutions.files.map(elmt=>{
            return(
              <img alt="question image" src={`${solutionURL}${elmt}`} key={Math.floor(Math.random() * 10000) + 1001} className="img-fluid" />
            )
          })
          :<p className="text-center fs-3">{pageData.data.solutions}</p>

           :<p className="text-center fs-3">{pageData.data}</p>
          }
          </div>
          <div className="border  container-fluid" style={{height:'80vh'}}>
          {
           typeof pageData.data !== 'string'?
          typeof  pageData.data.solutions !== 'string'?
          
          pageData.data.solutions.directory.map(guides=>{
            return(
              <div className="container-fluid  text-center p-2" key={Math.floor(Math.random() * 10000) + 2001}>
                <Link href={`./livechat?tutorID=${guides.guideID}`}><button className=" text-white btn btn-warning p-2 rounded">Talk to Tutor {guides.guideID}</button></Link>
              </div>
            )
          })
          :<p className="text-center fs-3">{pageData.data.solutions}</p>

           :<p className="text-center fs-3">{pageData.data}</p>
          }
          </div> 
          </Carousel>

}
         
         
       
         
         
          
         
         
        
      </div>
    </>
       
    )
}
MaterialView.getLayout = function getLayout(page: ReactElement) {
  return <DashBoardLayOut headerTxt="View Material">{page}</DashBoardLayOut>;
};
export default MaterialView;

export const getServerSideProps: GetServerSideProps = async (context) => {
    // ...
 
  
    const responseServer = context.res;
    responseServer.setHeader(
      'Cache-Control',
      'public, s-maxage=100, stale-while-revalidate=300',
    ); 
    const { query } = context;
    const { question, solution } = query;
  
    var formValues = {
      qID: question,
      solID:solution,
      type: "viewCourse",
    };
  
      var pageData = await AxiosGetData(
        baseURL + "questions.php",
        "POST",
        formValues
      );

      var response = pageData.data;

console.log(response);
 
      return {
        props: {
          pageData: response,
         
        },
      };
    
  };
