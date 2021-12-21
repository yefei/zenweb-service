import { Service } from '../../../src/index';

export default class AccountService extends Service {
  test() {
    return {
      service: 'AccountService',
    };
  }
}
