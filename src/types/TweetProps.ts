import { ImageDataModel } from "./api/QuoteDataModel"

export interface ImagesProps { 
	data: ImageDataModel[]
	media_ids?: string[] 
} 

export default interface TweetProps {
	status?: string,
	images?: ImagesProps
}