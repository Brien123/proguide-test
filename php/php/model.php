<?php
 $db1="crypzlhr_proguide2.0db";
 $db3="crypzlhr_materialsdb";
 $db2="crypzlhr_proguidetutordb";
$username='crypzlhr_proguide2user';//server
$pass='Proguide2.0@';

$connect=mysqli_connect('localhost',$username,$pass);

 
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
  $tb14='inquiries';
  $tb15='cansolve';
  $tb16='studentmaterials';
    $tb17='views';
    $tb18='plans';
      $tbv="verifier";
  $tbp="preptests";
  $tbr='testresult';
 $tba='assignReport';
 
 $NAME='name';
 $PASSWORD='pass';
 $EMAIL='email';
 $NUMBER='number';
 $TYPE='type';
 $REFERRAL='referral';
 
 define('MATRICULE','matnum');
define('ID','id');
define('LEVEL','lvl');
define('MODE','mode');
define('DEPT','dept');
define('PHONE','phone');
define('FAST',3000);
define('SFAST',4000);
define('NORM',1500);

 function serverResponse($result,$msg){
     $response = array(
                "success"=>$result,
                "data"=>$msg
                );
                exit(json_encode($response));
 }
  function validate_input_text($text){
 	$trim_text=trim($text);
 	$sanitize_text=filter_var($trim_text,FILTER_SANITIZE_STRING);
 	return $sanitize_text;
 }
date_default_timezone_set('Africa/Douala');
if(mysqli_connect_errno())
{
		echo 'Failed to connect'.mysqli_connect_errno();
}

?>