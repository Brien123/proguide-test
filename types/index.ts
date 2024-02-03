import { Options } from "next/dist/server/base-server"
import { type } from "os"
import React, { Component } from "react"
import { JsxChild } from "typescript"
import { StaticImageData } from 'next/image';
import { DOMAttributes } from "react";
import { MathfieldElementAttributes } from 'mathlive'

type CustomElement<T> = Partial<T & DOMAttributes<T>>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      ["math-field"]: CustomElement<MathfieldElementAttributes>;
    }
  }
}
export interface inputfieldWithIcon extends inputcontrole { 
    icon?: string
}
 export const baseURL = "https://www.studentproguide.site/php/";//http://localhost/php/
 export const hostname = "https://www.studentproguide.site/"; // http://localhost/
export interface choices{
    id: string
    options: string[]  
    name: string

}
export type ResServer = {
    success: boolean;
    data:
      | {
          sID: string;
          name: string;
          level: string;
        }[]
      | string;
  };
  
  
  export type serverRes5 = {
    pageData:{
      success: boolean;
      data:
        {
            solID: string,
            qID:string,
            qcode: string,
            qtitle: string,
            qtype: string,
            verified: number,
            year: number
          }[]
        | string;
    }
    
  };
  
  export type serverDept = {
    success: boolean;
    data:
      {
          department: string;
        }[]
      | string;
  };

export type serverRes = {
    success: boolean,
    data: {
      message: string,
      data:{
        id:string,
      type:string
  
      }
      
    }
  }
  declare global {
    interface Window {
        deferredPrompt:any;
    }
}
  export type notificationProps = {
    header: string,
    textMsg: string,
    postTime?: string,
    color?: string,
    child?: React.ReactElement
}

export interface navitem{
    children: React.ReactNode
    link: String
}

export interface hasChildren{
    children: React.ReactNode
}

export type bottomnav = {
    id: string;
}
export type inputprops = {
    labelName: string,
    iconType: string,
    inputVal?: string|number,
    typeName:  'text' | 'email' |'number' | 'select-radio' | 'submit' | 'password',
    onChangeFxn?: (event: React.FormEvent<HTMLInputElement>)=>void;

}
export interface BoxProps{
    name:  string
    image: any
    link: string
}
export type centerprops = {
    children: React.ReactNode,
    addClasses?:string
}
export type quicklinksprops = {
    name:string,
    url:string
}

export type Testimonyprops = {
    testimony: string,
    name: string
}

export type navprops = {
    url: string,
    name: string
}

export type navbtnprops = navprops & {
    classes: string

}

export type layoutprops = {
    children : React.ReactNode,
    imgLink: string | StaticImageData ,
    textHeader: string,
    loader?: boolean
}

export type Headerprops={
    children : React.ReactNode,
    img: string | StaticImageData ,
    order?: string
}

export type userDataProps = {
  userID: string | null,
  userType: string | null
}

export type dashboardlayoutprops = {
  children : React.ReactNode,
  headerTxt?:string
}

export type loadStateProps = {
  loadState : boolean,
  updateLoadState: (event: boolean)=>void;
}

export interface formcard{
    formSteps: Component[] 
}

export type inputcontrole = {
    id: string;
    info?: string;
    value?: string;
    name: string;
    label?: string;
    className?: string;
    required?: boolean
    valid?: boolean
    type?: 'text' | 'email' | 'select-radio' | 'submit' | 'password';
    status?: 'success' | 'danger';
    errors?: string;
    children?: React.ReactNode;
    defaultChecked?: boolean;
    onChange?: (
        event: React.ChangeEvent<HTMLInputElement>
    ) => void;
}
export interface dropdowninput extends inputcontrole {
    options: string[]
};

export type infotext = {
    className?: string;
    label: string | JSX.Element | undefined;
} 



export type inputlabel = {
    className?: string;
    htmlFor?: string;
    label: string | JSX.Element | undefined;

}