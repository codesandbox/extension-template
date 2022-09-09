import { SandpackClient } from "@codesandbox/sandpack-client";

document.body.innerHTML = `
<iframe id="iframe" style="border:0;width:100%;height:100%;"/>
    
`;

const ws = new WebSocket("ws://localhost:3000");

let client: SandpackClient;

ws.onmessage = (msg) => {
  const files = JSON.parse(msg.data);

  if (client) {
    client.updatePreview({ files });
  } else {
    client = new SandpackClient("#iframe", {
      files,
    });
  }
};
