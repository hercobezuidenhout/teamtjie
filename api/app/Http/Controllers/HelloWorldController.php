<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HelloWorldController extends Controller
{
    public function index()
    {
        return response()->json([
            'message' => 'Hello, World!'
        ]);
    }

    public function getName($name)
    {
        return response()->json([
            'message' => 'Hello, ' . $name . '!'
        ]);
    }
}
