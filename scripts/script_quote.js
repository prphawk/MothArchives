const fs = require('fs')

/*
cd ../motharchives 
node ./scripts/script_quote.js
node ./scripts/script_new.js
*/

const onlyNew = true

const quotesDir = './quotes/'
const fileNames = fs.readdirSync(quotesDir)
const finalFilePath = `./scripts/${onlyNew ? "quote_new" : "quote_all"}.json`

let data = []

const readFile = (file) => JSON.parse(fs.readFileSync(`${quotesDir}${file}`).toString())

const textOrimages = (q) => q.text !== '' || (q.images && q.images.length > 0)

const isOnlyNew = (q) => onlyNew ? q.new === true : true

const filterQuotes = (arr) => arr.filter(q => textOrimages(q) && isOnlyNew(q))

fileNames.forEach(file => {
  const fileData = readFile(file)
  data.push(...filterQuotes(fileData))
})

daysOfPosting = (data.length/7).toFixed(1)

const response = {
  numberOfQuotes: data.length,
  daysOfPosting,
  monthsOfPosting: (daysOfPosting/30).toFixed(1),
  shuffle: true,
  quotes: data
}

fs.writeFile(finalFilePath, JSON.stringify(response, null, 2), (err) => {
  if (err) {
    console.warn('-> There has been an error saving the data.')
    console.error(err.message);
  }
})