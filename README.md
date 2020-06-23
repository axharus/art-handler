# ArtHandler

This package only for art-sites.org clients.

What this package for
  - Logging errors inside laravel
  - Logging errors in JS and XHR Requests

Plugin works only when ```debug=false``` in .env file
### Installation

ArtHandler requires Laravel v5.6+ and php 7.2+ to run.

Install package

```sh
$ composer require axharus/art-handler
```

Add provider to app.js if laravel version is lower than 5.5
```php
\Axharus\ArtHandler\ArtHandlerServiceProvider::class
```

Publish resources

```sh
$ php artisan vendor:publish --provider="Axharus\ArtHandler\ArtHandlerServiceProvider" --force 
```
For production it is better to use bable because debuger.js is written on ES6

Install debbuger.js into your template. Please install it in head section on top of outer in order to catch all error in your application.

```html
{!! \Axharus\ArtHandler\ArtHandler::scriptLoader('/vendor/debuger/debuger.js') !!}
```
Pass path to babeled file into this function or use default if it is only for dev purposes



Configure .env file
```
ARTDEBUGER_API=api_key
ARTDEBUGER_FORCEDEBUG=false
ARTDEBUGER_JS_DEBUG=false
ARTDEBUGER_PREVENTOR=
ARTDEBUGER_HANDLER_URL=
```
API key you can get from your project manager

If you want to work with plugin with ```debug=true``` set ```FORCEDEBUG=true```.

If you want to see sending log in console set ```ARTDEBUGER_JS_DEBUG=true```
 
If you want to prevent sending errors with some codes pass it to ```ARTDEBUGER_ARTPREVENTOR``` using comma ```404,500,403```
