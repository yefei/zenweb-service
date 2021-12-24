#!/usr/bin/env node
import * as path from 'path';
import { findServicesToTyping } from "../typing";

export function cwdPath(p: string): string {
  if (p.startsWith('./')) {
    return path.join(process.cwd(), p.slice(2));
  }
  return p;
}

const paths = cwdPath(process.env.ZENWEB_SERVICE_PATH || './src/service');
const typingFile = cwdPath(process.env.ZENWEB_SERVICE_TYPING_FILE || './src/_typings/service.ts');
const patternsEnv = process.env.ZENWEB_SERVICE_PATTERNS;

findServicesToTyping(paths, typingFile, patternsEnv).then(() => {
  console.log('make service typing success');
  process.exit();
}, (e: any) => {
  console.error('make service typing error:', e);
  process.exit(1);
});
