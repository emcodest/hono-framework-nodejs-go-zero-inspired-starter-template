import type { Config } from '../config/config';
import { UserModel } from '../model/user.model';

export class ServiceContext {
  public config: Config;
  public userModel: UserModel;

  constructor(config: Config) {
    this.config = config;
    this.userModel = new UserModel();
  }

  // Add other dependencies here (cache, external services, etc.)
}
