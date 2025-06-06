<?php

use Swoole\Coroutine;
use Swoole\Coroutine\Http\Client;

use function Swoole\Coroutine\run;

run(function () {
    $client = new Client("127.0.0.1", 8000);
    $client->upgrade("/?token=secret");
    while (true) {
        $client->push(json_encode([
            "event" => "publish",
            "message" => [
                "ph" => rand(0, 14),
                "tds" => rand(0, 1000),
                "distance" => rand(0, 100),
                "temp" => rand(0, 100)
            ]
        ]));

        Coroutine::sleep(2);
    }
});
