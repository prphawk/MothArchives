import ReplyService from "./services/ReplyService"
import TweetService from "./services/TweetService"
import cron from 'node-cron'
import express from "express"

const PORT = process.env.PORT || 8000

const app = express()

app.get('/force-pop', async (req, res) =>  res.send(await TweetService.tweetQuote(true)))
		
app.listen(PORT, () => console.log(`-> Server is running at PORT: ${PORT}`))

ReplyService.ReplyStream()

//10 14 18 22
cron.schedule('0 0 13,17,21,1 * * *', TweetService.tweetQuote)
