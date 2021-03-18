interface DataModel {
  id: number,
  text: string,
}

export default interface QuoteDataModel extends DataModel {
  source?: string,
  replies: DataModel[]
}


