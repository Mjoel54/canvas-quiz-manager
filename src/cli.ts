#!/usr/bin/env node
import { mainMenu } from "./menus/mainMenu.js";

async function runCli() {
  await mainMenu();
}

runCli();
