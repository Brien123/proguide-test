import React , {useState} from "react";
import Pro from "../../components/images/books.svg";
import Pro1 from "../../components/images/test.svg";
import Pro2 from "../../components/images/team.svg";
import Pro3 from "../../components/images/parents.svg";
import Pro4 from "../../components/images/admin.svg";
import { serialize } from "react-serialize";
import { StaticImageData } from 'next/image';

type pageData = {
    student: {
        appHeader:{
            img: string | StaticImageData,
            childElement: (e:React.ReactElement)=>void

        },
        service:{
            sname:string, 
            slink:string,
            simg: string | StaticImageData

        }[]
    }
    



}




const BoardData:pageData = {
    student: {
        appHeader:{
            img: Pro,
            childElement:serialize(<div>hey</div>)
               
            

        },
        service:[{
            sname:'hey', 
            slink:'yeah',
            simg: 'y'
        }

        ]
    }

 

}

export default BoardData;