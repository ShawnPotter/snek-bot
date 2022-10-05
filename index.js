/** 
 * Bot that converts Twitter links with videos to vxtwitter links
 * @Author Shawn Potter
 * @Version 0.1
*/

// Require the necessary discord.js classes
const fs = require('node:fs');
const path = require('node:path');
const { token } = require('./config.json');
const { Client, GatewayIntentBits, Collection } = require('discord.js');

// Create client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

//Command Handler
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for(const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// set a new item in the colleciton
	// with the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// Display ready message in console
client.once('ready', () => {
	console.log('S.N.E.K is Ready!');
});

client.on('interactionCreate', async interaction => {

	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({
			content: 'There was an error while executing this command!',
			ephemeral: true,
		});
	}

});

// Log in the client
client.login(token);

//Read messages and replace any twitter links containing videos with a vxtwitter link
/* 
client.on('messageCreate', message => {

	if (message.content.includes('https://twitter.com')) {
		// console.log('Twitter link detected'); // debug use

		//get the username of the poster
		const username = message.member;

		// split the url mutliple times to properly extract the user and id
		const discordMsg = message.content.split('/');
		const splitIdFromMetaData = discordMsg[5].split('?');

		// assign the twitter username and tweet id string to variables
		const twitterUser = discordMsg[3];
		const tweetId = splitIdFromMetaData[0];
		const checkTweet = async () => {
			try {
				// Make request
				const response = await getRequest(tweetId);
				if (response.includes.media[0].type === 'video') {
					// console.log(response.includes.media[0].type); // debug
					// console.log('tweet contains video, replacing link'); // debug

					// delete the original message
					message.delete();

					// send message to denote which user sent the link
					message.channel.send(`${username} posted:`, { 'allowedMentions': { 'users' : [] } });

					// send the new vxtwitter message
					message.channel.send(`https://vxtwitter.com/${twitterUser}/status/${tweetId}`);
				}
				else {
					console.log('no video detected, letting discord embed twitter link');
				}
				return response;
			}
			catch (e) {
				console.log(e);
				process.exit(-1);
			}
			process.exit();
		};
		checkTweet();
	}
});
 */