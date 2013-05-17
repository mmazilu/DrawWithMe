var http = require('http');
var sockjs = require('sockjs');
var wsroutes = require('./wsroutes');

var echo = null;

function startWS(server) {
	echo = sockjs.createServer();
	
	echo.on('connection', function(conn) {
		wsroutes.create(conn);
	});
	
	echo.installHandlers(server, {prefix:'/echo'});
}

function getServers(){
    return wsroutes;
}

exports.startWS = startWS;
exports.getServers = getServers;