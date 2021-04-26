export default interface TweetProps {
	status?: string,
	image?: { 
		media_ids?: string[],
		altText?: string, 
		path: string 
	}
}