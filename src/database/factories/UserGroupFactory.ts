import * as Faker from 'faker';
import { define } from 'typeorm-seeding';
import { UserGroup } from '../../api/models/UserGroup';
define(UserGroup, (faker: typeof Faker, settings: { role: string []}) => {
    const usergroup = new UserGroup();
    return usergroup;
});
