import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import { DashBoardLayOut, userData } from "../components/layout/layout";
import type { ReactElement } from "react";
import MyImage from "../components/images/imageDiv";
import Pro from "../components/images/admin.svg";
import Skeleton, {SkeletonTheme} from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'


import { AppHeaderDiv, AxiosGetData, Box, LoginPrompt, NavItemBtn, NavigableButton } from "../components/utilityComponents";
//import { BoardData } from "../../components/pageInfo/data";

type logProps ={
  type: null|string,
  ID: null|string,
}

type serverRes3 = {
  success: boolean,
  data:{
    users: number,
    applicants: number,
    revenue: number,
    applications: {
      mode: string,
      status: string,
      submitDate:string,
      department: string,
      level: string,
      phone: string,
      name: string,
      matricule: string,
      Status: string,
      Amount: number,
      apkID: number
    }[]| string,
    unpaid: {
      mode: string,
      status: string,
      submitDate:string,
      department: string,
      level: string,
      phone: string,
      name: string,
      matricule: string,
      apkID: number
    }[]| string
    
  }
}

const AdminPanel = () => {

  var userCred = useContext(userData);
 const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isLogged, setIsLogged] = useState(false);
  const [adminData, setadminData] = useState<serverRes3>({
    success: false,
    data:{
      users: 0,
      applicants: 0,
      revenue: 0,
      applications: '',
      unpaid: ''
    }
  });
  
  
  function addComma(str: string){
    //console.log(str+":type of is :"+typeof(str));
    if(str !== null){
    var length = str.length;
    var position = Math.round(length/3);
    if( length == 3){
        return '$'+str;
    }else{
       return `${str.slice(0,position)},${str.slice(position)}` ; 
    }
    }
 
    
}


