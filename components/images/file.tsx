import React from 'react';

import Parent from "./parents.svg";
import Teacher from "./teacher.png";
import Student from "./student.png";
import Admin from "./admin.svg";
import Pro from "./pro+logo.png";



const GiveString = (name: string):string=>{
    let val = require(name);
    return val;
}

const Pro1 = GiveString('./pro+logo.png');

export {
    Parent,
    Pro,
    Teacher,
    Student,
    Admin,
    Pro1
}