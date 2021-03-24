import express from "express"
import QuoteService from "./services/QuoteService"

const app = express();
const PORT = process.env.PORT || 8000;
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
	return res.send(QuoteService.popQuote())
})
		
app.listen(PORT, () => console.log(`\n-> Server is running at PORT: ${PORT}`))