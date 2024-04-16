'use strict';

const rlp = require('node:readline/promises');
const util = require('node:util');
const { exec } = require('node:child_process');
const run = util.promisify(exec);

const concolor = require('concolor');
const FAIL_CODE = 1;

const format = {
  question: (message) => concolor('b,white')(message),
  info: (message) => concolor('b,white')(message),
  error: (message) => concolor('b,red')(message),
  success: (message) => concolor('b,green')(message),
};

const INVALID_COMMAND = format.error`============   Invalid command!   ==============`;
const INVALID_FLAG = format.error`============   Invalid flag!   ==============`;

const startDialog = () =>
  rlp.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

const parseParams = (args) => {
  const params = {};
  if (!args.length) return params;
  for (let i = 0; i < args.length; i += 2) {
    const [flag, argument] = args.slice(i, i + 2);
    if (!flag.startsWith('--') || !argument) process.exit(1);
    const key = flag.slice(2);
    params[key] = argument;
  }
  return params;
};

const error = (message) => {
  console.log(format.error(message));
  process.exit(FAIL_CODE);
};

module.exports = {
  startDialog,
  format,
  parseParams,
  INVALID_COMMAND,
  INVALID_FLAG,
  error,
  run,
};
