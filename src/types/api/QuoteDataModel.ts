interface DataModel {
  id: number,
  text?: string,
}

export interface ImageDataModel { 
  altText?: string,
  fileName: string 
}

export default interface QuoteDataModel extends DataModel {
  source?: string,
  showSource?: boolean,
  replies: DataModel[]
  image?: ImageDataModel
}


