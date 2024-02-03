<?php
require_once "gateway.php";
require_once "update.php";
require_once "sanitizer.php";
require_once "insert.php";
require_once "model.php";
require_once "load.php";
require_once "utility.php";
require_once "update.php";

$createUser = new InsertHandler($connect);
$updater = new Updater($connect);

//$sanitizeTxt = new Sanitizer(json_decode(file_get_contents('php://input'), true));
$inputData = json_decode(file_get_contents('php://input'), true);
$loader = new loadInfo($db3,'');
if($inputData[$TYPE] == 'saveChat'){

     $q="SELECT * FROM {$tb14} WHERE roomID='{$inputData['roomID']}' ";

     if(is_null($loader->select($q))){
          serverResponse(false,$inputData['roomID']);
     }else{
          $q =" UPDATE {$tb14} SET messages = '{$inputData['chat']}' WHERE roomID = ? ";
          if($createUser->selectDb($db3)){
               $stmt = mysqli_prepare($connect,$q);
                            mysqli_stmt_bind_param($stmt,'s',$inputData['roomID']);
                                if(mysqli_stmt_execute($stmt)){  
                                      //return true;

                                      //Now we're going to write code to see Unread Messages. We'll check just he last 3
                                      // messages and see if we have thesame sender atleast twice. If so then there is a possibility
                                      // of the receiver having unread messages

                                    
                                      if($inputData['chat'] !== '' && !empty($inputData['chat'])){
                                    $ids = array(); $toBeInformed;
                                        $chats = json_decode($inputData['chat'], true);
                                        $length = count($chats);
                                        for($i = $length-1; $i>=$length-3; $i--){
                                        
                                             array_push($ids,$chats[$i]['sender']);

                                        }
                                      }
                                      foreach (array_count_values($ids) as $item => $count) {
                                        if($count<=1){
                                             $toBeInformed = $item;
                                             //write code to notify the other of unread messages
                                        }


                                    }
                                    if(substr(trim($toBeInformed), 0, 4) == 'stud'){
                                        //person to be informed is a student
                                        $db = $db1;
                                        $tb=$tb1;
                                        $col='studID';
                                    }else{
                                        $db=$db2;
                                        $tb=$tb2;
                                        $col='guideID';


                                    }
                                    $load = new loadInfo($db,'');
                                    $q =" SELECT email FROM {$tb} WHERE {$col} = '{$toBeInformed}' ";
                                    $contactDetail = $load->select($q);
                                    if(!is_null($contactDetail)){
                                             //send him an email
                                    }
                                    
                                    serverResponse(true, 'saved chats');
                                     
                                                }else{
                                //return false;
                                     //echo "<script> console.log('Update Failed'); </script>" ;
                    die(mysqli_error($this->connect));
                            }
          
      }
         

     }
    serverResponse(true, $inputData['chat']);
    

     
   
    
     
     
    
}elseif($inputData[$TYPE] == 'viewCourse'){
    
   

     
    
    
    
}if($inputData[$TYPE] == 'initialFetch'){// return popular courses
    

}else{
     serverResponse(false,"Invalid Type sent");
}

?>