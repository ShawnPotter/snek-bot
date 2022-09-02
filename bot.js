/** 
 * Bot that converts Twitter links with videos to vxtwitter links
 * @Author Shawn Potter
 * @Version 0.1
*/

require('dotenv').config();
// Require the necessary discord.js classes
const { discordToken } = require('./config.json');
const { Client, GatewayIntentBits } = require('discord.js');

// Get Tweet objects by ID, using bearer token authentication
// https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/quick-start

const needle = require('needle');

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const token = process.env.BEARER_TOKEN;

const endpointURL = 'https://api.twitter.com/2/tweets?ids=';

async function getRequest(tweetId) {

	// These are the parameters for the API request
	// specify Tweet IDs to fetch, and any additional fields that are required
	// by default, only the Tweet ID and text are returned
	const params = {
		// Edit Tweet IDs to look up
		'ids': `${tweetId}`,

		// Edit optional query parameters here
		'expansions':'attachments.media_keys',
	};

	// this is the HTTP header that adds bearer token authentication
	const res = await needle('get', endpointURL, params, {
		headers: {
			'User-Agent': 'v2TweetLookupJS',
			'authorization': `Bearer ${token}`,
		},
	});

	if (res.body) {
		return res.body;
	}
	else {
		throw new Error('Unsuccessful request');
	}
}


// Create client instance
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
	],
});

// Display ready message in console
client.once('ready', () => {
	console.log('Ready!');
});

// Log in the client
client.login(discordToken);

//Read messages and
client.on('messageCreate', message => {

	if (message.content.includes('https://twitter.com')) {
		// console.log('Twitter link detected'); // debug use

		const username = message.member;

		// split the string mutliple times to properly extract the user and id
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
