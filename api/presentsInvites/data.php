<?php
header("Content-Type:application/json");
require_once '../../config.php';
require_once '../../functions_def.php';

$methods = ['get', 'post', 'put', 'delete'];
$tables=['invites','wish_list'];

$method = strtolower($_SERVER["REQUEST_METHOD"]);

if (!in_array($method, $methods)) {
    http_response_code(405);
    header("Allow: GET, POST, PATCH, DELETE");
    echo json_encode([
        "message" => "$method is not allowed!"
    ]);
    exit();
}

$table = $_GET['table'] ?? "";
$id = $_GET['id'] ?? '';

if (!in_array($table, $tables)) {
    http_response_code(404);
    header("Allow: login, register, forget");
    echo json_encode([
        "message" => "Wrong table"
    ]);
    exit();
}

$postData = file_get_contents('php://input');
if (!empty($postData)) {
    $requestData = json_decode($postData, true);
    // Check if email parameter exists
    if (isset($requestData['link'])) {
        $link = $requestData['link']??null;
    }
    if (isset($requestData['presentName'])){
        $presentName=$requestData['presentName'];
    }
    if (isset($requestData['inviteEmail'])){
        $inviteEmail=$requestData['inviteEmail'];
    }
    if (isset($requestData['inviteName'])){
        $inviteName=$requestData['inviteName'];
    }
}

if ($method==="get" && $table==="wish_list"){
    $allData = getData($id,$table);
    if (!empty($id))
        $allData ? response(200, "Data found", $allData) : response(404, "Data Not Found");
    else
        response(400, "Missing ID");
    exit();
}

if ($method==="put" && $table==='wish_list'){
    if (isset($link,$presentName) && !empty($id)) {
        if (getEvent($id)===false) {
            response(404,"Can't add present, event with given ID doesn't exist");
            exit();
        }
        addPresent($id, $link, $presentName);
    }else{
        response(422, "Please provide id, link and present name");
    }
    exit();
}

if ($method==="delete" && $table==='wish_list'){
    if (!empty($id)) {
        deletePresent($id);
    } else {
        response(400, "ID missing");
    }
    exit();
}

if ($method==="get" && $table==="invites"){
    if (!empty($id)){
        $allData = getData($id, $table);
        $allData ? response(200, "Data found", $allData) :
            response(404, "Data Not Found");
    }else{
        response(400, "Event ID missing");
    }
    exit();
}

if ($method==="delete" && $table==="invites"){
    if (!empty($id)){
        $deleteData = deleteInvite($id);
        $deleteData ? response(200,"Data deleted successfully.") :
            response(404,"ID doesn't exsist.");
    }else{
        response(400, "ID missing");
    }
    exit();
}

if ($method==="put" && $table==="invites"){
    if (isset($inviteName, $inviteEmail) && !empty($id)){
        if (getEvent($id)===false) {
            response(404,"Can't add invite, event with given ID doesn't exist");
            exit();
        }
        sendInvite($id, $inviteEmail, $inviteName);
    } else {
        response(422, "Data missing");
    }
    exit();
}