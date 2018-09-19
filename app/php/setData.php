<?php
require_once 'config.php';

if (!array_key_exists('userId', $_GET) || empty($_GET['userId']))
    exit("Missing param: userId");
$userId = $_GET['userId'];
echo "userId: $userId <br>";

$db = getMemcached(BUCKET_INDEX);
$keyXu = 'kvtm_'.$userId.'_xu';
$raw = $db->get($keyXu);
if ($raw === false)
    exit("NULL xu");
$coin = intval($raw);

$db = getMemcached(BUCKET_USER_1);
$keyGame = 'kvtm_'.$userId.'_game';
$raw = $db->get($keyGame);
if ($raw === false)
    exit("NULL game");

$data = json_decode($raw);
$data->coin = $coin;

if (isset($_GET['level']))
{
    $level = intval($_GET['level']);
    $data->level = $level;
    echo "new level: $level <br>";
}

if (isset($_GET['gold']))
{
    $gold = intval($_GET['gold']);
    $data->gold = $gold;
    echo "new gold: $gold <br>";
}

if (isset($_GET['reputation']))
{
    $reputation = intval($_GET['reputation']);
    $data->reputation = $reputation;
    echo "new reputation: $reputation <br>";
}

$raw = json_encode($data);
$db->set($keyGame, $raw);

echo prettyPrint($raw, true);

