<?php

use Illuminate\Database\Capsule\Manager as Capsule;

require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/../config/app.php";

$dbName = $_ENV["DB_NAME"];
$dbHost = $_ENV["DB_HOST"];
$dbUser = $_ENV["DB_USER"];
$dbPass = $_ENV["DB_PASS"];

$pdo = new PDO("mysql:host=$dbHost", $dbUser, $dbPass);

$check = $pdo->query("SHOW DATABASES LIKE '$dbName'");
if ($check->rowCount() === 0) {
    $pdo->exec("CREATE DATABASE `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    echo "Database `$dbName` created.\n";
}
 else {
    $pdo->exec("DROP DATABASE $dbName");
    $pdo->exec("CREATE DATABASE `$dbName` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
}

$capsule = new Capsule;
$capsule->addConnection([
    'driver' => 'mysql',
    'host' => $dbHost,
    'database' => $dbName,
    'username' => $dbUser,
    'password' => $dbPass,
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
]);

$capsule->setAsGlobal();
$capsule->bootEloquent();


