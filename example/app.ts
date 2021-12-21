import * as path from 'path';
import { Core } from '@zenweb/core';
import { setup } from '../src/index';

const app = new Core();

app.setup(setup, {
  paths: [path.join(process.cwd(), 'service')],
  typingFile: path.join(process.cwd(), 'service.d.ts'),
});

app.use(ctx => {
  // ctx.body = ctx.service.user_account.test();
});

app.setupAfter(() => {
  // 重名测试
  // app.serviceRegister.register(class {}, 'user_account');
});

app.start();
