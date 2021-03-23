import express from "express"
import QuoteService from "./services/QuoteService"
import ScheduleService from "./services/ScheduleService"

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	return res.send(
	//ScheduleService.isItTime ? 
		QuoteService.popQuote() 
		//: 'Not Time Yet!'
		)
})

app.get('/schedule/', (req, res) => {
	return res.send(ScheduleService.getSchedule())
})

app.post('/schedule/', (req, res) => {
	const body : number[] = req.body
	return res.send(ScheduleService.setScheduleData(body))
})

app.listen(PORT, () => console.log(`\n-> Server is running at PORT: ${PORT}`))