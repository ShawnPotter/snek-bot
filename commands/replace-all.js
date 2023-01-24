const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const Toggled = require('../data/schema/replace-toggle');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('replace-all')
			.setDescription("Toggles on SNEK's ability to replace all twitter links with vxtwitter")
		.addBooleanOption(
			option =>
			option.setName('toggle')
				.setDescription('Whether or not the command is turned on (true) or off (false)')
				.setRequired(true)
		),
		async execute (interaction) {
			const guildId = interaction.guild.id;
			const bool = interaction.options.getBoolean('toggle');
			let setToggle = await Toggled.findOne({id: guildId});

			//if the guild's ID is not in the database
			if(!setToggle)
			{
				if (bool)
				{
					setToggle = await new Toggled(
						{
							id: interaction.guild.id,
							toggled: true
						}
					)
					await setToggle.save().catch(console.error);
					console.log(`Guild ${guildId} has toggled on Replace-All`);
				}
				else
				{
					await interaction.reply({
						content: "You haven't turned on Replace-All yet!"
					});
				}
			}
			//if the guild's ID is in the database
			else
			{	
				if (bool && setToggle.toggled === false)
				{
					setToggle.toggled = true;
					await setToggle.save().catch(console.error);
					
					await interaction.reply({
						content: "You have enabled Replace-All!"
					});

					console.log(`Guild ${guildId} has toggled on Replace-All`);	
				}
				else if (!bool && setToggle.toggled === true)
				{
					setToggle.toggled = false;
					await setToggle.save().catch(console.error);

					await interaction.reply({
						content: "You have disabled Replace-All!"
					});
					
					console.log(`Guild ${guildId} has toggled off Replace-All`);	
				}
				else if(bool && setToggle.toggled === true)
				{
					await interaction.reply({
						content: "You have already turned on Replace-All!"
					});
				}
				else {
					await interaction.reply({
						content: "You have already turned off Replace-All!"
					});
				}
			}
		}
}