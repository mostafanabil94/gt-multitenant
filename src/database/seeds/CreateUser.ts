import { Connection } from "typeorm";
import { Factory, Seed } from "typeorm-seeding";
import { User } from "../../api/models/User";
export class CreateUser implements Seed {
  public async seed(factory: Factory, connection: Connection): Promise<User> {
    const em = connection.createEntityManager();
    const user = new User();
    user.userId = 1;
    user.userGroupId = 1;
    user.username = "admin@gymtour.app";
    user.password = await User.hashPassword("admin");
    user.email = "no-reply@gymtour.com";
    user.deleteFlag = 0;
    user.isActive = 1;
    return await em.save(user);
  }
}
