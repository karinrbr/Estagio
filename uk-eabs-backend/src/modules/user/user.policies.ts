import { AppAbility, IPolicyHandler } from '../../shared/policies/casl-ability.factory';
import { ACTION } from '../../shared/policies/casl.constant';
import { User } from './user.entity';

export class ReadUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(ACTION.Read, User);
  }
}
