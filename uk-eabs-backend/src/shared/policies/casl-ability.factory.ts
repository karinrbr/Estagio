import * as _ from 'lodash';
import { Injectable, SetMetadata } from '@nestjs/common';
import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType } from '@casl/ability';
import { ACTION, CHECK_POLICIES_KEY } from './casl.constant';
import { User } from '../../modules/user/user.entity';
import { Role } from '../../modules/user/user.constant';

// type Subjects = typeof Article | typeof User | Article | User | 'all';

// 'all' is a special keyword in CASL that represents "any subject"
type Subjects = typeof User | User | 'all';

export type AppAbility = Ability<[ACTION, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User, params: any) {
    const { can, cannot, build } = new AbilityBuilder<Ability<[ACTION, Subjects]>>(Ability as AbilityClass<AppAbility>);

    const isAdmin = user && user.role == Role.administrator;
    const isSameUser = user && user.id == params.id;

    if (isAdmin) {
      can(ACTION.Manage, 'all'); // read-write access to everything
    } else {
      can(ACTION.Read, 'all'); // read-only access to everything
      if (isSameUser) {
        can(ACTION.Update, User); // User can update itself
      }
      cannot(ACTION.Delete, User); // Users cannot delete other users
    }
    // return build({});
    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) => item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export const CheckPolicies = (...handlers: PolicyHandler[]) => SetMetadata(CHECK_POLICIES_KEY, handlers);
