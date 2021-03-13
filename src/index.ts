import express, { response } from 'express'
const app = express();
const PORT = 8000;
import Dotenv from 'dotenv'
import Twit from 'twit'
import superagent from 'superagent'
import QuoteResponseModel from './types/QuoteModel'

Dotenv.config();

/* Configure the Twitter API */
export const Bot = new Twit({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
	//timeout_ms: 60 * 1000,
})

/**
 * @description Faz busca filtrada de acordo com uma query construída por props.
 */
export const GetTweets = () => {

  const q = `from:${process.env.BOT_ACCOUNT}`

	return Bot.get('search/tweets', { q, count: 3 }, (error, data: Twit.Twitter.SearchResults, response) => {

			if (error) return 'Bot could not get tweets: ' + error;
			
			if(response.statusCode === 200) {
				data.statuses.forEach(s => 
					console.log(`${s.text} \n${s.in_reply_to_status_id_str}`))
			} 

			return response.statusMessage
		})
}

export const getQuote = () => {
		return superagent.get(`${process.env.API_URL}/deque/`)
			//.set('Accept', 'application/json')
			.end((err, res) => {
				//if (res.ok) {
					console.log(res.body)
					tweetQuote(
						{ 
							id:9,text:"teste do bot 1",source:"ihaaaaaa",
							replies: [{ text: "resposta 1" }, { text: "resposta 2", source: "Fonte muito top" }]
						}
					)
				//} 
				return err
		})
}

const tweetQuote = (quote: QuoteResponseModel) => {
	Bot.post('statuses/update', { status: quote.text }, 
	(err, data: Twit.Twitter.Status, response) => {
		if(err) 
			return console.log(err)
		tweetReply(makeThread(quote), data.id_str)
		console.log(response)
		console.log('*'.repeat(20))
	})
}

const makeThread = (quote: QuoteResponseModel): string[] => {
	if(quote.replies.length === 0) {
		return [quote.source]
	} 
		const thread = quote.replies.map(reply => reply.text)
		const lastReply = quote.replies[quote.replies.length - 1]
		if(lastReply.source) {
			thread.push(lastReply.source)
		}
		return thread
}

const tweetReply = (thread: string[], reply_id_str: string) => {
	if(thread.length > 0) {
		const [head, ...tail] = thread;
		Bot.post('statuses/update', { 
			status: head,
			in_reply_to_status_id: reply_id_str,
			auto_populate_reply_metadata: true  
		}, (err, data: Twit.Twitter.Status, response) => {
			if(err) 
				return console.log(err)
			return tweetReply(tail, data.id_str)
		})
	}
}

app.get('/', (req, res) => res.send(getQuote()));
app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});