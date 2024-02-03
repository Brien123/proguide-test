<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");

require_once "sanitizer.php";
require_once "insert.php";
require_once "model.php";

$sanitizeTxt = new Sanitizer(json_decode(file_get_contents('php://input'), true));
$inputData = $sanitizeTxt->cleanedText;
//exit(json_encode($inputData));

if(strtolower($inputData[$TYPE]) == 'student'){
    $database = $db1;
    $table = $tb1;
    $column = 'studID';
}elseif(strtolower($inputData[$TYPE]) == 'teacher'){
     $database = $db2;
    $table = $tb2;
    $column = 'guideID';
    
}elseif(strtolower($inputData[$TYPE]) == 'parent'){
    
}else{
     serverResponse(false, [
        "message"=>"Invalid Type from submission form",
        "data"=>array(
                     "id"=>null,
                     "type"=>null
                     )
        ]);
    
}

$loader = new loadInfo($database,$table);
    $rows = $loader->select("SELECT * FROM {$table} WHERE email = '{$inputData[$EMAIL]}' ");
    
    if(is_null($rows)){
        serverResponse(false, [
                 "message"=>'Invalid Credentials. Email Not Found!',
                 "data"=>array(
                     "id"=>"dummy",
                      "type"=>"dummy",
                     )
                
                
                 ]);
        
    }else{
        if($inputData[$NAME] == $rows[0]['username']){
            serverResponse(true, [
                 "message"=>'Successful Login',
                 "data"=>array(
                     "id"=>$rows[0][$column],
                      "type"=>strtolower($inputData[$TYPE]),
                     )
                
                
                 ]);
            
            
        }else{
             serverResponse(false, [
                 "message"=>'Wrong Username Entered. Please Retry',
                 "data"=>array(
                     "id"=>null,
                      "type"=>null,
                     )
                
                
                 ]);
            
        }
    }

?>