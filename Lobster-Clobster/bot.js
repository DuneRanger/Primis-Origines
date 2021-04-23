const Discord = require('discord.js');
const client = new Discord.Client();
const auth = require("./auth.json");
const path = require("path");
const ping = require("./sub-ping.js");
const tictactoe = require("./sub-tictactoe.js");
const countdown = require("./sub-countdown.js");
const spelldown = require("./sub-spelldown.js");
const ownerID = "306748338760318976";


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity("Daniel suffer trying to program me", { type: "WATCHING"});
})

 

client.on('message', async message => {
	if (!message.content.startsWith("!") || message.author.bot) return;
	message.content = message.content.toLowerCase();
	const args = message.content.slice("!".length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command === "help") {
		helpMSG(message, args);
	} else if (command === "restart" && message.author.id == ownerID) {
		restart(message);
	} else if (command === "ping") {
		await ping.ping2(message);
		await ping.ping1(message);
	} else if (command === "beep") {
		message.channel.send("Chce se mi srát");
	} else if (command === "tictactoe") {
    	tictactoe(message, args[0], client);
 	} else if (command === "countdown") {
		countdown(message, args[0], args[1], client);
	} else if (command === "spelldown") {
		spelldown(message, args[0], args[1], client);
	} 

});

let restart = function(message) {
	message.channel.send("restarting...")
	client.destroy()
	client.login(auth.token);
}

let helpMSG = function(message, args) {
	if (args[0] == "tictactoe") {
		message.channel.send(
`\`\`\`!tictactoe leaderboard will send the leaderboard of the top 10 players and your position.
To register as a player, you must type your *original* discord username (Not your current nickname!)
Write \`cancel\` to cancel the game before player2 is registered
Write \`end game\` to end the game after registering users (Note: requires the other players confirmation)
Another game cannot be started if one is already in progress
Note:\`\`\``);
	}
	else {
		message.channel.send(
`Existing commands:\`\`\`\n!beep\n!ping\n!tictactoe\t!tictactoe leaderboard\t!help tictactoe\`\`\`
Please note that all commands are case insensitive (Capital letters don't matter)`);
	}
}


client.login(auth.token)