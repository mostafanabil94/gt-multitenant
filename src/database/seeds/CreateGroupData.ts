import { Connection } from "typeorm";
import { Factory, Seed } from "typeorm-seeding";
import { UserGroup } from "../../api/models/UserGroup";
export class CreateGroupData implements Seed {
  public async seed(
    factory: Factory,
    connection: Connection
  ): Promise<UserGroup> {
    const em = connection.createEntityManager();
      const groupData: any = [
        {
          groupId: 1,
          name: 'Super Admin',
          isActive: 1,
        },
        {
          groupId: 2,
          name: 'Admin',
          isActive: 1,
        },
        {
          groupId: 3,
          name: 'Sales',
          isActive: 1,
        },
        {
          groupId: 4,
          name: 'Fitness',
          isActive: 1,
        },
        {
          groupId: 5,
          name: 'Customer Service',
          isActive: 1,
        },
      ];
    let i = 0;
        for ( i; i < groupData.length; i++ ) {
            const group = new UserGroup();
                group.groupId = groupData[i].groupId;
                group.name = groupData[i].name;
                group.isActive = groupData[i].isActive;
                await em.save(group);
            }
    return groupData;
}
}
