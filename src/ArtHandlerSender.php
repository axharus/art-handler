<?php


namespace Axharus\ArtHandler;


use GuzzleHttp\Client;

class ArtHandlerSender {
    private $api;
    private $path;
    private $ip;
    private $type;
    private $error_content;
    private $browser;
    private $screen_size;
    private $os;
    private $status_code;
    private $referer;

    /**
     * ArtHandlerSender constructor.
     *
     *
     *
     * @param array $params
     */
    public function __construct($params = []) {
        $this->api           = env('ARTDEBUGER_API', false);
        $this->path          = $this->isne($params, 'path') ? $params['path'] : url()->full();
        $this->ip            = $this->isne($params, 'ip') ? $params['ip'] : request()->ip();
        $this->type          = $this->isne($params, 'type') ? $params['type'] : "php";
        $this->error_content = $this->isne($params, 'error_content') ? $params['error_content'] : 'Empty';
        $this->browser       = $this->isne($params, 'HTTP_USER_AGENT') ? $params['HTTP_USER_AGENT'] : isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
        $this->screen_size   = $this->isne($params, 'screen_size') ? $params['screen_size'] : 'null';
        $this->os            = $this->isne($params, 'os') ? $params['os'] : 'null';
        $this->status_code   = $this->isne($params, 'status_code') ? $params['status_code'] : '4';
        $this->referer       = $this->isne($params, 'referer') ? $params['referer'] : isset($_SERVER['HTTP_REFERER']) ? $_SERVER['HTTP_REFERER'] : 'Empty';


    }

    public function isne($array, $key){
        return isset($array[$key]) && !empty($array[$key]);
    }

    public function send() {
        if (env('APP_DEBUG') && ! env('ARTDEBUGER_FORCEDEBUG', false)) {
            return 'Not enabled';
        }
        $client   = new Client();
        $root     = env('ARTDEBUGER_ALTERNATIVE', 'https://qa.art-sites.org');
        $response = $client->get($root.'/receive', [
            'query' => [
                'api'           => $this->api,
                'path'          => $this->path,
                'ip'            => $this->ip,
                'type'          => $this->type,
                'error_content' => substr($this->error_content, 0, 1000).'...',
                'browser'       => $this->browser ? $this->browser : isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : 'null',
                'screen_size'   => $this->screen_size,
                'os'            => $this->os,
                'status_code'   => $this->status_code,
                'referer'       => $this->referer
            ]
        ]);


        return [
            'body'   => (string) $response->getBody(),
            'status' => $response->getStatusCode()
        ];
    }
}
