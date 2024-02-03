
import React, { useContext, useEffect, useState } from "react";
import { GetStaticPaths, GetStaticProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { ScrapeMotionValuesFromProps } from "framer-motion";
import { AppHeaderDiv, LoginPrompt, QuestionBox } from "../../components/utilityComponents";
import type { ReactElement } from "react";
import MyImage from "../../components/images/imageDiv";
import { DashBoardLayOut, userData } from "../../components/layout/layout";
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
    const [showCopy, setshowCopy] = useState(false); 
    var userCred = useContext(userData);
    var text = "www.studentproguide.site/dashboard/transcript?ref="+userCred.userID;
    const CopyToClipboard = (txt: string)=>{
        navigator.clipboard.writeText(txt);
        setshowCopy(true);
        setTimeout(()=>{setshowCopy(false)},3000);
    }
    
  return (
    <div className="p-2">
      <div
        className="shadow-lg rounded testbg text-white "
        style={{ maxHeight: "22vh" }}
      >
        <div className="text-center bgShape p-2">
          <br />
          <span className="arima fs-2">  {newVar == 'share'? 'Share & Earn' : newVar} </span>
          <br />
          
        </div>
      </div>
      <br />
      
      <div className="container ">
        {newVar != 'share' ? 'Soon Available...': <>
        <div className="p-2 container">
            <h4 className="text-center prata">
                <u>How It Works</u>
            </h4>
            <span className="text-muted p-2">
                At ProGuide, we seek to make every partaker in the accomplishment of our vision and mission a 
                beneficiary of some sort of reward. With the most sorted being Financial, especially amongst students, we established
                to reward a percentage of our profits to whosoever aids us make someone&apos;s academic life easier.
<br/>
                As a result we currently reward <b>15% of profit</b> on paid referrals for our Transcript Application Module.
                Thus for referrals for our Full Transcript Application, the referrer obtains <strong>150XAF</strong> whilst for our 
                Partial Applications, the referrer obtains <strong>75XAF</strong> <br/>
                <center>
                <h6 className="text-center prata">
                <u>So what do you do Now?</u>
            </h6>
                    Easy! Just copy the link below and share to your friends and class mates<br/><hr/>

                    {userCred.userID == null?<LoginPrompt/>:
                    
                    <input type="text" className="container-fluid border rounded " onClick={()=>{CopyToClipboard(text)}} placeholder={`www.studentproguide.site/dashboard/transcript?ref=${userCred.userID}`}/>
                        
                }
                {showCopy? <p className="p-1 rounded text-white orangebg w-50"> Copied!</p>:<> </>}
                </center>
            </span>
        </div>
        </>}
      </div>
    </div>
  );
};

export const getStaticPaths: GetStaticPaths<Params> = async () => {
  const paths = [
   
    { params: { view: "edit" } },
    { params: { view: "share" } },
    { params: { view: "help" } },
    { params: { view: "stats" } },
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
