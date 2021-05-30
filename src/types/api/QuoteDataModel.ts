export default interface QuoteDataModel {
  id: number,
  text?: string,
  source?: string,
  showSource?: boolean,
  replies: string[]
  images?: string[]
}


