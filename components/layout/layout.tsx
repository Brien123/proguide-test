import React, {useState, useContext, createContext, useEffect} from 'react';
import MyImage from '../images/imageDiv';
import { useRouter } from "next/navigation";
import { StaticImageData } from 'next/image';
import ProLoader from '../../pages/loader';
import { type } from 'os';
import BottomNav from '../bottom-nav/bottom-nav';
import {loadStateProps, layoutprops, userDataProps, dashboardlayoutprops} from '../../types';
const initialVal = false;
export const loaderShow  = createContext<loadStateProps>({} as loadStateProps);


export default function Layout({children, imgLink, textHeader}:layoutprops ) {
  const [loader, updateLoader] = useState(false);

const displayLoader = (currentState: boolean)=>{
  currentState ? updateLoader(false): updateLoader(true);
}
    return (
      <loaderShow.Provider value={{loadState: loader, updateLoadState:(loader)=> displayLoader(loader)}}>
      <>
         <div style={{ height: "100vh" }}>
        <div
          className="container-fluid backgroundBlueColor d-flex justify-content-center"
          style={{ height: "40%" }}
        ><MyImage url={imgLink} classes='p-2 h-80 w-75' />
          
        </div>
        <div className="h-80" style={{ marginTop: "-15vh" }}>
          <div
            className="border h-100 shadow-lg p-3 bg-light"
            style={{
              zIndex: "6",
              borderTopLeftRadius: "30px",
              borderTopRightRadius: "30px",
            }}
          >
            <center>
                <p className="arima fs-4">{textHeader}</p>
                <hr />
            </center>
            
            {
              loader? <ProLoader /> : children 
            }
           
            
           
          </div>
        </div>
      </div>
     
        
      </>
      </loaderShow.Provider>
    )
  }
  export const userData  = createContext<userDataProps>({} as userDataProps);

  export function DashBoardLayOut({children, headerTxt}:dashboardlayoutprops){
    const router = useRouter();
    const [user,updateID] = useState<string | null>(null);
    const [type,updateType] = useState<string | null>(null);
    useEffect(()=>{
        const id = localStorage.getItem('id');
        const userType = localStorage.getItem('type');
        if(id == 'dummy' || id == null){ {/*id == null || for production*/ }
            console.log('Not logged In');
            //router.push('/login'); 
            //updateID(null);
            //updateType(null); 
        }else{
          
            updateID(id);
            updateType(userType);
        }

       
      },[user]);

    return(
      <userData.Provider value={{userID: user, userType: type }}>
<div className='container-fluid p-2' style={{ minHeight: "100vh" }}>
  <div className="w-100 nunito text-center p-2  border-bottom">
    <strong>{headerTxt}</strong>
  </div>
  {children}
</div><br/>
<div>
<BottomNav id='e33' />

</div>
      </userData.Provider>

      
    );

  }