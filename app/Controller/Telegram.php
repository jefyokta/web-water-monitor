<?php

namespace App\Controller;

use App\Database\Pool;
use App\Service\Preference;
use Oktaax\Console;
use Oktaax\Http\Request;
use Oktaax\Http\Response;
use Oktaax\Http\ResponseJson;
use Swoole\Coroutine;
use Swoole\Coroutine\Http\Client;

use function Swoole\Coroutine\go;

class Telegram
{

    private static $telehost = "api.telegram.org";

    private static $commands = ["/ph", "/ultrasonic", "/temperature", "/tds"];

    public static function store(Request $request, Response $response)
    {

        $url = $request->post("url") ?? false;
        if ($url) {
            $client = new Client(self::$telehost, 443, true);
            $data = ["url" => $url];
            $client->setHeaders(["content-type" => "application/json"]);
            $res = $client->post("/bot{$_ENV['BOT_TOKEN']}/setWebhook", json_encode($data));
            if ($client->errCode == 0) {
                $client->close();
                $response->json(new ResponseJson([], "ok", false));
            } else {
                $client->close();
                $response->end(500);
            }
        } else {
            $response->status(400)->json(new ResponseJson([], "url field is required!", true));
        }
    }


    public static function index(Request $request, Response $response)
    {
        $response->json(new ResponseJson(["name" => $_ENV["BOT_USERNAME"]]), "ok");
    }

    public static function getWebhook($_, Response $response)
    {
        if (!Preference::has("teleHost")) {
            $client = new Client(self::$telehost, 443, true);
            $token =$_ENV['BOT_TOKEN'];
            $client->get("/bot$token/getWebhookInfo");
            $response->header("content-type", "application/json")->end($client->getBody());
        }
    }
    public static function chat(Request $request, Response $response)
    {

        $message = $request->json("message");
        $chatId = $message['chat']["id"];
        $chat = $message["text"];


        Coroutine::writeFile("storage/log", json_encode($request, JSON_PRETTY_PRINT));
        go(function () use ($chatId, $chat) {
            $token = $_ENV['BOT_TOKEN'];
            $host = self::$telehost;
            $client = new Client($host, 443, true);
            $client->setHeaders([
                "Content-Type" => "application/json",
                "Host" => $host
            ]);

            $url = "/bot{$token}/sendMessage";
            $body = json_encode([
                "chat_id" => $chatId,
                "text" => self::getResponse($chat)
            ]);

            $client->post($url, $body);
            Console::log($client->getBody());
            $client->close();
        });

        $response->end();
    }


    private static function getResponse(string $msg): string
    {
        if (!in_array($msg, self::$commands)) {
            return "invalid command";
        }

        $pdo = Pool::get();
        try {
            $pdo->beginTransaction();
            $stmt = $pdo->query("SELECT * FROM tmp");
            $data = $stmt->fetch(\PDO::FETCH_ASSOC);
            $pdo->commit();

            return self::assert($msg, $data) . " ,last_update:" . $data["last_update"] ?? "";
        } catch (\Throwable $th) {
            $pdo->rollBack();
            return "Sorry, server is broken";
        } finally {
            Pool::put($pdo);
        }
    }

    public static function assert($message, $data)
    {
        $res = "";
        if (empty($data)) {
            return "esp never give $message data";
        }
        switch ($message) {
            case self::$commands[0]:
                $res = $data["ph"] ?? "";
                break;
            case self::$commands[1]:
                $res = $data["ultra"] ?? "";
                break;
            case self::$commands[2]:
                $res = $data["temp"] ?? "";
                break;
            case self::$commands[3]:
                $res = $data["tds"] ?? "";
                break;

            default:
                break;
        }

        return $res;
    }
};
