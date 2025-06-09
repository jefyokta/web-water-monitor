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

    private static $commands = [
        "/ph",
        "/ultrasonic",
        "/temperature",
        "/tds"
    ];

    public static function store(Request $request, Response $response)
    {

        $url = $request->json("url") ?? false;
        if ($url) {
            $client = new Client(self::$telehost, 443, true);
            $data = ["url" => $url . "/telegram"];
            $client->setHeaders(["content-type" => "application/json"]);
            $token = $_ENV['BOT_TOKEN'];
            $res = $client->post("/bot$token/setWebhook", json_encode($data));
            if ($client->errCode == 0) {
                $client->close();
                Preference::set("teleHost", $url);
                $response->json(new ResponseJson(["url" => $url], "ok", false));
            } else {
                $client->close();
                $response->header('content-type', 'application/json')->status(500)->end(json_encode(["message" => "opps something wrong", "error" => true]));
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
        if (!Preference::has("teleHost") || Preference::get("teleHost") == "") {
            $client = new Client(self::$telehost, 443, true);
            $token = $_ENV['BOT_TOKEN'];
            $client->get("/bot$token/getWebhookInfo");
            $body = json_decode($client->getBody()) ?? "";
            $url = $body?->result?->url;
            if (!empty($url)) {
                $host = parse_url($url, PHP_URL_HOST) ?? '';
                Preference::set("teleHost", $host);
            }
            $client->close();
        }
        $response
            ->header("content-type", "application/json")
            ->end(json_encode(["host" => Preference::get("teleHost")]));
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
            return "invalid command use /ph /ultrasonic /temperature or /tds";
        }

        $pdo = Pool::get();
        try {
            $pdo->beginTransaction();
            $stmt = $pdo->query("SELECT * FROM tmp");
            $data = $stmt->fetch(\PDO::FETCH_ASSOC);
            $pdo->commit();

            return self::assert($msg, $data) ?? "";
        } catch (\Throwable $th) {
            $pdo->rollBack();
            return "Sorry, server is broken";
        } finally {
            Pool::put($pdo);
        }
    }

    public static function assert($message, $data)
    {
        $res = "unknown command `$message`\n available command \n" . implode("\n", self::$commands);
        if (empty($data)) {
            return "esp never give any data";
        }
        switch ($message) {
            case self::$commands[0]:
                $res = $data["ph"] ?? "";
                break;
            case self::$commands[1]:
                $res = $data["deep"] ?? "";
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
