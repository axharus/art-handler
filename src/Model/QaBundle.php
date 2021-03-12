<?php

namespace Axharus\ArtHandler\Model;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class QaBundle extends Model {
    protected $table = 'qa_bundle';
    protected $fillable = ['request_data', 'created_at', 'updated_at'];

    public static function database_add($data){
        self::create([
            'request_data' => json_encode($data),
            'created_at'   => Carbon::now(),
            'updated_at'   => Carbon::now()
        ]);
    }

    public static function database_delete(){
        self::truncate();
    }

    public static function database_count(){
        return self::count();
    }

    public static function database_get(){
        return self::all();
    }
}
