import ReplyService from "./services/ReplyService"
import TweetService from "./services/TweetService"
import cron from 'node-cron'

const PORT = process.env.PORT || 8000

import express from "express"

const app = express()

app.get('/force-pop', async (req, res) =>  res.send(await TweetService.tweetQuote(true)))
		
app.listen(PORT, () => console.log(`-> Server is running at PORT: ${PORT}`))

ReplyService.ReplyStream()

cron.schedule('0 0/30 11,17,23 * * *', () => { console.log("Tweeting..."); TweetService.tweetQuote() })



