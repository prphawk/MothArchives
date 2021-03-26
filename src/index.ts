import express from "express"
import QuoteService from "./services/QuoteService"

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {

	const isItTime = () => {
		const now = new Date().getHours()
		return [11, 17, 23].some(h => h == now) //GMT
	} 

	return res.send(isItTime() ? QuoteService.popQuote() : 'Not Time Yet!')
})

app.get('/force-pop', (req, res) => {
	return res.send(QuoteService.popQuote(true))
})
		
app.listen(PORT, () => console.log(`\n-> Server is running at PORT: ${PORT}`))