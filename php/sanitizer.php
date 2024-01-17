<?php
require_once "model.php";

class Sanitizer{
   
    public $cleanedText;
    
    function __construct($values){
     	 //$this->dataInput =json_decode($values,true); //decodes the JSON Entry containing Field names and Values
 		 $this->cleanedText = array_map(array($this,'toConvertAndSanitize') ,$values);
 		 
 	}
	public  function toConvertAndSanitize($key){ 
    $trim_text=trim($key);
    if (filter_var($trim_text,FILTER_VALIDATE_EMAIL)) {
      $sanitize_text=filter_var($trim_text,FILTER_SANITIZE_EMAIL);
      return $sanitize_text;
  }elseif(is_bool($trim_text)){
    $sanitize_text =$trim_text ;
    return $sanitize_text;
  }else{
    $sanitize_text=preg_replace('//','',  filter_var($trim_text,FILTER_SANITIZE_STRING));
    return $sanitize_text;
  }
    
  }


			
			
		}
//	function __destruct(){
	 //   return $this->cleanedText;
//	}
		//Sanitizer function still has qualms handling boolean inputs. It returns "1" when bool is true and an empty string when false.
		


?>