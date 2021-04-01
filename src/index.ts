import express from "express"
import QuoteService from "./service"

const app = express()
const PORT = process.env.PORT || 8000

app.get('/', (req, res) => {

	const isItTime = () => {
		const now = new Date().getHours()
		return [11, 17, 23].some(h => h == now)
	} 

	return res.send(isItTime() ? QuoteService.popQuote() : 'Not Time Yet!')
})

app.get('/force-pop', (req, res) => {
	return res.send(QuoteService.popQuote(true))
})
		
app.listen(PORT, () => console.log(`\n-> Server is running at PORT: ${PORT}`))