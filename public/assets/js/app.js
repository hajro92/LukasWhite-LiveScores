var games;

var conn = new WebSocket('ws://localhost:8080');
conn.onopen = function(e) {
	
	var message = $.parseJSON('{"type":"init","games":{"52613fc668b94":{"id":"52613fc668b94","home":{"team":"West Ham","score":0},"away":{"team":"Man City","score":0}},"52613fc668b9b":{"id":"52613fc668b9b","home":{"team":"Sunderland","score":0},"away":{"team":"Newcastle","score":0}},"52613fc668b9f":{"id":"52613fc668b9f","home":{"team":"Cardiff","score":0},"away":{"team":"Hull","score":0}},"52613fc668ba2":{"id":"52613fc668ba2","home":{"team":"Swansea","score":0},"away":{"team":"West Brom","score":0}},"52613fc668ba4":{"id":"52613fc668ba4","home":{"team":"Man Utd","score":0},"away":{"team":"Southampton","score":0}},"52613fc668ba6":{"id":"52613fc668ba6","home":{"team":"Norwich","score":0},"away":{"team":"Liverpool","score":0}},"52613fc668ba8":{"id":"52613fc668ba8","home":{"team":"Aston Villa","score":0},"away":{"team":"Crystal Palace","score":0}}}}');
	setupScoreboard(message);
};

conn.onmessage = function(e) {    
	
	var message = $.parseJSON(e.data);
	

	switch (message.type) {
		
		case 'init':

			setupScoreboard(message);
			break;

		case 'goal':

			goal(message);
			break;

  }

};

function setupScoreboard(message) {
	
	// Create a global reference to the list of games
	games = message.games;

	var template = '<tr data-game-id="{{ game.id }}"><td class="team home"><h3>{{game.home.team}}</h3></td><td class="score home"><div id="counter-{{game.id}}-home" class="flip-counter"></div></td><td class="divider"><p>:</p></td><td class="score away"><div id="counter-{{game.id}}-away" class="flip-counter"></div></td><td class="team away"><h3>{{game.away.team}}</h3></td></tr>';

	$.each(games, function(id){		
		var game = games[id];				
		$('#scoreboard table').append(Mustache.render(template, {game:game} ));		
		game.counter_home = new flipCounter("counter-"+id+"-home", {value: game.home.score, auto: false});
		game.counter_away = new flipCounter("counter-"+id+"-away", {value: game.away.score, auto: false});
	});

}

function goal(message) {	
	games[message.game][message.team]['score']++;
	var counter = games[message.game]['counter_'+message.team];
	counter.incrementTo(games[message.game][message.team]['score']);
}

$(function () {

	$(document).on('click', '.team h3', function(e){
		var game = $(this).parent().parent().attr('data-game-id');		
		var team = ($(this).parent().hasClass('home')) ? 'home' : 'away';
		conn.send(JSON.stringify({ type: 'goal', team: team, game: game }));
	});

});



