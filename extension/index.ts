#!/usr/bin/env node
import express from "express";
import * as ws from "ws";
import fs from "fs/promises";
import * as path from "path";
import chokidar from "chokidar";

const app = express();
const port = 3000;
const rootPath =
  process.env.NODE_ENV === "development"
    ? path.join(process.cwd(), "demo")
    : process.cwd();
const files: Record<string, { code: string }> = {};
const wsServer = new ws.WebSocketServer({ noServer: true });

// One-liner for current directory
chokidar
  .watch(rootPath, {
    ignored: [/node_modules/, /^\..*/],
  })
  .on("all", async (event, path) => {
    switch (event) {
      case "add": {
        const stat = await fs.stat(path);

        if (stat.isFile()) {
          const content = await fs.readFile(path);
          files[path.substring(rootPath.length)] = { code: content.toString() };
        }
        break;
      }
      case "change": {
        const content = await fs.readFile(path);
        files[path.substring(rootPath.length)] = { code: content.toString() };
        break;
      }
      case "unlink": {
        delete files[path.substring(rootPath.length)];
        break;
      }
    }

    const stringifiedFiles = JSON.stringify(files);
    wsServer.clients.forEach((socket) => {
      socket.send(stringifiedFiles);
    });
  });

wsServer.on("connection", (socket) => {
  socket.send(JSON.stringify(files));
});

app.get("/ui.js", async (_, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.send((await fs.readFile(`${__dirname}/ui.js`)).toString());
});

app.get("/", (_, res) => {
  res.setHeader("Content-Type", "text/html");
  res.send(`<!DOCTYPE html>
<html>
  <head>
    <style>
      html, body { margin: 0; height: 100vh; }
    </style>
  </head>
  <body>
    <script src="ui.js"></script>
  </body>
</html>
`);
});

const server = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});
