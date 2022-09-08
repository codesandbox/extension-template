import { SandpackClient } from '@codesandbox/sandpack-client'

document.body.innerHTML = `
<iframe id="iframe"/>
    
`

const client = new SandpackClient('#iframe', {
files: {
    "/index.js": {
      code: `console.log(require('uuid'))`,
    },
  },
  entry: "/index.js",
  dependencies: {
    uuid: "latest",
  },
})

