import express from 'express'
const app = express();
const PORT = 8000;
import Dotenv from 'dotenv'
import Twit from 'twit'

Dotenv.config();

/* Configure the Twitter API */
export const Bot = new Twit({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token: process.env.ACCESS_TOKEN,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET,
	//timeout_ms: 60 * 1000,
});

console.log('The bot is running on port ' + (process.env.PORT || 3000));

/**
 * @description Faz busca filtrada de acordo com uma query construída por props.
 */
export const GetTweets = () => {
  const q = `from:${process.env.BOT_ACCOUNT}`
	console.log(`Searching results for queue: ${q}`)
	return Bot.get('search/tweets', 
		{ q, count: 3 }, 
		(error, data: Twit.Twitter.SearchResults, response) => {
			if (error) {
				return 'Bot could not get tweets: ' + error;
			} else {
        if(response.statusCode === 200) {
          data.statuses.forEach(s => console.log(`${s.text} --- ${s.in_reply_to_status_id} --- ${s.user.name}\n`))
          console.log(`\n search_metadata: ${data.search_metadata.count} ${'-'.repeat(20)}`)
          return response.statusMessage
        } 
        return response.statusCode
			}
		})
}

app.get('/', (req, res) => res.send(GetTweets()));
app.listen(PORT, () => {
  console.log(`[server]: Server is running at https://localhost:${PORT}`);
});