const fs = require('fs')

const quotesDir = './quotes/'
const fileNames = fs.readdirSync(quotesDir)

const textOrimages = (q) => q.text !== '' || (q.images && q.images.length > 0)

fileNames.forEach(file => {

    const fileData = JSON.parse(fs.readFileSync(`${quotesDir}${file}`).toString())

    fileData.forEach(q => { if(textOrimages(q)) q.new = false })
  
    fs.writeFile(`${quotesDir}${file}`, JSON.stringify(fileData, null, 2), (err) => {
      if (err) {
        console.warn('-> There has been an error saving the data.')
        console.error(err.message);
      }
    })
})