<?php
    function addPrefix($pre, $text){
       return $pre.$text;
   }
   function pdftoimage2($pdfLink,$name,$dir){
  
   $files2view=array();
    if(is_dir($dir.$name)){
// directory exist. Just Fetch Files
if(is_array(scandir($dir.$name))){
$files =scandir($dir.$name);
for($i=2; $i<=count($files)-1;$i++){
    array_push($files2view,addPrefix($name.'/',$files[$i]));
}
return $files2view;
exit();
}else{
echo "error fetching";
}


}else{
if(mkdir($dir.$name)){ //succesful creation of directory then add files
//pdf to image
$save=$dir.$name.'/converted-%03d.jpg';
$save1="output_file_name-%03d.png";
//exit(var_dump(exec('convert -density 150 "'.$pdfLink.'"  -quality 92 "'.$save.'"', $output, $return_var)));
if(!exec('convert -density 150 "'.$pdfLink.'"  -quality 92 "'.$save.'"', $output, $return_var)){
$files =scandir($dir.$name);
for($i=2; $i<=count($files)-1;$i++){
    array_push($files2view,addPrefix($name.'/',$files[$i]));
}
return $files2view;
}else{
echo "failed to Display";
} 
}
//-density 150 -antialias  name -resize 1024x -quality 100  -flatten -sharpen 0x1.0
}
}
function extractfilename($pdf){
$element=explode('/',$pdf); //break file link after every "/"
$filename=explode('.', $element[count($element) - 1]); // get the actual name of the file excluding its extension

return $filename[0];// returns the filename
}

function deleteDirectory($dirname){
if(is_dir($dirname)){
array_map("unlink", glob("$dirname/*"));
array_map("rmdir", glob("$dirname/*"));
rmdir($dirname);
}
}


function countOccurrences($searchString, $array) {
    $count = 0;
    
    foreach ($array as $value) {
        
        if (strpos($value, $searchString) !== false) {
            $count++;
        }
    }
    
    return $count;
  }

  function createFormat($array, $endOfOptions){
    $optionRange = array_slice($array, 1, $endOfOptions); // extracts the options

    // $array[0] question
    // $array[$endOfOptions+1] the answer is immediately after the options
   // $array[$endOfOptions+2]the explanation is 2 indices after the end of options

    return array(
        'question'=>$array[0],
        'options'=>$optionRange,
        'correctAnswer'=>$array[$endOfOptions+1],
        'explanation'=>$array[$endOfOptions+2]
    );
    
  }

?>