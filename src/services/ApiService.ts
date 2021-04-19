import QuoteDataModel from "../types/QuoteDataModel"
import superagent from "superagent"
import code from 'http-status-codes'

export const getSource = async (text: string) => {

  const res = await superagent
  .get(process.env.API_URL_SEARCH_SOURCE)
  .send({ text })
  .on('error', () => console.log("-> deu merda getSource"))

    if (res.ok) {
      return res.status === code.OK ? res.text : undefined
    } else console.error(res.error)
    return undefined
  }
  
export const getQuote = async (forcePop: boolean) => {

  let path = process.env.API_URL_POP_QUOTE

  if(forcePop) path += 'force-pop'

  const res = await superagent.put(path)
  .set('Authorization', `Bearer ${process.env.BEARER_TOKEN}`)
  .set('Accept', 'application/json')
  .on('error', () => console.log("-> deu merda getQuote"))
  
    if (res.ok) {
      if(res.status === code.OK) {
        return res.body as QuoteDataModel
      } 
      if(res.status === code.NO_CONTENT) 
        console.log(`-> No need to post yet!`)
    } 
    else 
      console.error(res.error)

    return undefined
}