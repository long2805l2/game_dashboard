<?php
define('BUCKET_INDEX', 'index');
define('BUCKET_CACHE', 'cache');
define('BUCKET_USER_1', 'user_1');

$configBucket = array(
    BUCKET_INDEX => array(
        'ip' => '127.0.0.1',
        'port' => '11220'
    ),
    BUCKET_CACHE => array(
        'ip' => '127.0.0.1',
        'port' => '11240'
    ),
    BUCKET_USER_1 => array(
        'ip' => '127.0.0.1',
        'port' => '11230'
    ),
);

function getMemcached ($bucketId)
{
    global $configBucket, $mapMemcached;
    if (isset($configBucket[$bucketId]))
    {
        if (!isset($mapMemcached))
            $mapMemcached = array();
        if (!isset($mapMemcached[$bucketId]))
        {
            $bucket = new Memcached();
            $bucket->addServer($configBucket[$bucketId]['ip'], $configBucket[$bucketId]['port']);
            $mapMemcached[$bucketId] = $bucket;
        }
        return $mapMemcached[$bucketId];
    }
    return false;
}

function prettyPrint( $json, $html = false)
{
    $result = '';
    $level = 0;
    $in_quotes = false;
    $in_escape = false;
    $ends_line_level = NULL;
    $json_length = strlen( $json );

    for( $i = 0; $i < $json_length; $i++ ) {
        $char = $json[$i];
        $new_line_level = NULL;
        $post = "";
        if( $ends_line_level !== NULL ) {
            $new_line_level = $ends_line_level;
            $ends_line_level = NULL;
        }
        if ( $in_escape ) {
            $in_escape = false;
        } else if( $char === '"' ) {
            $in_quotes = !$in_quotes;
        } else if( ! $in_quotes ) {
            switch( $char ) {
                case '}': case ']':
                    $level--;
                    $ends_line_level = NULL;
                    $new_line_level = $level;
                    break;

                case '{': case '[':
                    $level++;
                case ',':
                    $ends_line_level = $level;
                    break;

                case ':':
                    $post = " ";
                    break;

                case " ": case "\t": case "\n": case "\r":
                    $char = "";
                    $ends_line_level = $new_line_level;
                    $new_line_level = NULL;
                    break;
            }
        } else if ( $char === '\\' ) {
            $in_escape = true;
        }
        if( $new_line_level !== NULL ) {
            if ($html)
                $result .= "<br>".str_repeat( "&nbsp;&nbsp;&nbsp;", $new_line_level );
            else
                $result .= "\n".str_repeat( "\t", $new_line_level );
        }
        $result .= $char.$post;
    }

    return $result;
}