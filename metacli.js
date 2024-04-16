'use strict';

const path = require('node:path');
const metasql = require('metasql');

const help = require('./lib/help');
const codeGeneration = require('./lib/codeGeneration');
const terminal = require('./lib/terminal');

const [, , command, ...args] = process.argv;

const schemaPath = __dirname.includes('node_modules')
  ? path.join(process.cwd(), 'application/schemas')
  : path.join(__dirname, '../node_modules/metadomain/schemas');

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
    const errorMessage = terminal.format.error(error.message);
    return terminal.error(errorMessage);
  }
})();
