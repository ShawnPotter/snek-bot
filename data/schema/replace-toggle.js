const mongoose = require('mongoose');

module.exports = mongoose.model("replaceToggle", new mongoose.Schema(
	{
		id:
		{
			type: String
		},
		toggled:
		{
			type: Boolean,
			default: false
		}
	}	
), "replaceToggle");