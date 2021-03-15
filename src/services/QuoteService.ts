import { Twitter } from 'twit'
import superagent from 'superagent'
import QuoteModel from '../types/QuoteModel'
import { Bot } from '../index'

export default class QuoteService {

	static popQuote = () => {
		return superagent.get(process.env.API_URL_POP_QUOTE)
		//alguma segurança aqui -> .set('Accept', 'application/json')
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (res.ok) {
				const quote = res.body as QuoteModel
				const thread = QuoteService.getThread(quote)
				QuoteService.tweetThread(thread)
			} else return err
		})
	}

	private static getThread = (quote: QuoteModel): string[] => {

		const thread = [quote.text]

		if(quote.replies.length > 0) {
			thread.push(...quote.replies.map(r => r.text))
		}

		if(quote.source) {
			thread.push(quote.source)
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