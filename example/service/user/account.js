import { Service } from '@zenweb/service';

export default class AccountService extends Service {
  test() {
    return {
      service: 'AccountService',
    };
  }
}
