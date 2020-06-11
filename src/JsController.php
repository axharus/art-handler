<?php

namespace Axharus\ArtHandler;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class JsController extends Controller {
    public function index() {
        $sender = new ArtHandlerSender([
            "type"          => "js",
            "error_content" => \request()->input('error'),
            "path"          => \request()->input('path'),
            "screen_size"   => \request()->input('screen'),
            "status_code"      => \request()->input('status_code')
        ]);
        $status = $sender->send();

        return response($status, 200);
    }
}
