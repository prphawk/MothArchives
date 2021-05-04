import { Twitter } from 'twit'
import QuoteDataModel from '../types/api/QuoteDataModel'
import Bot from '../config'
import TweetProps from '../types/TweetProps'
import { getQuote } from './ApiService'

export default class TweetService {

	static tweetQuote = async (forcePop?: boolean) => {

		const quote = await getQuote(forcePop)
		
		if(quote) {
			const thread = TweetService.getThread(quote)
			TweetService.tweetThread(thread)
			return quote
		}

		return undefined
	}

	private static getThread = (quote: QuoteDataModel): TweetProps[] => {

		const thread = [{ status: quote.text, image: quote.image } as TweetProps]

		if(quote.replies.length > 0) {
			thread.push(...quote.replies.map(r => { 
				return { status: r.text }
			}))
		}

		if(quote.source && quote.showSource) {
			thread.push({ status:"→ " + quote.source })
		}

		return thread
	}


	static tweetThread = (thread: TweetProps[], in_reply_to_status_id?: string ) => {
		if(thread.length > 0) {
			const [head, ...tail] = thread
			
			Bot.post('statuses/update', { 
				status: head.status, 
				in_reply_to_status_id, 
				media_ids: head.image?.media_ids 
			}, (err, data: Twitter.Status) => {
				if(err) {
					console.log('-> ERR:' + head) 
					return console.error(err)
				}
				console.log(`-> Tweeted: ${data.text}`)
				TweetService.tweetThread(tail, data.id_str)
			})
		}
	}

}