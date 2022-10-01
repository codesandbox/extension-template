import express from "express";
import fs from "fs";
import * as ws from "ws";

const httpServer = express();
const port = process.env.EXTENSION_PORT || 3000;
const wsServer = new ws.WebSocketServer({ noServer: true });

httpServer.get("/client.js", (_, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.send(fs.readFileSync(`${__dirname}/client.js`).toString());
});

httpServer.get("/", (_, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <script src="client.js"></script>
  </body>
</html>
`);
});

const server = httpServer.listen(port, () => {
  console.log(`Extension listening on port ${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});

export { httpServer, wsServer };
