<?php
session_start();
require_once "load.php";
require_once "insert.php";
require_once 'model.php';
require_once 'mail.php';


if(isset($_GET['reference'])){
    
$payer= new InsertHandler($connect);
$loader= new loadInfo($db1,'');
    
	$query_str = $_SERVER['QUERY_STRING'];
		parse_str($query_str,$query_param);
		
		$stat=validate_input_text($query_param['status']);
		$ref=validate_input_text($query_param['reference']);
		$amt=validate_input_text($query_param['amount']);
		$appAmt=validate_input_text($query_param['app_amount']);
		
 	function InformCustomerService($email,$name,$number,$mode,$special,$text){
    global $activationMail;
    if($special == 1){
        $set = 'true';
    }else{
        $set = 'false';
    }
    $customer_service = ['javeaaita10@gmail.com'];
       
          
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
                  $activationMail("New Transcript Application",$sentFrom='proguidepro2.0@gmail.com',$senderName='ProGuide',$email,'',"A payment was cashed In",$text.$table,"www.studentproguide.site/admin","View Details");
          
          
      }
 
   if(isset($_SESSION['UserID'])){
         $id=$_SESSION['UserID'];
   }else{
       $id=NULL;
   }//change to session id
   //$db1,"INSERT INTO transactions (UserID, Stat, Reference, Amount, Operator, date) VALUES (?,?,?,?,?,?) ",$stat,$ref,$amt,$operator,$id)
     $database = $db1;
    $table = $tb5;
    $qry = "INSERT INTO {$table} (studID,amount,hashCode,type,status,datetime) VALUES (?,?,?,?,?,?)";
     $type="sissss";
     $stud=NULL;
     $submitdate=date("Y-m-d H:i:s");
     $reqType = 'deposit';
      $param = [$stud,$appAmt,$ref,$reqType,$stat,$submitdate];
$loader = new loadInfo($db1,'');
$verifyHashCode = $loader->select("SELECT * FROM {$tb5} WHERE hashCode = '{$ref}'");
if(is_null($verifyHashCode)){
    $tID=$payer->registerUser($database,$qry,$type,$param);
  
}else{
    $t = $loader->select("SELECT transacID FROM {$tb5} WHERE hashCode = '{$ref}'");
    $tID=$t[0]['transacID'];

}
      
       if($stat == 'SUCCESSFUL'){
           
           // inform cs of paymenet 
           InformCustomerService('javeaaita10@gmail.com','','','','','');
           
           
          // serverResponse(true,array($_SESSION));
           if(isset($_SESSION['initiator']) && $_SESSION['initiator'] == 'topup'){
               // update the usercoins table then destroy the $_SESSION['initiator']
               header("Location: https://www.studentproguide.site/php/topup.php?stat=true&transID={$tID}&amt={$appAmt}");
           }else{
               header("Location: https://www.studentproguide.site/status?stat=true&transID={$tID}");
           }
    
  
}else{
header("Location: https://www.studentproguide.site/status?stat=false&transID={$tID}");
}   

 

 //on transcript page check if a record exists to confirm
}

?>




