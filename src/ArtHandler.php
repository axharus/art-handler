<?php


namespace Axharus\ArtHandler;


use App\Exceptions\Handler;
use Illuminate\Auth\AuthenticationException;
use \Illuminate\Contracts\Debug\ExceptionHandler;
use Symfony\Component\HttpKernel\Exception\HttpException;

class ArtHandler extends Handler implements ExceptionHandler {

    public function report($e) {
        if(!strpos($e->getFile(), 'axharus/art-handler')){
            $status = 0;
            $message = "";
            if($e instanceof AuthenticationException){
                $message = "Status code => 403\n";
                $message .= "Info => ".$e->getMessage()."\n";
                $message .= "Trace => ".$e->getTraceAsString();
                $status = 403;
            }elseif($e instanceof HttpException){
                $message = "Status code => ".$e->getStatusCode()."\n";
                $message .= "Info => ".$e->getMessage()."\n";
                $message .= "Trace => ".$e->getTraceAsString();
                $status = $e->getStatusCode();
            }else{
                $message = "Status code => ".$e->getCode()."\n";
                $message .= "Info => ".$e->getMessage()."\n";
                $message .= "Trace => ".$e->getTraceAsString();
                $status = $e->getCode();
            }
            $sender  = new ArtHandlerSender([
                "type"          => "php",
                "error_content" => $message,
                "screen_size"   => "",
                "status_code"      => $status
            ]);
            $sender->send();
        }

        return parent::report($e);
    }

    public static function scriptLoader($link){
        global $art_microtime;
        $time_to_load =round(microtime(true) - $art_microtime, 2);
        $preventor = '[';
        $com = "";
        foreach (explode(',', env("ARTDEBUGER_PREVENTOR", "")) as $item) {
            if($item){
                $preventor.=$com.intval($item);
                $com = ',';
            }
        }
        $preventor .= ']';

        $debuger = env("ARTDEBUGER_JS_DEBUG", false) ? 'true' : 'false';

        $output = "<script>\n";
        $output .= "window.artdebug = ".$debuger.";\n";
        $output .= "window.artpreventor = ".$preventor.";\n";
        $output .= "window.artloadingtime = ".$time_to_load.";\n";
        $output .= "window.arthandlerurl = '".env('ARTDEBUGER_HANDLER_URL', '')."';\n\n";
        $output .= file_get_contents(public_path().$link);
        $output .= "</script>";
        return $output;
    }
}
