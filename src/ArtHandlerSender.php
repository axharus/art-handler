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

    /**
     * ArtHandlerSender constructor.
     *
     *
     *
     * @param array $params
     */
    public function __construct($params = []) {
        $this->api           = env('ARTDEBUGER_API', false);
        $this->path          = $params['path']??url()->full();
        $this->ip            = $params['ip']??request()->ip();
        $this->type          = $params['type']??"php";
        $this->error_content = $params['error_content']??'Empty';
        $this->browser       = $params['HTTP_USER_AGENT']??$_SERVER['HTTP_USER_AGENT']??'';
        $this->screen_size   = $params['screen_size']??'';
        $this->os            = $params['os']??'';
        $this->status_code   = $params['status_code']??'4';

    }

    public function send() {
        if (env('APP_DEBUG') && ! env('ARTDEBUGER_FORCEDEBUG', false)) {
            return false;
        }
        $client   = new Client();
        $root     = env('ARTDEBUGER_ALTERNATIVE', 'https://qa.art-sites.org');
        $response = $client->get($root.'/receive', [
            'query' => [
                'api'           => $this->api,
                'path'          => $this->path,
                'ip'            => $this->ip,
                'type'          => $this->type,
                'error_content' => substr($this->error_content, 0, 1000) . '...',
                'browser'       => $this->browser??$_SERVER['HTTP_USER_AGENT']??'',
                'screen_size'   => $this->screen_size,
                'os'            => $this->os,
                'status_code'   => $this->status_code
            ]
        ]);


        return [
            'body'   => (string) $response->getBody(),
            'status' => $response->getStatusCode()
        ];
    }
}
