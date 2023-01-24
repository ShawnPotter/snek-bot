const replaceSchema = require('./schema/replace-toggle')

module.exports.fetchReplaceToggle = async function(key)
{
	let replaceToggleDB = await replaceSchema.findOne(
		{
			id: key
		}
	);
	if (replaceToggleDB)
	{
		return replaceToggleDB;
	}
	else 
	{
		replaceToggleDB = new replaceSchema(
			{
				id: key,
				toggled: false
			}
		)
		await replaceToggleDB.save().catch(err => console.log(err));
		return replaceToggleDB;
	}
}