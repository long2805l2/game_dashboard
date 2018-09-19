<?php
require_once 'config.php';
header("Access-Control-Allow-Origin: *");

if (!array_key_exists('userId', $_GET) || empty($_GET['userId']))
    exit('{"error": "Missing param: userId"}');

$userId = $_GET['userId'];

$db = getMemcached(BUCKET_INDEX);
$keyXu = 'kvtm_'.$userId.'_xu';
$raw = $db->get($keyXu);
if ($raw === false)
    exit('{"error": "null xu"}');

$coin = intval($raw);

$db = getMemcached(BUCKET_USER_1);
$keyGame = 'kvtm_'.$userId.'_game';

$raw = $db->get($keyGame);
if ($raw === false)
    exit('{"error": "null data"}');

$data = json_decode($raw);
$data->coin = $coin;
$data->userId = $userId;

echo json_encode($data);
?>