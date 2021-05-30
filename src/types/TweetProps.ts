export interface ImagesProps { 
	data: string[]
	media_ids?: string[] 
} 

export default interface TweetProps {
	status?: string,
	images?: ImagesProps
}