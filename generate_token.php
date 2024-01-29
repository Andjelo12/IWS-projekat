<?php
header("Content-Type:application/json");

echo json_encode(["token"=>bin2hex(random_bytes(20))]);
