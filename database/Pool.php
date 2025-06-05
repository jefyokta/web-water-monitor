<?php

namespace App\Database;

use Swoole\ConnectionPool;
use PDO;

class Pool
{
    /**
     * @var \Swoole\ConnectionPool<\PDO>
     */
    protected static $connection;

    static function create(int $maxConn)
    {
        try {
            self::$connection = new ConnectionPool(function () {
                $config = require __DIR__ . "/../config/app.php";
                return new PDO(
                    "mysql:host={$config['db']['host']};dbname={$config['db']['name']};charset=utf8mb4",
                    $config['db']['user'],
                    $config['db']['pass'],
                    [
                        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    ]
                );
            }, $maxConn);
        } catch (\Throwable $th) {
            throw $th;
            // exit(1);
        }
    }

    static function get()
    {
        return self::$connection->get();
    }

    static function fill()
    {
        return self::$connection->fill();
    }

    static function put($pdo)
    {
        return self::$connection->put($pdo);
    }

    static function close(){
        self::$connection->close();
    }
};
