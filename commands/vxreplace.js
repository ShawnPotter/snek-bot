const { SlashCommandBuilder } = require('discord.js');
const { getRequest } = require('../twitter/twitter-api');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vxt')
		.setDescription('Add twitter link in parameter to change into vxtwitter link')
		.addStringOption(option => 
			option.setName('input')
			.setDescription('Link')
			.setRequired(true)),
	async execute(interaction) {
		const link = interaction.options.getString('input');
		console.log(link);

		if (link.includes('https://twitter.com')) {
			// console.log('Twitter link detected'); // debug use

			// split the url mutliple times to properly extract the user and id
			const twitterLink = link.split('/');
			const tweetIdFromLink = twitterLink[5].split('?');
	
			// assign the twitter username and tweet id string to variables
			const twitterUser = twitterLink[3];
			const tweetId = tweetIdFromLink[0];
			const checkTweet = async () => {
				try {
					// Make request
					const response = await getRequest(tweetId);
					if (response.includes.media[0].type === 'video') {
						// console.log(response.includes.media[0].type); // debug
						// console.log('tweet contains video, replacing link'); // debug

						await interaction.reply(`${interaction.user} posted: https://vxtwitter.com/${twitterUser}/status/${tweetId}`);
					}
					else {
						// console.log('no video detected, letting discord embed twitter link'); // debug
						await interaction.reply('No video detected. Please input a video link.')
					}
					return response;
				}
				catch (e) {
					console.log(e);
					process.exit(-1);
				}
			};
			checkTweet();
		} 
		else {
			await interaction.reply(`${interaction.user} that is not a Twitter Link. Try again.`);
		}
	}
}