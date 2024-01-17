<?php
require_once 'gateway.php';
require_once 'sanitizer.php';
require_once 'model.php';
require_once 'load.php';
require_once 'insert.php';

//$check = new Sanitizer(
$inputData = json_decode(file_get_contents('php://input'), true);

$loader= new loadInfo($db1,'');
$inserter= new InsertHandler($connect);

if($inputData['type'] == 'initialFetch'){ 
$loader= new loadInfo($db3,'');

    $q1 = "SELECT * FROM {$tb12}";
    $institutes = $loader->select($q1);
    if(is_null($institutes)){
        serverResponse(false,'No Universitiies Added Yet'.json_encode($inputData));
    }else{
        serverResponse(true,$institutes);
    }
}elseif($inputData['type'] == 'fetchDepts'){
   
    $q ="SELECT DISTINCT {$tb10}.department FROM {$tb11} INNER JOIN {$tb10} ON {$tb11}.qID = {$tb10}.qID AND {$tb11}.sID='{$inputData['schoolID']}' ";
$loader= new loadInfo($db3,'');
    
    $dept=$loader->select($q);
    if(is_null($dept)){
       
        serverResponse(false,'No Department Available');
    }else{
        serverResponse(true,$dept);
    }
}

?>