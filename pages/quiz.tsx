import React, { useState, useEffect, useContext, useRef } from 'react';
import { AxiosGetData, CentralisedBody } from '../components/utilityComponents';
import { useRouter } from 'next/router';
import { baseURL } from '../types';
import { ToastContainer, toast } from 'react-toastify';
import LoaderScreen from '../components/loadingBtn/loaderScreen';
import { userData } from './_app';

import { replaceMathDelimiters } from './math';



type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?:string
}

type serverResponse = {
    success: boolean,
    data:{
        duration: number,
        materialID: number,
        quizz: string,
        sID: number,
        subject: string,
        topic: string
    }| string

} | boolean 

type studentReportProps = {
  questionIndex : number,
  selectedAnswer: string,
  correctAnswer: string,
  timeTaken: number

}

const QuizInterface: React.FC = () => {
    const defaultTime = 10;
    const corectionTime = 100;

    const initialTPQ = useRef(20);
    
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showInstructions, setInstructions] = useState(true);
  const [hasAccount, setHasAccount] = useState(false);
  const [quizSubject, setSubject] = useState('');
  const [quizTopic, setTopic] = useState('');
  const [viewMode, setViewMode] = useState<'test'| 'correction'>('test')
  const [timePerQ, setTPQ] = useState(defaultTime);
  const [serverData, setServerData] = useState<serverResponse>(false);
  const [quizData, setQuizData] = useState<QuizQuestion[]>([{
    question: "What is your best studying platform?",
    options: ['ProGuide','Youtube','EduClick', 'Kawlo'],
    correctAnswer: "ProGuide",
    explanation:"ProGuide Individualizes your learning process and Provides your with a mentor and academic assistant with little charge"
  }]);
  const [timeLeft, setTimeLeft] = useState(timePerQ);// default time per question
 // const [isAnimating, setIsAnimating] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null | undefined >(null);
  const [studentTracking, setStudentTracking] = useState<studentReportProps[]>([])
const router = useRouter();
const queryStr = router.query;

useEffect(()=>{
    //fetch the data for the particular quiz
    if(queryStr.assignmentID !== null && queryStr.assignmentID !== undefined){
        var formValues = {
            id: queryStr.assignmentID,
            type: 'viewPrepTestById'
        }

        AxiosGetData(baseURL+'preptests.php','POST', formValues).then(
            res=>{
                if(res.data.success){
                    setServerData(res.data);
                    setQuizData(JSON.parse(res.data.data.quizz))
                    setTPQ(Math.floor(res.data.data.duration/JSON.parse(res.data.data.quizz).length))
                    initialTPQ.current = Math.floor(res.data.data.duration/JSON.parse(res.data.data.quizz).length);
                    setTopic(res.data.data.topic)
                    setSubject(res.data.data.subject)
                   // console.log(JSON.parse(res.data.data.quizz))
                   console.table(JSON.parse(res.data.data.quizz))
                }else{
                    toast.error('An Unknown Error Occurred code we345.');
                }
                
                console.log(res.data);
            }
        ).catch(err=>{
            toast.error('An Unknown Error Occurred.');
            console.log(err);
        })
    }else{
        console.log('No fetch sent')
    }
    

},[queryStr])

