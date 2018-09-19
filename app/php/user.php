<?php
	include_once 'config.php';

	$PATH = array (
		"view" => "http://49.213.72.182/kvtm/view.php"
	,	"setData" => "http://49.213.72.182/kvtm/setData.php"
	,	"coin" => "http://49.213.72.182/kvtm/billing/test/testDirect.php"
	);

	function run ()
	{
		global $PATH;

		if (count ($_GET) < 1)
			return "";
			
		if (!array_key_exists('action', $_GET) || empty($_GET['action']))
			return "Missing param: action";
			
		$action = $_GET['action'];
		$url = $PATH [$action] . "?";
		foreach ($_GET as $key => $value)
			if ($key !== "action")
				$url .= $key . "=" . $value . "&";
		
		$url .= "end=true";

		$postvars = http_build_query(array());
		$ch = curl_init();
	
		curl_setopt($ch, CURLOPT_URL, $url);
		curl_setopt($ch, CURLOPT_POST, 0);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $postvars);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		
		$temp = curl_exec($ch);
		curl_close($ch);
		
		return $temp;
	}
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<title>User Tools</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" media="screen" href="./css/default.css" />
	<link rel="stylesheet" type="text/css" media="screen" href="./css/user_page.css" />
	<script src="./js/user_page.js"></script>
</head>
<body>
	<div class="tab">
		<button class="tablinks active" onclick="openForm(event, 'searchForm')">Raw Data</button>
		<button class="tablinks" onclick="openForm(event, 'cheatForm')">Cheat</button>
		<button class="tablinks" onclick="openForm(event, 'cheatCoinForm')">Coin</button>
	</div>
	<form id="searchForm" class="tabcontent" action="user.php" method="get" style="display: block;">
		<label>User ID</label>
		<input type="hidden" name="action" value="view">
		<input type="text" name="userId">
		<input type="submit" value="View" onclick="onSearch()">
	</form>
	<form id="cheatForm" class="tabcontent" action="user.php" method="get">
		<input type="hidden" name="action" value="setData">
		<label>User ID</label>
		<input type="text" name="userId">
		<label>Level</label>
		<input type="number" name="level" value="1">
		<label>Gold</label>
		<input type="number" name="gold" value="0">
		<label>Reputation</label>
		<input type="number" name="reputation" value="0">
		<p><u>Note: You must <b>logout</b> and wait 5s!</u></p>
		<input type="submit" value="Run" onclick="onCheat()">
	</form>
	<form id="cheatCoinForm" class="tabcontent" action="user.php" method="get">
		<input type="hidden" name="action" value="coin">
		<label>User ID</label>
		<input type="text" name="userId">
		<label>Coin</label>
		<input type="number" name="amount" value="0">
		<p><u>Note: You must <b>logout</b> and wait 5s!</u></p>
		<input type="submit" value="Run" onclick="onCheatCoin()">
	</form>
	<div id="result"><?php echo run (); ?></div>	
</body>
</html>