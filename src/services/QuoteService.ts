import { Twitter } from 'twit'
import superagent from 'superagent'
import QuoteDataModel from '../types/QuoteModel'
import { Bot } from '../index'

export default class QuoteService {

	static popQuote = () => {
		return superagent.get(process.env.API_URL_POP_QUOTE)
		//alguma segurança aqui -> .set('Accept', 'application/json')
		.set('Accept', 'application/json')
		.end((err, res) => {
			if (res.ok) {
				if( res.status === 200) {
					const thread = QuoteService.getThread(res.body)
					QuoteService.tweetThread(thread)
				} else console.error(`-> ERROR APP REQ API; STATUS ${res.status}`)
			} else return err
		})
	}

	private static getThread = (quote: QuoteDataModel): string[] => {

		const thread = [quote.text]

		console.log(quote)

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