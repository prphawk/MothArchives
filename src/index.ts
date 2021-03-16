import express from 'express'
import Dotenv from 'dotenv'
import Twit from 'twit'
import ScheduleService from './services/ScheduleService'
import QuoteService from './services/QuoteService'

const app = express();
const PORT = process.env.PORT || 8000;
Dotenv.config();

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

/* Configure the Twitter API */
export const Bot = new Twit({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
})

app.get('/', (req, res) => {
	return res.send(
		ScheduleService.isItTime ? 
		QuoteService.popQuote() : 
		'Not Time Yet!')
})

app.get('/schedule/', (req, res) => {
	return res.send(ScheduleService.getSchedule())
})

app.post('/schedule/', (req, res) => {
	const body : number[] = req.body
	return res.send(ScheduleService.setSchedule(body))
})

app.listen(PORT, () => console.log(`\n-> Server is running at PORT: ${PORT}`))