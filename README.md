# Simple IRC
This is a simple IRC nodejs module that does not rely on any dependencies primarily tested with twitch.

## Getting Started
The snippet of code is the client which will hold all your configurations.
```javascript
var irc = require('./irc.js');

var options = {
	host: "irc.chat.twitch.tv", //add host address
	port: 6667, //add port value
	user: "", //add your nick
	pass: "oauth:", //add your oauth
	channels: ["twitch", "shroud"], //enter channels you would like to join
	interval: 3000, //default is 3000 milleseconds
	debug: false //will log all data received
}

const bot = new irc(options);
bot.connect();

bot.on('connect', () => {
	console.log(`Connected successfully`);
});

bot.on('chat', (user, channel, txt) => {
	console.log(`${user}@#${channel} -> ${txt}`);
});

bot.on('join', (channel) => {
	console.log(`Joined #${channel}`);
});

bot.on('part', (channel) => {
	console.log(`Parting #${channel}`);
});
```

### Features
- Automatically sorted join function (Binary Search)
- Event emits
- Custom interval channel joining

## Events
- connect - Connected to server.
- chat - Chat message received.
- join - Successfully joined channel.
- part - Successfully parted channel.

## Functions
- say(Message, Channel) - (String, String) Sends message to channel.
- join(Channel) - (String) Joins channel.
- part(Channel) - (String) Leaves channel.
    - Do not enter '#' symbols as they are automatically accounted for.
- write(String) - Writes message directly to server does __not__ automatically add ```\r\n```
- ping() - pings server to check if connection is alive.
