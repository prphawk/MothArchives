interface DataModel {
  id: number,
  text?: string,
}

export default interface QuoteDataModel extends DataModel {
  source?: string,
  showSource?: boolean,
  replies: DataModel[]
  image?: { altText?: string, path: string }
}


