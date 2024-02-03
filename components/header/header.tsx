import React from "react";
import Styles from './header.module.css';
import MyImage from '../images/imageDiv';
import Team from '../images/teamcolor.svg';

const HeaderSlide = ()=>{
    return(
        <section className={`container-fluid ${Styles.headerdiv} `}>
                <div className="row p-3">
                <div className="col-md-6 order-sm-2">
                        <MyImage url={Team} classes="w-100 "/>
                    </div>

                    <div className="col-md-6 p-4 my-3 order-sm-1">
                        <p style={{fontFamily:'Arima', color:'white'}} className="display-3">
                            <strong>
                            JUST DREAM BIG AND I WILL GET YOU THERE
                            </strong>
                        </p>
                        <p className="prata" style={{fontSize:'18px',color:'white'}}>
                            <strong>Pro</strong>, ProGuide&apos;s Digital Student Assistant, will stand by you throughout your academic journey till you 
                            achieve your academic and ultimately your career goals.
                        </p>
                        <button style={{fontFamily:'Arima', backgroundColor: '#FFAC1C', color:'white'}} className=" p-2 btn  border-0 rounded shadow-lg ">
                            GET A DEDICATED MENTOR
                        </button>
                    </div>
                    
                </div>
            
        </section>
    );
}
export default HeaderSlide;