<?php


require_once "model.php";
require_once "gateway.php";
require_once "callback.php";

//$inputData = json_decode(file_get_contents('php://input'), true);

//serverResponse(true,[$_GET['amount'],$_GET['phone']]);

	
	if(isset($_GET['amount']) || isset($_GET['phone'])){
	    $amt=$_GET['amount'];
	    $phone=$_GET['phone'];
	       $pay=new paymentHandler('RgasjNxPuBMMER5meiIrsd2yHiGrAcpxG9Qq4geybgxMKWvsxheE9NL-QY1lj6PIPdvIUVF9JTkEYXydlkpVnQ','hJczxWyv643fd2mD0VVWdnFVdW8ZMl4Btg2sD-BDjfZCK5r2wAA0LkiMoHqR1xRwLrab0qu31PtOxSSwvUCe4Q');
   $link=$pay->generateLink($amt,$phone,"https://www.studentproguide.site/php/payment.php");
 // var_dump($link['link']);
 //header("Location:{$link['link']}");
 if(isset($_GET['direct'])){
     header("Location:{$link['link']}");
 }else{
     serverResponse(true, [$link['link'],$_GET['apk']]);
 }
 
	    
	}else{
	    echo "Sorry Payment Could Not Be Effectuated.Contact Admin.<br>";
	    echo "<a href='../transcript.php'> Click To Return To Transcript Page </a>";
	}
	
 
	


  


 
?>



 
 	