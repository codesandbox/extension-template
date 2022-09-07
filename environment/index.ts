import express from 'express'
import fs from 'fs/promises'
import path from 'path'

const app = express()
const port = 3000

function getAllFilesAndContents(rootPath: string, dirPath: string, files: Record<string, { code: string }>): Promise<any> {
    return fs.readdir(dirPath).then((entries) => Promise.all(entries.map((entry) => {
        const entryPath = path.join(dirPath, entry)
        return fs.stat(entryPath).then((stat) => {
            if (stat.isFile()) {
                return fs.readFile(entryPath).then((content) => files[entryPath.substring(rootPath.length)] = { code: content.toString() })
            } else if (stat.isDirectory()) {
                return getAllFilesAndContents(rootPath, entryPath, files)
            }
        })
    })))
}

app.get('/devtool.js', (_, res) => {
    res.setHeader('Content-Type', 'application/javascript')
    fs.readFile(`${__dirname}/devtool.js`).then((content) => {
       res.send(content.toString())
    })
    
})

app.get('/files', (_, res) => {
    let entryPath = process.cwd()
    
    if (!process.env.NODE_ENV) {
        entryPath = path.join(entryPath, 'demo')
    }
    
    const files: Record<string, { code: string }> = {}
    

    
    getAllFilesAndContents(entryPath, entryPath, files).then(() => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(files))
    })
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