<?php

require_once "gateway.php";
require_once "update.php";
require_once "sanitizer.php";
require_once "insert.php";
require_once "model.php";
require_once "load.php";
require_once "mail.php";


//serverResponse(false,'Transcript Module Not Active');

$createUser = new InsertHandler($connect);

$sanitizeTxt = new Sanitizer(json_decode(file_get_contents('php://input'), true));
$inputData = $sanitizeTxt->cleanedText;



function InformCustomerService($email,$name,$number,$mode,$special,$text){
    global $activationMail;
    if($special == 1){
        $set = 'true';
    }else{
        $set = 'false';
    }
    $customer_service = ['javeaaita2@gmail.com'];
       
          
           $table="
           <center><table style=\"width:100%\">
  <tr>
    <th>Information</th>
    <th>Value</th> 
    
  </tr>
  <tr>
    <td>Applicant Name or Matricule</td>
    <td>$name</td>
    
  </tr>
  <tr>
    <td>Applicant Contact</td>
    <td>$number</td>
   
  </tr>
  <tr>
    <td>Application Mode</td>
    <td>$mode</td>
   
  </tr>
   <tr>
    <td>Accepted Special Offer</td>
    <td>$set</td>
   
  </tr>
</table></center>
           "; 
                  $activationMail("New Transcript Application",$sentFrom='mbenguvis0@gmail.com',$senderName='ProGuide',$email,'',"Please Log In the App to view if payment was effectuated",$text.$table,"www.studentproguide.site/admin","View Details");
          
          
      }
 
   

