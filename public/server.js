var http = require("http");
var url = require("url");
var connect = require("connect");

var srv = null;
var wsServer = null;

function start() {
//  srv = connect.createServer(
//    connect.static("./public/")
//	).listen(8080);

    srv = connect()
        .use(connect.static('./public/'))
        .use(function(req, res){
            if (req.url == "/getServers"){
                res.writeHead(200, {"Content-Type": "application/json"});
                var aa= {"canvasHolders": wsServer.getCanvasHolders()};
                res.write(JSON.stringify(aa));
                res.end();
            } else  {
                res.writeHead(200, {"Content-Type": "application/json"});
                var aa= {"error":"unknown request"};
                res.write(JSON.stringify(aa));
                res.end();
            }
        })
        .listen(48080);

    console.log("Server has started.");
};

function getServer(){
	return srv;
}

function setWSServer(ws){
    wsServer = ws;
}

exports.start = start;
exports.getServer = getServer;
exports.setWSServer = setWSServer;