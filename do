<?php
require_once __DIR__ . "/vendor/autoload.php";

$config = require __DIR__ . "/config/app.php";
$app = require "server/index.php";

$app->listen($config['app']['port'], $config['app']['host'], function ($url) {
    echo "Listening at: \n{$url}\n";
});
