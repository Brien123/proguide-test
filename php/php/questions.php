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
$updaterFxn = new Updater($connect);

$sanitizeTxt = new Sanitizer(json_decode(file_get_contents('php://input'), true));
$submitdate=date("Y-m-d H:i:s");
$inputData = $sanitizeTxt->cleanedText;
$loader = new loadInfo($db3,'');
$loaderDB1 = new loadInfo($db1,'');
 function checkAvailableSolution($matArray){
          global $loader,$tb13;
          $q="SELECT materialID FROM {$tb13} WHERE qID='{$matArray['qID']}' ";
          $val=$loader->select($q);
          if(is_null($val)){
               $matArray['solID']=null;
          }else{
               $matArray['solID']=$val[0]['materialID'];
          }
          return $matArray;
     }
     
     function selectAttachmentsForQuestions($arr){
         global $loader,$tb10,$tb9;
         $q = "SELECT {$tb9}.verified, qcode, qtitle, qtype, year, qID FROM {$tb10},{$tb9} WHERE {$tb10}.qID = '{$arr['qID']}' AND {$tb9}.materialID = {$tb10}.materialID ";
         $val = $loader->select($q);
         return $val;
     }
if($inputData[$TYPE] == 'fetchAllCourses'){
     //here I have to fetch courses based on the user school and level(for k12) or department (UG)
     
     $sName = $inputData['sch'];
     $qLvl = $inputData['lvl'];
     $qDept = $inputData['dept'];
     /*
     $tb1="students";
 $tb2="guides";
 $tb3="transcriptInfo";
 $tb4="transcriptApk";
 $tb5="transactions";
  $tb6="transcriptReferral";
  $tb7="account";
  $tb8='admin';
  $tb9='materials';
  $tb10='questions';
  $tb11='belongsTo';
  $tb12='institution';
  $tb13='solution';
     */
     if($qLvl == ''){//requested for a university level course, Filter by Departments. qLevel ='UG' might be unneccessary
         $query = "SELECT  {$tb9}.verified, {$tb10}.qcode, {$tb10}.qtitle, {$tb10}.qtype, {$tb10}.year,{$tb10}.qID
         FROM 
         {$tb12} 
         INNER JOIN 
         {$tb11} ON {$tb12}.sID = {$tb11}.sID AND {$tb12}.sID = '{$sName}' 
         INNER JOIN 
         {$tb10} ON {$tb10}.qID = {$tb11}.qID AND {$tb10}.qlevel = 'UG' AND {$tb10}.department = '{$qDept}' 
         INNER JOIN 
         {$tb9} ON {$tb9}.materialID = {$tb10}.materialID ";
     }else{//department is not needed then so filter by k12 level: O or A
          $query = "SELECT  {$tb9}.verified, {$tb10}.qcode,  {$tb10}.qtitle, {$tb10}.qtype, {$tb10}.year,{$tb10}.qID
         FROM 
         {$tb12} 
         INNER JOIN 
         {$tb11} ON {$tb12}.sID = {$tb11}.sID AND {$tb12}.level = '{$qLvl}' 
         INNER JOIN 
         {$tb10} ON {$tb10}.qID = {$tb11}.qID AND {$tb10}.qlevel = '{$qLvl}'
         INNER JOIN 
         {$tb9} ON  {$tb9}.materialID = {$tb10}.materialID  ";
     }
     $courses = $loader->select($query);
    
     if(is_null($courses)){
          serverResponse(true,'No Questions Found');
     }else{
          serverResponse(true,array_map('checkAvailableSolution', $courses));
     }
    
     
     
    
}elseif($inputData[$TYPE] == 'viewCourse'){
     // first we check if a solution is available
      $q="SELECT filename FROM {$tb9} INNER JOIN  {$tb10} ON {$tb9}.materialID = {$tb10}.materialID AND {$tb10}.qID = '{$inputData['qID']}'  ";
          $questionFileName=$loader->select($q);
          if(is_null($questionFileName)){
               serverResponse(false,'WRONG QUESTION ID');
          }else{
               //extract questions in image format
               $directory='../Question/';
               $link2file="../uploads/";
               $images = pdftoimage2($link2file.$questionFileName[0]['filename'],extractfilename($questionFileName[0]['filename']),$directory);}
     if($inputData['solID'] == 'null'){//no solution
          //get just questions filename
         
               serverResponse(true,array('questions'=>array('files'=>$images), 'solutions'=>'No Solution for this course'));
          }else{
               //solution is present and should be fetched
               $q="SELECT filename FROM {$tb9} WHERE materialID = '{$inputData['solID']}'  ";
               $solutionFilename=$loader->select($q);
                 if(is_null($solutionFilename)){
               serverResponse(false,'WRONG SOLUTION ID');
          }else{
               //extract solutions in image format
               //we will equally get the tutors
               $qTutor = " SELECT guideID FROM {$tb15} WHERE qID = '{$inputData['qID']}' ";
               if(is_null($loader->select($qTutor))){
                   $tutors = " No Tutor Found";
               }else{
                   $tutors = $loader->select($qTutor);
               }
               $directory='../Solution/';
               $link2file="../uploads/";
               $Solimages = pdftoimage2($link2file.$solutionFilename[0]['filename'],extractfilename($solutionFilename[0]['filename']),$directory);}
               serverResponse(true,array('questions'=>array('files'=>$images), 'solutions'=>array('directory'=>$tutors,'files'=>$Solimages)));
          }
        
}elseif($inputData[$TYPE] == 'initialFetch'){
     serverResponse(true,'show popular courses');

}elseif($inputData[$TYPE] == 'clientFetch'){
    // return popular courses or user visited courses if available

// check for user visited courses
$q1="SELECT materialID as qID FROM {$tb16} WHERE studentID ='{$inputData['userID']}' AND type='question'";
$values = $loaderDB1->select($q1);
//serverResponse(true,$values);
if(is_null($values)){ // user hasn't used or bought any courses. So Show the Popular Courses
$popular_courses = $loader->select("SELECT qID FROM {$tb17} WHERE count IN (SELECT count FROM {$tb17} WHERE count >= 4) ");
if(is_null($popular_courses)){// no one has accessed any course yet or the mechanism is not triggered
serverResponse(true,'No courses to Display');
}else{// there are popular courses

$attachments=array_map('selectAttachmentsForQuestions',$popular_courses);

if(is_null($attachments)){
    serverResponse(false, 'Error With Question IdS');
}else{
    //serverResponse(true,array_map('checkAvailableSolution',$attachments));
    $toSend = array();
    foreach($attachments as $key => $values){
        foreach($values as $k=>$v){
        array_push($toSend, checkAvailableSolution($v));
        }
        //
       
          
    }
    serverResponse(true, $toSend);// popular courses listing in same format for display
}
    
}
    
}else{ // user has visited some courses or bought others. Show him those.

    $attached=array_map('selectAttachmentsForQuestions',$values);

if(is_null($attached)){
    serverResponse(false, 'Error With Question IdS');
}else{
    //serverResponse(true,array_map('checkAvailableSolution',$attachments));
    //serverResponse(false, 'came here');
    $toSend = array();
    foreach($attached as $key => $values){
        foreach($values as $k=>$v){
        array_push($toSend, checkAvailableSolution($v));
        }
        //
       
          
    }
    serverResponse(true, $toSend);// popular courses listing in same format for display
}
}
}elseif($inputData[$TYPE] == 'recordView'){
    // count the number of view
    $q1="INSERT INTO {$tb17} (count, lastView, qID) VALUES (?,?,?)";
    $q2="INSERT INTO {$tb16} (studentID, materialID, type, planID, activationDate, status) VALUES (?,?,?,?,?,?)";
    $nor = $loader->select("SELECT count FROM {$tb17} WHERE qID = '{$inputData['question']}' ");
     $type="question";
    $plan=1;//free plan
    $stat='paid';
    $param1=[$inputData['userID'],$inputData['question'],$type,$plan,$submitdate,$stat];
    
     $createUser->registerUser($db1,$q2,'sssiss',$param1);// register in student materials
        
   
    
    if(is_null($nor)){// if no previous record for course being viewed exists
    $cnt =1;
    $param=[$cnt,$submitdate,$inputData['question']];
    if($createUser->registerUser($db3,$q1,'iss',$param)){
        serverResponse(true, 'View Recorded');
    }else{
        serverResponse(false, 'Error Occured While Recording View');
    }
        
    }else{// if course has been viewed before just increment the count and update the lastView
    $currentCount = $nor[0]['count'] + 1;
    $updateQuery = "UPDATE {$tb17} SET count = {$currentCount}, lastView='{$submitdate}' WHERE qID = ? ";
    if($updaterFxn->updateRow($db3,$updateQuery,$inputData['question'],'s')){
        serverResponse(true,'Views Updated');
    }else{
          serverResponse(false,'Views could NOt be Updated');
    }
        
    }
    

   
   
    
    
   // serverResponse(true, $inputData);
}elseif($inputData[$TYPE] == 'checkStatus'){
        // Check Payment Status
    $q4= "SELECT planID, materialID, type FROM {$tb16} WHERE studentID = '{$inputData['userID']}' ";
    $userPlan = $loaderDB1->select($q4);
    if(is_null($userPlan)){
        serverResponse(false,array('sols'=>false, 'reason'=>'Something is fundamentally wrong somewhere') );
    }else{
        if($userPlan[0]['planID'] == 1){//user if on free mode
            serverResponse(true, array('sols'=>false, 'reason'=>'free mode'));
        }elseif($userPlan[0]['planID'] > 1){
            if($inputData['question'] == $userPlan[0]['materialID'] && $userPlan[0]['type']  == 'question'){// user has access to this particular solution
            serverResponse(true, array('sols'=>true, 'reason'=>'paid mode')); // user is on paid mode
                
            }else{
                serverResponse(true, array('sols'=>false, 'reason'=>'not paid for this particular solution')); // user is not on paid mode for this question
            }
            
        }else{
            serverResponse(false, array('sols'=>false, 'reason'=>'Some unknown error'));
        }
    }
}else{
     serverResponse(false,"Invalid Type sent");
}

?>