import { Twitter } from 'twit'
import QuoteDataModel from '../types/QuoteDataModel'
import Bot from '../config'
import { getQuote } from './ApiService'
import * as fs from 'fs'

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

	private static getThread = (quote: QuoteDataModel): string[] => {

		const thread = [quote.text]

		if(quote.replies.length > 0) {
			thread.push(...quote.replies.map(r => r.text))
		}

		if(quote.source && quote.showSource) {
			thread.push("→ " + quote.source)
		}

		return thread
	}

	static tweetThread = (thread: string[], in_reply_to_status_id?: string) => {
		if(thread.length > 0) {
			const [head, ...tail] = thread;
			
			Bot.post('statuses/update', { status: head, in_reply_to_status_id }, (err, data: Twitter.Status) => {
				if(err) {
					console.log('-> ERR:' + head) 
					return console.error(err)
				}
				console.log(`-> Tweeted: ${data.text}`)
				TweetService.tweetThread(tail, data.id_str)
			})
		}
	}

	static tweetImage = (pathToImage: string, status?: string, altText?: string) => {
  
    const b64content = fs.readFileSync(pathToImage, { encoding: 'base64' })

    Bot.post('media/upload', { media_data: b64content }, (err, data: { media_id_string: string }) => {

      const mediaIdStr = data.media_id_string 
      const meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

      Bot.post('media/metadata/create', meta_params, (err) => {
        if (!err) {
          const params = { status, media_ids: [mediaIdStr] }

          Bot.post('statuses/update', params, (err, data) => console.log(data))
        }
      })
    })
}
}