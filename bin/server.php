<?php
use Ratchet\Server\IoServer;
use Ratchet\WebSocket\WsServer;
use LiveScores\Scores;

require dirname(__DIR__) . '/vendor/autoload.php';

$server = IoServer::factory(
    new WsServer(
        new Scores()
    )
    , 8080
);


$teams = array("Arsenal", "Aston Villa", "Cardiff", "Chelsea", "Crystal Palace", "Everton", "Fulham", "Hull", "Liverpool", "Man City", "Man Utd", "Newcastle", "Norwich", "Southampton", "Stoke", "Sunderland", "Swansea", "Tottenham", "West Brom", "West Ham");

shuffle($teams);

for ($i = 0; $i <= count($teams); $i++) {
	$id = uniqid();
	$games[$id] = array(
			'id' => $id,
			'home' => array(
					'team' => array_pop($teams),
					'score' => 0,
			),
			'away' => array(
					'team' => array_pop($teams),
					'score' => 0,
			),
	);
}

print_r(json_encode(array('type' => 'init', 'games' => $games)));

$server->run();