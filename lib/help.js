'use strict';

const terminal = require('./terminal');

module.exports = () => {
  const message = terminal.format.info`
    Usage: metacli [command] [options]

    Commands:
      gennerate-db-schema  Generate database schema
      gennerate-app        Generate application
      help                 Show help
    
    Options:
        --name               Application name
        `;

  console.log(message);
};
