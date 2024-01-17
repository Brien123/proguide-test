import React, { useState } from "react";
import MyImage from "../images/imageDiv";
import Parent from "../images/parents.svg";
import Teacher from "../images/teacher.png";
import Student from "../images/student.png";
import Admin from "../images/admin.svg";
import Pro from "../images/pro+logo.png";
import Link from "next/link";

type Textprop = {};

function Services() {
  const [text, updateText] = useState<Array<string>>([
    "Personalized and Dedicated Assistance from Digital Student Assistant",
    "Game-based Learning for increased engagement",
    "Weekly Preparatory Tests and Quizzes",
    "Progress Maps and Orientation",
  ]);
  const [textHeader, updateTextHeader] = useState<string>("Student");
  const HandleClick = (param: number) => {
    switch (param) {
      case 1:
        updateTextHeader("Student");
        updateText([
          "Personalized and Dedicated Assistance from Digital Student Assistant",
          "Game-based Learning for increased engagement",
          "Weekly Preparatory Tests and Quizzes",
          "Progress Maps and Orientation",
        ]);
        break;
      case 2:
        updateTextHeader("Teacher");
        updateText([
          "Automated Creation of Assignements and Corrections",
          "Insights on student's progress and weak points",
          "Plethora of Tools for the creation of Studying Content",
          "Earn Income from doing what you are already paid for",
        ]);
        break;
      case 3:
        updateTextHeader("Administrator");
        updateText([
          "Tools for tracking Teachers and Students Performance",
          " Efficient Management of Grading System and Creation of Report Cards",
        ]);
        break;
      case 4:
        updateTextHeader("Parent");
        updateText([
          "Observe in Real Time the Progress of Your Child",
          "Assign a credible Mentor to your child for the supervision of Academic Progress",
        ]);
        break;
      default:
        updateTextHeader("Student");
        updateText([
          "Personalized and Dedicated Assistance from Digital Student Assistant",
          "Game-based Learning for increased engagement",
        ]);
    }
  };
  return (
    <section className="container-fluid backgroundBlueColor" id="service">
      <center>
        <p className="arima fs-3" style={{ color: "white" }}>
          Click On Any Image to See How we are beneficial to them
        </p>
      </center>
      <div className="row">
        <div className="col-md-7 order-sm-2">
          <div className="row p-2">
            <div
              className="col-6 d-flex justify-content-center align-items-center "
              onClick={() => {
                HandleClick(2);
              }}
            ><a href="#box" style={{ textDecoration: "none" }}>
              <div
                className="p-2 rounded  bg-light text-center glow "
                style={{ height: "200px" }}
              >
                <MyImage url={Teacher} classes="h-80 w-100" />
                <p className="arima">Teachers</p>
              </div>
              </a>
            </div>
            
            <div
              className="col-6 d-flex justify-content-center align-items-center"
              onClick={() => {
                HandleClick(3);
              }}
            ><a href="#box" style={{ textDecoration: "none" }}>
              <div
                className="p-2 rounded glow bg-light text-center"
                style={{ height: "200px" }}
              >
                <MyImage url={Admin} classes="h-80 w-100" />
                <p className="arima">Administrators</p>
              </div></a>
            </div>
          </div>
          <div className="container d-flex justify-content-center align-items-center">
            <div
              className="p-2 rounded shadow-lg bg-light text-center"
              style={{ height: "200px" }}
            >
              <MyImage url={Pro} classes="h-100 w-100" />
            </div>
          </div>
          <div className="row p-2">
            <div className="col-6 d-flex justify-content-center align-items-center">
            <a href="#box" style={{ textDecoration: "none" }}>
              <div
                className="p-2 rounded glow bg-light text-center"
                style={{ height: "200px" }}
                onClick={() => {
                  HandleClick(1);
                }}
              >
                <MyImage url={Student} classes="h-80 w-100" />
                <p className="arima">Students</p>
              </div>
              </a>
            </div>
            <div
              className="col-6 d-flex justify-content-center align-items-center"
              onClick={() => {
                HandleClick(4);
              }}
            ><a href="#box" style={{ textDecoration: "none" }}>
              <div
                className="p-2 rounded glow bg-light text-center"
                style={{ height: "200px" }}
              >
                <MyImage url={Parent} classes="h-80 w-100" />
                <p className="arima">Parents</p>
              </div></a>
            </div>
          </div>
        </div>
        <div className="col-md-5  d-flex justify-content-center align-items-center p-2 order-sm-1" id="box">
          <div className="rounded shadow-lg bg-light arima p-3 ">
            <span className="fs-4">{textHeader}</span>
            {text.map((txt) => {
              return (
                <p key={text.indexOf(txt)}>
                  <i
                    className="fa fa-check-circle"
                    style={{ color: "orange" }}
                  ></i>
                  &nbsp;{txt}
                </p>
              );
            })}

            <button
              style={{
                fontFamily: "Arima",
                backgroundColor: "#FFAC1C",
                color: "white",
              }}
              className=" p-2 btn  border-0 rounded shadow-lg "
            >
              <Link href={{
                pathname: './signup',
                query: {key: textHeader, ref: 'juv'}}} 
                style={{ textDecoration: "none" }}>
                
                <span style={{color:'white'}}>Sign Up As A {textHeader}</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
