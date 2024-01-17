<?php
session_start();
require_once "gateway.php";
require_once "update.php";
require_once "sanitizer.php";
require_once "insert.php";
require_once "model.php";
require_once "load.php";
require_once "mail.php";



//serverResponse(true, $_SESSION['test']);


$createUser = new InsertHandler($connect);
$updaterFxn = new Updater($connect);
 $jarvis = new loadInfo($db1,'');
$submitdate=date("Y-m-d");
//the top Up Page begins by first ensuring checking whether the user coins are sufficient to make a payment. If they are just pay and return to page that requested. 

// if funds are insufficient, prompt user to top up his account by nagivigating to interpay and endeavor to set up the user id in session variable and initiator so as to navigate back here
if(isset($_GET['userID']) && isset($_GET['pay']) && isset($_GET['module']) ){
    $pay=$_GET['pay'];
    $uID = $_GET['userID'];
   
    $data = $jarvis->select("SELECT balance FROM {$tb7} WHERE studID='{$uID}'");
    if(!is_null($data)){// if user coins row exists
        if($data[0]['balance'] >= $pay){//user balance is greater or equal to payment amount so proceed with payment
            
            $difference = $data[0]['balance'] - $pay; 
            if($difference < 0){
                $difference = 0;
            } 
         
        // select plan which corresponds to payment
        $qplan = " SELECT planID FROM {$tb18} WHERE price = '{$pay}'";
        if(!is_null($qplan)){
            $planID = $qplan[0]['planID'];
            if($_GET['module'] == 'qs'){// is qs module send $_GET['material'] too
                 $q1="UPDATE {$tb16} SET status='paid', planID={$planID} WHERE studID=? AND materialID='{$_GET['material']}' ";
                   $q2="UPDATE {$tb7} SET balance='{$difference}' WHERE studID=?";
            }
           
        }
                
                   if($updaterFxn->updateRow($db1,$q2,$uID,'s')){// user balance deducted
                      if($updaterFxn->updateRow($db1,$q1,$uID,'s')){ // set question status to paid 
                       header("Location: https://www.studentproguide.site/test");
                          
                      }else{
                          header("Location: https://www.studentproguide.site/status?false=true");
                      }
                       
                   }
                   
         
              
            
            
        }else{
            // funds are insufficient just top Up difference
            $amtToPay = $pay - $data[0]['balance'];
            $_SESSION['userID'] = $uID;
            $_SESSION['initiator'] = 'topup';
            
            if(isset($_SESSION['initiator'])){
                header("Location: https://www.studentproguide.site/php/interpay.php?direct=yes&amount={$amtToPay}&phone=1234");
            }
            
        }
    }else{// usercoin row does not exist! Just go and make payment then create row
    $initBalance = 0;
    $qInsertCoin ="INSERT INTO {$tb7} (studID, balance) VALUES (?,?)";
    $param=[$uID, $initBalance];
     if($createUser->registerUser($db1,$qInsertCoin,'si',$param)){
         $_SESSION['userID'] = $uID;
      $_SESSION['initiator'] = 'topup';
            if(isset($_SESSION['initiator'])){
                header("Location: https://www.studentproguide.site/php/interpay.php?direct=yes&amount={$pay}&phone=1234");
            }
    }else{
        serverResponse(false, 'Error Occured While inserting user account');
    }
        
    }
    
}elseif(isset($_GET['stat']) && isset($_GET['transID'])){
     $data = $jarvis->select("SELECT balance FROM {$tb7} WHERE studID='{$_SESSION['userID']}'");
     if(!is_null($data)){
         // get the current value and add the added amount to it
         $newBalance = $data[0]['balance'] + (int)$_GET['amt'];
         $qU="UPDATE {$tb7} SET balance='{$newBalance}' WHERE studID=?";
         if($updaterFxn->updateRow($db1,$qU,$_SESSION['userID'],'s')){
             header("Location: https://www.studentproguide.site/status?stat=true&topUp={$_GET['amt']}");
         }else{
             serverResponse(false, "Could not Update your balance user:  {$_SESSION['userID']}");
         }
         
     }else{
         //
          $initBalance = (int)$_GET['amt'];
    $qInsertCoin ="INSERT INTO {$tb7} (studID, balance) VALUES (?,?)";
    $param=[$uID, $initBalance];
    if($createUser->registerUser($db1,$qInsertCoin,'si',$param)){
        header("Location: https://www.studentproguide.site/status?stat=true&topUp={$_GET['amt']}");
     }else{
         serverResponse(false, "User Id still not created {$_SESSION['userID']}");
     }
    
    
}
    
}

?>