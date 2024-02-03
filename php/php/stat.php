<?php

require_once "gateway.php";
require_once "update.php";
require_once "sanitizer.php";
require_once "insert.php";
require_once "model.php";
require_once "load.php";

$createUser = new InsertHandler($connect);


$sanitizeTxt = new Sanitizer(json_decode(file_get_contents('php://input'), true));
$inputData = $sanitizeTxt->cleanedText;

function generalStats(){
    
}

if($inputData[$TYPE] == 'student'){
    function extractRefBonus($val){
        $intEquivalent = (int)$val;
    $whole = floor($intEquivalent/1000);
    $dif = $intEquivalent - ($whole*1000);
    if($dif <= 500 && $dif != 0){
        return 75;
    }elseif($dif == 0){
        return 150;
    }else{
        return 0;
    }
    }
    $loader = new loadInfo($db1,'');
    $qry1 = "SELECT username,email,phone FROM {$tb1} WHERE studID = '{$inputData[ID]}' ";
    $qry2 = "SELECT {$tb5}.amount FROM (({$tb6} INNER JOIN {$tb4}  ON {$tb6}.apkID={$tb4}.apkID AND {$tb4}.transacID IS NOT NULL) INNER JOIN {$tb5} ON {$tb4}.transacID={$tb5}.transacID) WHERE {$tb5}.status = 'SUCCESSFUL' AND {$tb6}.studID='{$inputData[ID]}' ";
    $qry3 = "SELECT balance FROM {$tb7} WHERE studID = '{$inputData[ID]}' ";
    
$userinfo = $loader->select($qry1);
$refBonus = $loader->select($qry2);
$balance = $loader->select($qry3);

if(is_null($userinfo)){
    serverResponse(false,"Invalid User Id");
}else{
     //is_null($refBonus)?$bonus = 0:$bonus = count($refBonus);
     if(is_null($refBonus)){
         $bonus=0;
     }else{
         $bonus = array_sum(array_map('extractRefBonus',$refBonus));
     }
     is_null($balance)?$bal = 0:$bal = $balance[0]['balanace'];
     
     serverResponse(true,[
         'user'=>$userinfo[0],
         'position'=>'n/a',
         'balance'=>$bal,
         'bonus'=>$bonus
         
         ]);
}
    
}elseif($inputData[$TYPE] == 'admin'){
       $database = $db1;
    $table1 = $tb4;
    $table2 = $tb1;
    $preLoad = new loadInfo($database, '');
     $loader = new loadInfo($database, $table1);//transcript data
    $loader1 = new loadInfo($database, $table2);//userdata
    
    $validAdmin = $preLoad->select("SELECT * FROM {$tb8} WHERE studID='{$inputData[ID]}' ");
    $query = "SELECT SUM(amount) FROM {$tb5} WHERE status = 'SUCCESSFUL'";
    $rev = $preLoad->select($query);
    
    is_null($loader->getAllProducts())?$total_trancripts = 0:$total_trancripts = count($loader->getAllProducts());
   
     is_null($loader1->getAllProducts())?$total_users = 0:$total_users = count($loader1->getAllProducts());
     $q="SELECT {$tb4}.mode,{$tb4}.submitDate,{$tb4}.apkID, {$tb4}.status,{$tb3}.matricule,{$tb3}.department,{$tb3}.level,{$tb3}.phone,{$tb3}.name, {$tb5}.Status,{$tb5}.Amount FROM (({$tb3} INNER JOIN {$tb4} ON {$tb4}.sn = {$tb3}.sn AND {$tb4}.transacID IS NOT NULL) INNER JOIN {$tb5} ON {$tb4}.transacID = {$tb5}.transacID) ORDER BY {$tb4}.submitDate DESC ";
     $q2="SELECT {$tb4}.mode,{$tb4}.submitDate,{$tb4}.apkID, {$tb4}.status,{$tb3}.matricule,{$tb3}.department,{$tb3}.level,{$tb3}.phone,{$tb3}.name FROM ({$tb3} INNER JOIN {$tb4} ON {$tb4}.sn = {$tb3}.sn ) WHERE {$tb4}.transacID IS NULL ORDER BY {$tb4}.submitDate DESC ";
   
    $values  = $preLoad->select($q);
    is_null($values)?$val = array():$val = $values;
    $unpaid = $preLoad->select($q2);
    is_null($unpaid)?$valpay = array():$valpay = $unpaid;
    
    if(is_null($validAdmin)){
        serverResponse(false,"You Do not have Admin Priveleges");
    }else{
        serverResponse(true,[
         'users'=>$total_users,
         'applicants'=>$total_trancripts,
         'revenue'=>$rev[0]['SUM(amount)'],
         'applications'=>$val,
         'unpaid'=>$valpay
         ]);
    }
     
    
   
    
    
    }elseif($inputData[$TYPE] == 'tutor'){
        $database = $db2;
        $table = $tb2;
    
}elseif($inputData[$TYPE] == 'parent'){
        $database = $db3;
    
}elseif($inputData[$TYPE] == 'general'){
   
    $database = $db1;
    $table = $tb4;
    
}elseif($inputData[$TYPE] == 'user'){
   
    $database = $db1;
    $table1 = $tb4;
    $table2 = $tb1;
    
    $loader = new loadInfo($db1, $tb4);
$data = $loader->getAllProducts();

if(is_null($data)){
    $count = 0;
}else{
    $count=count($data);
}

    if($inputData[$NAME] == 'userID'){
        $selectTable = $tb3.'.studID';
    }else{
        $selectTable = $tb4.'.apkID';
    }
    
    $loader = new loadInfo($database, $table1);//transcript data
    $loader1 = new loadInfo($database, $table2);//userdata
 
    $q="SELECT {$tb4}.mode,{$tb4}.apkID, {$tb4}.status,{$tb3}.matricule, {$tb5}.Status,{$tb5}.Amount FROM (({$tb3} INNER JOIN {$tb4} ON {$tb4}.sn = {$tb3}.sn ) INNER JOIN {$tb5} ON {$tb4}.transacID = {$tb5}.transacID) WHERE $selectTable='{$inputData[MATRICULE]}'";
    $values  = $loader->select($q);
     
    if(is_null($values)){
    serverResponse(false,[
        'total'=>$count,
        'user'=>'not found'
        ]);
}else{
     serverResponse(true,[
         'total'=>$count,
         'user'=>$values
         ]);
}
    
}else{
     serverResponse(false,"Info not accessible please login");
}



?>