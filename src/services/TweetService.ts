import { Twitter } from 'twit'
import QuoteDataModel from '../types/api/QuoteDataModel'
import Bot from '../config'
import * as fs from 'fs'
import TweetProps from '../types/TweetProps'
import { getQuote } from './ApiService'

export default class TweetService {

	static tweetQuote = async (forcePop?: boolean) => {

		//const quote = await getQuote(forcePop)
		const quote = {
			text: "ola text",
			source: "source :)",
			replies: [],
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

		// const uploadImages = (images: ImagesProps) => {
			
		// 		images.media_ids = []
				//images.data.forEach(async d => {

				

				// const b64content = fs.readFileSync(`./images/${d.fileName}`, { encoding: 'base64' })

				// Bot.post('media/upload', { media_data: b64content })
				// .then(async response => {
					
				// 	const mediaIdStr = response.data["media_id_string"] 
				// 	const meta_params = { media_id: mediaIdStr, alt_text: { text: d.altText } }
					
				// 	await Bot.post('media/metadata/create', meta_params)
				// 	.then(response => images.media_ids.push(mediaIdStr))
				// }).catch(err => console.error(err))

				const b64content1 = fs.readFileSync(`./images/winter.png`, { encoding: 'base64' })
				const b64content2 = fs.readFileSync(`./images/shera.png`, { encoding: 'base64' })

				const image = b64content1+','+b64content2

				Bot.post('media/upload', { media_data: b64content1 }, function(err, data1, res) {
					if (err) console.log(err);
					console.log(data1);
					Bot.post('media/upload', { media_data: b64content2 }, function(err, data2, res) {
						if (err) console.log(err);
						console.log(data2);
							Bot.post('statuses/update', {status: 'test picture', media_ids: [ data1["media_id_string"], data2["media_id_string"] ] } , function(err, params, res) {
								if (err) console.log(err);
								console.log(params);
							})
					})
			})
			//})    
		}

		// thread.forEach(t => { 
		// 	if(t.images) {
		// 		uploadImages(t.images) 
		// 		console.log(t.images)
		// 	} 
		// }) 
	//}
}