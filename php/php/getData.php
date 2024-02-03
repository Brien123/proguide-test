<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
$data = json_decode(file_get_contents('php://input'), true);



if(is_array($data)){
       exit(json_encode($data)); 
}else{
    $answer = 'failed';
   exit(json_encode($answer));
}

?>