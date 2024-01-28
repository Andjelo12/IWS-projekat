<?php
header("Content-Type:application/json");
require_once '../../config.php';
require_once '../../functions_def.php';

$methods = ['get', 'post', 'patch', 'delete'];

$method = strtolower($_SERVER["REQUEST_METHOD"]);

if (!in_array($method, $methods)) {
    http_response_code(405);
    header("Allow: GET, POST, PATCH, DELETE");
    echo json_encode([
        "message" => "$method is not allowed!"
    ]);
    exit();
}

$postData = file_get_contents('php://input');
$email=null;
$inviteEmail=null;
$inviteName=null;
$message=null;
if (!empty($postData)) {
    $requestData = json_decode($postData, true);
    // Check if email parameter exists
    if (isset($requestData['email'])) {
        $email = $requestData['email']??null;
    }
    if (isset($requestData['inviteEmail']) && isset($requestData['inviteName']) && isset($requestData['message'])){
        $inviteEmail=$requestData['inviteEmail'];
        $inviteName=$requestData['inviteName'];
        $message=$requestData['message'];
    }
}

$id=$_GET['id']??null;

if ($method === 'get') {
    if(empty($id)) {
        $allData = getAllEvents();

        $allData ? response(200, "Data found", $allData) :
            response(404, "Data Not Found");

        exit();
    } else {
        $allData = getEvent($id);

        $allData ? response(200, "Data found", $allData) :
            response(404, "Data Not Found");

        exit();
    }
}

if ($method === 'post') {
    if (isset($email)) {
        $userEvents = getUserEvents($email);
        $userEvents ? response(200, "Data found", $userEvents) :
            response(404, "Data Not Found");
        exit();
    }
    if (empty($id)) {
        $eventName = $_POST['eventName'] ?? null;
        $description = $_POST['description'] ?? null;
        $location = $_POST['location'] ?? null;
        $date = $_POST['date'] ?? null;
        $created_by = $_POST['created_by'] ?? null;

        if (isset($eventName,$description,$location,$date,$created_by) && !empty($_FILES['image'])) {
            $file_temp = $_FILES["image"]["tmp_name"];
            $random = mt_rand(1, 10000);
            $file_name = "$random-" . $_FILES['image']["name"];
            $upload = "../../images/events/$file_name";
            move_uploaded_file($file_temp, $upload);

            insertIntoEvents($file_name, $description, $location, $date, $eventName, $created_by);
            response(200, "Event successfully created");
        } else {
            response(400, "Missing required fields!");
        }
        exit();
    }
    if (!empty($id)) {
        $eventName = $_POST['eventName'] ?? null;
        $description = $_POST['description'] ?? null;
        $location = $_POST['location'] ?? null;
        $date = $_POST['date'] ?? null;

        if (isset($eventName,$description,$location,$date)) {
            if (!empty($_FILES['image'])) {
                $file_temp = $_FILES["image"]["tmp_name"];
                $random = mt_rand(1, 10000);
                $file_name = "$random-" . $_FILES['image']["name"];
                $upload = "../../images/events/$file_name";
                move_uploaded_file($file_temp, $upload);
                updateEventImage($file_name, $description, $location, $date, $eventName, $id);
                response(200, "Event successfully changed");
            } else {
                $responseData = updateEventNoImage($description, $location, $date, $eventName, $id);
                if ($responseData)
                    response(200, "Event successfully changed");
                else
                    response(202, "No data changed");
            }
        } else {
            response(400, "Missing required fields!");
        }
        exit();
    }
}

if ($method==="delete" && !empty($id)){
    $deleteData = deleteEvent($id);

    $deleteData ? response(200,"Data deleted successfully.") : response(404,"Event with given ID doesn't exsist");


    exit();
}

if ($method==="patch" && !empty($id)){
    $response = archiveEvent($id);

    $response ? response(200, "Event archived") :
        response(400, "Wrong ID!");
    exit();
}
