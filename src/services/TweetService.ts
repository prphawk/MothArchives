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
			source: "source",
			replies: [],
			showSource: true,
			image: { altText: "altText", path: "./quotes/images/winter.png" }
		} as QuoteDataModel
		if(quote) {
			const thread = TweetService.getThread(quote)
			quote.image 
			? TweetService.tweetImage(thread) 
			: TweetService.tweetThread(thread)
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

	private static tweetImage = (thread: TweetProps[]) => {

		const image = thread[0].image
  
    const b64content = fs.readFileSync(image.path, { encoding: 'base64' })

    return Bot.post('media/upload', { media_data: b64content }, (err, data: { media_id_string: string }) => {

      const mediaIdStr = data.media_id_string 
      const meta_params = { media_id: mediaIdStr, alt_text: { text: image.altText } }

      Bot.post('media/metadata/create', meta_params, (err) => {
        if (!err) {
					image.media_ids = [mediaIdStr]
					TweetService.tweetThread(thread)
        }
				else console.log(err)
      })
    })
}
}