<?php
header("Content-Type:application/json");
require_once '../../config.php';
require_once '../../functions_def.php';

$tables=['login','register','forget'];

$method = strtolower($_SERVER["REQUEST_METHOD"]);

if ($method!=='post'){
    http_response_code(405);
    header("Allow: POST");
    echo json_encode([
        "message" => "$method is not allowed!"
    ]);
    exit();
}

$action=$_GET['action'] ?? '';

if (!in_array($action, $actions)){
    http_response_code(403);
    header("Allow: login, register, forget");
    echo json_encode([
        "message" => "Wrong action"
    ]);
    exit();
}

$country = "";
$proxy = false;
$deviceType = 'phone';
$ipAddress = getIpAddress();
$user_agent = '';
$urlApi = "http://ip-api.com/json/$ipAddress?fields=$apiFields";
$apiResponse = getCurlData($urlApi);

$apiData = json_decode($apiResponse, true);

if (isset($apiData['country']))
    $country = $apiData['country'];

if (isset($apiData['proxy']))
    $proxy = $apiData['proxy'];

$json = file_get_contents('php://input');
$obj = json_decode($json,true);

if ($action==="login"){
    $email = strtolower(trim($obj['email'])) ?? null;
    $password = $obj['password'] ?? null;

    if(!empty($email) && !empty($password)){
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            response(400, "Mail is in in invalid format!");
            exit();
        }
        $data = checkUserLogin($pdo, $email, $password);
        $userData = emailExists($pdo, $email);
        if ($data and is_int($data['id_user']) and $data['active']==1) {
            if ($data['is_banned']==0){
                $lastInsertID=insertIntoUserDetects($email, $userData);
                insertIntoDetects($user_agent, $ipAddress,$deviceType, $country, $lastInsertID, $proxy, 'success');
                response(200, "Login successfull");
                exit();
            }elseif($data['is_banned']==1){
                $lastInsertID=insertIntoUserDetects($email, $userData);
                insertIntoDetects($user_agent, $ipAddress,$deviceType, $country, $lastInsertID, $proxy, 'banned');
                response(403, "Account blocked");
                exit();
            }
        } elseif($data and $data['active']==0){
            response(409, "Account is not activated");
            exit();
        } else {
            $lastInsertID=insertIntoUserDetects($email, $userData);
            insertIntoDetects($user_agent, $ipAddress,$deviceType, $country, $lastInsertID,$proxy, 'wrong data');
            response(401, "Wrong details provided");
            exit();
        }
    } else {
        response(422, "Incomplete data sent");
        exit();
    }
}
if ($action==="register"){
    $firstName = trim($obj['firstName']) ?? null;
    $lastName = trim($obj['lastName']) ?? null;
    $email = strtolower(trim($obj['email'])) ?? null;
    $password = trim($obj['password']) ?? null;

    if(!empty($firstName) && !empty($lastName) && !empty($email) && !empty($password)){
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            response(400, "Mail is in in invalid format!");
            exit();
        }
        $userData = emailExists($pdo, $email);
        if (!existsUser($pdo,$email)){
            $token = createToken(20);
            if ($token) {
                $id_user = registerUser($pdo, $password, $firstName, $lastName, $email, $token);
                try {
                    $lastInsertID=insertIntoUserDetects($email, $id_user);
                    insertIntoDetects($user_agent, $ipAddress,$deviceType, $country, $lastInsertID, $proxy, 'register');
                    $body = "Da bi ste aktivirali nalog potrebno je da odete na <a href=" . SITE . "active.php?token=$token>link</a>";
                    sendEmail($pdo, $email, $emailMessages['register'], $body, $id_user);
                    response(200, "Registration successfull");
                    exit();
                } catch (Exception $e) {
                    error_log("****************************************");
                    error_log($e->getMessage());
                    error_log("file:" . $e->getFile() . " line:" . $e->getLine());
                    response(500, "Error has occurred while sending email");
                    exit();
                }
            }
        } else {
            $lastInsertID=insertIntoUserDetects($email, $userData);
            insertIntoDetects($user_agent, $ipAddress,$deviceType, $country, $lastInsertID, $proxy, 'register with same email');
            response(409, "User already exists");
            exit();
        }
    } else {
        response(422, "Incomplete data sent");
        exit();
    }
}
if ($action==="forget"){
    $email = strtolower(trim($obj['email'])) ?? null;

    if (!empty($email) and getUserData($pdo, 'id_user', 'email', $email) && filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $token = createToken(20);
        setForgottenToken($pdo, $email, $token);
        $id_user = getUserData($pdo, 'id_user', 'email', $email);
        try {
            $body = "Da bi ste započeli proces izmene lozinke posetite <a href=" . SITE . "forget.php?token=$token>sajt</a>.";
            sendEmail($pdo, $email, $emailMessages['forget'], $body, $id_user);
            response(200, "Reset link send to email successfully");
            exit();
        } catch (Exception $e) {
            error_log("****************************************");
            error_log($e->getMessage());
            error_log("file:" . $e->getFile() . " line:" . $e->getLine());
            response(500, "Error has occurred while sending reset email");
            exit();
        }
    } else {
        response(422, "Provide valid email");
        exit();
    }
}

