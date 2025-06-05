<?php

use App\Controller\Dashboard;
use App\Controller\Home;
use App\Controller\Telegram;
use App\Database\Pool;
use App\Middleware\ContentType;
use Oktaax\Http\Inertia;

use Oktaax\Oktaax;
use Oktaax\Trait\HasWebsocket;
use Oktaax\Views\PhpView;
use Swoole\Coroutine\Http\Client;
use Swoole\Server\Task;
use Swoole\Table;

$app =  new class extends Oktaax {
    use HasWebsocket;
};

Pool::create(5);
$app->table(function(Table $table){
    $table->column("is_esp",Table::TYPE_INT);
});

$app->setServer('task_worker_num', 2);
$app->setServer('task_enable_coroutine', true);
$app->setView(new PhpView(__DIR__ . "/../resources/view/"));
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
$app->get("/configuration", function () {
    Inertia::render("Configuration");
});


$app->post("/telegram/bot/webhook", [Telegram::class, "store"]);
$app->get("/telegram/bot/webhook", [Telegram::class, "getWebhook"]);
$app->get("/telegram/bot/username", [Telegram::class, "index"]);

$app->post("/telegram", [Telegram::class, "chat"]);

$app->ws("publish", function ($serv, $client) {});

return $app;
