import express from "express"
import ReplyService from "./service/ReplyService"
import TweetService from "./service/TweetService"

const app = express()
const PORT = process.env.PORT || 8000

app.get('/', (req, res) => {

	const isItTime = () => {
		const now = new Date().getHours()
		return [11, 17, 23].some(h => h == now)
	} 

	return res.send(isItTime() ? TweetService.tweetQuote() : 'Not Time Yet!')
})

app.get('/force-pop', (req, res) => {
	return res.send(TweetService.tweetQuote(true))
})
		
app.listen(PORT, () => console.log(`-> Server is running at PORT: ${PORT}`))

ReplyService.ReplyStream()