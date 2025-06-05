<?php

use Swoole\Coroutine;
use Swoole\Coroutine\Http\Client;

use function Swoole\Coroutine\run;

run(function () {
    $client = new Client("api.telegram.org",443,true);
    $client->get("/botSecretToken/getWebhookInfo");
    echo $client->getBody();
});


echo "out of co\n";