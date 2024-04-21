'use strict';

const { execSync } = require('node:child_process');
const fs = require('node:fs');

const DOCKER_COMPOSE_UP = 'docker compose up --build';
const DOCKER_COMPOSE_FILE = './docker-compose.yml';
const NPM_DOTEST = 'npm run dotest';

module.exports = () => {
  const existDockerConfig = fs.existsSync(DOCKER_COMPOSE_FILE);
  const command = existDockerConfig ? DOCKER_COMPOSE_UP : NPM_DOTEST;
  const process = execSync(command);
  process.stdout.on('data', (data) => console.log(data.toString()));
  process.stderr.on('data', (data) => new Error(data.toString()));
  return;
};
