<?php

require_once "model.php";
require_once "insert.php";

class Updater extends InsertHandler {  
    public function updateRow($dbName,$query,$id,$type){
	    if($this->selectDb($dbName)){
	        	$stmt = mysqli_prepare($this->connecter,$query);
                          	mysqli_stmt_bind_param($stmt,$type,$id);

							if(mysqli_stmt_execute($stmt)){ 
								 return true;
										 }else{
		 				    return false;
		 				    	echo "<script> console.log('Update Failed'); </script>" ;
   				die(mysqli_error($this->connecter));
		 				}
	        
	    }


}
}

?>