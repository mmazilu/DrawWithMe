function ConnectedClient() {

    var me      = this;
	
    me.id       = "";
	me.name     = "";
	me.conn     = null;
	me.clients  = {};
	me.type     = "";
	me.adminObj = null;
    me.owner    = null;

    me.init = function (id, conn, admin) {
		me.conn 	= conn;
		me.id		= id;
		me.adminObj	= admin;
		console.log(admin);
		me.conn.on('data', me.message);
		me.conn.on('close', me.close);
		me.conn.on('error', me.error);
    };

    me.message = function (message, id) {
	var tmpJson = JSON.parse(message);
		if (tmpJson.type == "setName"){
			me.name = tmpJson.value;
			return;
		}
		if (tmpJson.type == "createCanvas"){
			me.type = "owner";
			console.log(me.adminObj);
			me.adminObj.addCanvasHolder(me);
			return;
		}
		if (tmpJson.type == "joinCanvas"){
			me.type = "client";
			me.adminObj.addCanvasClient(me, tmpJson.value);
			return;
		}
		if (tmpJson.type == "kickClient"){
            var msg = {"type": "event", "value" : "serverLeft"};
            if (me.clients[tmpJson.value]){
                me.clients[tmpJson.value].sendMessage(msg);
                me.clients[tmpJson.value].conn.close();
            }
            me.adminObj.removeCanvasClient(me.clients[tmpJson.value]);
            me.removeClient(me.clients[tmpJson.value]);
            return;
		}
		if (tmpJson.type == "drawStuff"){
			if (me.type == "owner"){
				for(var prop in me.clients) {
					if(me.clients.hasOwnProperty(prop))
                    if (me.clients[prop].id != id)
						me.clients[prop].sendMessage(tmpJson);
				}
                if (id != undefined) me.sendMessage(tmpJson);
			} else {
                me.owner.message(message, me.id);
			}
			return;
		}
    };


    me.removeClient = function (client) {
		if (!client) return;
        var msg = {"type": "clientLeft", "value" : client.id};
        me.sendMessage(msg);
        delete me.clients[client.id];
    };

    me.sendMessage = function (message) {
        me.conn.write(JSON.stringify(message));
    };

    me.serverLeft = function () {
        var msg = {"type": "event", "value" : "serverLeft"};
        me.sendMessage(msg);
        me.conn.close();
        me.adminObj.removeCanvasClient(me);
    };

    me.close = function () {
	    console.log("object "+ me.id+ " got closed");
        if (me.type == "owner"){
            for(var prop in me.clients) {
                if(me.clients.hasOwnProperty(prop))
                    me.clients[prop].serverLeft();
            }
            me.adminObj.removeCanvasHolder(me);
        } else {
            if (me.owner != null)
                me.owner.removeClient(me);
        }
        return;
    };


    me.error = function () {
	console.log("object "+ me.id+ "got error");
    };

    me.send = function (conn, message) {
        conn.write(JSON.stringify(message));
    };

    me.toString = function () {
        console.log("name: " + me.name + "   id: " + me.id);
    };

    me.pushClient = function (client) {
        me.clients[client.id] = client;
        client.setOwner(me);
        var msg = {"type": "clientConnected", "value" : client.id, "name": client.name}
        me.sendMessage(msg);
    };

    me.setOwner = function (owner) {
        me.owner = owner;
    };

}

exports.ConnectedClient = ConnectedClient;
