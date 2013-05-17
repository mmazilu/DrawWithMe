var connectionList = {};
var canvasHolders  = {};
var canvasClients  = {};

var connectedClient = require("./clients/connectedClient");


function create(conn, client){
	console.log ("connection created ");
	var rand = randomString();
	console.log (rand);
	connectionList[rand] = new connectedClient.ConnectedClient();
	connectionList[rand].init(rand, conn, this);
	connectionList[rand].toString();
}

function addCanvasHolder(client){
	canvasHolders[client.id] = client;
}

function addCanvasClient(client, canvasOwnerId){
	canvasClients[client.id] = client;
	for(var prop in canvasHolders) {
		if(canvasHolders.hasOwnProperty(prop))
        if (canvasHolders[prop].id == canvasOwnerId){
            canvasHolders[prop].pushClient(client);
        }
	}
}

function getCanvasHolders(){
    var tmpOwners = [];
    for(var prop in canvasHolders) {
        if(canvasHolders.hasOwnProperty(prop)){
            tmpOwners.push({name: canvasHolders[prop].name, id: canvasHolders[prop].id});
        }
    }
    return tmpOwners;
}

function removeCanvasHolder(client) {
	delete canvasHolders[client.id];
}

function removeCanvasClient(client) {
    if (client)
        delete canvasClients[client.id];
}

function randomString() {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = 8;
	var randomstring = '';
	for (var i=0; i<string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum,rnum+1);
	} 
	return randomstring;
}

exports.create = create;
exports.addCanvasHolder = addCanvasHolder;
exports.addCanvasClient = addCanvasClient;
exports.removeCanvasHolder = removeCanvasHolder;
exports.removeCanvasClient = removeCanvasClient;
exports.getCanvasHolders = getCanvasHolders;
