import superagent from "superagent"
import { Twitter } from "twit"
import Bot from "../config"
import TweetService from "./TweetService"

interface Status extends Twitter.Status {
	extended_tweet?: { full_text: string }
}

interface OriginalReply {
  id_str: string
	screen_name: string, 
}

export default class ReplyService {

  static ReplyStream = () => {

    const stream = Bot.stream('statuses/filter', { track: ["Source?", "Sauce?"] })

    stream.on('tweet', (data: Status) => {
      if(data.in_reply_to_user_id_str === process.env.ACCOUNT_ID) {
          console.log(`\n-> ${data.full_text || data.text}`)
          ReplyService.replyWithSource({
            screen_name: data.user.screen_name, 
            id_str: data.id_str
          }, data.in_reply_to_status_id_str)
      }
    })
  }

  private static replyWithSource = async (ogReply: OriginalReply, in_reply_to_status_id_str: string) => {
    const data = await ReplyService.getFirstTweetFromThread(in_reply_to_status_id_str)
    if(data) {
      console.log(`\n-> PRIMEIRO TWEET: ${data.extended_tweet?.full_text || data.text}`)
      const src = await ReplyService.getSource(data.extended_tweet?.full_text || data.text)
      if(src) {
        TweetService.tweetThread([`@${ogReply.screen_name} [src] ${src}`], ogReply.id_str)
      }
    }
  }

  private static getFirstTweetFromThread = async (in_reply_to_status_id_str: string): Promise<Status | undefined> => {
    const response = await Bot.get('statuses/show/:id', { id: in_reply_to_status_id_str })
    if(response.resp.complete) {
      const data = response.data as Status
      if(data.in_reply_to_status_id_str) {
        return await ReplyService.getFirstTweetFromThread(data.in_reply_to_status_id_str)
      }
      else return data
    }
    return undefined
  }

  private static getSource = async (text: string) => {

    const res = await superagent.get(process.env.API_URL_SEARCH_SOURCE).send({ text })
      if (res.ok) {
        if(res.status === 200) {
          console.log(`-> SOURCE: ${res.text}`)
          return res.text
        } 
        else if(res.status === 204) 
          console.log(`-> No source found!`)
      } else console.error(res.error)

      return undefined
  }
}