<?php 

class paymentHandler{
    public $value;
    
     function __construct($username,$password){
               $curl = curl_init();

                curl_setopt_array($curl, array(
              CURLOPT_URL => 'https://www.campay.net/api/token/',
              CURLOPT_RETURNTRANSFER => true,
              CURLOPT_ENCODING => '',
              CURLOPT_MAXREDIRS => 10,
              CURLOPT_TIMEOUT => 0,
              CURLOPT_FOLLOWLOCATION => true,
              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
              CURLOPT_CUSTOMREQUEST => 'POST',
              CURLOPT_POSTFIELDS =>"{
                  \"username\":\"" .$username . "\",
                  \"password\":\"" . $password . "\"
                  }",
              CURLOPT_HTTPHEADER => array(
                'Content-Type: application/json'
              ),
            ));

            $response = curl_exec($curl);
            curl_close($curl);
            $val = json_decode($response,true);
            $this->value=$val['token'];
             
      }
      
      
      public function generateLink($amount,$from,$url){
    $curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://www.campay.net/api/get_payment_link/',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>"{
  \"amount\":\"" .$amount . "\",
      \"from\":\"" . $from . "\",
      \"currency\":\"XAF\",
      \"description\": \"Payment\",
    \"external_reference\":\"\",
     \"redirect_url\": \"".$url."\",
     \"failure_redirect_url\": \"".$url."\"
}",

  CURLOPT_HTTPHEADER => array(
  'Authorization: Token '.$this->value,
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
return json_decode($response,true);
    
}

  public function getStatus($reference){
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://www.campay.net/api/transaction/'.$reference.'/',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
  CURLOPT_HTTPHEADER => array(
     'Authorization: Token '.$this->value,
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
return json_decode($response, true);
}

public function requestPay($amount,$from,$url){ //returns reference,ussd_code,operator
    
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://www.campay.net/api/collect/',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>"{
      \"amount\":\"" .$amount . "\",
      \"from\":\"" . $from . "\",
      \"currency\":\"XAF\",
      \"description\": \"Test\",
    \"external_reference\":\"\",
    \"redirect_url\": \" ".$url."\"
     
      
      
  }",
  CURLOPT_HTTPHEADER => array(
    'Authorization: Token '.$this->value,
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
return json_decode($response,true);

}



    public function proCallback(){
    
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://studentproguide.site/call.php',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'GET',
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
} 
public function withdraw($amount , $to){
    $curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://www.campay.net/api/withdraw/',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>"{
      \"amount\":\"" .$amount . "\",
      \"to\":\"" . $to . "\",
      \"description\": \"Test\",
    \"external_reference\":\"\"
  }",
  CURLOPT_HTTPHEADER => array(
   'Authorization: Token '.$this->value,
    'Content-Type: application/json'
  ),
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
}

}

/*   https://studentproguide.site/payment.php */

    

?>