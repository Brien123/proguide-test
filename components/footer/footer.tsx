import React from "react";
import MyImage from "../images/imageDiv";
import { CentralisedBody, QuickLinks } from "../utilityComponents";
import Pro from "../images/pro+logo.png";
import Styles from './footer.module.css';
import Link from "next/link";

const Footer = () => {
  return (
    <div className={`container-fluid`}>
      <div className="row h-100 p-5" >
        <div className="col-md-4">
            <div  className="w-50">
            <MyImage url={Pro} classes="img-fluid" />
            </div><br/>
            <p className="prata" >
                <small>
                ProGuide&apos;s Personal Student Assistant, Pro, provides a digital realm where Teachers are Empowered with diital Tools whilst Students are Engaged into studying with the ultimate goal
                of helping the latter achieve academic success and attain their career goals.
                </small>
                
            </p>
            

        </div>
        <div className="col-md-4">
        <div className=" rounded-right nunito p-3" >
            <span className="fs-4">Quick Links</span>
            <div className="d-flex flex-column">
                
                    <QuickLinks url='./index' name="Home" />
                    <QuickLinks url='./index' name="About" />
                    <QuickLinks url='./index' name="Services" />
                    <QuickLinks url='./index' name="Testimony" />
                
               
               
            </div>

          </div>
        </div>
        <div className="col-md-4">

        <div className=" rounded-right nunito p-3" >
            <span className="fs-4">Contact Us</span>
            <div className="d-flex flex-column">
                <div className=" p-3">
                    <i className=" fa fa-map-marker bluedefault"></i> &nbsp;
                    Bonaberi - Douala, Cameroon
                </div>
                <div className=" p-3">
                <i className=" fa fa-phone bluedefault"></i> &nbsp;
                    (+237) 682898606
                </div>
                <div className=" p-3">
                <i className=" fa fa-envelope bluedefault"></i> &nbsp;
                    contactus@proguide.com
                </div>
                <div className=" p-3">
                <i className=" fa fa-globe bluedefault"></i> &nbsp;
                    www.studentproguide.site
                </div>
            </div>

          </div>
        </div>
      </div>
      <div className="bg-primary">
        <CentralisedBody addClasses="p-3">
            <span style={{color:'white'}}>Copyright 2023</span>
        </CentralisedBody>
      </div>
    </div>
  );
};

export default Footer;
