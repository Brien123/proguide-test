<?php

session_start();
require_once 'vendor/autoload.php'; 
require_once 'gateway.php';
require_once 'sanitizer.php';
require_once 'model.php';
require_once 'load.php';
require_once 'insert.php';
require_once 'utility.php';

serverResponse(true, $_SESSION);
session_destroy();

?>