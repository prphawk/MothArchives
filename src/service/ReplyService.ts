import UserReplyModel from "../type/UserReplyModel"
import { Twitter } from "twit"
import Bot from "../config"
import { getSource } from "./ApiService"
import TweetService from "./TweetService"

interface Status extends Twitter.Status {
	extended_tweet?: { full_text: string }
}

export default class ReplyService {

  static ReplyStream = () => {

    const isReplyToBot = (data: Status) => data.in_reply_to_user_id_str === process.env.ACCOUNT_ID

    const stream = Bot.stream('statuses/filter', { track: ["Source?", "Sauce?"] })

    stream.on('tweet', (data: Status) => {

      if(isReplyToBot(data)) {
          console.log(`\n-> Reply to Bot: ${data.text}`)

          ReplyService.replyWithSource({
            userHandle: data.user.screen_name, 
            userTweetId: data.id_str,
            botTweetId: data.in_reply_to_status_id_str
          })
      }
    })
  }

  private static replyWithSource = async ({ userHandle, userTweetId, botTweetId }: UserReplyModel) => {

    const formatText = (text: string) => {
      let arr = text.split(" ")
      arr.splice(arr.length - 2, 2)
      return arr.join(" ")
    }

    const data = await ReplyService.getThreadBegining(botTweetId)
    if(data) {
      let text = data.extended_tweet?.full_text || data.text
      
      console.log(`\n-> First Tweet: ${text}`)

      const src = await getSource(data.truncated ? formatText(text) : data.text)
      if(src) {
        TweetService.tweetThread([`@${userHandle} [src] ${src}`], userTweetId)
      }
    }
  }

  private static getThreadBegining = async (id: string): Promise<Status | undefined> => {
    const response = await Bot.get('statuses/show/:id', { id })
    if(response.resp.complete) {
      const data = response.data as Status
      if(data.in_reply_to_status_id_str) {
        return await ReplyService.getThreadBegining(data.in_reply_to_status_id_str)
      }
      else return data
    }
    return undefined
  }


}