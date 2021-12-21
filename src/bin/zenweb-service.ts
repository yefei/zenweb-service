#!/usr/bin/env node
import * as path from 'path';
import { findServicesToTyping } from "../typing";

const pathEnv = process.env.ZENWEB_SERVICE_PATHS;
const typingEnv = process.env.ZENWEB_SERVICE_TYPING_FILE;
const patternsEnv = process.env.ZENWEB_SERVICE_PATTERNS;

const paths = pathEnv ? pathEnv.split(':') : [path.join(process.cwd(), 'app', 'service')];
const typingFile = typingEnv || path.resolve(process.cwd(), 'typings', 'service.d.ts');

findServicesToTyping(paths, typingFile, patternsEnv).then(() => {
  console.log('make service typing success');
  process.exit();
}, (e: any) => {
  console.error('make service typing error:', e);
  process.exit(1);
})
