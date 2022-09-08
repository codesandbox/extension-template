import { SandpackClient } from '@codesandbox/sandpack-client'

document.body.innerHTML = `
<iframe id="iframe"/>
    
`

const ws = new WebSocket('ws://localhost:3000')






ws.onopen = () => {
    console.log("HEEEY")
}

let client: SandpackClient

ws.onmessage = (msg) => {
    const files = JSON.parse(msg.data)
    console.log(files)
    if (client) {
      client.updatePreview({files})
    } else {
        client = new SandpackClient('#iframe', {
        files
    })  
    }
    

}