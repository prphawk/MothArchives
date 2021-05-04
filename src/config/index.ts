import Dotenv from 'dotenv'
import Twit from 'twit'

Dotenv.config();

/* Configure the Twitter API */
const Bot = new Twit({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
})

export const track = ["source?", "where from?", "fonte?", "src?", "gimme link"]

export default Bot
