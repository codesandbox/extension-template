import { SandpackClient } from '@codesandbox/sandpack-client'

document.body.innerHTML = `
<iframe id="preview"/>
    
`

async function start() {
  const response = await fetch('/files')
  const files = await response.json()
  
  console.log(files)
const client = new SandpackClient("#preview", {
  files
});
}

start()