useEffect(()=>{
  const uID = localStorage.getItem('id');
  const userType = localStorage.getItem('type');

  if (uID != null) {
    var formValues = {
        id: uID,
        type: 'admin'
      };
      //console.log(formValues.matnum);
      
      AxiosGetData('https://www.studentproguide.site/php/stat.php', 'post', formValues).then(res=>{
        
      console.log(res.data);
        if(!res.data.success){
            alert(res.data.data);
            router.push('/dashboard');
        }else{
          setadminData(res.data);
          setIsLoading(false);
        }
      }).catch(err=>{
        console.log(err);
      })
    
  }else{
    alert('Login First');
    router.push('/login');
    
  }
},[])

  
  

  
  return (
    
   
    
    <div className="p-2 container-md">
     
      <AppHeaderDiv img={Pro} >
        <>
        <div className="arima p-2 mt-1">
              Welcome Admin
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
      {
        isLoading?'Loading...':
        <div className="p-2">
      <p className="prata text-center">Some Key Figures</p>
        <div className="row p-2 " style={{minHeight:'20vh'}}>
          
          <div className="col-6 p-2 col-md-3 ">
          <div className="bluebg p-2 h-100 rounded shadow-lg text-white prata  position-relative ">
                <small>Total Users</small>
                <div className="position-absolute bottom-0 end-0  p-1">
                  {adminData.success?adminData.data.users:<SkeletonTheme baseColor="red"><Skeleton/></SkeletonTheme>}
                </div>

          </div>
          </div>
          <div className="col-6 p-2 col-md-3">
          <div className="bluebg p-2 h-100 rounded shadow-lg text-white prata  position-relative ">
                <small>Total Applicants</small>
                <div className="position-absolute bottom-0 end-0 ">
                {adminData.success?adminData.data.applicants:<SkeletonTheme baseColor="red"><Skeleton/></SkeletonTheme>}
                  
                </div>

          </div>
          </div>
          <div className="col-6 p-2 col-md-3">
          <div className="bluebg p-2 h-100 rounded shadow-lg text-white prata  position-relative ">
                <small>Revenue</small>
                <div className="position-absolute bottom-0 end-0  p-1">
                 
                  <small>{adminData.success?addComma(adminData.data.revenue.toString())+' XAF':<SkeletonTheme baseColor="red"><Skeleton/></SkeletonTheme>}
                  </small>
                </div>

          </div>
          </div>
          <div className="col-6 p-2 col-md-3">
          <div className="bluebg p-2 h-100 rounded shadow-lg text-white prata  position-relative ">
                Customers
                <div className="position-absolute bottom-0 end-0  p-1">
                 
                  {adminData.success?adminData.data.applications.length:<SkeletonTheme baseColor="red"><Skeleton/></SkeletonTheme>}

                </div>

          </div>
          </div>
          
         
        </div>
        <div className="container-fluid">
          <p className="prata">Customers Info ({adminData.data.applications.length})</p>
          <div className="table-responsive-sm">
                <table className="table">
                  <thead className="bg-light arima">
                    <tr>
                      <td>Name</td>
                      <td>Matricule</td>
                      <td>Mode</td>
                      <td>Date Applied</td>
                      <td>Level</td>
                      <td>Dept</td>
                      <td>Phone</td>
                      <td>Payment</td>
                      <td>Status</td>
                      <td>Action</td>
                      
                    </tr>
                  </thead>
                  <tbody>

                  
                  {
                    Object.values(adminData.data.applications).map(elmt=>{
                      return(
                        <tr key={Object.values(adminData.data.applications).indexOf(elmt)} className="prata">
                          <td>{elmt.name}</td>
                          <td>{elmt.matricule}</td>
                          <td>{elmt.mode}</td>
                          <td>{elmt.submitDate}</td>
                          <td>{elmt.level}</td>
                          <td>{elmt.department}</td>
                          <td>{elmt.phone}</td>
                          <td>{elmt.Amount}{elmt.Status == 'SUCCESSFUL'?<>&nbsp;<i className="fa fa-check" style={{color:'green'}}></i></>:<>&nbsp;<i className="fa fa-times" style={{color:'red'}}></i></>}</td>
                          <td>{elmt.status}</td>
                          <td>{elmt.Status == 'SUCCESSFUL'?
                         <NavigableButton classes="btn-success" text="Complete" url='' disable={true}/>
                          :<NavigableButton classes="btn-danger" text="Pay Now" url={`https://www.studentproguide.site/php/interpay.php?direct=yes&amount=${elmt.Amount}&phone=1234&apk=${elmt.apkID}`} disable={false}/>}</td>
                          
                        </tr>
                      )
                    })
                  }
                </tbody>
                </table>
                
          </div><br/>
          <p className="prata">Applicant Info (did not pay {adminData.data.unpaid.length})</p>
          <div className="table-responsive-sm">
                <table className="table">
                  <thead className="bg-light arima">
                    <tr>
                      <td>Name</td>
                      <td>Matricule</td>
                      <td>Mode</td>
                      <td>Date Applied</td>
                      <td>Level</td>
                      <td>Dept</td>
                      <td>Phone</td>
                      <td>Status</td>
                    
                      
                    </tr>
                  </thead>
                  <tbody>

                  
                  {
                    Object.values(adminData.data.unpaid).map(elmt=>{
                      return(
                        <tr key={Object.values(adminData.data.unpaid).indexOf(elmt)} className="prata">
                          <td>{elmt.name}</td>
                          <td>{elmt.matricule}</td>
                          <td>{elmt.mode}</td>
                          <td>{elmt.submitDate}</td>
                          <td>{elmt.level}</td>
                          <td>{elmt.department}</td>
                          <td>{elmt.phone}</td>
                          <td>{elmt.status}</td>
                    
                          
                        </tr>
                      )
                    })
                  }
                </tbody>
                </table>
                
          </div>

        </div>
      </div>
      }
      

    </div>
  );
};

AdminPanel.getLayout = function getLayout(page: ReactElement) {
  return <DashBoardLayOut headerTxt="Admin Panel">{page}</DashBoardLayOut>;
};

export default AdminPanel;
