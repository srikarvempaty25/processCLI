#! /usr/bin/env node
const chalk = require('chalk');
const boxen = require('boxen');
const yargs = require('yargs');
const figlet = require('figlet');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

const usage = chalk.keyword('violet')(
  "\nUsage: mycli [--listprocesses] [--kill <process_name>]\n" +
    boxen(chalk.green('\n' + 'Lists the currently running processes and optionally kills processes by name' + '\n'), {
      padding: 1,
      borderColor: 'green',
      dimBorder: true,
    }) +
    '\n'
);

const options = yargs
  .usage(usage)
  .option('listprocesses', {
    describe: 'List running processes',
    type: 'boolean',
    demandOption: false,
  })
  .option('kill', {
    describe: 'Kill all running processes',
    type: 'boolean',
    demandOption: false,
  })
  .help(true)
  .argv;

const argv = require('yargs/yargs')(process.argv.slice(2)).argv;

if (argv.listprocesses) {
  execPromise('tasklist')
    .then(({ stdout }) => {
      const processes = stdout.split('\n').slice(3).map((line) => line.split(/\s+/)[0]);
      console.log(
        '\n' +
          boxen(chalk.green('Running Processes:\n\n' + processes.join('\n')), {
            padding: 1,
            borderColor: 'green',
            dimBorder: true,
          }) +
          '\n'
      );
    })
    .catch((error) => {
      console.error(error);
    });
}

if (argv.kill) {
  execPromise('taskkill /F /FI "STATUS eq running"')
    .then(() => {
      console.log('Successfully killed all running processes');
    })
    .catch((error) => {
      console.error(`Error killing processes: ${error}`);
    });
}
