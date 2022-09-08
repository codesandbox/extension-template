import express from 'express'
import * as ws from 'ws'
import fs from 'fs/promises'
import * as path from 'path'
import chokidar from 'chokidar'



const app = express()
const port = 3000


async function getProjectFiles(files: Record<string, { code : string }>, rootPath: string, currentPath: string = rootPath): Promise<void> {
    const entries = await fs.readdir(currentPath)
    
    await Promise.all(entries.map(async (entry) => {
        const newPath = path.join(currentPath, entry)
        const stat = await fs.stat(newPath)
        
        if (stat.isFile()) {
            const content = await fs.readFile(newPath)
            files[newPath.substring(rootPath.length)] = { code: content.toString()}
            
        } else if (stat.isDirectory()) {
            return getProjectFiles(files, rootPath, newPath)
        }
    }))
}

const rootPath = process.env.NODE_ENV === 'development' ? path.join(process.cwd(), 'demo') : process.cwd()
const files: Record<string, { code: string }> = {}
const initialFilesPromise = getProjectFiles(files, rootPath)
const wsServer = new ws.WebSocketServer({ noServer: true });

// One-liner for current directory
chokidar.watch('.').on('all', (event, path) => {
  
});

wsServer.on('connection', socket => {
  initialFilesPromise.then(() => socket.send(JSON.stringify(files)))
});


app.get('/ui.js', async (_, res) => {
    res.setHeader('Content-Type', 'application/javascript')
    res.send((await fs.readFile(`${__dirname}/ui.js`)).toString())
})

/*
app.ws('/', () => {
  
})
*/

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

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});