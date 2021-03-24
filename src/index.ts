import express from "express"
import QuoteService from "./services/QuoteService"
import ScheduleService from "./services/ScheduleService"

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	return res.send(
		ScheduleService.isItTime 
		? QuoteService.popQuote() 
		: 'Not Time Yet!'
	)
})

app.get('/force-pop', (req, res) => {
	const auth = req.headers.authorization
	if (!auth || auth.substring(7) !== process.env.BEARER_TOKEN) {
    return res.status(403).json({ error: 'Credentials are incorrect!' })
  } else res.send(QuoteService.popQuote())
})
		
app.listen(PORT, () => console.log(`\n-> Server is running at PORT: ${PORT}`))