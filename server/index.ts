#!/usr/bin/env node
import { httpServer } from "../packages/extension-server";
import fs from "fs";

httpServer.get("/uppercase-name", () => {
  const packageJson = JSON.parse(
    fs.readFileSync(`${process.cwd()}/package.json`).toString()
  );

  packageJson.name = packageJson.name.toUpperCase();

  fs.writeFileSync(
    `${process.cwd()}/package.json`,
    JSON.stringify(packageJson, null, 2)
  );
});