const userCred = useContext(userData);
  useEffect(() => {
    if (currentQuestion < quizData.length) {
     
      const timer = setTimeout(() => {
        if (timeLeft > 0) {
          setTimeLeft(timeLeft - 1);
        } else {
          handleOptionClick('',-1,0);// if option index is -1 means no answer was selected
        }
      }, 1000);

      return () => clearTimeout(timer);
    }else{
     var formValues={};
      if(userCred.userID === null){
        //prompt user to create Account if not test will not be recorded
setHasAccount(false)
formValues ={
  quizID: queryStr.assignmentID,
  studentID: Math.random(),
  mark: score,
  detailAnalysis: studentTracking,
  type: 'saveResult'

};
        localStorage.setItem(`quizDataResult${queryStr.assignmentID}`,JSON.stringify(formValues));
        toast.warning('It appears You donot have an Account. Please Create one now to see your result and view Correction')
        
      }else{
        formValues ={
          quizID: queryStr.assignmentID,
          studentID: userCred.userID,
          mark: score,
          detailAnalysis: studentTracking,
          type: 'saveResult'
  
        };}
     
console.log(formValues);
        AxiosGetData(baseURL+'preptests.php','POST',formValues).then(res=>{
          console.log(res.data)
          if(res.data.data.success){
            toast.success('Your Results were sucessfully registered')
          }else{
            toast.error('We faced an issue which was not due to network. Nonetheless your marks are saved locally. Contact your teacher')
            localStorage.setItem(`quizDataResult${queryStr.assignmentID}`,JSON.stringify(formValues));
          }
        }).catch(err=>{
          if (err.message === 'Network Error') {
            //save to localStorage
            localStorage.setItem(`quizDataResult${queryStr.assignmentID}`,JSON.stringify(formValues));
            toast.warning('We could not send your result to your teacher because you are offline. Please Reconnect');
          }
        })

      
      // send result to backend or save in localStorage in case of internet Absence
     
    }
  }, [currentQuestion, timeLeft]); 
  const hideInstructions = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
    setCurrentQuestion(0)
    setStudentTracking([])
    setInstructions(false);
    setTimeLeft(timePerQ);
  }

  useEffect(()=>{
    console.log('score changed '+score);

  },[score])

  const handleOptionClick = (selectedAnswer: string,  optionIndex: number, timeTaken: number) => {
    {/*if (isAnimating !== null) {
        return; // Prevent multiple clicks during animation
      }*/}
      

      
    if (selectedAnswer == quizData[currentQuestion].correctAnswer) {
      setScore(score + 1);
      console.log('correct answer');
    }else{
      console.log(`wrong answer. You selected ${selectedAnswer} but the answer is ${quizData[currentQuestion].correctAnswer}`);

    }

    
    //console.log(`student answered question ${currentQuestion + 1} with ${selectedAnswer} and correct answer is ${quizData[currentQuestion].correctAnswer} in ${timeTaken} seconds`)
 var trackedData: studentReportProps = {
questionIndex: currentQuestion,
correctAnswer: quizData[currentQuestion].correctAnswer,
selectedAnswer: selectedAnswer,
timeTaken: timeTaken
 }
 var newObj;
    if(studentTracking.length === 0){
  newObj = [trackedData]
 }else{
  newObj = [...studentTracking, trackedData]

 }

 setStudentTracking(newObj);
 
    
    //setIsAnimating(currentQuestion);
    setSelected(optionIndex);
    //setCurrentQuestion(currentQuestion + 1);
    setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(timePerQ); // Reset timer for the next question
        //setIsAnimating(null);
        setSelected(null);
      }, 1000);

     

  };

  useEffect(()=>{
    console.log('Initial Value');
console.log(studentTracking)
  },[studentTracking])

 

  const handleRestartQuiz = () => {
    setCurrentQuestion(0);
    setViewMode('test');
    setScore(0);
    setStudentTracking([]);
    setTPQ(initialTPQ.current)
  };

  const correctionMode = () =>{
    setViewMode('correction');
    setCurrentQuestion(0)
    setTPQ(corectionTime)
  }

  return (
    <div className='bluebg' style={{height:'100vh', width: '100vw'}}>
    <CentralisedBody addClasses='w-100 border h-100 p-3'>
        <ToastContainer/>
        {
            serverData === false ?<LoaderScreen/>:<>
             {
                showInstructions?<div className='p-2 prata text-white'>
                    <h3>Instructions</h3>
                    <p>You are about to take a Timed Preparatory Test. Endeavor to Have all Materials ready by you</p><br/>
                    <ul className="list-group border-none">
                    <li className="list-group-item border-none"> Subject : {quizSubject}</li>
                    <li className="list-group-item border-none"> Topic : {quizTopic}</li>
                    <li className="list-group-item border-none"> Duration Per Question : {timePerQ} s</li>
                    <li className="list-group-item border-none"> Number of Questions : {quizData.length} </li>
                           
                          </ul>
<br/>
                          <button className="btn orangebg text-white rounded p-2 arima" onClick={hideInstructions}>
                            Start Test
                          </button>
                    </div>:
                <div className="container ">
                  {/*mathjax provider wrapper*/}
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    {currentQuestion < quizData.length ? (
                      <div className="card rounded shadow-lg">
                        <div className="card-body">
                          
                          <h3 className="card-subtitle prata mb-4">{replaceMathDelimiters(quizData[currentQuestion].question)}</h3>
                          {viewMode == 'test'?<><div className="timer">Time Left: {timeLeft}s</div>
                          <ul className="list-group border-none ">
                            {quizData[currentQuestion].options.map((option, index) => {
                              //
                              return(
                                option !== '' && option !== null &&
                              
                                <li key={index} className="m-2 border-none"><center>
                                <button
                                  className={`btn btn-gamified ${selected === index ? 'bg-success text-white' : ''}`}
                                  onClick={() => handleOptionClick(option, index, timePerQ-timeLeft)}
                                >
                                  {replaceMathDelimiters(option)}
                                </button></center>
                              </li>
                              )
                            }
                              
                              
                              
                              
                            )}
                          </ul></>:
                          <>
                          <ul className="list-group border-none">
                            {quizData[currentQuestion].options.map((option, index) => (
                              <li key={index} className="list-group-item border-none"><center>
                               {
                                option == studentTracking[currentQuestion].selectedAnswer?
                                <button
                                  className={` text-white p-2 rounded  ${ option == studentTracking[currentQuestion].correctAnswer?'border-success correct ':'border-danger incorrect'} `} 
                                >
                                  {replaceMathDelimiters(option)}
                                </button>:
                                   <button
                                   className={`  p-2 rounded  ${ option == studentTracking[currentQuestion].correctAnswer?'border-success correct text-white':'btn'} `} 
                                 >
                                   {replaceMathDelimiters(option)}
                                 </button>
                                
                               }
                                </center>
                              </li>
                            ))}
                          </ul>
                          <div className="row">
                            <div className="col-12 border-success rounded bg-light border p-2">
                              {
                                quizData[currentQuestion].explanation == ''?'No Explanation was provided by Your Tutor':
                                replaceMathDelimiters(quizData[currentQuestion].explanation)
                              }
                            </div>
                            <div className="col-6 text-center mt-1">
                              {
                                currentQuestion !== 0 &&
                              
                              <button className='btn text-white shadow-lg rounded w-75 btn-warning' onClick={()=>setCurrentQuestion(currentQuestion - 1)}>Prev</button>
                              }</div>
                           <div className="col-6 text-center mt-1">
                              <button className='btn shadow-lg rounded w-75 btn-primary' onClick={()=>setCurrentQuestion(currentQuestion + 1)}>Next</button></div>
                          </div>
                          </>}
                        </div>
                      </div>
                    ) : (
                      <div className="card">
                        <div className="card-body">
                          <h2 className="card-title">Quiz Completed!</h2>
                          <p className="card-text">Final Score: {score} / {quizData.length}</p>
                          <button className="btn btn-primary" onClick={handleRestartQuiz}>
                            Restart Quiz
                          </button>
                          <button className="btn btn-warning text-white prata m-2" onClick={correctionMode}> View Correction </button>
                         {
                          hasAccount?<></>:
                          <p className='text-warning'> This is a Beta version of the App - MJ</p>
                         }

                          
                        </div>
                      </div>
                    )}
                  </div>
                </div>
               
              </div>
            }
            </>
           
          
        }
    
    </CentralisedBody>
    </div>
  );
};

export default QuizInterface;
