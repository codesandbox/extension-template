import express from 'express'
import expressWs from 'express-ws'
import fs from 'fs'

const app = expressWs(express)
const port = 3000

app.get('/ui.js', (_, res) => {
    res.setHeader('Content-Type', 'application/javascript')
    res.send(fs.readFileSync(`${__dirname}/ui.js`).toString())
})

app.get('/files', (_, res) => {
    if (process.env.NODE_ENV === 'development') {
        
    }
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