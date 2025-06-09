<?php

namespace App\Controller;

use App\Database\Pool;
use Oktaax\Http\Inertia;
use Oktaax\Http\Request;
use Oktaax\Http\Response;
use PDO;

class History
{


    public static function index(Request $request, Response $response)
    {
        $page = max((int) @$request->get('page', 1), 1);
        $limit = 10;
        $offset = ($page - 1) * $limit;

        $pdo = Pool::get();

        try {
            $stmt = $pdo->query("SELECT COUNT(*) FROM history");
            $total = (int) $stmt->fetchColumn();

            $stmt = $pdo->prepare("SELECT * FROM history ORDER BY created_at DESC LIMIT :limit OFFSET :offset");
            $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
            $stmt->execute();
            $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);

            return Inertia::render('History', [
                'data' => $posts,
                'pagination' => [
                    'total' => $total,
                    'page' => $page,
                    'last_page' => ceil($total / $limit),
                    "per_page"=>10
                ],
            ]);
        } catch (\Throwable $th) {
            $response->status(500)->end();
        } finally {
            Pool::put($pdo);
        }
    }
}
