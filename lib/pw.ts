#!/usr/bin/env ts-node

import { cli } from './application.context';

process.on('exit', code => {
  process.stdout.write('\x1B[2J\x1B[0f');
});

cli.parse(process.argv);
