const axios = require("axios");
const axiosRetry = require("axios-retry");
const mysql = require('mysql2');

var User='crypzlhr_proguide2user';//'root';
var Pass ='Proguide2.0@';// '';
const dbConnect = mysql.createConnection({
    host: "localhost",
    user: User,
    password:Pass,
    database: 'crypzlhr_materialsdb'
  });


const AxiosGetData = async (link, type, dataObj) =>{
 
        axiosRetry(axios, {
            retries: 3,
            shouldResetTimeout: true,
            retryCondition: (_error) => true // retry no matter what
          });
          //console.log('sent me from server ')
          const reqData = await axios({
            method: type,
            url: link,
            
            data: JSON.stringify(dataObj),
            timeout: 10000
          });
    
        return reqData;
    
      
    };

    
module.exports = {
    AxiosGetData, dbConnect
}

