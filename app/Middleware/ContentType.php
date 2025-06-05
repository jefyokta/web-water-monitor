<?php

namespace App\Middleware;

use Oktaax\Http\Request;
use Oktaax\Http\Response;

class ContentType
{
    protected static $mimetype = [
        'js' => 'application/javascript',
        'css' => 'text/css',
        'json' => 'application/json',
        'svg' => 'image/svg+xml',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
    ];

    public static function handle(Request $request, Response $response, $next)
    {

        $ext = pathinfo($request->uri, PATHINFO_EXTENSION);
        if (self::$mimetype[$ext] ?? false) {
            $response->header("content-type", self::$mimetype[$ext]);
            $response->header("x-powered-by", "oktaax");
        }
        $next($request, $response);
    }
};