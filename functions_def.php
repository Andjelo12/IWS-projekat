<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';
require_once "config.php";

$pdo = connectDatabase($dsn, $pdoOptions);
$GLOBALS['pdoConn']=connectDatabase($dsn, $pdoOptions);
/** Function tries to connect to database using PDO
 * @param string $dsn
 * @param array $pdoOptions
 * @return PDO
 */
function connectDatabase(string $dsn, array $pdoOptions): PDO
{

    try {
        $pdo = new PDO($dsn, PARAMS['USER'], PARAMS['PASS'], $pdoOptions);

    } catch (\PDOException $e) {
        var_dump($e->getCode());
        throw new \PDOException($e->getMessage());
    }

    return $pdo;
}

/**
 * Function redirects user to given url
 *
 * @param string $url
 */
function redirection($url)
{
    header("Location:$url");
    exit();
}


/**
 * Function checks that login parameters exists in users_web table
 *
 * @param PDO $pdo
 * @param string $email
 * @param string $enteredPassword
 * @return array
 */
function checkUserLogin(PDO $pdo, string $email, string $enteredPassword): array
{
    $sql = "SELECT id_user, firstname,password, is_admin, is_banned, active FROM users2 WHERE email=:email LIMIT 0,1";
    $stmt= $pdo->prepare($sql);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);

    $data = [];
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($stmt->rowCount() > 0) {

        $registeredPassword = $result['password'];

        if (password_verify($enteredPassword, $registeredPassword)) {
            $data['id_user'] = $result['id_user'];
            $data['is_admin']=$result['is_admin'];
            $data['is_banned']=$result['is_banned'];
            $data['active']=$result['active'];
            $data['firstname']=$result['firstname'];
        }
    }

    return $data;
}

function getIpAddress()
{

    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }

    if (!filter_var($ip, FILTER_VALIDATE_IP)) {
        $ip = "unknown";
    }

    return $ip;
}

