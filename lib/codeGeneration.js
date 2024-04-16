'use strict';

const fsp = require('node:fs/promises');
const terminal = require('./terminal');
const path = require('node:path');
const templateEngine = require('../templates/engine');

const QUESTIONS = {
  app: {
    path: `Where would you like to create your app? (e.g. .): `,
    name: `What is the name of your app? (e.g. my-app): `,
    description: `How would you describe your app? (e.g. A simple app): `,
    cache: `Do you want use cache? (Yes or No): `,
    docker: `Do you want use Docker? (Yes or No): `,
  },
};

const DOCKER_COMPOSE_PATH = 'docker-compose.yml';
const TEMPLATE_DIR_PATH = '../templates/ApplicationStructureTemplate';
const PACKAGE_JSON_PATH = 'package.json';
const CLOSED_QUESTIONS = ['cache', 'docker'];

const CLOSED_ANSWER_ALIASES = {
  yes: true,
  y: true,
  no: false,
  n: false,
  '': false,
};

// eslint-disable-next-line no-prototype-builtins
const hasProp = (obj, prop) => obj.hasOwnProperty(prop);

class Application {
  constructor() {
    this.projectInfo = {};
  }
  processParams(params) {
    const projectInfo = {};
    for (const key in params) {
      if (!hasProp(QUESTIONS.app, key)) {
        terminal.error(terminal.INVALID_FLAG);
      }
      projectInfo[key] = params[key];
    }
    return projectInfo;
  }
  formatCloseAnswer(answer, question) {
    const isOpen = !CLOSED_QUESTIONS.includes(question);
    if (isOpen) return answer;
    const invalid = !hasProp(CLOSED_ANSWER_ALIASES, answer.toLowerCase());
    if (invalid) {
      throw Error('Invalid answer! Please, enter (yes, y) or  (no, n)');
    }
    return CLOSED_ANSWER_ALIASES[answer.toLowerCase()];
  }
  async start(params) {
    this.projectInfo = this.processParams(params);
    const dialog = terminal.startDialog();
    for await (const question of Object.keys(QUESTIONS.app)) {
      const answerFromParams = this.projectInfo[question];
      if (answerFromParams) {
        this.projectInfo[question] = this.formatCloseAnswer(
          answerFromParams,
          question,
        );
        continue;
      }
      const questionMessage = terminal.format.question(QUESTIONS.app[question]);
      const answer = await dialog.question(questionMessage);
      this.projectInfo[question] = this.formatCloseAnswer(answer, question);
    }
    const successMessage = await this.build();
    dialog.write(successMessage);
    dialog.close();
  }

  async build() {
    const { name, docker, cache, description } = this.projectInfo;

    const destinationPath = path.resolve(this.projectInfo.path, name);
    const templatePath = path.resolve(__dirname, TEMPLATE_DIR_PATH);
    const copyOptions = {
      force: false,
      errorOnExist: true,
      recursive: true,
    };
    await fsp.cp(templatePath, destinationPath, copyOptions);

    const packagePath = path.resolve(destinationPath, PACKAGE_JSON_PATH);
    const packageSrc = templateEngine.package([name, description, cache]);

    if (docker) {
      const dockerSrc = templateEngine.docker([name, cache]);
      const dockerPath = path.resolve(destinationPath, DOCKER_COMPOSE_PATH);
      await fsp.writeFile(dockerPath, dockerSrc, 'utf8');
    }

    await fsp.writeFile(packagePath, packageSrc, 'utf8');
    await terminal.run(`npm i --prefix ${destinationPath}`);
    const successMessage = `
    Your app has been created at ${destinationPath}
    `;
    return terminal.format.success(successMessage);
  }
}

module.exports = { Application };
