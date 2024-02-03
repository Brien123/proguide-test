import React, { useContext, useEffect, useState } from "react";
import type { ReactElement } from "react";
import { DashBoardLayOut } from "../components/layout/layout";
import { NextPageWithLayout, userData } from "./_app";
import SignUpImg from "../components/images/sinup.svg";

import {
  AppHeaderDiv,
  AxiosGetData,
  CoolButton,
  InputTextField,
  LoginPrompt,
  QuestionsBox,
} from "../components/utilityComponents";
import MobileHeader from "../components/header/mobileHeader";
import LoaderScreen from "../components/loadingBtn/loaderScreen";
import MyImage from "../components/images/imageDiv";
import Pro4 from "../components/images/exams.svg";
import Link from "next/link";
import { baseURL, ResServer, serverRes5, serverDept } from "../types";
import { GetServerSideProps } from "next";

import { useRouter } from "next/router";



const Page = (pageData : serverRes5) => {
  const router = useRouter();
  const qString = router.query;
  const [schName, setSchName] = useState("");
  const [Level, setLevel] = useState("");
  const [descText, setText]=useState('');
  const [showK12, setShow] = useState(false);
  const [schools, setSchools] = useState<ResServer>({
    success: false,
    data:'not yet loaded'
  })
  const userCred = useContext(userData);
  const [Dept, setDept] = useState("");
  const [onSubmitForm, updateonSubmitForm] = useState(false);
  const [departments, setDeptments] = useState<serverDept>({
    success: false,
    data: "not loaded",
  });
  const [courses, setCourses] = useState<serverRes5>(pageData);
  const handleSelectionChange = (cID: string, cName: string) => {
    setSchName(cID);
    setLevel(cName);
  };

  useEffect(() => {
    console.log("school name changed");
    if (Level == "higher") {
      setShow(false);
      //fetch the schools depts
      var formValues = {
        schoolID: schName,
        type: "fetchDepts",
      };
      //
      console.log(formValues);
      AxiosGetData(baseURL + "fetchData.php", "POST", formValues)
        .then((res) => {
          console.log(res.data);
          setDeptments(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setShow(true);
    }
  }, [schName]);

  useEffect(()=>{
var formValues = {
  type:'initialFetch'
}

AxiosGetData(baseURL + "fetchData.php", "POST", formValues)
.then((res) => {
  console.log(res.data);
  setSchools(res.data);
})
.catch((err) => {
  console.log(err);
  alert('An Error Occured');
});
var uID = localStorage.getItem('id');
if(uID == null || uID == undefined){
  return ()=>{<LoginPrompt/>};
}
//fetch user visited courses or popular courses
if(qString.school === undefined){
  FetchUserCourse(uID)
}



  },[])

  const FetchUserCourse = (userid:string)=>{
    var fvalues = {
      userID: userid,
      type:'clientFetch'
    }
console.log(fvalues)
    AxiosGetData(baseURL+"questions.php", "POST", fvalues)
.then((res) => {
  console.log(res.data);

  var val={
    pageData:{
      success: true,
      data: res.data.data
    }
  }

  setCourses(val);
  setText('Recently Used')
})
.catch((err) => {
  console.log(err);
  alert('An Error Occured');
});

  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateonSubmitForm(true);
    var formValues = {
      sch: schName,
      lvl: Level,
      dept: Dept,
      type: "fetchAllCourses",
    };
   
 
      if (Dept !== "" && schName !== "") {
        router.push(`/test?department=${Dept}&school=${schName}`);
      }else if(Level !== "" && schName !== ""){
        router.push(`/test?lvl=${Level}&school=${schName}`);
      }
      
      
  };
  useEffect(() => {
    if (Dept != "") {
      var savedCourse = localStorage.getItem(Dept);
      if (savedCourse == null) {
        localStorage.setItem(Dept, JSON.stringify(courses));
      }
    }
  }, [courses]);

  return (
    <div className="container-fluid">
      {
       // JSON.stringify(pageData)
      }
      <AppHeaderDiv img={Pro4}>
        <div>
          All Your Past Questions
          <br />
          On your Mobile
          <br />
          We give it ALL to you for <b>ABSOLUTELY FREE</b>
        </div>
        <div>
          <CoolButton
            bgColor="#FFAC1C"
            textColor="white"
            url="#apply"
            displayTxt="Past Questions for 0 FCFA"
          />
        </div>
      </AppHeaderDiv>
      <form className="rounded shadow-lg p-4" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col bluedefault roboto" style={{ height: "50px" }}>
            Free Past Questions -- Just for You
          </div>
        </div>
        <hr />

        <label htmlFor="basic-url" className="form-label">
          Your Institution Name
        </label>
        <div className="input-group shadow-sm p-2">
          <select
            className="form-select"
            aria-label="Default select example"
            style={{ height: "50px" }}
            onChange={(e) => {
              handleSelectionChange(
                e.currentTarget.value,
                e.currentTarget[e.currentTarget.selectedIndex].id
              );
            }}
            required
          >
            <option>Your School:</option>
            {schools.success ? (
              typeof schools.data !== "string" ? (
                schools.data.map((elmt) => {
                  return (
                    <option key={elmt.sID} value={elmt.sID} id={elmt.level}>
                      {elmt.name}
                    </option>
                  );
                })
              ) : (
                <option>No school List found</option>
              )
            ) : (
              <option>Error Loading</option>
            )}
          </select>
        </div>

        {showK12 ? (
          <>
            <label htmlFor="basic-url" className="form-label">
              What Exam are you preparing for?
            </label>
            <div className="input-group shadow-sm p-2">
              <select
                className="form-select"
                aria-label="Default select example"
                style={{ height: "50px" }}
                onChange={(event) => {
                  setDept(event.currentTarget.value);
                }}
                required
              >
                <option>GCE Ordinary Level</option>
                <option>GCE Advanced Level</option>
                <option>Higher National Diploma Examinations</option>
                <option>Probatoire</option>
                <option>Baccaleaureat</option>
              </select>
            </div>
          </>
        ) : (
          <>
            <label htmlFor="basic-url" className="form-label">
              Your Department
            </label>
            <div className="input-group shadow-sm p-2">
              <select
                className="form-select"
                aria-label="Default select example"
                style={{ height: "50px" }}
                onChange={(event) => {
                  setDept(event.currentTarget.value);
                }}
                value={Dept}
                required
              >
                <option value='default'>Select your Department:</option>
                {departments.success ? (
                  typeof departments.data !== "string" ? (
                    departments.data.map((elmt) => {
                      return (
                        <option key={1 + Math.random()} value={elmt.department}>
                          {elmt.department}
                        </option>
                      );
                    })
                  ) : (
                    <option>{departments.data}</option>
                  )
                ) : 
                  <option value='no-dept'>No Departments Available Yet - choose school</option>
                }
              </select>
            </div>
          </>
        )}

        {onSubmitForm ? (
          <button
            style={{
              fontFamily: "Arima",
              backgroundColor: "#FFAC1C",
              color: "white",
            }}
            type="button"
            className=" p-2 btn  mt-4 border-0 rounded w-100 shadow-lg "
          >
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
            Loading...
          </button>
        ) : (
          <button
            style={{
              fontFamily: "Arima",
              backgroundColor: "#0d6efd",
              color: "white",
            }}
            type="submit"
            className=" p-2 btn  mt-4 border-0 rounded w-100 shadow-lg "
          >
            Search For Questions &nbsp;<i className="fa fa-search"></i>
          </button>
        )}
      </form>

      {typeof courses.pageData.data == "string" ? (
        <div className="text-center container p-2 mt-2">{courses.pageData.data}</div>
      ) : (
        <div className="p-2 shadow-lg">
          <h3 className="prata"> {descText}</h3>
          <p className="prata text-center"> Past Questions</p>
          {courses.pageData.data.map(elmt=>{
            return(
              <QuestionsBox 
              ccode={elmt.qcode}
              ctitle={elmt.qtitle}
              img={Pro4}
              link={`/questionViewer?question=${elmt.qID}&solution=${elmt.solID}`}
              questype={elmt.qtype}
              verify={elmt.verified}
              year={elmt.year}
              key={elmt.qcode}
              />
            )
          })}
        </div>
        )}

       
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <DashBoardLayOut>{page}</DashBoardLayOut>;
};

export default Page;
export const getServerSideProps: GetServerSideProps = async (context) => {
  // ...
  
  var formValues;
  var defaultValue = {
    type: "initialFetch",
  };
  const responseServer = context.res;
  responseServer.setHeader(
    'Cache-Control',
    'public, s-maxage=100, stale-while-revalidate=300',
  ); 
  const { query } = context;
  const { department, school, level } = query;

  if (typeof school !== "undefined") {
    if (typeof department !== "undefined" && typeof level == "undefined") {
      //department select
      formValues = { dept: department, sch: school, lvl:'', type: "fetchAllCourses" };
    } else{
      formValues = { lvl: level, sch: school, dept:'', type: "fetchAllCourses" };
    } 
  } else {
    formValues = defaultValue;
  }


    var pageData = await AxiosGetData(
      baseURL + "questions.php",
      "POST",
      formValues
    );
    var response = pageData.data;

    return {
      props: {
        pageData: response,
      },
    };
  
};
