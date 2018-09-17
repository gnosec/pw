#!/usr/bin/env node
const { cli } = require('./application.context');

// clear console on exit
process.on('exit', code => {
  process.stdout.write('\x1B[2J\x1B[0f');
});

// bootstrap application
cli.parse(process.argv);
