import express from 'express'
import fs from 'fs'

const app = express()
const port = 3000

app.get('/ui.js', (_, res) => {
    res.setHeader('Content-Type', 'application/javascript')
    res.send(fs.readFileSync(`${__dirname}/ui.js`).toString())
})

app.get('/uppercase-name', () => {
    const packageJson = JSON.parse(fs.readFileSync(`${process.cwd()}/package.json`).toString())
    
    packageJson.name = packageJson.name.toUpperCase()
    
    fs.writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(packageJson, null, 2))
})

app.get('/', (_, res) => {
    res.setHeader('Content-Type', 'text/html')
  res.send(`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <script src="ui.js"></script>
  </body>
</html>
`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})