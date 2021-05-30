export interface ImageDataModel { 
  altText?: string,
  fileName: string 
}

export default interface QuoteDataModel {
  id: number,
  text?: string,
  source?: string,
  showSource?: boolean,
  replies: string[]
  images?: ImageDataModel[]
}


