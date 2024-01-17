<?php
require_once "gateway.php";
require_once "update.php";
require_once "sanitizer.php";
require_once "insert.php";
require_once "model.php";
require_once "load.php";
require_once "utility.php";
//require_once "mail.php";

$createUser = new InsertHandler($connect);
$submitDate = date('Y-m-d H:i:s'); 
//$sanitizeTxt = new Sanitizer();
$inputData =json_decode(file_get_contents('php://input'), true);
$loader = new loadInfo($db3,'');
$loader1 = new loadInfo($db1,'');

//I need to write a function that fetches a quizz for a student
//It should fetch based on subject, topic, and (per school or exam... not yet sure which is best)
//for a start, a user should be able to send a quiz to students. teh main thing need here is the ID of the Preptest
/**
 * Input array should be of the form
 * array(
 * 'id'=>4,
 * 'topic'=>4,
 * 'subject'=>4,
 * 'type'=>'someString'
 * )
 * 
 */
if($inputData['type'] === 'viewPrepTestById'){

    $q1="SELECT * FROM {$tbp} WHERE sn = '{$inputData['id']}'";
   
    $values = $loader->select($q1);
    if(is_null($values)){// no such prep tests found
        serverResponse(false, "Invalid Request for Prep Test");
    }else{
        serverResponse(true, $values[0]);
    }
}elseif($inputData['type'] === 'viewPrepTestByTopic'){
    $q1="SELECT * FROM {$tbp} WHERE topic = '{$inputData['topic']}'";
    
}elseif($inputData['type'] === 'viewPrepTestBySubject'){
    $q1="SELECT * FROM {$tbp} WHERE subject = '{$inputData['subject']}'";
    
}elseif($inputData['type'] === 'saveResult'){
    
    // we are going to first save the data in the appropriate user table
    $q="INSERT INTO {$tba} (testID, studID, report, registerDate) VALUES (?,?,?,?)";
    $type1 = "ssss";
    $params1=[$inputData['quizID'], $inputData['studentID'], json_encode($inputData['detailAnalysis']), $submitDate];

    //check if record already exist 
    if(is_null($loader1->select("SELECT * from {$tba} WHERE testID = '{$inputData['quizID']}' AND studID = '{$inputData['studentID']}' "))){
// if it is null then, this is the first time he takes this test so save it
if($createUser->registerUser($db1, $q, $type1,$params1) == 0){// succesfully inserted test result
    // insert individual student result now. Insert score and total time taken by student.
    
    $totalTime=0;
    foreach ($inputData['detailAnalysis'] as $key => $value) {
        # code...
        $totalTime = $value['timeTaken'] + $totalTime;

    }

    //now insert into the testresult table
    if($createUser->registerUser($db2, "INSERT INTO {$tbr} (testID,studID,score,totaltime) VALUES (?,?,?,?)","sssi", [$inputData['quizID'], $inputData['studentID'],$inputData['mark'],$totalTime])== 0){
        serverResponse(true, 'Succesful Registration of Test Results');
    }else{
        serverResponse(false, 'Update on School List Failed!');

    }
   

   }else{
    serverResponse(false, 'You cannot save the entry twice');
   }
    }else{
        serverResponse(false, 'Seems you are trying to save this test a second time...');
    }
  
    
}else{
    serverResponse(false, "Invalid Request Type base 1");
}


?>