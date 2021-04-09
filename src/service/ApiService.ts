import QuoteDataModel from "../type/QuoteDataModel"
import superagent from "superagent"

export const getSource = async (text: string) => {

  const res = await superagent.get(process.env.API_URL_SEARCH_SOURCE).send({ text })
    if (res.ok) {
      if(res.status === 200) {
        return res.text
      } 
      else if(res.status === 204) 
        console.log(`-> No source found!`)
    } else console.error(res.error)

    return undefined
  }

export const getQuote = async (forcePop: boolean) => {

  let path = process.env.API_URL_POP_QUOTE

    if(forcePop) path += 'force-pop'

    const res = await superagent.put(path)
    .set('Authorization', `Bearer ${process.env.BEARER_TOKEN}`)
    .set('Accept', 'application/json')
    
      if (res.ok) {
        if(res.status === 200) {
          return res.body as QuoteDataModel
        } 
        if(res.status === 204) 
          console.log(`-> No need to post yet!`)
      } 
      else 
        console.error(res.error)

      return undefined
}