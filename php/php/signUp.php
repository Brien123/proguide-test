<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

require_once "sanitizer.php";
require_once "insert.php";
require_once "model.php";
require_once "mail.php";

$sanitizeTxt = new Sanitizer(json_decode(file_get_contents('php://input'), true));


$inputData = $sanitizeTxt->cleanedText;
//exit(json_encode(file_get_contents('php://input')));

 $entryDate = date("y-m-d H:i:s");// current date and time in Cameroon
//verify user Type

$uniqueKey=strtoupper(substr(sha1(microtime()), rand(0, 5), 10));
$userTypes = array(
    'student'=>array(
        "db"=>$db1,
        "tb"=>$tb1,
        "qry"=>"INSERT INTO {$tb1} (studID,username,email,phone,registerDate) VALUES (?,?,?,?,?)",
        "qryTypes"=>"sssis",
        "column"=>'studID',
        "refQuery"=>"INSERT INTO referral (upline,downline) VALUES (?,?)",
        "refType"=>"ss"
    ),
    'teacher'=>array(
        "db"=>$db2,
        "tb"=>$tb2,
        "qry"=>"INSERT INTO {$tb2} (username,email,rank,status,registerDate) VALUES (?,?,?,?,?)",
        "qryTypes"=>"sssss",
     "column"=>'guideID',
     "refQuery" => "INSERT INTO referral (upline,downline) VALUES (?,?)",
     "refType" => "ss"
        
        ),
    'parent'=>array()
    );
/*if(strtolower($inputData[$TYPE]) == 'student'){
      $parameters = $userTypes['student'];
}elseif($inputData[$TYPE] == 'teacher'){
   $parameters = $userTypes['teacher'];
}elseif($inputData[$TYPE] == 'parent'){
   return 'parent';*/
    
if(array_key_exists($inputData[$TYPE], $userTypes)){
    $selectType = $inputData[$TYPE];
}else{
    serverResponse(false, [
        "message"=>"Invalid Type from submission form",
        "data"=>array(
                     "id"=>null,
                     "type"=>null
                     )
        ]);
}


 $refParam = function($id,$ref){
         return [$ref,$id];
     } ;
$createUser = new InsertHandler($connect); // iNserter object

$loader = new loadInfo($userTypes[$selectType]['db'],$userTypes[$selectType]['tb']); // create loader for the particular db and table
    $checkEmail = is_null($loader->select("SELECT * FROM {$userTypes[$selectType]['tb']} WHERE email = '{$inputData[$EMAIL]}' ")); //verifies if email exists
 

    if($checkEmail){// if true, email doesn't exist yet hence proceed with addition
    $id="stud".$uniqueKey;
    if($selectType == 'teacher'){
        $rank='tutor';
        $status="inactive";
        $param = [$inputData[$NAME],$inputData[$EMAIL],$rank,$status,$entryDate];
        $returnType = $createUser->registerUser($userTypes[$selectType]['db'],$userTypes[$selectType]['qry'],$userTypes[$selectType]['qryTypes'],$param);
        if($returnType !== 0){
            $check = true;
        }else{
            $check = false;
        }
        
    }elseif($selectType == 'student'){
        $param = [$id,$inputData[$NAME],$inputData[$EMAIL],$inputData[$NUMBER],$entryDate];
        $returnType = $createUser->registerUser($userTypes[$selectType]['db'],$userTypes[$selectType]['qry'],$userTypes[$selectType]['qryTypes'],$param);
         if($returnType == 0){
            $check = true;
        }else{
            $check = false;
        }
    }
      
        if($check){// added record
             $insertedID=$loader->select("SELECT {$userTypes[$selectType]['column']} FROM {$userTypes[$selectType]['tb']} WHERE email = '{$inputData[$EMAIL]}' "); // now give me the id of the newly inserted user
               //check if referral available and add.
        if(!is_null($inputData[$REFERRAL]) && !empty($inputData[$REFERRAL])){
            //verify if upline id is valid
            $rows = is_null($loader->select("SELECT * FROM {$userTypes[$selectType]['tb']} WHERE {$userTypes[$selectType]['column']} = '{$inputData[$REFERRAL]}' "));
            if(!$rows){// if column exist for referral ID
            $returnedVal = $createUser->registerUser($userTypes[$selectType]['db'],$userTypes[$selectType]['refQuery'],$userTypes[$selectType]['refType'],$refParam($insertedID[0][$userTypes[$selectType]['column']],$inputData[$REFERRAL]));// since ref ID is valid Insert it in ref table
            if($returnedVal){// upon successfull insertion leave u quietly
           // $activationMail('Successfully Account Creation','mbenguvis0@gmail.com','ProGuide',$inputData[$EMAIL],'',"Welcome, You're Officially Onboard!","We are so happy to have you joining the most impressive and engaging community of learners with Personal Assistants. Let's Explore together",'www.studentproguide.site/dashboard','See Products and Fun Services');
                serverResponse(true, [
                 "message"=>'New User and Referral Added',
                 "data"=>array(
                     "id"=>$insertedID[0][$userTypes[$selectType]['column']],
                     "type"=>$inputData[$TYPE]
                     )
                 ]);
            }else{//if a problem occurs log them in but notify Juvis
                //$activationMail('Hey we got a problem','mbenguvis0@gmail.com','ProGuide','mbenguvis0@gmail.com','',"New user added for {$insertedID[0][$userTypes[$selectType]['column']]} but referrer though valid wasn't","This is problematic check it out. The referrer is {$inputData[$REFERRAL]}",'https://ap.www.namecheap.com/','Check it Now');
                serverResponse(true, [
                 "message"=>'New User added but Referral failed',
                 "data"=>array(
                     "id"=>$insertedID[0][$userTypes[$selectType]['column']],
                     "type"=>$inputData[$TYPE]
                     )
                 ]);
                
            }
            }else{// invalid refferal ID but still log them in
           // $activationMail('Successfully Account Creation','mbenguvis0@gmail.com','ProGuide',$inputData[$EMAIL],'',"Welcome, You're Officially Onboard!","We are so happy to have you join the most impressive and engaging community of learners with Personal Assistants. Let's Explore together",'www.studentproguide.site/dashboard','See Products and Fun Services');
                serverResponse(true, [
                 "message"=>' Referral ID not valid',
                 "data"=>array(
                     "id"=>$insertedID[0][$userTypes[$selectType]['column']],
                     "type"=>$inputData[$TYPE]
                     )
                 ]);
            }
            
        }else{//no referral ID found
           // $activationMail('Successfully Account Creation','mbenguvis0@gmail.com','ProGuide',$inputData[$EMAIL],'',"Welcome, You're Officially Onboard!","We are so happy to have you joining the most impressive and engaging community of learners with Personal Assistants. Let's Explore together",'www.studentproguide.site/dashboard','See Products and Fun Services');
         serverResponse(true, [
                 "message"=>'User Successfully Added with no Referral ID',
                 "data"=>array(
                     "id"=>$insertedID[0][$userTypes[$selectType]['column']],
                     "type"=>$inputData[$TYPE]
                     )
                 ]);
        }
        }else{
             serverResponse(false, [
                 "message"=>'Failed to Insert User Record',
                 "data"=>array(
                     "id"=>null,
                      "type"=>$returnType,
                     )]);
        }
       
    }else{
        serverResponse(false, [
                 "message"=>'Email Already Exist',
                 "data"=>array(
                     "id"=>"dummy",
                      "type"=>$checkEmail,
                     )]);
    }


?>