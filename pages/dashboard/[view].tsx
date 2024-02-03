import React, { useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { ScrapeMotionValuesFromProps } from "framer-motion";
import { AppHeaderDiv, QuestionBox } from "../../components/utilityComponents";
import type { ReactElement } from "react";
import MyImage from "../../components/images/imageDiv";
import { DashBoardLayOut } from "../../components/layout/layout";
import Pro from "../../components/images/books.svg";
import Link from "next/link";
interface Post {
  id: number;
  title: string;
  body: string;
}

interface PostProps {
  post: Post;
}

interface Params extends ParsedUrlQuery {
  view: string;
}

type varpros = {
  newVar: string;
};

//useEffect(()=>{})

const ViewScreen = ({ newVar }: varpros) => {

  if(newVar == 'study'){
    var headerTxt = 'Past Questions & Solutions';
  }else{
    headerTxt = newVar;
  }
    const [isLoading, setIsLoading] = useState(true); 
  return (
    <div className="p-2">
      <div
        className="shadow-lg rounded testbg text-white "
        style={{ maxHeight: "22vh" }}
      >
        <div className="text-center bgShape p-2">
          <br />
          <span className="arima fs-2">  {headerTxt} </span>
          <br />
          <div className="container">
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search Questions, Solutions, Tutors"
              />
              <div
                className="input-group-append primarybtn"
                style={{ backgroundColor: "#FFAC1C" }}
              >
                <button className="h-100 btn btnprimary">
                  <i className="fa fa-search text-white"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <span className="fs-4 nunito">Your Available Materials (03)</span>
      <div className="container ">
        <div className="row position-relative " style={{ minHeight: "68vh" }}>
         
          {
            <>
               <QuestionBox imgLink={Pro} name='PHY 220' url="" verified={true}/>
            <QuestionBox imgLink={Pro} name='FRE 102' url="" verified={false}/>
            <QuestionBox imgLink={Pro} name='ACC ' url="" verified={true}/>
          </>
         
          }
          <div
            className="p-2 "
            style={{ position: "absolute", bottom: "50px" }}
          >
            <div
              className="shadow-lg text-center p-2 rounded primarybtn "
              style={{ float: "right" }}
            >
              <i className="fa fa-plus fa-2x text-white"></i><br/>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = [
   
    { params: { view: "study" } },
    { params: { view: "test" } },
    { params: { view: "mentor" } },
  ];
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { view } = context.params!;
  
  var newVar =  view;

  //const post = await fetch(`https://jsonplaceholder.typicode.com/posts/${view}`).then((res) => res.json());
  return { props: { newVar } };
};

ViewScreen.getLayout = function getLayout(page: ReactElement) {
  return <DashBoardLayOut>{page}</DashBoardLayOut>;
};
export default ViewScreen;
