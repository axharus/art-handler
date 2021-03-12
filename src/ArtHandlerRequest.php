<?php
namespace Axharus\ArtHandler;

use Axharus\ArtHandler\Model\QaBundle;
use GuzzleHttp\Client;

class ArtHandlerRequest {
    protected $api;
    protected $path;
    protected $ip;
    protected $type;
    protected $error_content;
    protected $browser;
    protected $screen_size;
    protected $os;
    protected $status_code;
    protected $referer;
    protected $time;


    protected function create_request(){
        $query = [
            'api'           => $this->api,
            'path'          => $this->path,
            'ip'            => $this->ip,
            'type'          => $this->type,
            'error_content' => substr($this->error_content, 0, 1000).'...',
            'browser'       => $this->browser,
            'screen_size'   => $this->screen_size,
            'os'            => $this->os,
            'status_code'   => $this->status_code,
            'referer'       => $this->referer,
            'time'          => time()
        ];
        if($this->time){
            $query['time'] = $this->time;
        }

        return $query;
    }

    protected function queue_request($url,  $data){
        $chunk_size = env('ARTDEBUGER_CHUNKSIZE', 1);
        $response = false;
        if($chunk_size == 1){
            $response = $this->send_queue_request($url,  $data);
        }else{
            try{
                if(QaBundle::database_count() < $chunk_size){
                    QaBundle::database_add($data);
                    $response = [
                        'body'   => 'To database',
                        'status' => '200'
                    ];
                }elseif(QaBundle::database_count() >= $chunk_size){
                    QaBundle::database_add($data);
                    $data = QaBundle::database_get();
                    $response = $this->send_queue_request($url,  json_encode($data), true);
                    if($response['body'] == 'Created'){
                        QaBundle::database_delete();
                    }
                }
            }catch (\Exception $e){
                if(env('APP_DEBUG')){
                    dump('ArtHandler Something wrong with database', $e);
                }
            }
        }

        return $response;
    }

    protected function send_queue_request($url,  $data, $post = false){
        $client   = new Client();
        if($post){
            $request = $client->request('POST', $url, [
                'query' => [
                    'api' => env('ARTDEBUGER_API', false)
                ],
                'form_params' => [
                    'data' => $data
                ]
            ]);
        }else{
            $request = $client->get($url, [
                'query' => $data
            ]);
        }

        return [
            'body'   => (string) $request->getBody(),
            'status' => $request->getStatusCode()
        ];
    }
}
