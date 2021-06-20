import QuoteDataModel from "../types/api/QuoteDataModel"
import superagent from "superagent"
import code from 'http-status-codes'

export const getSource = async (text: string) => {

  const res = await superagent
  .get(process.env.API_URL_SEARCH_SOURCE)
  .send({ text })
  .catch((err) => {
    console.warn(`Unable to get Source: ${err.message}`)
    return undefined
  })

    if (res.ok) {
      return res.status === code.OK ? res.text as QuoteDataModel : undefined
    } else console.error(res.error)
  }
  
export const getQuote = async (forcePop: boolean) => {

  let path = process.env.API_URL_POP_QUOTE

  if(forcePop) path += 'force-pop'

  const res = await superagent.put(path)
  .set('Authorization', `Bearer ${process.env.BEARER_TOKEN}`)
  .set('Accept', 'application/json')
  .catch((err) => {
    console.warn(`Unable to put transaction to ${path}: ${err.message}`)
    return undefined
  })
  
  if (res.ok && res.status === code.OK) {
      return res.body as QuoteDataModel
  }
}