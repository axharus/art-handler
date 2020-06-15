# ArtHandler

This package only for art-sites.org clients.

What this package for
  - Logging errors inside laravel
  - Logging errors in JS and XHR Requests


### Installation

ArtHandler requires Laravel v5.6+ to run.

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
$ php artisan vendor:publish --provider="Axharus\ArtHandler\ArtHandlerServiceProvider"   
```
For production it is better to use babale because debuger.js is written on ES6

Install debbuger.js into your template. Please install it in head section on top of outher in order to catch all error in your application.

```html
<script>
    window.artdebug = false;
    window.artpreventor = [404];
</script>
<script src="{{asset('vendor/debuger/debuger.js')}}"></script>
```

Here is 2 configs
If you want to see process of sending all bugs in debug console set ```artdebug = true```
If you want to prevent sending errors with some status code add them to ```artpreventor``` array
By default 404 code is prevented from sending

Configure .env file
```
ARTDEBUGER_API=api_key
ARTDEBUGER_FORCEDEBUG=false
```
API key you can get from your project manager
