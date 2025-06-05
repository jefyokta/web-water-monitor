<?php

namespace App\Controller;

use Oktaax\Http\Inertia;
use Oktaax\Http\Request;
use Oktaax\Http\Response;

class Dashboard
{
    public static function index(Request $request, Response $response)
    {
        Inertia::render("Dashboard", ["botUsername" => $_ENV["BOT_USERNAME"]]);
    }
};
