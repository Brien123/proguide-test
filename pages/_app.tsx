  
import '../styles/globals.css'
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'react-toastify/dist/ReactToastify.css';

import { ReactElement, ReactNode, createContext, useEffect, useState } from 'react'
import type { NextPage } from 'next'
import { userDataProps} from '../types';

import type { AppProps } from 'next/app'
import { useRouter } from 'next/router';
import LoaderScreen from '../components/loadingBtn/loaderScreen';
import Script from 'next/script';
import {io} from 'socket.io-client';
export const userData  = createContext<userDataProps>({} as userDataProps);

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}
const socket = io();
export const SocketContext = createContext(socket);
export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [user,updateID] = useState<string | null>(null);
  const [type,updateType] = useState<string | null>(null);
  useEffect(() => {
    require('bootstrap/dist/js/bootstrap');
    const handleStart = () =>{
      setLoading(true);
     // setTimeout(() => setLoading(false), 500);
    } 
    const id = localStorage.getItem('id');
    const userType = localStorage.getItem('type');
    if(id == 'dummy' || id == null){ {/*id == null || for production*/ }
    console.log('Not logged In');
    //router.push('/login'); 
    updateID(null);
    updateType(null); 
}else{
  
    updateID(id);
    updateType(userType);
}

    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
      //socket.disconnect()
    };
  }, []);
<>

</>
  
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);


  return (
    <>
    <userData.Provider value={{userID: user, userType: type }}>
    <SocketContext.Provider value={socket}>
    
    {loading?<LoaderScreen/>:getLayout(<Component {...pageProps} />)}
    </SocketContext.Provider>
    </userData.Provider>
    <Script src="https://www.googletagmanager.com/gtag/js?id=G-CR87FFW8EM" strategy='afterInteractive' />
  <Script id='google-analytics' strategy='afterInteractive'>
    
{
  `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-CR87FFW8EM');
  `
}
  </Script>
    
    </>
    
    )
}

