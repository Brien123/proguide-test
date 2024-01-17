import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { DashBoardLayOut, userData } from "../../components/layout/layout";
import type { ReactElement } from "react";
import MyImage from "../../components/images/imageDiv";



import { AppHeaderDiv, Box, LoginPrompt, NavItemBtn, SaveChats } from "../../components/utilityComponents";
//import { BoardData } from "../../components/pageInfo/data";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { baseURL } from "../../types";
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 3000 },
    items: 5,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 3,
  },
};
type logProps ={
  type: null|string,
  ID: null|string,
}
const Dashboard = () => {

  var userCred = useContext(userData);
 
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [dashBoardData, setDashboardData] = useState({});
  
  const services = {
    student: [{
      name: 'Study Materials',
      link:'/test',
      img:Pro  
    },
    {
      name: 'Preparatory Tests',
      link:'dashboard/test',
      img:Pro1  
    },
    {
      name: 'Transcripts',
      link:'/dashboard/transcript',
      img:Pro2  
    },
    {
      name: 'Pro-Mentor',
      link:'dashboard/mentor',
      img:Pro3 
    }
  
  ],
    teacher:[{
      name: 'Upload Study Materials',
      link:'/dashboard/upload',
      img:Pro  
    },
    {
      name: 'View Chats',
      link:'#',
      img:Pro1  
    },
    {
      name: 'My Revenue',
      link:'#',
      img:Pro2  
    },
    {
      name: 'Mentor Hours',
      link:'#',
      img:Pro3 
    }
  
  ],
    parent:[{
      name: "View Child's Progress",
      link:'#',
      img:Pro  
    },
    {
      name: 'View Mentors',
      link:'#',
      img:Pro1  
    }
  
  ]
  }
  

  if(userCred.userType == 'student'){
    var dataService = services.student;
   
    var Pro = require("../../components/images/books.svg");
var Pro1 = require("../../components/images/test.svg");
var Pro2 = require("../../components/images/team.svg");
var Pro3 = require("../../components/images/parents.svg");
var Pro4 = require("../../components/images/admin.svg");
services.student[0].img= Pro;
services.student[1].img= Pro1;
services.student[2].img= Pro2;
services.student[3].img= Pro3;

  }else if(userCred.userType == 'teacher'){
    var dataService = services.teacher;
    var Pro = require("../../components/images/revenue.svg");
    var Pro1 = require("../../components/images/assignment.svg");
    var Pro2 = require("../../components/images/contact.svg");
    var Pro3 = require("../../components/images/chats.svg");
    
    services.teacher[0].img= Pro1;
    services.teacher[1].img= Pro3;
    services.teacher[2].img= Pro;
    services.teacher[3].img= Pro2;


  }else if(userCred.userType == 'parent'){
    var dataService = services.parent;
    var Pro = require("../../components/images/report.svg");
    var Pro1 = require("../../components/images/assignment.svg");
    var Pro2 = require("../../components/images/contact.svg");
    var Pro3 = require("../../components/images/classroom.svg");
    services.parent[0].img= Pro;
    services.parent[1].img= Pro1;

  }else{
    var dataService = services.student;

  }
useEffect(()=>{
  const userID = localStorage.getItem('id');
  const userType = localStorage.getItem('type');
  if(localStorage.getItem('chats') !== null){
    var savedChatsInMem = localStorage.getItem('chats');
    if(savedChatsInMem !== null){ 
      SaveChats(savedChatsInMem,baseURL+'livechat.php');
      console.log('sent save')
    }
  }
  if (userID && userType) {
    setIsLogged(true);
  }
},[])

  
  console.log(userCred.userID+' and '+userCred.userType);

  
  return (
    <>
    {
      !isLogged?<LoginPrompt />:<div className="p-2 container-md">
     
      <AppHeaderDiv img={Pro} >
        <>
        <div className="arima p-2 mt-1">
              Hey I am Pro,
              <br /> Your Student Assistant
        </div>
            <button
              style={{
                fontFamily: "Arima",
                backgroundColor: "#FFAC1C",
                color: "white",
              }}
              type="button"
              className=" p-2 btn border-0 rounded w-100 shadow-lg "
            > 
              Let&apos;s Explore
            </button>
        </>
      </AppHeaderDiv>
      
      <div className="container p-2 ">
        <p className="arima">Number of Students Studying: 345</p>
        <Carousel responsive={responsive} sliderClass="mt-n1" itemClass="p-1" arrows={false}>
          <div>
          <center>
            <MyImage classes="img-fluid border border-success rounded-circle shadow-lg" h={75} w={75} url={Pro} /><br/>
            <small>laura</small>
            </center>
          </div>
          <div>
          <center>
            <MyImage classes="img-fluid border border-success rounded-circle shadow-lg" h={75} w={75} url={Pro1} /><br/>
            <small>mbeng</small>
            </center>
          </div>
          <div>
          <center>
            <MyImage classes="img-fluid border border-success rounded-circle shadow-lg" h={75} w={75} url={Pro2} /><br/>
            <small>rodrickMRT</small>
            </center>
          </div>
          <div>
          <center>
            <MyImage classes="img-fluid border border-success rounded-circle shadow-lg" h={75} w={75} url={Pro3} /><br/>
            <small>caleb</small>
            </center>
          </div>
          <div>
          <center>
            <MyImage classes="img-fluid border border-success rounded-circle shadow-lg" h={75} w={75} url={Pro4} /><br/>
            <small>john</small>
            </center>
          </div>
        </Carousel>
      </div>
      <div className="container p-2 arima ">
      <p>We have </p>
      <div className="row ">
        
       
        
        {
          
          dataService.map(elmt=>{
            return(
            <div className="col-6 p-2 " key={dataService.indexOf(elmt)} >
            <Box name={elmt.name} image={elmt.img} link={elmt.link} />
          </div>)
            
            
          })
            
          
          
        } </div></div>
     
         
        
      
    </div>
    }
    
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <DashBoardLayOut headerTxt="Dashboard">{page}</DashBoardLayOut>;
};

export default Dashboard;
