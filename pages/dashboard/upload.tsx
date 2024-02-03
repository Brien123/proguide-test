import React, { useEffect, useState, useContext } from "react";
import { DashBoardLayOut } from "../../components/layout/layout";
import type { ReactElement } from "react";
import MyImage from "../../components/images/imageDiv";
import {
  AxiosGetData,
  CoolButton,
  InputTextField,
  LoginPrompt,
  ProfileBtn,
  QuestionsBox,
  UploadSolution,
} from "../../components/utilityComponents";
import { useRouter } from "next/router";
import { baseURL, serverDept, ResServer, serverRes5 } from "../../types";
import axios from "axios";
import { userData } from "../_app";
import { ToastContainer, toast } from "react-toastify";
var Pro = require("../../components/images/books.svg");
//if admin or tutor uplloads material set verified to true else if it is a student, set to false
// based on the view mode get the type of material being uploaded.
//if it is a student viewing this page, make the Upload button for solutions and prep Tests invisible
const UploadPage = () => {
  const router = useRouter();
  const imageSrc = true;
  const [viewType, setViewType] = useState<
    "question" | "solution" | "preptest"
  >("question");
  const [schName, setSchName] = useState("");
  const [onSubmitForm, updateonSubmitForm] = useState(false);
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [years, setYears] = useState("");
  const [Dept, setDept] = useState("");
  const [Level, setLevel] = useState("");
  const [qID, setQID] = useState("");
  const [qLevel, setqLevel] = useState("UG");
  const [chapter, setChapter] = useState("");
  const [showK12, setShow] = useState(false);
  const [verified, setVerified] = useState(false);
  const [selectAO, setSelectAO] = useState(false);
  const [duration, setDuration] = useState(0);
  const [Hour, setHour] = useState(0);
  const [Minute, setMinute] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [departments, setDeptments] = useState<serverDept>({
    success: false,
    data: "not loaded",
  });
  const [courses, setCourses] = useState<serverRes5>({pageData:{
    success: false,
    data:'Not Loaded Yet'
  }})
  const [schools, setSchools] = useState<ResServer>({
    success: false,
    data: "not yet loaded",
  });
  const userCred = useContext(userData);

  // insert logic to know whether the question uploaded is A level or O level
  useEffect(() => {
    if (Level === "k12") {
      //show selection pane to know whether it is A level or O level Course
      setSelectAO(true);
    } else {
      setSelectAO(false);
      setqLevel("UG");
    }
  }, [Level]);
  useEffect(() => {
    const userType = localStorage.getItem("type");
    console.log(userCred);
    if (userType == null || userType == undefined) {
      return () => {
        <LoginPrompt />;
      };
    } else {
      if (userType !== "student") {
        setVerified(true);
      }
    }

    var formValues1 = {
      type: "initialFetch",
    };

    AxiosGetData(baseURL + "fetchData.php", "POST", formValues1)
      .then((res) => {
        console.log(res.data);
        setSchools(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert("An Error Occured");
      });
  }, [userCred]);


 useEffect(()=>{
  const total = Hour*3600+Minute*60;
setDuration(total)

 },[Hour,Minute])

 useEffect(()=>{
  console.log(duration);
 },[duration])
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
  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
updateonSubmitForm(true)
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      if(viewType == 'question'){
        formData.append(
          "textData",
          JSON.stringify({
            school: schName,
            department: Dept,
            materialtype: viewType,
            verify: verified,
            ccode: courseCode,
            ctitle: courseTitle,
            year: years,
            questionLvl: qLevel,
            uID: userCred.userID,
            uType: userCred.userType,
          })
        );
      }else if(viewType == 'solution'){
        formData.append(
          "textData",
          JSON.stringify({
            questionID: qID,
            materialtype: viewType,
            verify: verified,
            uID: userCred.userID,
            uType: userCred.userType,
          })
        );
      }else if(viewType == 'preptest'){
        formData.append(
          "textData",
          JSON.stringify({
            school: schName,
            department: Dept,
            topic: chapter,
            duration: duration,
            verify: verified,
            materialtype: viewType,
            uID: userCred.userID,
            uType: userCred.userType,
          })
        );
      }
      
      

      try {
        const response = await axios.post(baseURL + "upload.php", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        updateonSubmitForm(false)
        console.log(response.data);
        if(response.data.success){
          toast.success(response.data.data,{
            position:toast.POSITION.TOP_RIGHT
          })
        }
      } catch (error) {
        updateonSubmitForm(false)
        toast.error('An Unknown Error Occurred',{
          position:toast.POSITION.TOP_RIGHT
        })
        console.error("Error uploading file", error);
      }
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSelectionChange = (cID: string, cName: string) => {
    setSchName(cID);
    setLevel(cName);
  };
  useEffect(()=>{
    setDept(Dept);
    console.log(qID)
  },[Dept, qID])

  const handleDepartment = (event:React.ChangeEvent<HTMLSelectElement>)=>{
      setDept(event.currentTarget.value);
    if(viewType == 'solution'){
      //if view type is solution, in addition to setting the selected department, make an asynchronous call to backend to get the questions and available
      // solutions
      let formValues;
      if(Level == 'higher'){
        const Lvl = '';
      formValues = { dept: event.currentTarget.value, sch: schName, lvl:Lvl, type: "fetchAllCourses" };

      }else{
      formValues = { dept: event.currentTarget.value, sch: schName, lvl:Level, type: "fetchAllCourses" };

      }
      console.log(formValues)
      AxiosGetData(
        baseURL + "questions.php",
        "POST",
        formValues
      ).then(res=>{
        let coursesFromDB = {
          pageData:{
            success: res.data.success,
            data: res.data.data
          }
        }
        setCourses(coursesFromDB);
        console.log(res.data)
      }).catch(err=>{
        //alert('Error Occurred');
        console.log(err)
      })

    }
  }
  return (
    <div className="p-2 container">
      <ToastContainer/>
      <div className="row prata border p-2 rounded">
        <div className="col-4">
          <button
            className="btn p-3 btn-outline-primary"
            onClick={() => {
              setViewType("question");
            }}
          >
            Questions
          </button>
        </div>
        <div className="col-4">
          <button
            className="btn p-3 btn-outline-primary"
            onClick={() => {
              setViewType("solution");
            }}
          >
            Solutions
          </button>
        </div>
        <div className="col-4">
          <button
            className="btn p-3 btn-outline-primary"
            onClick={() => {
              setViewType("preptest");
            }}
          >
            Prep Tests
          </button>
        </div>
      </div>

      <form onSubmit={handleFormSubmit} className="p-3 shadow-lg rounded">
        <div className="row">
          <div className="col bluedefault roboto" style={{ height: "50px" }}>
             {viewType} Upload
          </div>
        </div>
        <hr />
        <div className="row">
            <div className="input-group p-2">
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
            {
              selectAO && (
                <>
                  <label htmlFor="basic-url" className="form-label">
                    Enter Exam Question you&apos;re Uploading?
                  </label>
                  <div className="form-check w-50 border rounded ">
                    <input
                      className="form-check-input"
                      value="AL"
                      name="radioGroup"
                      type="radio"
                      onChange={(e) => setqLevel(e.currentTarget.value)}
                    />
                    <label className="form-check-label">
                      GCE Advance Level
                    </label>
                  </div>
                  <div className="form-check w-50 border rounded ">
                    <input
                      className="form-check-input"
                      name="radioGroup"
                      value="OL"
                      type="radio"
                      onChange={(e) => setqLevel(e.currentTarget.value)}
                    />
                    <label className="form-check-label">
                      GCE Ordinary Level
                    </label>
                  </div>
                </>
              )
              //insert academic depatments available for k12 below in the commented section!
            }
            {showK12 ? (
              <>
                {/*
         
            <label htmlFor="basic-url" className="form-label">
              Enter Exam Question you're Uploading?
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
              */}
              </>
            ) : (
              <>
                <label htmlFor="basic-url" className="form-label">
                  Question Department
                </label>
                {
                  viewType == 'preptest'?<>
                  <InputTextField iconType="" labelName="" typeName="text" onChangeFxn={(e)=>{
                    setDept(e.currentTarget.value)
                  }}/>
                  </>:
                  <div className="input-group p-2">
                  <select
                    className="form-select"
                    aria-label="Default select example"
                    style={{ height: "50px" }}
                    onChange={handleDepartment}
                    value={Dept}
                    required
                  >
                    <option value="default">Select your Department:</option>
                    {departments.success ? (
                      typeof departments.data !== "string" ? (
                        departments.data.map((elmt) => {
                          return (
                            <option
                              key={1 + Math.random()}
                              value={elmt.department}
                            >
                              {elmt.department}
                            </option>
                          );
                        })
                      ) : (
                        <option>{departments.data}</option>
                      )
                    ) : (
                      <option value="no-dept">
                        No Departments Available Yet - choose school
                      </option>
                    )}
                  </select>
                </div>
                }
                
              </>
            )}
          </div>
        <div className={viewType === 'question'? "d-block": "d-none"}>
          <div className="row">
            <div className="form-group col-md-6">
              <label htmlFor="inputCity">Course Title</label>
              <input
                type="text"
                className="form-control"
                id="inputCity"
                value={courseTitle}
                onChange={(e) => {
                  setCourseTitle(e.currentTarget.value);
                }}
              />
            </div>
            <div className="form-group col-md-4">
              <label htmlFor="inputState">Course Code</label>
              <input
                type="text"
                className="form-control"
                id="inputCity"
                value={courseCode}
                onChange={(e) => {
                  setCourseCode(e.currentTarget.value);
                }}
              />
            </div>
            <div className="form-group col-md-2">
              <label htmlFor="inputZip">Year(s)</label>
              <input
                type="text"
                className="form-control"
                value={years}
                onChange={(e) => {
                  setYears(e.currentTarget.value);
                }}
                id="inputZip"
              />
            </div>
          </div>
        </div>

        <div className={viewType === 'solution'? "d-block": "d-none"} style={{height:'40vh', overflow: 'scroll', border: '2px dashed grey'}}>
        {typeof courses.pageData.data == "string" ? (
        <div className="text-center container p-2 mt-2">{courses.pageData.data}</div>
      ) : (
        <div className="p-2 shadow-lg">
          <p className="prata text-center"> Past Questions</p>
          {courses.pageData.data.map(elmt=>{
            return(
              <UploadSolution 
              ccode={elmt.qcode}
              cID={elmt.qID}
              ctitle={elmt.qtitle}
              solution={elmt.solID}
              key={elmt.qcode}
              onClickFxn={(e)=>{setQID(e.currentTarget.id)}}
              onChangeFxn={(e)=>{setQID(e.currentTarget.value)}}
              />
            )
          })} 
        </div>
        )}
        </div>

        <div className={viewType === 'preptest'? "d-block": "d-none"}>
        <div className="form-group col-md-2">
              <label htmlFor="inputChapter">Quiz for Chapter?</label>
              <input
                type="text"
                className="form-control"
                onChange={(e) => {
                  setChapter(e.currentTarget.value);
                }}
                id="inputChapter"
              />
            </div>
            <div className="row">
            <div className="form-group col-6">
              <label htmlFor="inputHour">Duration in Hours</label>
              <input
                type="number"
                min={0}
                max={3}
                className="form-control"
                value={Hour}
                onChange={(e)=>setHour(parseInt(e.currentTarget.value))}
                id="inputHour"
              />
            </div>
            <div className="form-group col-6">
              <label htmlFor="inputMins">Duration in Minutes</label>
              <input
                type="number"
                className="form-control"
                value={Minute}
                min={0}
                max={60}
                onChange={(e)=>setMinute(parseInt(e.currentTarget.value))}
                id="inputMins"
              />
            </div>
            </div>
        </div>

        <div className="form-group p-2">
          <input
            type="file"
            className="form-control"
            accept=".xls,.xlsx,.pdf"
            onChange={handleFileChange}
          />
        </div>
        <button
            style={{
              fontFamily: "Arima",
              backgroundColor: "#FFAC1C",
              color: "white",
            }}
            type="submit"
            className=" p-2 btn  mt-4 border-0 rounded w-100 shadow-lg "
            disabled={onSubmitForm}
           
          >
            {!onSubmitForm?'Insert Material':<>Loading...<span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span></>}
          </button>

        
      </form>
    </div>
  );
};
UploadPage.getLayout = function getLayout(page: ReactElement) {
  return <DashBoardLayOut headerTxt="Upload Materials">{page}</DashBoardLayOut>;
};

export default UploadPage;
