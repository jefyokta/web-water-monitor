<?php

namespace App\Controller;

use App\Database\Pool;
use Oktaax\Http\Inertia;

class Home
{
    public static function index($req, $res)
    {
        Inertia::render("Index");
    }
}
