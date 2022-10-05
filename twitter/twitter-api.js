//twitter API config
require('dotenv').config();

// Get Tweet objects by ID, using bearer token authentication
// https://developer.twitter.com/en/docs/twitter-api/tweets/lookup/quick-start

const needle = require('needle');

// The code below sets the bearer token from your environment variables
// To set environment variables on macOS or Linux, run the export command below from the terminal:
// export BEARER_TOKEN='YOUR-TOKEN'
const bearerToken = process.env.BEARER_TOKEN;

const endpointURL = 'https://api.twitter.com/2/tweets?ids=';

module.exports.getRequest = getRequest;

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
			'authorization': `Bearer ${bearerToken}`,
		},
	});

	if (res.body) {
		return res.body;
	}
	else {
		throw new Error('Unsuccessful request');
	}
}
