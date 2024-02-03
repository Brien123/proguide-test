<?php
require_once "model.php";
require_once "load.php";
class InsertHandler extends loadInfo{
    public $connecter;
    function __construct($connection){
        $this->connecter = $connection;
        
    }
      public function selectDb($db){
       
        if(!mysqli_select_db($this->connecter,$db)){
            die('Failed:' .mysqli_error($this->connecter) );
            return false;
    }else{
        return true;
    }
}
    
    public function registerUser($registerDb,$query,$types,$params){
        
        if($this->selectDb($registerDb)){
            $stmt = mysqli_prepare($this->connecter,$query);
            	    mysqli_stmt_bind_param($stmt,$types,...$params);
            	    if(mysqli_stmt_execute($stmt)){
            	        return mysqli_insert_id($this->connecter);
            	    }else{
            	        die('Failed:' .mysqli_error($this->connecter) );
                        return false;
            	        
            	    }
    
        }else{
            exit('Connection To DB in Register User Failed');
        }
        
        
    }
    
    
    
}

?>