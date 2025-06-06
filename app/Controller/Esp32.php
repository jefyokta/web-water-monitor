<?php

namespace App\Controller;

use App\Database\Pool;
use App\Service\Preference;
use Exception;
use Oktaax\Http\Request;
use Oktaax\Http\Response;
use Oktaax\Http\ResponseJson;
use Swoole\Coroutine\Http\Client;

class Esp32
{

    public static function store(Request $req, Response $res)
    {
        $conn = Pool::get();
        try {

            $val = $req->validate([
                "password" => "required",
                "distance" => "required|numeric",
                "calibration" => "required|numeric"
            ], $req->bodies());

            $data = $val->getData();
            $err = $val->getErrors();

            if (!empty($err)) {
                return $res->status(400)->json(new ResponseJson($err, "Missing or invalid request", true));
            }

            $pass = $data['password'];

            $stmt = $conn->prepare("SELECT password FROM users WHERE username = ?");
            $stmt->execute(['super_user']);
            $storedPassHash = $stmt->fetchColumn();

            if (!password_verify($pass, $storedPassHash ?? "")) {
                return $res->status(401)->json(new ResponseJson([], "Unauthorized", true));
            }
            $espHost = Preference::get("espHost") ?? false;
            if (!$espHost) {
                return $res->status(500)->json(new ResponseJson([], "ESP is out of network", true));
            }

            $client = new Client($espHost);
            $client->setHeaders(['Content-Type' => 'application/x-www-form-urlencoded']);
            $client->post("/configuration", [
                "calibration" => floatval($data["calibration"]),
                "distance" => floatval($data["distance"])
            ]);
            if ($client->statusCode == 200) {

                return $res->json(new ResponseJson([], "Configuration sent to ESP successfully"));
            };
            return $res->status(500)->json(new ResponseJson([], "Configuration sent to ESP unsuccessfully", true));
        } catch (Exception $e) {
            return $res->status(500)->json(new ResponseJson([], "Error: " . $e->getMessage(), true));
        } finally {
            Pool::put($conn);
        }
    }
};
