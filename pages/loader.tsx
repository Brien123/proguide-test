import React, { useContext } from 'react';
import MyImage from '../components/images/imageDiv';
import { CentralisedBody } from '../components/utilityComponents';
import Pro from '../components/images/es-loader.gif';

const  ProLoader = ()=>{
    
    return (
        <div className="container-fluid w-100" >
            <CentralisedBody addClasses=' h-100'>
                <div className="container shadow-lg rounded d-flex justify-content-center p-3">
                   <MyImage url={Pro} classes="img-fluid" w={100} h={100}  />
                </div>

            </CentralisedBody>
        </div>

    );
}
export default ProLoader;