function getAllEvents(): array|bool
{
    $sql = "SELECT * FROM event WHERE is_blocked='free' AND archived='no'";
    $stmt = $GLOBALS['pdo']->prepare($sql);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getEvent(int $id){
    $sql = "SELECT * FROM event WHERE id=:id";
    $stmt = $GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(":id",$id,PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function updateEventImage($foto, $description, $location, $date, $eventName, $eventId){
    $sql="UPDATE event SET name=:name, description=:description, location=:location, date=:date, foto=:foto WHERE id=:id";
    $stmt=$GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(':foto',$foto,PDO::PARAM_STR);
    $stmt->bindValue(':description',$description,PDO::PARAM_STR);
    $stmt->bindValue(':location',$location,PDO::PARAM_STR);
    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->bindValue(':name',$eventName,PDO::PARAM_STR);
    $stmt->bindValue(':id',$eventId,PDO::PARAM_STR);
    $stmt->execute();
}
function updateEventNoImage(string $description, string $location, string $date, string $eventName, int $eventId){
    $sql="UPDATE event SET name=:name, description=:description, location=:location, date=:date, foto=foto WHERE id=:id";
    $stmt=$GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(':description',$description,PDO::PARAM_STR);
    $stmt->bindValue(':location',$location,PDO::PARAM_STR);
    $stmt->bindValue(':date',$date,PDO::PARAM_STR);
    $stmt->bindValue(':name',$eventName,PDO::PARAM_STR);
    $stmt->bindValue(':id',$eventId,PDO::PARAM_STR);
    $stmt->execute();
    return $stmt->rowCount() > 0;
}

function addPresent(int $event_id, string $link, string $presentName){
    if (!filter_var($link, FILTER_VALIDATE_URL)) {
        response(400, "Invalid URL sent!");
        exit();
    }
    $sql="INSERT INTO wish_list(item,link,event_id) VALUE (:item,:link,:event_id)";
    $stmt=$GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(":item",$presentName,PDO::PARAM_STR);
    $stmt->bindValue(":link",$link,PDO::PARAM_STR);
    $stmt->bindValue(":event_id",$event_id,PDO::PARAM_INT);
    $stmt->execute();
    response(200, "Present successfully added!");
}

function deletePresent(int $id){
    $sql="DELETE FROM wish_list WHERE id=:id";
    $stmt=$GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(":id",$id,PDO::PARAM_STR);
    $stmt->execute();

    if ($stmt->rowCount()>0) {
        response(200, "Present successfully deleted!");
    }else{
        response(404, "Present with given ID doesn't exists!");
    }
}

function getData($id, $table){
    $sql="SELECT * FROM $table WHERE event_id=:event_id";
    $stmt=$GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(":event_id",$id,PDO::PARAM_INT);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function getUserEvents($email){
    $sql = "SELECT * FROM event WHERE created_by=:created_by";
    $stmt = $GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(":created_by",$email,PDO::PARAM_STR);
    $stmt->execute();

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function deleteEvent($id){
    $sql = "DELETE FROM event WHERE id=:id";
    $stmt = $GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->rowCount() > 0;
}

function deleteInvite($id){
    $sql = "DELETE FROM invites WHERE id=:id";
    $stmt = $GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(':id', $id, PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->rowCount() > 0;
}

function archiveEvent(int $id){
    $sql="UPDATE event SET archived='yes' WHERE id=:id";
    $stmt=$GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(":id",$id,PDO::PARAM_INT);
    $stmt->execute();
    return $stmt->rowCount() > 0;
}
function insertIntoEvents(string $foto, string $description, string $location, string $date, string $name,string $created_by){
    $sql = "INSERT INTO event(name, description, date,location,foto,created_by) VALUES (:name, :description, :date, :location,:foto,:created_by)";
    $query = $GLOBALS['pdo'] -> prepare($sql);
    $query->bindParam(':foto',$foto,PDO::PARAM_STR);
    $query->bindParam(':name',$name, PDO::PARAM_STR);
    $query->bindParam(':description',$description, PDO::PARAM_STR);
    $query->bindParam(':date',$date, PDO::PARAM_STR);
    $query->bindParam(':location',$location, PDO::PARAM_STR);
    $query->bindParam(':created_by',$created_by, PDO::PARAM_STR);
    $query->execute();
}

function sendInvite(int $event_id, string $inviteEmail, string $inviteName){
    if (!filter_var($inviteEmail, FILTER_VALIDATE_EMAIL)) {
        response(400, "Mail is in in invalid format!");
        exit();
    }
    checkIfInvited($event_id,$inviteEmail);
    $token=createToken(10);
    $event=findEvent($event_id);
    $time=date("H:i",strtotime($event['time2']));
    insertIntoInvites($inviteEmail, $inviteName, $event_id,$token);
    $phpmailer = new PHPMailer(true);

    $phpmailer->isSMTP();
    $phpmailer->Host = 'first.stud.vts.su.ac.rs';
    $phpmailer->SMTPAuth = true;
    $phpmailer->Port = 587;
    $phpmailer->Username = 'first';
    $phpmailer->Password = 'ZADcO14NsZMPzeU';


    $phpmailer->setFrom("first@first.stud.vts.su.ac.rs");
    $phpmailer->addAddress("$inviteEmail");

    $phpmailer->isHTML(true);
    $phpmailer->CharSet = 'UTF-8';
    $phpmailer->Subject = "Pozivnica za događaj";
    $phpmailer->Body = "Pozdrav. Pozvani ste da dođete na \"{$event['name']}\" događaj koji će se održati {$event['date2']} u {$time}h. Da bi ste potvrdili vaš dolazak potrebno je da odete na <a href=" . SITE . "inviteResponse.php?code=$token>link</a>";
    $phpmailer->AltBody = "Pozdrav. Pozvani ste da dođete na \"{$event['name']}\" događaj koji će se održati {$event['date2']} u {$event['time2']}h. Da bi ste potvrdili vaš dolazak potrebno je da odete na ".SITE."inviteResponse.php?code=$token";

    $phpmailer->send();
    response(200, "Invite to user successfully sent!");
}

function insertIntoInvites(string $inviteEmail, string $inviteName, int $event_id, string $invite_code){
    $sql = "INSERT INTO invites (email, name, event_id, invite_code, wish_list) values (:email,:name,:event_id,:invite_code, 'yes')";
    $stmt=$GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(":email",$inviteEmail,PDO::PARAM_STR);
    $stmt->bindValue(":name",$inviteName,PDO::PARAM_STR);
    $stmt->bindValue(":event_id",$event_id,PDO::PARAM_INT);
    $stmt->bindValue(":invite_code",$invite_code,PDO::PARAM_STR);
    $stmt->execute();
}

function checkIfMessageSend(int $id, string $email){
    $sql="SELECT sender_email FROM messages WHERE id_event=:id_event";
    $stmt=$GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(":id_event", $id, PDO::PARAM_INT);
    $stmt->execute();
    $results=$stmt->fetchAll();
    foreach ($results as $result){
        if ($result['sender_email']==$email){
            response(406, "Email already sent!");
            exit();
        }
    }
}

function checkIfInvited(int $id, string $email):void{
    $sql = "SELECT * FROM invites WHERE event_id=:id";
    $stmt=$GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(":id", $id, PDO::PARAM_INT);
    $stmt->execute();
    $results=$stmt->fetchAll();
    foreach ($results as $result){
        if ($result['email']==$email){
            response(409, "User already in invites");
            exit();
        }
    }
}

function findEvent(int $id):array{
    $sql = "SELECT created_by, name, DATE(date) as date2, TIME(date) as time2 FROM event WHERE id=:id";
    $stmt = $GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(":id",$id,PDO::PARAM_STR);
    $stmt->execute();

    return $stmt->fetch(PDO::FETCH_ASSOC);
}

function response(int $status, string $status_message, mixed $data = null): void
{
    header("HTTP/1.1 " . $status);

    $response['status'] = $status;
    $response['status_message'] = $status_message;

    if ($data !== null) {
        $response['data'] = $data;
    }

    echo json_encode($response);
}

/**Function inserts data into log table.
 * @param string $userAgent
 * @param string $ipAddress
 * @param string $deviceType
 * @param string $country
 * @param bool $proxy
 * @return void
 */
function insertIntoDetects(string $userAgent, string $ipAddress, string $deviceType, string $country, string $lastInsertID,bool $proxy, string $status): void
{
    $sql = "INSERT INTO detects(user_agent, ip_address, country, proxy, device_type, user_id, status) VALUES(:userAgent, :ipAddress, :country, :proxy, :deviceType, :user_id,:status)";
    $stmt = $GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(':userAgent', $userAgent, PDO::PARAM_STR);
    $stmt->bindValue(':ipAddress', $ipAddress, PDO::PARAM_STR);
    $stmt->bindValue(':country', $country, PDO::PARAM_STR);
    $stmt->bindValue(':proxy', $proxy, PDO::PARAM_INT);
    $stmt->bindValue(':deviceType', $deviceType, PDO::PARAM_STR);
    $stmt->bindValue(':user_id', $lastInsertID, PDO::PARAM_STR);
    $stmt->bindValue(':status',$status, PDO::PARAM_STR);

    $stmt->execute();
}

function emailExists(PDO $pdo, string $email){
    $sql = "SELECT id_user FROM users2 WHERE email=:email LIMIT 0,1";
    $stmt= $pdo->prepare($sql);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($stmt->rowCount() > 0) {
        return $result['id_user'];
    }
    return null;
}

function insertIntoUserDetects(string $email, ?string $userDetails){
    if (empty($userDetails))
        $sql = "INSERT INTO user_detects(email) VALUES(:email)";
    else
        $sql = "INSERT INTO user_detects(email, user_details) VALUES(:email, :user_details)";
    $stmt = $GLOBALS['pdo']->prepare($sql);
    $stmt->bindValue(':email', $email, PDO::PARAM_STR);
    if (!empty($userDetails))
        $stmt->bindValue(':user_details', $userDetails, PDO::PARAM_STR);
    $stmt->execute();
    return $GLOBALS['pdo']->lastInsertId();
}

function getCurlData($url): string
{
    // https://www.php.net/manual/en/book.curl.php

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    $result = curl_exec($ch);
    curl_close($ch);

    return $result;
}

function getEmail(PDO $pdo, string $token){
    $sql = "SELECT email FROM users2 WHERE binary forgotten_password_token = :token AND forgotten_password_expires>now()";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':token', $token, PDO::PARAM_STR);
    $stmt->execute();
    $result=$stmt->fetch(PDO::FETCH_ASSOC);
    return $result['email'];
}


/**
 * Function checks that user exists in users table
 * @param PDO $pdo
 * @param string $email
 * @return bool
 */
function existsUser(PDO $pdo, string $email): bool
{

    $sql = "SELECT id_user FROM users2 WHERE email=:email AND (registration_expires>now() OR active ='1') LIMIT 0,1";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();
    $stmt->fetch(PDO::FETCH_ASSOC);

    if ($stmt->rowCount() > 0) {
        return true;
    } else {
        return false;
    }
}


/**Function registers user and returns id of created user
 * @param PDO $pdo
 * @param string $password
 * @param string $firstname
 * @param string $lastname
 * @param string $email
 * @param string $token
 * @return int
 */
function registerUser(PDO $pdo, string $password, string $firstname, string $lastname, string $email, string $token): int
{

    $passwordHashed = password_hash($password, PASSWORD_DEFAULT);

    $sql = "INSERT INTO users2(password,firstname,lastname,email,registration_token, registration_expires,active)
            VALUES (:passwordHashed,:firstname,:lastname,:email,:token,DATE_ADD(now(),INTERVAL 1 DAY),0)";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':passwordHashed', $passwordHashed, PDO::PARAM_STR);
    $stmt->bindParam(':firstname', $firstname, PDO::PARAM_STR);
    $stmt->bindParam(':lastname', $lastname, PDO::PARAM_STR);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->bindParam(':token', $token, PDO::PARAM_STR);
    $stmt->execute();

    // http://dev.mysql.com/doc/refman/5.6/en/date-and-time-functions.html

    return $pdo->lastInsertId();

}


/** Function creates random token for given length in bytes
 * @param int $length
 * @return string|null
 */
function createToken(int $length): ?string
{
    try {
        return bin2hex(random_bytes($length));
    } catch (\Exception $e) {
        // c:xampp/apache/logs/
        error_log("****************************************");
        error_log($e->getMessage());
        error_log("file:" . $e->getFile() . " line:" . $e->getLine());
        return null;
    }
}

function getToken():string{
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $authorizationHeader = $_SERVER['HTTP_AUTHORIZATION'];
    } elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
        // For some server configurations, you might need to check REDIRECT_HTTP_AUTHORIZATION as well
        $authorizationHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
    } else {
        // If not found, set it to an empty string or handle the absence as needed
        $authorizationHeader = '';
    }
    $token='';
    if (!empty($authorizationHeader)) {
        // Split the Authorization header to get the token part
        $parts = explode(' ', $authorizationHeader);

        // Check if the Authorization header has the expected format
        if (count($parts) === 2 && strtolower($parts[0]) === 'bearer') {
            $token = $parts[1];
        }
    }
    return $token;
}

/**
 * Function creates code with given length and returns it
 *
 * @param $length
 * @return string
 */
function createCode($length): string
{
    $down = 97;
    $up = 122;
    $i = 0;
    $code = "";

    /*    
      48-57  = 0 - 9
      65-90  = A - Z
      97-122 = a - z        
    */

    $div = mt_rand(3, 9); // 3

    while ($i < $length) {
        if ($i % $div == 0)
            $character = strtoupper(chr(mt_rand($down, $up)));
        else
            $character = chr(mt_rand($down, $up)); // mt_rand(97,122) chr(98)
        $code .= $character; // $code = $code.$character; //
        $i++;
    }
    return $code;
}


/** Function tries to send email with activation code
 * @param PDO $pdo
 * @param string $email
 * @param array $emailData
 * @param string $body
 * @param int $id_user
 * @return void
 */
function sendEmail(PDO $pdo, string $email, array $emailData, string $body, int $id_user): void
{

    $phpmailer = new PHPMailer(true);

    try {

        $phpmailer->isSMTP();
        $phpmailer->Host = 'first.stud.vts.su.ac.rs';
        $phpmailer->SMTPAuth = true;
        $phpmailer->Port = 587;
        $phpmailer->Username = 'first';
        $phpmailer->Password = 'ZADcO14NsZMPzeU';


        $phpmailer->setFrom('first@first.stud.vts.su.ac.rs', 'Admin');
        $phpmailer->addAddress("$email");

        $phpmailer->isHTML(true);
        $phpmailer->CharSet = 'UTF-8';
        $phpmailer->Subject = $emailData['subject'];
        $phpmailer->Body = $body;
        $phpmailer->AltBody = $emailData['altBody'];

        $phpmailer->send();
    } catch (Exception $e) {
        $message = "Message could not be sent. Mailer Error: {$phpmailer->ErrorInfo}";
        addEmailFailure($pdo, $id_user, $message);
    }

}

function insertIntoMessages(PDO $pdo, string $message,int $event_no,string $email, string $name){
    $sql="INSERT INTO messages(invite_name, message, id_event, sender_email)VALUE(:name, :message, :id_event, :sender_email)";
    $stmt=$pdo->prepare($sql);
    $stmt->bindValue(":name",$name,PDO::PARAM_STR);
    $stmt->bindValue(":message",$message,PDO::PARAM_STR);
    $stmt->bindValue(":id_event",$event_no,PDO::PARAM_INT);
    $stmt->bindValue(":sender_email",$email,PDO::PARAM_STR);
    $stmt->execute();
}

/** Function inserts data in database for e-mail sending failure
 * @param PDO $pdo
 * @param int $id_user
 * @param string $message
 * @return void
 */
function addEmailFailure(PDO $pdo, int $id_user, string $message): void
{
    $sql = "INSERT INTO user_email_failures (id_user, message, date_time_added)
            VALUES (:id_user,:message, now())";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id_user', $id_user, PDO::PARAM_INT);
    $stmt->bindParam(':message', $message, PDO::PARAM_STR);
    $stmt->execute();

}


/**
 * Function returns user data for given field and given value
 * @param PDO $pdo
 * @param string $data
 * @param string $field
 * @param mixed $value
 * @return mixed
 */
function getUserData(PDO $pdo, string $data, string $field, string $value): string
{
    $sql = "SELECT $data as data FROM users2 WHERE $field=:value LIMIT 0,1";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':value', $value, PDO::PARAM_STR);
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);

    $data = '';

    if ($stmt->rowCount() > 0) {
        $data = $result['data'];
    }

    return $data;
}

/**
 * Function sets the forgotten token
 * @param PDO $pdo
 * @param string $email
 * @param string $token
 * @return void
 */
function setForgottenToken(PDO $pdo, string $email, string $token): void
{
    $sql = "UPDATE users2 SET forgotten_password_token = :token, forgotten_password_expires = DATE_ADD(now(),INTERVAL 6 HOUR) WHERE email = :email";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':token', $token, PDO::PARAM_STR);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();
}