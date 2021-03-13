import ReplyResponseModel from "./ReplyModel"

export default interface QuoteResponseModel {
  id: number,
  text: string,
  source: string,
  replies: ReplyResponseModel[]
}