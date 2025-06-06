<?php

use Swoole\Coroutine;
use Swoole\Coroutine\Http\Client;

use function Swoole\Coroutine\run;

require_once __DIR__."/vendor/autoload.php";
require_once __DIR__."/config/app.php";

echo $_ENV["APP_HOST"];