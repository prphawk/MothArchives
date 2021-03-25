import { Twitter } from 'twit'
import superagent from 'superagent'
import QuoteDataModel from '../types/QuoteModel'
import Bot from '../config'

export default class QuoteService {

	static popQuote = (forcePop?: boolean) => {

		let path = process.env.API_URL_POP_QUOTE

		if(forcePop) path += 'force-pop'

		superagent.put(path)
		.set('Authorization', `Bearer ${process.env.BEARER_TOKEN}`)
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (res.ok) {
				if(res.status === 200) {
					const thread = QuoteService.getThread(res.body)
					QuoteService.tweetThread(thread)
				} 
				else if(res.status === 204) 
					console.log(`-> No need to post yet!`)
			} 
			else console.error(err)
		})
	}

	private static getThread = (quote: QuoteDataModel): string[] => {

		const thread = [quote.text]

		if(quote.replies.length > 0) {
			thread.push(...quote.replies.map(r => r.text))
		}

		if(quote.source && quote.hideSource !== true) {
			thread.push("→ " + quote.source)
		}

		return thread
	}

	private static tweetThread = (thread: string[], in_reply_to_status_id?: string) => {
		if(thread.length > 0) {
			const [head, ...tail] = thread;
			
			Bot.post('statuses/update', { 
				status: head,
				in_reply_to_status_id,
				//auto_populate_reply_metadata: true  
			}, (err, data: Twitter.Status, res) => {
				if(err) {
					console.log('-> ERR:' + head) 
					return console.error(err)
				}
				console.log(`-> Tweeted: ${data.full_text || data.text}`)
				QuoteService.tweetThread(tail, data.id_str)
			})
		}
	}
}