<?php

use App\Http\Middleware\HelloWorldMiddleware;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HelloWorldController;

Route::controller(HelloWorldController::class)->group(function () {
    Route::get('/hello-world', 'index');
    Route::get('/hello-world/{name}', 'getName')->middleware(HelloWorldMiddleware::class);
});

Route::fallback(function () {
    return "Welcome to the Teamtjie API";
});