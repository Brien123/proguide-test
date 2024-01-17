import React from "react";
import MyImage from "../images/imageDiv";
import Styles from './about.module.css';
import Phone from "../images/child.png";
import { CentralisedBody } from "../utilityComponents";

const AboutUs = ()=>{
    return(
        <section className={`bg-light container-fluid  p-3 ${Styles.blob}`} id="about">
            <center><span className={` text-center fs-3 arima ${Styles.bottomBold}`} >
                    Our Story
            </span></center>
            <div className="row">
                <div className="col-md-6 p-3 ">
                    <CentralisedBody>
                    <MyImage url={Phone} classes=" rounded shadow-lg" h={300} w={300}/>

                    </CentralisedBody>
                    
                      

                </div>
                <div  className={`col-md-6 p-3`} >
                    <p style={{fontFamily:'Arima'}} className='fs-3 bluecolor'>
                        It all began when we realized a Smartphone could serve as a portal to the whole World...
                    </p>
                    <p className="roboto" >
                        In 2017, The Anglophone Crisis hit Students in the English Speaking Regions of Cameroon very hard as Studying in physical locations was
                        risky. Just 2 years later, due to the COVID-19 Pandemic, schools were literally shutdown for months due to the fear of the spread of the deadly
                        virus and now we do not know what might be coming next but throughout these uncertain times, our students always had access to Mobile Phones.
                        <br/>
                        So why not use these devices properly...
                    </p>
                </div>

            </div>
        </section>
    );
}

export default AboutUs;