import React, { useEffect, useState} from "react";
import { DashBoardLayOut } from "../../components/layout/layout";
import type { ReactElement } from "react";
import MyImage from "../../components/images/imageDiv";
import { AxiosGetData, CoolButton, ProfileBtn } from "../../components/utilityComponents";
import { useRouter } from "next/router";
import { baseURL } from "../../types";
var Pro = require("../../components/images/books.svg");
type serverRes3 = {
    success: boolean,
    data: {
      balance: number,
      position: number| string,
      bonus: number,
      user:{
        username: string,
        email: string,
        phone: string
      }
    } | string
  }
const Profile =  ()=>{
    const router = useRouter();
    const [redraw, setRedraw] = useState(true);
    const [profileData, setProfileData] = useState<serverRes3>({
        success: false,
        data:{
            balance: 0,
      position: 0,
      bonus: 0,
      user:{
        username: '',
        email: '',
        phone: ''
      }

        }
    });

    useEffect(()=>{

        const uID = localStorage.getItem('id');
        const usertype = localStorage.getItem('type');

        if(uID && usertype){
            var formValues = {
                id: uID,
                type: usertype
              };
              console.log(formValues);
              AxiosGetData(baseURL+'stat.php', 'post', formValues).then(res=>{
                setProfileData(res.data);
              console.log(res.data);
                if(res.data.success){
                    (res.data.data.bonus> 1500) && setRedraw(false)
                }
              }).catch(err=>{
                console.log(err);
              })
        }else{
            alert('Please Login or Sign Up');
            router.push('/login');
            
        }
        

    },[])

    return(
        <div className="p-2 container">
            <div className="shadow-lg rounded testbg text-white p-2">
                <div className="text-center">
                <MyImage url={Pro} classes='rounded-circle border border-info'  h={75} w={75}/><br/>
                <small>{typeof profileData.data != 'string'? profileData.data.user.username:'undefined'}</small> <i className="fa fa-circle bo" style={{color:'green'}}></i>
                </div>
                <div className="row text-center p-3">
                    <div className="col-4 ">
                        <p className="arima ">{typeof profileData.data != 'string'? profileData.data.balance:'undefined'} FCFA<br/><small className="nunito">Balance</small></p>
                        
                    </div>
                    <div className="col-4">
                    <p className="arima ">{typeof profileData.data != 'string'? profileData.data.position:'undefined'}<sup>th</sup> <br/><small className="nunito">Pro Rank</small></p>

                    </div>
                    <div className="col-4">
                    <p className="arima ">{typeof profileData.data != 'string'? profileData.data.bonus:'undefined'} FCFA<br/><small className="nunito">Bonus</small></p>

                    </div>
                </div>

            </div>
            <div className="rounded shadow-lg mt-2 p-2">
                <p className="arima fs-5 text-center pt-2 ">Finance</p><hr/>
                <div className="row p-2">
                    <div className="col-6 p-2">
                        
                        <CoolButton bgColor="#FFAC1C" displayTxt="Top Up" textColor="white" url="">
                        <i className="fa fa-arrow-up bo " style={{color:'white'}}></i>
                        </CoolButton>
                        

                    </div>
                    <div className="col-6 p-2">
                    
                    <CoolButton bgColor="#0d6efd" displayTxt="Redraw" textColor="white" url="" disable={redraw}>
                    <i className="fa fa-arrow-down bo " style={{color:'white'}}></i>
                    </CoolButton>
                    {redraw?<small className="text-danger">You can only redraw as from 1500XAF</small>:<p></p>}



                    </div>
                </div>
            </div>
            <div className="rounded shadow-lg mt-2 p-2 arima">
            <p className="arima fs-5 text-center pt-2 ">Settings & Analytics</p><hr/>
            <ProfileBtn colorStr="#0d6efd" iconStr="fa-bar-chart"   link='profile/stats' txt="My Statistics"/>
            <ProfileBtn colorStr="#0d6efd" iconStr="fa-user"   link='profile/edit' txt="Edit Profile"/>
            <ProfileBtn colorStr="#0d6efd" iconStr="fa-share"   link='profile/share' txt="Invite Friends and Earn"/>
            <ProfileBtn colorStr="#0d6efd" iconStr="fa-comments"   link='profile/help' txt="Help Center"/>
            <ProfileBtn colorStr="red" iconStr="fa-sign-out"   link='' txt="Log Out"/>
                
            </div>
        </div>
    )

}
Profile.getLayout = function getLayout(page: ReactElement) {
    return <DashBoardLayOut headerTxt="Profile">{page}</DashBoardLayOut>;
  };

export default Profile;