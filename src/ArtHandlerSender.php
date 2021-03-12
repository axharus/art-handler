<?php


namespace Axharus\ArtHandler;


use Axharus\ArtHandler\Model\QaBundle;
use Carbon\Carbon;
use GuzzleHttp\Client;

class ArtHandlerSender extends ArtHandlerRequest {

    /**
     * ArtHandlerSender constructor.
     *
     *
     *
     * @param array $params
     */
    public function __construct($params = []) {
        $user_agent = 'Empty on server';

        if ($this->isne($params, 'HTTP_USER_AGENT')) {
            $user_agent = $this->browser;
        } elseif (isset($_SERVER['HTTP_USER_AGENT'])) {
            $user_agent = $_SERVER['HTTP_USER_AGENT'];
        }

        $referer = 'Empty';
        if ($this->isne($params, 'referer')) {
            $referer = $params['referer'];
        } elseif (isset($_SERVER['HTTP_REFERER'])) {
            $referer = $_SERVER['HTTP_REFERER'];
        }

        $this->api           = env('ARTDEBUGER_API', false);
        $this->path          = $this->isne($params, 'path') ? $params['path'] : url()->full();
        $this->ip            = $this->isne($params, 'ip') ? $params['ip'] : request()->ip();
        $this->type          = $this->isne($params, 'type') ? $params['type'] : "php";
        $this->error_content = $this->isne($params, 'error_content') ? $params['error_content'] : 'Empty';
        $this->browser       = $user_agent;
        $this->screen_size   = $this->isne($params, 'screen_size') ? $params['screen_size'] : 'null';
        $this->os            = $this->isne($params, 'os') ? $params['os'] : 'null';
        $this->status_code   = $this->isne($params, 'status_code') ? $params['status_code'] : '4';
        $this->referer       = $referer;
        $this->time          = $this->isne($params, 'time') ? $params['time'] : false;


    }

    public function send() {
        try {
            $access = $this->check_access();
            if($access){
                return $access;
            }

            $root     = env('ARTDEBUGER_ALTERNATIVE', 'https://qa.art-sites.org');
            $query    = $this->create_request();
            $response = $this->queue_request($root.'/receive', $query);

            return $response;
        } catch (\Exception $e) {
            if(env('APP_DEBUG')){
                dump('Art handler execpiton', $e);
            }

            return 'fail';
        }
    }


    private function check_access(){
        if(!env('ARTDEBUGER_ENABLED', true)){
            return [
                'body'   => 'Not enabled',
                'status' => '200'
            ];
        }
        if (env('APP_DEBUG') && ! env('ARTDEBUGER_FORCEDEBUG', false)) {
            return [
                'body'   => 'Not enabled',
                'status' => '200'
            ];
        }
        if(in_array($this->status_code, explode(',', env('ARTDEBUGER_PREVENTOR', '')))){
            return [
                'body'   => 'Prevented',
                'status' => '200'
            ];
        }
        return false;
    }

    public function isne($array, $key) {
        return isset($array[ $key ]) && ! empty($array[ $key ]);
    }
}
