<?php
require_once "gateway.php";
require_once "update.php";
require_once "sanitizer.php";
require_once "insert.php";
require_once "model.php";
require_once "load.php";
require_once "utility.php";
require_once 'vendor/autoload.php'; 

use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
$reader = new Xlsx();  

$inputData = json_decode($_POST['textData'], true);
$targetDirectory = '../uploads/';
$loader = new loadInfo($db3,'');
$updateQry = new Updater($connect);
$submitDate = date('Y-m-d H:i:s');
$status='unverified';
$targetFile = $targetDirectory.basename($_FILES['file']['name']);

//serverResponse(true, $_FILES);
/*
if (move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
    serverResponse(true,$_FILES);
} else {
    echo 'Error uploading file';
}*/
$insertFxn = new InsertHandler($connect);
if(isset($_FILES['file'])){
    /// file is present, do neccessary db insertions.

    $q1="INSERT INTO {$tb9} (type, filename, verified) VALUES (?,?,?) ";
    $q2="INSERT INTO {$tb10} (materialID, qcode, department, qtitle, year, qtype, qlevel) VALUES (?,?,?,?,?,?,?)";
    $q3="INSERT INTO {$tb11} (sID, qID) VALUES (?,?)";
    $q4="INSERT INTO {$tbv} (uploaderID, materialID, status, dateApproved, uploaderCat) VALUES (?,?,?,?,?)";
    $q5="INSERT INTO {$tb13} (materialID, qID) VALUES (?,?)";

    // first thing is to insert the material
    //registerUser($registerDb,$query,$types,$params)
    $types1="ssi";
    $types2="issssss";
    $types3="ii";
    $types4="sisss";
    $types5="ii";

    //first we upload the material, if it is not uploaded no need to continue
    if (!move_uploaded_file($_FILES['file']['tmp_name'], $targetFile)) {
        serverResponse(false,'Error uploading file');
    }
    if($materialID=$insertFxn->registerUser($db3, $q1, $types1, [$inputData['materialtype'],basename($_FILES['file']['name']),$inputData['verify']])){
            // depending on the material type (question, solution, or prepTest) Insert in the appropriate table
            if($inputData['materialtype'] === 'question'){// insert a question
                
                if($questionID=$insertFxn->registerUser($db3, $q2, $types2, [$materialID,$inputData['ccode'],$inputData['department'],$inputData['ctitle'],$inputData['year'],$inputData['materialtype'],$inputData['questionLvl']])){
                    //question inserted. Now insert the school to which it belongs
                    if($sn=$insertFxn->registerUser($db3, $q3, $types3, [$inputData['school'],$questionID])){
                        // insertion of school succeeded now register the inserter
                        $status='unverified';
                        if($sn=$insertFxn->registerUser($db3, $q4, $types4, [$inputData['uID'],$materialID, $status, $submitDate, $inputData['uType']])){
                            serverResponse(true, "Upload Occured hinge free");
                        }else{
                            serverResponse(false, "Faiure to Save the Uploader Details");

                        }

                    }else{
                        serverResponse(false, "School Insertion for material {$questionID} failed");
                    }
                }else{
                    serverResponse(false, "Question was not inserted but material was");
                }
            }elseif($inputData['materialtype'] === 'solution'){
                //to upload solution, just populate 1 tb
                //check if the question id u which to upload already exists if it does just update!
                if(is_null($fetchedSN = $loader->select("SELECT sn FROM {$tb13} WHERE qID = '{$inputData['questionID']}' "))){
                    //proceed with notmal insertion. Else do Updates
                    if($sn=$insertFxn->registerUser($db3, $q5, $types5, [$materialID,$inputData['questionID']])){
                        
                            if($sn=$insertFxn->registerUser($db3, $q4, $types4, [$inputData['uID'],$materialID, $status, $submitDate, $inputData['uType']])){
                                serverResponse(true, "Uploaded Solution and registered Uploader");
                            }else{
                                serverResponse(false, "Failed to Save Uploader Details");
    
                            }
                    }else{
                        serverResponse(false, "Failed To insert the Soultion in Table");
                    }
                }else{
                    $solQry = " UPDATE {$tb13} SET materialID = '{$materialID}' WHERE sn = ?";
                    //$updaterQry = " UPDATE {$tbv} SET uploaderID = '{$inputData['uID']}', uploaderCat = '{$inputData['uType']}', dateApproved = '{$submitDate}' WHERE ";
                    //change queries to perform updates
                    if($updateQry->updateRow($db3,$solQry, $fetchedSN[0]['sn'],'s')){
                        serverResponse(true, "Updated Solution and registered Uploader");
                    }else{
                        serverResponse(false, "Failed to Update Solution");

                    }
                }
               

            }elseif($inputData['materialtype'] == 'preptest'){
                $spreadsheet = $reader->load($targetFile); 
                $worksheet = $spreadsheet->getActiveSheet();  
                $worksheet_arr = $worksheet->toArray(); 

                //we need to refine the array gotten from the excel sheet so it is of this format
                /*
                    {
                        question: string,
                        options: string[],
                        correctAnswer: string,
                        explanation: string

                    }[]
                so in essence we an array of objects of the js format shown above.
                To do that there are a couple of things to do. Firstly, and most importantly, we need to know the number of 
                options per question [set] then we will have to extract each of those options into an options array.

                
                */

                //take note the first array item of the worksheet array is the row headers.
                //var_dump($worksheet_arr[0]);

                $occurences = countOccurrences('Option', $worksheet_arr[0]);// this gives us the length of the options array.
                //this tell us that for all the arrays extracted from the pdf, items from index 1 to $countOccurences will
                //have options

                //var_dump(createFormat($worksheet_arr[1], $occurences));// create format changes the raw data from the excel sheet to
                //a format which can easily be understood and displayed. What I need to do now is to aggregate all
                //the rightly formatted data in one big array and then json_encode it so it can be saved in db

                $lengthOfOriginal = count($worksheet_arr);
                
                $bigRightlyFormattedData=array();
                for($i=1; $i<=$lengthOfOriginal-1;$i++){
                    if(!is_null($worksheet_arr[$i][0])){
                        //additional check so that empty rows are not added. if the first element(question is null) 
                        array_push($bigRightlyFormattedData, createFormat($worksheet_arr[$i], $occurences));
                    }
                        
                }//duration specifies the length of the full tests
               
                if($sn=$insertFxn->registerUser($db3,"INSERT INTO {$tbp} (subject, topic, materialID, sID, quizz, duration) VALUES (?,?,?,?,?,?)", "ssissi", [$inputData['department'],$inputData['topic'],$materialID,$inputData['school'],json_encode($bigRightlyFormattedData),$inputData['duration']])){
                    if($sn=$insertFxn->registerUser($db3, $q4, $types4, [$inputData['uID'],$materialID, $status, $submitDate, $inputData['uType']])){
                        serverResponse(true, "Uploaded prep tests and registered Uploader");
                    }else{
                        serverResponse(false, "Failed to Save Uploader Details");

                    }
                }else{
                    serverResponse(false, "Sorry an Error Occured");
                }
              
            
            //serverResponse(true, $worksheet_arr);
            }

    }else{
        serverResponse(false, "Initial Insertion Error");
    }

}else{
    serverResponse(false, 'No file detected');
}

?>