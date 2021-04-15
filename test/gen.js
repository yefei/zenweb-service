'use strict';

const path = require('path');

process.env.NODE_ENV = 'development';

const { Core } = require('@zenweb/core');
const app = new Core();

app.setup(require('..').setup, {
  paths: [path.join(process.cwd(), 'test', 'service')],
  patterns: '**/*_service.js',
  typingFile: path.join(process.cwd(), 'test', 'typings', 'service.d.ts'),
});

app.boot();
