import express from 'express'
import fs from 'fs'

const app = express()
const port = 3000

app.get('/client.js', (_, res) => {
    res.setHeader('Content-Type', 'text/javascript;charset=UTF-8')
    res.send(fs.readFileSync(`${__dirname}/client.js`).toString())
})

app.get('/', (_, res) => {
  res.send(`
<!DOCTYPE html>  
<html>
  <head>
    
  </head>
  <body>
    <h1>Hello world</h1>
    <script src="./client.js"></script>
  </body>
</html>
`)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})