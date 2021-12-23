#!/usr/bin/env node
import * as path from 'path';
import { findServicesToTyping } from "../typing";

const pathEnv = process.env.ZENWEB_SERVICE_PATHS;
const typingEnv = process.env.ZENWEB_SERVICE_TYPING_FILE;
const patternsEnv = process.env.ZENWEB_SERVICE_PATTERNS;

const paths = pathEnv ? pathEnv.split(':') : [path.join(process.cwd(), 'src', 'service')];
const typingFile = typingEnv || path.join(process.cwd(), 'src', '_typings', 'service.ts');

findServicesToTyping(paths, typingFile, patternsEnv).then(() => {
  console.log('make service typing success');
  process.exit();
}, (e: any) => {
  console.error('make service typing error:', e);
  process.exit(1);
})
