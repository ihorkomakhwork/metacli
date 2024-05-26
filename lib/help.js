'use strict';

const terminal = require('./terminal');

module.exports = () => {
  const message = terminal.format.info`
    Usage: metacli [command] [options]

    Commands:
      generate-db-schema  Generate database schema
      generate-application        Generate application
        Options:
        --path               Where would you like to create your app? (e.g. .)
        --name               What is the name of your app? (e.g. my-app)
        --description        How would you describe your app? (e.g. A simple app)
        --cache              Do you want use cache? (Yes or No): 
        --docker            Do you want use Docker? (Yes or No)
      help                 Show help
`;

  console.log(message);
};
