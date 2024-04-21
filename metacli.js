'use strict';

const path = require('node:path');
const metasql = require('metasql');

const help = require('./lib/help');
const codeGeneration = require('./lib/codeGeneration');
const terminal = require('./lib/terminal');

const [, , command, ...args] = process.argv;

const schemaPath = path.join(process.cwd(), './application/schemas');

const commands = {
  'generate-db-schema': () => metasql.create(schemaPath, schemaPath),
  'generate-application': async (params) => {
    const appGeneration = new codeGeneration.Application();
    await appGeneration.start(params);
  },
  help,
};

(async () => {
  try {
    if (!commands[command]) {
      console.log(terminal.INVALID_COMMAND);
      return help();
    }
    const params = terminal.parseParams(args);
    return await commands[command](params);
  } catch (error) {
    return terminal.error(error.message);
  }
})();
