<?php

require_once __DIR__."/Migration.php";
use Illuminate\Database\Capsule\Manager as Capsule;


Capsule::table('users')->insert([
    "name" => "super_user",
    "username" => "super_user",
    "password" => password_hash("supersecretpassword", PASSWORD_BCRYPT)
]);
echo " table users filled";
