const fs = require('fs')

const justPriority = false
const quotesDir = './quotes/'
const fileNames = fs.readdirSync(quotesDir)
const finalFilePath = `./scripts/${justPriority ? "quote_priority" : "quote_all"}.json`

let data = []

const readFile = (file) => JSON.parse(fs.readFileSync(`${quotesDir}${file}`).toString())

const filterQuotes = (arr) => arr.filter(q => q.text !== '' && (justPriority ? q.priority === true : true))

fileNames.forEach(file => {
  const fileData = readFile(file)
  data.push(...filterQuotes(fileData))
})

const response = {
  numberOfQuotes: data.length,
  daysOfPosting: (data.length/3).toFixed(1),
  shuffle: true,
  quotes: data
}

fs.writeFile(finalFilePath, JSON.stringify(response, null, 2), (err) => {
  if (err) {
    console.warn('-> There has been an error saving the data.')
    console.error(err.message);
  }
})

/*
cd ../motharchives 
node ./scripts/quote_all.js
*/