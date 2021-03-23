const fs = require('fs')

const quotesDir = './quotes/'
const quoteAllFile = './scripts/quote_all.json'
const fileNames = fs.readdirSync(quotesDir)

let data = []

fileNames.forEach(file => {
  const singData = JSON.parse(
    fs.readFileSync(`${quotesDir}${file}`).toString()
    ).filter(q => q.text !== '')
  data.push(...singData)
})

fs.writeFile(quoteAllFile, 
  JSON.stringify({
    numberOfQuotes: data.length,
    shuffle: true,
    quotes: data
  }, null, 2), (err) => {
    if (err) {
      console.warn('-> There has been an error saving the data.')
      console.error(err.message);
    }
})

//node ./scripts/quote_all.js