<?php


use Illuminate\Database\Capsule\Manager as Capsule;
use Illuminate\Database\Schema\Blueprint;

require_once __DIR__ . "/NormalConnection.php";

Capsule::schema()->create('tmp', function (Blueprint $table) {
    $table->increments('id');
    $table->float('ph');
    $table->float('temperature');
    $table->float('tds');
    $table->float('distance');
    $table->timestamps();
});

Capsule::schema()->create('history', function (Blueprint $table) {
    $table->increments('id');
    $table->float('ph');
    $table->float('temperature');
    $table->float('tds');
    $table->float('distance');
    $table->timestamp('created_at')->useCurrent();
});;

Capsule::schema()->create("users", function (Blueprint $table) {
    $table->string("username")->unique();
    $table->string("name");
    $table->id();
    $table->string("password");
});
