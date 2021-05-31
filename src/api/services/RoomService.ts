import { Service } from "typedi";
import { OrmRepository } from "typeorm-typedi-extensions";
import { Logger, LoggerInterface } from "../../decorators/Logger";
import { Like } from "typeorm/index";
import { RoomRepository } from "../repositories/RoomRepository";
import { Room } from "../models/Room";

@Service()
export class RoomService {
  constructor(
    @OrmRepository() private roomRepository: RoomRepository,
    @Logger(__filename) private log: LoggerInterface
  ) {}

  // create room
  public async create(room: any): Promise<Room> {
    this.log.info("Create a new room ");
    return this.roomRepository.save(room);
  }

  // find Condition
  public findOne(room: any): Promise<any> {
    return this.roomRepository.findOne(room);
  }

  // update room
  public update(id: any, room: Room): Promise<any> {
    room.roomId = id;
    return this.roomRepository.save(room);
  }

  // room List
  public list(
    limit: any,
    offset: any,
    select: any = [],
    search: any = [],
    whereConditions: any = [],
    relation: any = [],
    count: number | boolean
  ): Promise<any> {
    const condition: any = {};

    if (select && select.length > 0) {
      condition.select = select;
    }
    condition.where = {};

    if (relation && relation.length > 0) {
      condition.relations = relation;
    }

    if (whereConditions && whereConditions.length > 0) {
      whereConditions.forEach((item: any) => {
        condition.where[item.name] = item.value;
      });
    }

    if (search && search.length > 0) {
      search.forEach((table: any) => {
        const operator: string = table.op;
        if (operator === "where" && table.value !== "") {
          condition.where[table.name] = table.value;
        } else if (operator === "like" && table.value !== "") {
          condition.where[table.name] = Like("%" + table.value + "%");
        }
      });
    }

    if (limit && limit > 0) {
      condition.take = limit;
      condition.skip = offset;
    }

    if (count) {
      return this.roomRepository.count(condition);
    } else {
      return this.roomRepository.find(condition);
    }
  }
  // delete room
  public async delete(id: number): Promise<any> {
    return await this.roomRepository.delete(id);
  }
}
