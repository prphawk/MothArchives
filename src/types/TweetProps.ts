import { ImageDataModel } from "./api/QuoteDataModel"

interface ImageProps extends ImageDataModel	{ 
	media_ids?: string[] 
} 

export default interface TweetProps {
	status?: string,
	image?: ImageProps
}