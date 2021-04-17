//import express from "express"
import ReplyService from "./service/ReplyService"
import TweetService from "./service/TweetService"
import cron from 'node-cron'

//const app = express()
const PORT = process.env.PORT || 8000

// app.get('/force-pop', (req, res) => {
// 	return res.send(TweetService.tweetQuote(true))
// })
		
// app.listen(PORT, () => console.log(`-> Server is running at PORT: ${PORT}`))

console.log(`-> v.0.3 ${new Date()} Server is running at PORT: ${PORT}`)

ReplyService.ReplyStream()

cron.schedule('0 0 11,17,21,22,23 * * *', () => { console.log("Tweeting..."); TweetService.tweetQuote() })



