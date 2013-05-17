var server = require("./server");
var sock   = require("./sock");

server.start();

sock.startWS(server.getServer());
server.setWSServer(sock.getServers());