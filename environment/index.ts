import express from 'express'
import fs from 'fs'

const app = express()
const port = 3000

app.get('/devtool.js', (_, res) => {
    res.setHeader('Content-Type', 'application/javascript')
    res.send(fs.readFileSync(`${__dirname}/devtool.js`).toString())
})

app.get('/uppercase-name', () => {
    console.log("UPPERCASED IT!?!?")
    const packageJson = JSON.parse(fs.readFileSync(`${__dirname}/../package.json`).toString())
    
    packageJson.name = packageJson.name.toUpperCase()
    
    
    
    fs.writeFileSync(`${__dirname}/../package.json`, JSON.stringify(packageJson, null, 2))
})

app.get('/', (_, res) => {
    res.setHeader('Content-Type', 'text/html')
  res.send(`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <script src="devtool.js"></script>
  </body>
</html>
`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})