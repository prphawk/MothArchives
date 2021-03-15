interface TextModel {
  id: number,
  text: string,
}

export default interface QuoteModel extends TextModel{
  source?: string,
  replies: TextModel[]
}


