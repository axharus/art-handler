<?php
namespace Axharus\ArtHandler;

use Illuminate\Support\ServiceProvider;

class ArtHandlerServiceProvider extends ServiceProvider{
    public function boot(){
        $this->app->singleton(\Illuminate\Contracts\Debug\ExceptionHandler::class, ArtHandler::class);
        $this->publishes([
            __DIR__.'/public' => public_path('vendor/debuger'),
        ], 'public');

    }

    public function register() {
        $this->loadRoutesFrom(__DIR__.'/routes.php');
    }
}
