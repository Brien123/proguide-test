/*
This is tje Transcript Application Page.
This page or module handles everything related with the application of Transcripts on ProGuide. Some of the actions students can 
perform on this page include :

1. Apply for Transcripts
2. View Transcript Application Status

Everything on this page should be optimized to achieve the aforementioned tasks.

*/

import React, { useEffect, useState, useContext } from "react";


// These are useful components rendered on the page. They were created once and can be reused several times. Check utilityComponents.tsx to view their definition
import {
  AppHeaderDiv,
  AxiosGetData,
  CentralisedBody,
  CoolButton,
  InputTextField,
  LoginPrompt,
  NavigableButton,
} from "../../components/utilityComponents";
// just images used on the transcript Application Page
import Pro4 from "../../components/images/odelivery.svg";
import Hello from "../../components/images/hello.svg";

// this is the general Layout of these page. Think of it as some HOC (Higher Order Component) in which we wrap all elements of this page
import { DashBoardLayOut, userData } from "../../components/layout/layout";
import type { ReactElement } from "react";
import MyImage from "../../components/images/imageDiv";

import LoadBtn from "../../components/loadingBtn/loadinBtn";
import { useRouter } from "next/router";
import Link from "next/link";
import { baseURL } from "../../types";

/*
 type descriptions for server responses. I know they shouldn't be here. We have 2 main server responses:
serverRes1 and serverRes2

Fun Fact: Most if not all my server responses have type names which include the word 'serverRes'

*/
type serverRes1 = {
  success: boolean;
  data:
    | {
        dept: string;
        fname: string;
        level: string;
        number: string;
        id: string;
      }
    | string;
};

type serverRes2 = {
  success: boolean;
  data: {
    total: number;
    user:
      | {
          mode: string;
          status: string;
          matricule: string;
          Status: string;
          Amount: number;
          apkID: number;
        }[]
      | string;
  };
};

// end of serverRes defs. Let the state definitions begin...

const Transcript = () => {
  const router = useRouter();
  const queryStr = router.query;
  const [userID, updateUserID] = useState<null | string>(null);
  const [matricule, updateMatricule] = useState("");
  const [fullname, updateFullname] = useState("");
  const [department, updateDept] = useState("");
  const [serverResponse, updateserverResponse] = useState<serverRes1>({
    success: false,
    data: { dept: "", fname: "", number: "", level: "", id: "" },
  });
  const [matID, updateID] = useState("");
  const [level, updateLevel] = useState("");
  const [number, updateNum] = useState(0);
  const [mode, updateMode] = useState("");
  const [currentDay, setCurrentDay] = useState("");
  const [price, updatePrice] = useState(0);
  const [agreement, updateAgreement] = useState(false);
  const [clickedBtn, setClickedBtn] = useState(false);
  const [onSubmitForm, updateonSubmitForm] = useState(false);
  const [leftMatricule, updateLeftMatricule] = useState(false);
  const [others, updateShowOthers] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [isLogged, setisLogged] = useState(false);
  const [specialOffer, setSpecialOffer] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [transData, setTransData] = useState<serverRes2>({
    success: false,
    data: {
      total: 0,
      user: "",
    },
  });

  let formerCharge = 0;
  const setPrice = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateMode(e.currentTarget.value);

    if (e.currentTarget.value == "normal") {
      updatePrice(1500);
    } else {
      //setShowOffer("block");
      var extra,
        ext = 0;

      level == "former" ? (extra = 1000) : (extra = 0);
      if (e.currentTarget.value == "fast") {
        updatePrice(3000 + extra +discount);
      } else if (e.currentTarget.value == "superfast") {
        level == "former" ? (ext = 2000) : (ext = 0);

        updatePrice(4000 + ext +discount);
      } else {
        extra = 0;
      }
    }
  };

  useEffect(() => {
    var extra,
      tra = 0;
    level == "former" ? (extra = 1000) : (extra = 0);

    if (mode == "fast") {
      updatePrice(3000 + extra +discount);
    } else if (mode == "superfast") {
      level == "former" ? tra == 2000 : (tra = 0);

      setDiscount(4000 + tra +discount);
    } else {
      extra = 0;
    }
  }, [level]);
