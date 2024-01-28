<?php
header("Content-Type:application/json");

$methods = ['get', 'post', 'put', 'patch', 'delete'];
$resources=['account','events','presentsInvites'];

$method = strtolower($_SERVER["REQUEST_METHOD"]);

if (!in_array($method,$methods)){
    http_response_code(405);
    header("Allow: GET, POST, PUT, PATCH, DELETE");
    echo json_encode([
        "message" => "$method is not allowed!"
    ]);
    exit();
}

$resource=$_GET['resource'];

if (!in_array($resource,$resources)){
    http_response_code(404);
    header("Valid-Resources: account, events, presentsInvites");
    echo json_encode([
        "message" => "Resource '$resource' is not accessible!"
    ]);
    exit();
}

/*if ($resource==='account')
    require_once './account';
if ($resource==='events')
    require_once './events';
if ($resource==='presentsInvites')
    require_once './presentsInvites';*/