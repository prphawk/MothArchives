import { Twitter } from 'twit'
import superagent from 'superagent'
import QuoteResponseModel from '../types/QuoteModel'
import { Bot } from '../index'

export default class QuoteService {

	static popQuote = () => {
		return superagent.get(`${process.env.API_URL}/deque/`)
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (res.ok) {
				const quote = res.body as QuoteResponseModel
				const thread = QuoteService.getThread(quote)
				QuoteService.tweetThread(thread)
			}
			return err
		})
	}

	private static getThread = (quote: QuoteResponseModel): string[] => {

		const thread = [quote.text]

		if(QuoteService.isNotEmpty(quote.replies)) {
			thread.push(...quote.replies)
		}

		if(quote.source) {
			thread.push(quote.source)
		}

		return thread
	}

	private static tweetThread = (thread: string[], in_reply_to_status_id?: string) => {
		if(QuoteService.isNotEmpty(thread)) {
			const [head, ...tail] = thread;
			
			Bot.post('statuses/update', { 
				status: head,
				in_reply_to_status_id,
				//auto_populate_reply_metadata: true  
			}, (err, data: Twitter.Status, response) => {
				if(err) {
					console.log('-> ERR:' + head) 
					return console.log(err)
				}
				console.log(`-> Tweeted: ${data.full_text || data.text}`)
				QuoteService.tweetThread(tail, data.id_str)
			})
		}
	}

	private static isNotEmpty<T>(arr: Array<T>) {
		return arr.length > 0
	}  
}