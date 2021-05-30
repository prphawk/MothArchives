import { Twitter } from 'twit'
import QuoteDataModel from '../types/api/QuoteDataModel'
import Bot from '../config'
import * as fs from 'fs'
import TweetProps from '../types/TweetProps'

export default class TweetService {

	static tweetQuote = async (forcePop?: boolean) => {

		//const quote = await getQuote(forcePop)
		const quote = {
			text: "ola text",
			source: "source :)",
			replies: [{"text": "ola reply"}],
			showSource: true,
			images: [{ altText: "altText", fileName: "winter.png" }, { altText: "altText2", fileName: "shera.png" }]
		} as QuoteDataModel
		if(quote) {
			const thread = TweetService.getThread(quote)
			quote.images
				? TweetService.tweetImage(thread) 
				: TweetService.tweetThread(thread)
			return quote
		}

		return undefined
	}

	private static getThread = (quote: QuoteDataModel): TweetProps[] => {

		const thread = [
			{ status: quote.text, 
				images: { 
					data: quote.images 
				}
			} as TweetProps]

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
				media_ids: head.images?.media_ids 
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

	private static tweetImage = (thread: TweetProps[]) => {
		if(thread.length > 0) {
			const [head, ...tail] = thread

			if(head.images) {

				const image = head.images.data[0]

				let b64content: string

				try {	
					b64content = fs.readFileSync(`./images/${image.fileName}+1`, { encoding: 'base64' })
				} catch (e) {
					console.log(e)
				}

				Bot.post('media/upload', { media_data: b64content }, (err, result) => {
					if(!err) {
						const mediaIdStr = result["media_id_string"] 
						const meta_params = { media_id: mediaIdStr, alt_text: { text: image.altText } }
						
						Bot.post('media/metadata/create', meta_params, (err) => {
							if (!err) {
								head.images.media_ids = [mediaIdStr]
								TweetService.tweetThread([head, ...tail])
							}
							else console.log(err)
						})
					}
					else console.log(err)
				})
			}
		}
	}
}