#!/usr/bin/env node

const path = require('path');
const commander = require('commander');
const glob = require('glob');
const { getPkg } = require('./utils/get-pkg');

glob.sync(path.join(__dirname, 'commands', '*.js')).forEach(commandModule => {
  const command = require(commandModule);
  command(commander);
});

commander.version(
  getPkg().version,
  '-v, --version',
  'output the current version'
);

commander.parse(process.argv);
