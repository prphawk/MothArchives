import express from 'express'
const app = express();
const PORT = process.env.PORT || 8000;
import Dotenv from 'dotenv'
import Twit from 'twit'
import ScheduleService from './services/ScheduleService'

Dotenv.config();

/* Configure the Twitter API */
export const Bot = new Twit({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
	//timeout_ms: 60 * 1000,
})

app.get('/', (req, res) => {
	console.log('-- ping! at ' + new Date().getDate().toString())
	return res.send(
		ScheduleService.isItTime ? 
		'QuoteService.popQuote()' : 
		'Not Time Yet!')
})

app.listen(PORT, () => console.log(`[server]: Server is running at PORT: ${PORT}`))