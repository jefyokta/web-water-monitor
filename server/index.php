<?php

use App\Channel\Consumer;
use App\Controller\Dashboard;
use App\Controller\Esp32;
use App\Controller\Home;
use App\Controller\Telegram;
use App\Database\Pool;
use App\Middleware\ContentType;
use App\Service\Preference;
use Oktaax\Http\Inertia;
use Oktaax\Http\Middleware\Csrf;
use Oktaax\Http\Request;
use Oktaax\Http\Response;
use Oktaax\Http\ResponseJson;
use Oktaax\Oktaax;
use Oktaax\Trait\HasWebsocket;
use Oktaax\Views\PhpView;
use Oktaax\Websocket\Support\Table as SupportTable;
use Swoole\Coroutine\Http\Client;
use Swoole\Server\Task;
use Swoole\Table;

$app =  new class extends Oktaax {
    use HasWebsocket;
};

Pool::create(5);
Preference::create();

$app->table(function (Table $table) {
    $table->column("is_esp", Table::TYPE_INT);
});

$app->setServer('task_worker_num', 2);
$app->setServer('task_enable_coroutine', true);
$app->setView(new PhpView(__DIR__ . "/../resources/view/"));

// $app->use(Csrf::handle($_ENV["APP_KEY"]));
// $app->use(Csrf::generate($_ENV["APP_KEY"], 12000));
$app->use([ContentType::class, "handle"]);


$app->documentRoot(__DIR__ . "/../public/");
$app->on("Task", function ($server, Task $task) {
    $pdo = Pool::get();
    try {
        $data = $task->data["payload"];
        if ($task->data["action"] === "insert") {
            $stmt = $pdo->prepare("INSERT INTO history (ph, ultra, temp, tds) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['ph'],
                $data['ultra'],
                $data['temp'],
                $data['tds']
            ]);
        } elseif ($task->data["action"] === "update") {
            $pdo->prepare("
            INSERT INTO tmp (id, ph, ultra, temp, tds)
            VALUES (1, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
                ph = VALUES(ph),
                ultra = VALUES(ultra),
                temp = VALUES(temp),
                tds = VALUES(tds)")->execute([
                $data['ph'],
                $data['ultra'],
                $data['temp'],
                $data['tds']
            ]);
        }
    } catch (\Throwable $e) {
        echo "Task error: " . $e->getMessage();
    } finally {
        Pool::put($pdo);
    }

    $task->finish("done");
});


$app->on("Finish", function ($s, $id) {
    echo "finish $id\n";
});
$app->on("WorkerStart", function () {
    echo "filling pool\n";
    Pool::fill();
});
$app->on("WorkerExit", function () {
    Pool::close();
});



$app->get("/", [Home::class, 'index']);
$app->get("/dashboard", [Dashboard::class, "index"]);

$app->get("/history", function () {
    Inertia::render("History");
});


$app->post("/telegram/bot/webhook", [Telegram::class, "store"]);
$app->get("/telegram/bot/webhook", [Telegram::class, "getWebhook"]);
$app->get("/telegram/bot/username", [Telegram::class, "index"]);

$app->post("/telegram", [Telegram::class, "chat"]);
$app->post("/esp", [Esp32::class, "store"]);



//ws

$app->gate(function ($serv, $request) {
    if (@$request->has("token") && @$request->get("token") == "secret") {
        echo "esp join";
        SupportTable::add($request->fd, ["is_esp" => true]);
        $serv
            ->toChannel(Consumer::class)
            ->broadcast(json_encode(["event" => "esp_join"]));
    }
});

$app->ws("esp_status", function ($serv, $client) {
    $espAvailable = SupportTable::getTable()->count() > 0;
    $esphst = Preference::get("espHost") ?? null;
    $serv->reply(["event" => "esp_status", "message" => ["status" => $espAvailable,"esp_host"=>$esphst]]);
});
$app->ws("publish", function ($serv, $client) {

    if (!SupportTable::get($client->fd)) {
        $serv->reply("Unauthorized");
    } else {
        echo "esp publishing";
        $serv
            ->toChannel(Consumer::class)
            ->broadcast(json_encode(["event" => "publish", "message" => $client->data]));
    }
});

$app->exit(function ($serv, $fd) {
    if (SupportTable::get($fd)) {
        SupportTable::remove($fd);
        $serv
            ->toChannel(Consumer::class)
            ->broadcast(json_encode(["event" => "esp_exit"]));
    }
});

return $app;
