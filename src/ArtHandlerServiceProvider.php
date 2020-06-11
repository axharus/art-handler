<?php
namespace Axharus\ArtHandler;

use Illuminate\Support\ServiceProvider;

class ArtHandlerServiceProvider extends ServiceProvider{
    public function boot(){
        $this->app->singleton(\Illuminate\Contracts\Debug\ExceptionHandler::class, ArtHandler::class);
    }

    public function register() {
//        $this->app->singleton(ArtHandler::class, function(){
//            return new ArtHandler();
//        });
        $this->publishes([
            __DIR__.'/public' => public_path('vendor/debuger'),
        ], 'public');

        $this->loadRoutesFrom(__DIR__.'/routes.php');
    }
}