if($inputData[$TYPE] == 'matricule'){
    $loader = new loadInfo($db1,$tb3);
   
    $row = $loader->select("SELECT * FROM {$tb3} WHERE matricule = '{$inputData[$NAME]}' ");
    if(is_null($row)){
        serverResponse(false,'No Transcript Found');
    }else{
        serverResponse(true,[
            'fname'=>$row[0]['name'],
            'level'=>$row[0]['level'],
            'number'=>$row[0]['phone'],
            'id'=>$row[0]['sn'],
            'dept'=>$row[0]['department']
            ]);
        
    }
}elseif($inputData[$TYPE] == 'add'){
   //serverResponse(false,$newMode);
    if($inputData['validity']){
        $newMode = $inputData[MODE].'_sp';
        $discount = 500;
      
    }else{
        $newMode = $inputData[MODE];
        $discount = 0;
        
    }
    $database = $db1;
    $table = $tb4;
    $qry = "INSERT INTO {$table} (sn, mode, agentID, submitDate, status, transacID) VALUES (?,?,?,?,?,?)";
     $type="ssssss";
     $agent=NULL;
     $transac=NULL;
     $pay='pending';
     $submitdate=date("Y-m-d");
     $stat = 'pending';
      $param = [$inputData[MATRICULE],$newMode,$agent,$submitdate,$stat,$transac];
      
      if($apkID=$createUser->registerUser($database,$qry,$type,$param)){// added record
      
      //inform cs
       $txt = "A returning user just reapplied <br/>";
      
      //InformCustomerService('javeaaita2@gmail.com',$inputData[MATRICULE],'please look in App',$inputData[MODE],$inputData['validity'],$txt);
     
      //initiate Payment
      if($inputData[MODE] == 'normal'){
          $price = NORM;
      }else{
          $price = $inputData[MODE] == 'fast' ? (FAST-$discount) : (SFAST-$discount);
      }
       
      //serverResponse(true,['amount'=>$price,'phone'=>$inputData[PHONE]]);
      header("location:interpay.php?amount={$price}&phone={$inputData[PHONE]}&apk={$apkID}");
      }
      else{
          serverResponse(false,'Failed to add record '.mysqli_error($connect));
          
      }
     
     
     
     
    
    
}elseif($inputData[$TYPE] == 'save&add'){
    //serverResponse(true,$inputData);
   
       if($inputData['validity']){
        $newMode = $inputData[MODE].'_sp';
        $discount = 500;
      
    }else{
        $newMode = $inputData[MODE];
        $discount = 0;
        
    }
    if($inputData[LEVEL] == 'former'){
        $inputData[MODE] == 'superfast'?$add = 2000: $add = 1000;
   }else{
       $add = 0;
   }
    
     $database = $db1;
    $table = $tb3;
    $qry = "INSERT INTO {$table} (studID,name,department,matricule,level,phone) VALUES (?,?,?,?,?,?)";
     $type="ssssss";
     if(isset($inputData[ID])){
         $uid = $inputData[ID];
     }else{
         $uid=NULL;
     }
    
      $param = [$uid,$inputData[$NAME],$inputData[DEPT],$inputData[MATRICULE],$inputData[LEVEL],$inputData[PHONE]];
      if($sn=$createUser->registerUser($database,$qry,$type,$param)){// saved user record
      
    
      //add
       $table = $tb4;
    $qry1 = "INSERT INTO {$tb4} (sn, mode, agentID, submitDate, status, transacID) VALUES (?,?,?,?,?,?)";
     $type="ssssss";
     $agent=NULL;
     $transac=NULL;
     $pay='pending';
     $submitdate=date("Y-m-d");
     $stat = 'pending';
      $param = [$sn, $newMode,$agent,$submitdate,$stat,$transac];
      //initiate Payment
      if($apkID=$createUser->registerUser($database,$qry1,$type,$param)){// added record
      
        // save referee
      if(!is_null($inputData[$REFERRAL]) && $inputData[$REFERRAL] != ''){
          $d = $db1;
            $t = $tb6;
            $q = "INSERT INTO {$t} (studID,apkID) VALUES (?,?)";
             $type="ss";
             $params = [$inputData[$REFERRAL],$apkID];
             $createUser->registerUser($d,$q,$type,$params); // add referree
                 
             
      }
      //inform customer service
      //inform cs
       $txt = " A new Applicant Just Applied<br/>";
   
    
      //InformCustomerService('tabiagnes2@gmail.com',$inputData[MATRICULE],'please look in App',$inputData[MODE],$inputData['validity'],$txt);
     
   
      
      //
      
      
      //initiate Payment
      if($inputData[MODE] == 'normal'){
          $price = NORM;
      }else{
          $price = $inputData[MODE] == 'fast' ? (FAST+$add-$discount) : (SFAST+$add-$discount);
      }
      //serverResponse(true,['amount'=>$price,'phone'=>$inputData[PHONE]]);
      header("location:interpay.php?amount={$price}&phone={$inputData[PHONE]}&apk={$apkID}");}
      else{
          serverResponse(false,"Could not add your application".mysqli_error($connect));
          
      }
      }else{
          serverResponse(false,"Could not save your Information".mysqli_error($connect));
      }
    
}elseif($inputData[$TYPE] == 'update'){
          $updateFxn = new Updater($connect);
          $query = "UPDATE {$tb4} SET transacID='{$inputData[MATRICULE]}' WHERE apkID=?";
          $type='i';
          if($updateFxn->updateRow($db1,$query,$inputData[ID],$type)){
              // alert referee of payment of downline.
              
              $loader = new loadInfo($db1,'');
              $q="SELECT {$tb1}.email,{$tb1}.username FROM {$tb1} INNER JOIN {$tb6} ON {$tb1}.studID = {$tb6}.studID WHERE {$tb6}.apkID = '{$inputData[ID]}'"; 
              $verifyUser = $loader->select($q);
              if(!is_null($verifyUser)){
                  $text = $verifyUser[0]['username']." You just helped a friend succesfully apply for a vital document from the comfort of their phones and we think you merit a little token for that kind gesture. Check on the app"; 
                  $activationMail("Congratulations!",$sentFrom='mbenguvis0@gmail.com',$senderName='ProGuide',$verifyUser[0]['email'],$verifyUser[0]['username'],"You Just made some Cash Online!",$text,"www.studentproguide.site/profile","Redraw Referral Bonus");
                  
              }
              
              serverResponse(true,"All records successfully updated");
              
          }else{
              serverResponse(false,mysqli_error($connect));
          }}
elseif($inputData[$TYPE] == 'synchronise'){
              
              //find out if the user id is legit
              $createUser = new loadInfo($db1, '');
              
              $verifyUser = $createUser->select("SELECT * FROM {$tb1} WHERE studID = '{$inputData[ID]}' ");
              if(is_null($verifyUser)){// user id is not valid
                  serverResponse(false, 'Your User ID is invalid. Please Contact the Support Team');
              }else{// user ID is valid. Proceed with getting the serial number associated to the apk ID
              
              $serialNumber = $createUser->select("SELECT sn FROM {$tb4} WHERE apkID = '{$inputData[MATRICULE]}'");
              if(is_null($serialNumber)){// invalid apk id
             serverResponse(false, 'Your Application ID is invalid. Please Contact the Support Team');
              }else{
                  $updateFxn = new Updater($connect);
                    $query = "UPDATE {$tb3} SET studID='{$inputData[ID]}' WHERE sn=?";
                    $type='s';
                    if($updateFxn->updateRow($db1,$query,$serialNumber[0]['sn'],$type)){
              serverResponse(true,"Synchronisation is Complete");
              
          }else{
              serverResponse(false,mysqli_error($connect));
          }
                  
                  
              }
                
                  
              }
              
          }
          else{
    serverResponse(false,"Invalid Type sent");
    
}

//serverResponse(true,$inputData);

?>