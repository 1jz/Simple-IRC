var net = require('net');
var emitter = require('events').EventEmitter;
var util = require('util');
var joinQ = require('./join.js'); //creates queue
var misc = require('./misc.js'); //miscellaneous functions

/*---------------------------------------------------------------------*/

function client(options) {
    this.host = options.host;
    this.port = options.port;
    this.pass = options.pass;
    this.user = options.user;
    this.channels = options.channels;
    this.interval = options.interval;
    this.debug = options.debug;
    this.connected = false;
    this.queue = new joinQ(this.interval); //can have custom interval
    emitter.call(this);
}

//client.prototype = Object.create(EventEmitter.prototype);
util.inherits(client, emitter);

client.prototype.connect = function connect() {
    const _this = this;

    this.connection = net.createConnection(this.port, this.host);
    this.connection.setEncoding('utf8');
    this.connection.setKeepAlive(true, 10000);

    this.connection.addListener('connect', () => {
        _this.emit('connect');
        this.write(`PASS ${this.pass}\r\nUSER ${this.user}\r\nNICK ${this.user}\r\n`);
        this.channels = this.channels.map((x) => {return x.toLowerCase();});
        for (var i = 0; i < this.channels.length; i++) {
            this.queue.add(((i) => this.join(this.channels[i])).bind(this, i), this.channels[i],0);
        }

        this.queue.exec();

        this.connected = true;
    });

    this.connection.on('data', function(data) {
        var parsedTwitchData = data.toString();

        if(_this.debug === true) {
            console.log(parsedTwitchData);
        }

        if(parsedTwitchData.indexOf("PRIVMSG") != -1) { //parses messages
            var msg = (parsedTwitchData.slice(parsedTwitchData.indexOf("#"), parsedTwitchData.length));
            var channel = msg.slice(1, msg.indexOf(":")-1);
            var txt = msg.slice(msg.indexOf(":")+1, msg.length).trim();
            var user = parsedTwitchData.replace(/(:)|(!).*|(\n)|(\r)/g, "");
            _this.emit('chat', user, channel, txt);
        } else if (parsedTwitchData.indexOf("JOIN") != -1) { //parses joins
            var channel = parsedTwitchData.slice(parsedTwitchData.indexOf("#")+1, parsedTwitchData.indexOf("\n"));
            _this.emit('join', channel);
        } else if (parsedTwitchData.indexOf("PING") == 0) { //parses pings
            this.write("PONG\r\n");
            if(_this.debug === true)
                console.log("PONG");
        }
    });

    this.connection.on('close', function() {
        console.log('Connection closed.');
    });

    this.connection.on('error', function(err) {
        console.error(err);
    });
}

client.prototype.write = function(text) { //simplifies this.connection.write -> this.write
    this.connection.write(text);
}

client.prototype.join = function(channel) { //will check if certain channels are already joined and if not will add it to the list which is automatically sorted when added.
    channel = channel.toLowerCase();
    var index = misc.sortedAdd(this.queue.joined, channel); 
    
    if(index[0] === true) {
        console.log(`Already in channel ${channel}.`);
    } else if (index[0] == false) {
        this.queue.joined.splice(index[1],0,channel);
        this.write(`JOIN #${channel}\r\n`);
    }
}

client.prototype.part = function(channel) { //parts channel
    channel = channel.toLowerCase();
    var index = misc.sortedAdd(this.queue.joined, channel); 
    
    if(index[0] === true) {
        this.queue.joined.splice(index[1], 1);
        this.write(`PART #${channel}\r\n`);
        this.emit('part', channel);
    } else if (index[0] === false) {
        console.log(`Currently not in channel ${channel}.`);
    }
}

client.prototype.say = function(message, channel) { //sends message
    if(this.connected && misc.binarySearch(this.queue.joined, channel) != -1)
        this.write(`PRIVMSG #${channel} :${message}\r\n`);
}

client.prototype.ping = function() { //pinging func
    this.write("PING\r\n");
}

/*---------------------------------------------------------------------*/

module.exports = client;