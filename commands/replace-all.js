const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const fs = require('node:fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('replace-all')
		.setDescription("Toggles on SNEK's ability to replace all twitter links with vxtwitter"),
		async execute (interaction) {
			// const user = interaction.user;
			// console.log(user);
			const hasPermission = interaction.memberPermissions.has(PermissionsBitField.Flags.Administrator);
			console.log(hasPermission);
			const guildId = interaction.guild;
			const data = fs.readFileSync('../data/replace-all-permissions.json');
			console.log("Current Permission List:");
			console.log(data);
			console.log(`Guild ID: ${guildId}`);

			const hasPermAlready = checkPermList(data, guildId);
			console.log(`Guild has already set this permission: ${hasPermAlready}`)


			//if user has permission to toggle command and hasn't already toggled this command on
			if(hasPermission && !hasPermAlready) {
				let guild = {
					"guild": `${guildId}`,
					"toggle": true
				}
				writeToFile(guild);
				console.log("Guild written to permission list");
				interaction.reply('guild added');
			}
			else {
				interaction.reply('error, could not add guild');
			}
		}
}

function checkPermList(data, guildId) {
	for(let key of Object.keys(data)) {
		if(data.length === 0)
		if(json[key] === guildId) {
			return true;
		}
		else {
			return false;
		}
	}
}

function writeToFile(data) {
	const list = fs.readFileSync(data);

	//if list is empty
	if (list.length === 0) {
		fs.writeFileSync(list, JSON.stringify([data]));
	}
	//else list is not empty
	else {
		//append to list
		const json = JSON.parse(JSON.stringify(list));
		//add new object to file
		json.push(data);
		fs.writeFileSync(list, JSON.stringify(data));
	}
}