// SynchroniseAccount helps link user records who applied without signing In to their newly created accounts
  const SynchroniseAccount = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setClickedBtn(true);
    var apkID = localStorage.getItem("apkID");
    var userID = localStorage.getItem("id");

    var formValues = {
      id: userID,
      matnum: apkID,
      type: "synchronise",
    };

    AxiosGetData(baseURL + "transcript.php", "post", formValues)
      .then((res) => {
        // console.log(res.data);
        if (res.data.success) {
          router.reload();
        } else {
          alert(res.data.data);
          setClickedBtn(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  // function handleSubmit takes action once the Submit button to apply for Transcript is clicked
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateonSubmitForm(true);
    let formValues;
    var uID = localStorage.getItem("userID");

    if (serverResponse.success) {
      // data available on server
      // add to transcript apk only
      formValues = {
        matnum: matID,
        mode: mode,
        validity: specialOffer,
        phone: number,
        type: "add",
      };
    } else {
      // first time applicant
      //save data accordingly on 2 tables (transcript apk n info)
      var ref;
      queryStr.ref === undefined ? (ref = null) : (ref = queryStr.ref);

      formValues = {
        name: fullname,
        matnum: matricule,
        dept: department,
        mode: mode,
        lvl: level,
        validity: specialOffer,
        phone: number,
        referral: ref,
        id: uID,
        type: "save&add",
      };
    }
    AxiosGetData(baseURL + "transcript.php", "post", formValues)
      .then((res) => {
        console.log(res.data);
        const response = res.data;
        if (response.success) {
          localStorage.setItem("apkID", response.data[1]);
          router.push(response.data[0]);
          /* AxiosGetData(response.data, 'post', {}).then(res=>{
        console.log(res.data);
    
      }).catch(e=>{
        console.log(e);
      })*/
        } else {
          alert("Submission Failed. Please Contact Admin");
        }

        //found record. fill fields
        //updateserverResponse(res.data);
      })
      .catch((e) => {
        alert("An Error Occured");
        updateonSubmitForm(false);

        console.log(e);
      });
  };
  const [showOffer, setShowOffer] = useState("block");
  
  /*
This function was used to allow users to apply for transcripts via partial mode

const [showApkForm, setShowForm] = useState(false);
 the state showApkForm is toggled between true and false based on the users initial selection
  const ProposalOffer = (value: boolean) => {
    if (value) {
      setDiscount(-200);
      setSpecialOffer(1);
    } else {
      setTimeout(()=>{
        setShowOffer("none")
        
      },1500)
      //setShowOffer("none");
    }
    setTimeout(()=>{
      setShowOffer("none")
      setShowForm(true);
    },1500)
   // setShowOffer("none");
   
  };*/
// the function verifyTranscript checks to see if we have the info of a user who enters his Matricule Number
  const verifyTranscript = (e: React.FocusEvent<HTMLInputElement>) => {
    //verify db to find if info exist for matricule
    updateLeftMatricule(true);
    const formValues = {
      name: matricule,
      type: "matricule",
    };

    AxiosGetData(baseURL + "transcript.php", "post", formValues).then((res) => {
      //console.log(res.data);

      //found record. fill fields
      updateserverResponse(res.data);
    });
  };

  useEffect(() => {
    console.log(serverResponse);
    updateLeftMatricule(false);
    if (serverResponse.success) {
      // found data
      if (typeof serverResponse.data !== "string") {
        //updateShowOthers(true); Just Update but don't show user data
        updateLevel(serverResponse.data.level);
        updateDept(serverResponse.data.dept);
        updateFullname(serverResponse.data.fname);
        updateID(serverResponse.data.id);
        updateNum(parseInt(serverResponse.data.number));
      }
    } else if (
      serverResponse.success == false &&
      typeof serverResponse.data === "string"
    ) {
      // did not find data
      alert(
        "Ooops We don't have any record for this Transcript. Just Fill the form Please"
      );
      updateShowOthers(true);
    }
  }, [serverResponse]);

  useEffect(() => {
    const transcriptID = localStorage.getItem("apkID");

    transcriptID != null && setHasApplied(true);
    const uID = localStorage.getItem("id");

    var uid, useCase;

    if (uID == null) {
      // not logged - fetch from local Storage
      if (transcriptID != null) {
        uid = transcriptID;
        useCase = "transcriptID";
      }
    } else {
      // logged -  fetch data
      setisLogged(true);
      uid = uID;
      useCase = "userID";
    }
    var formValues = {
      matnum: uid,
      name: useCase,
      type: "user",
    };
    //console.log(formValues.matnum);
    AxiosGetData(baseURL + "stat.php", "post", formValues)
      .then((res) => {
        setTransData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);



  return (
    <div className="p-2 container-md">
      <AppHeaderDiv img={Pro4}>
        <div className="fs-4 arima  h-100 text-center">
          <CentralisedBody addClasses=" w-100 h-100">
            <p>
              Your Transcripts, Our Priority: <br />
              <span className="bg-warning p-1 rounded shadow-sm">
                Safety First
              </span>
              , Delivery Assured
            </p>
          </CentralisedBody>
        </div>

        <small className="text-center">
          We are an{" "}
          <span className="text-warning">independent third party</span> service
          and not affiliated to the UNIVERSITY OF BUEA
        </small>
      </AppHeaderDiv>
      <>
      <div className="p-2 bg-light text-center table-responsive-md">
          {hasApplied ? (
            <>
              <p className="fs-4 prata text-muted"> Application Records </p>
              <div className="text-danger p-2 ">
                <>
                  {/*not found only userID isn't linked to account*/}
                  {transData.data.user == "not found" ? (
                    <>
                      <Link href="https://chat.whatsapp.com/BmZ3qOEQYhPBJLvDflO2zQ">
                        <button className="bg-success text-white btn btn-success shadow-lg rounded p-2">
                          Join Our WhatsApp Community{" "}
                          <i className="fa fa-whatsapp" aria-hidden="true"></i>
                        </button>
                      </Link>
                      <p className="text-center arima">
                        Please Synchronise your Account Now to view your Status
                        <br />
                        <button
                          className="btn btn-info text-white"
                          onClick={SynchroniseAccount}
                          disabled={clickedBtn}
                        >
                          {clickedBtn
                            ? "Synchronising..."
                            : "Synchronize Account"}
                        </button>
                        {/*<LoginPrompt/>*/}
                      </p>
                    </>
                  ) : (
                    <div className="table-responsive-sm">
                      {!isLogged ? (
                        <LoginPrompt />
                      ) : (
                        <table className="table">
                          <thead className="bg-light arima">
                            <tr>
                              <td>Matricule</td>
                              <td>Mode</td>
                              <td>Payment</td>
                              <td>Status</td>
                              <td>Action</td>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.values(transData.data.user).map((elmt) => {
                              return (
                                <tr
                                  key={Object.values(
                                    transData.data.user
                                  ).indexOf(elmt)}
                                  className="prata"
                                >
                                  <td>{elmt.matricule}</td>
                                  <td>{elmt.mode}</td>
                                  <td>
                                    {elmt.Amount}
                                    {elmt.Status == "SUCCESSFUL" ? (
                                      <>
                                        &nbsp;
                                        <i
                                          className="fa fa-check"
                                          style={{ color: "green" }}
                                        ></i>
                                      </>
                                    ) : (
                                      <>
                                        &nbsp;
                                        <i
                                          className="fa fa-times"
                                          style={{ color: "red" }}
                                        ></i>
                                      </>
                                    )}
                                  </td>
                                  <td>{elmt.status}</td>
                                  <td>
                                    {elmt.Status == "SUCCESSFUL" ? (
                                      <NavigableButton
                                        classes="btn-success"
                                        text="Complete"
                                        url=""
                                        disable={true}
                                      />
                                    ) : (
                                      <NavigableButton
                                        classes="btn-danger"
                                        text="Pay Now"
                                        url={`https://www.studentproguide.site/php/interpay.php?direct=yes&amount=${elmt.Amount}&phone=1234&apk=${elmt.apkID}`}
                                        disable={false}
                                      />
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </>
              </div>
            </>
          ) : (
            <>
              <p className="prata">We Have Processed</p>
              <span className="display-1 orangedefault arima">
                <strong>{112 + transData.data.total}</strong>
              </span>
              <p className="prata">
                Applications from people{" "}
                <strong className="orangedefault">Like You</strong>
              </p>
            </>
          )}
        </div>
        {/*
this code was used to all  users to select the option of applying for a partial mode (i.e Just receipt) or Full Mode but Boss Rodrick tok say make I moveam... Who am 
I to argue when he says so
        <div className="container-fluid ">
       
          <div
          className="container-fluid  p-2 rounded nunito "
          style={{ display: `${showOffer}` }}
        >
          <h3 className="text-center">What do you want us to do for you?</h3>
          <br />
          <div className="row">
            <div className="col-5">
              <div className=" p-1 border rounded btn-outline-primary btn shadow-lg"  onClick={()=>{ProposalOffer(true)}}>
                Apply and give my RECEIPT <br />
                (You Collect your Transcript from your Department)
              </div>
            </div>

            <div className="col-7">
              <div className=" p-1 border rounded btn-outline-primary btn shadow-lg" onClick={()=>{ProposalOffer(false)}}>
                Apply and give my TRANSCRIPT: <br />
                (ProGuide handles everything - We apply and hand your Transcript)
              </div>
            </div>
          </div>
        </div>
      </div>
        */}
      
       
        
         
        
        <div className="p-2 arima" id="apply">
          <form className="rounded shadow-lg p-4" onSubmit={handleSubmit}>
            <div className="row">
              <div
                className="col bluedefault roboto"
                style={{ height: "50px" }}
              >
                Application Details
              </div>
              <div className="col  d-flex flex-row-reverse position-relative">
                <div
                  style={{ position: "absolute", top: "-60px", left: "50%" }}
                >
                  <MyImage url={Hello} classes="" h={100} w={100} />
                </div>
              </div>
            </div>
            <hr />

            <label htmlFor="basic-url" className="form-label">
              Matricule Number
            </label>
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                onBlur={verifyTranscript}
                onChange={(event) => updateMatricule(event.currentTarget.value)}
                placeholder="Please Enter Your Matricule"
                aria-label="Username"
                aria-describedby="addon-wrapping"
                style={{ height: "50px" }}
                required
              />
            </div>
            {!leftMatricule ? (
              <p></p>
            ) : (
              <>
                <span className="bluedefault">
                  Checking If we have Your Info already...
                </span>
                <br />
              </>
            )}
            {serverResponse.success ? (
              <span className="text-success">
                Info Found! Just Enter Your Mode
              </span>
            ) : (
              <>
                <span></span>
                <br />
              </>
            )}

            {others ? (
              <>
                <InputTextField
                  labelName="Full Name"
                  typeName="text"
                  iconType=""
                  inputVal={fullname}
                  onChangeFxn={(e) => {
                    updateFullname(e.currentTarget.value);
                  }}
                />
                <InputTextField
                  labelName="Department"
                  typeName="text"
                  iconType=""
                  inputVal={department}
                  onChangeFxn={(e) => {
                    updateDept(e.currentTarget.value);
                  }}
                />

                <InputTextField
                  labelName="Your Phone Number"
                  typeName="number"
                  iconType=""
                  inputVal={number}
                  onChangeFxn={(e) => {
                    updateNum(parseInt(e.currentTarget.value));
                  }}
                />

                {!serverResponse.success ? (
                  <div className="input-group shadow-sm p-2">
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      style={{ height: "50px" }}
                      onChange={(event) =>
                        updateLevel(event.currentTarget.value)
                      }
                      required
                    >
                      <option>Your Level:</option>
                      <option value="1">L200</option>
                      <option value="2">L300</option>
                      <option value="3">L400</option>
                      <option value="4">L500</option>
                      <option value="5">L600</option>
                      <option value="6">L700</option>
                      <option value="former">I am a Former Student</option>
                    </select>
                  </div>
                ) : (
                  <InputTextField
                    labelName="Level"
                    typeName="text"
                    iconType=""
                    inputVal={level}
                    onChangeFxn={(e) => {
                      updateLevel(e.currentTarget.value);
                    }}
                  />
                )}
              </>
            ) : (
              <p></p>
            )}
            {/*
             */}
            <div className="input-group shadow-sm p-2">
              <select
                className="form-select"
                aria-label="Default select example"
                style={{ height: "50px" }}
                onChange={setPrice}
                required
              >
                <option>Choose Your Mode</option>
                
                <option value="fast">Fast Mode (2 - 7 Business Days)</option>
                <option value="superfast">
                  Super Fast Mode (3 Business Days)
                </option>
              </select>
            </div>
            <div className="container text-center fs-2">
              Price:{" "}
              <span style={{ textDecoration: "line-through" }}>
                {price == 0 ? "0" : price + 1000} FCFA
              </span>
              &nbsp;&nbsp;<span style={{ color: "green" }}>{price} FCFA</span>
            </div>

            <div className="form-check nunito">
              <p className="text-warning">
                <span className="text-bold">
                  <b>NB:</b>
                </span>
                <small>
                  For Transcript Deliveries Out of Buea, Please Contact Customer
                  Service First by clicking the &quot;Customer Service&quot;
                  button Below
                </small>
              </p>
              <input
                type="checkbox"
                className="form-check-input"
                id="exampleCheck1"
                onChange={(e) => {
                  updateAgreement(e.target.checked);
                }}
              />
              <label className="form-check-label" htmlFor="exampleCheck1">
                I grant my consent to let ProGuide apply for my Transcript on my
                behalf.
              </label>
            </div>

            {/*<LoadBtn txt="Apply For Transcript" disabledBtn={!agreement} txtColor='white' bgColor="#0d6efd" />*/}
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
                disabled={!agreement}
              >
                Apply For Transcript
              </button>
            )}
          </form>
        </div>

      </><br/>
      <p className="text-center prata mt-2">
        Any Questions or Worries? Contact us Here
        <br />
        <CoolButton
          bgColor="#eea849"
          displayTxt="Customer Service"
          textColor="white"
          url="https://wa.me/237692764860?text=Hello%20Support%20Team"
        >
          &nbsp;
          <i className="fas fa-user-astronaut"></i>
        </CoolButton>
      </p>
    </div>
  );
};
Transcript.getLayout = function getLayout(page: ReactElement) {
  return (
    <DashBoardLayOut headerTxt="Transcript Application">{page}</DashBoardLayOut>
  );
};
export default Transcript;
