import Head from 'next/head'
import Image from 'next/image'
import AboutUs from '../components/about/about'
import ContactForm from '../components/contact/contact'
import Footer from '../components/footer/footer'
import HeaderSlide from '../components/header/header'
import TopNavbar from '../components/navbar/navbar'
import Services from '../components/services/services'
import Testimony from '../components/testimony/testimony'
import { useEffect } from 'react'
import { Router, useRouter } from 'next/router'


export default function Home() {
  const router = useRouter();
  useEffect(()=>{
    var userid = localStorage.getItem('id');
    var usertype = localStorage.getItem('type');

    if (userid && usertype){
      router.push('/dashboard');

    }
  },[])
  return (
     <>
     <TopNavbar name='ProGuide'/>
      <HeaderSlide/>
      <AboutUs />
      <Services />
      <Testimony />
      <ContactForm />
      <Footer />
     </>
    
   
     
  )
}
