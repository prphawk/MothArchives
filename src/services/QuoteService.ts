import { Twitter } from 'twit'
import superagent from 'superagent'
import QuoteDataModel from '../types/QuoteModel'
import Bot from '../config'

export default class QuoteService {

	static popQuote = (forcePop?: boolean) => {

		const path = process.env.API_URL_POP_QUOTE

		if(forcePop) path.concat('force-pop')

		let thread: string[] = []

		superagent.put(path)
		.set('Authorization', `Bearer ${process.env.BEARER_TOKEN}`)
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (res.ok) {
				if(res.status === 200) {
					thread = QuoteService.getThread(res.body)
					QuoteService.tweetThread(thread)
				} 
				else console.error(`-> ERROR STATUS ${res.status}`)
			} 
			else console.error(err)
		})

		return thread
	}

	private static getThread = (quote: QuoteDataModel): string[] => {

		const thread = [quote.text]

		if(quote.replies.length > 0) {
			thread.push(...quote.replies.map(r => r.text))
		}

		if(quote.source) {
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