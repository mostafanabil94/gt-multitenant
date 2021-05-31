import "reflect-metadata";
import {
  Post,
  Body,
  JsonController,
  Res,
  Authorized,
  Put,
  Param,
  QueryParam,
  Get,
  Delete,
  Req,
} from "routing-controllers";
import { CreateRoomRequest } from "./requests/CreateRoomRequest";
import { Room } from "../../models/Room";
import { RoomService } from "../../services/RoomService";
import { BranchService } from "../../services/BranchService";

@JsonController("/room")
export class RoomController {
  constructor(
    private roomService: RoomService,
    private branchService: BranchService
  ) {}

  // Create Room API
  /**
   * @api {post} /api/room/create-room Create Room API
   * @apiGroup Room
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} userId userId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "userId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "New Room is created successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/room/create-room
   * @apiErrorExample {json} createRoom error
   * HTTP/1.1 500 Internal Server Error
   */
  @Post("/create-room")
  @Authorized()
  public async createRoom(
    @Body({ validate: true }) createRoomParam: CreateRoomRequest,
    @Res() response: any
  ): Promise<any> {
    const newRoom: any = new Room();
    newRoom.branchId = createRoomParam.branchId;
    newRoom.name = createRoomParam.name;
    newRoom.isActive = createRoomParam.status;
    const roomSave = await this.roomService.create(newRoom);
    if (roomSave) {
      const successResponse: any = {
        status: 1,
        message: "Room saved successfully",
        data: roomSave,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to save Room",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Update Room API
  /**
   * @api {put} /api/room/update-room/:id Update Room API
   * @apiGroup Room
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} userId userId
   * @apiParam (Request body) {Number} status status
   * @apiHeader {String} Authorization
   * @apiParamExample {json} Input
   * {
   *      "branchId" : "",
   *      "userId" : "",
   *      "status" : "",
   * }
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Room is updated successfully",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/room/update-room/:id
   * @apiErrorExample {json} updateRoom error
   * HTTP/1.1 500 Internal Server Error
   */
  @Put("/update-room/:id")
  @Authorized()
  public async updateRoom(
    @Param("id") id: number,
    @Body({ validate: true }) createRoomParam: CreateRoomRequest,
    @Res() response: any
  ): Promise<any> {
    const room = await this.roomService.findOne({
      where: {
        roomId: id,
      },
    });
    console.log(room);
    if (!room) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid roomId",
      };
      return response.status(400).send(errorResponse);
    }
    room.branchId = createRoomParam.branchId;
    room.name = createRoomParam.name;
    room.isActive = createRoomParam.status;
    const roomUpdate = await this.roomService.update(id, room);
    if (roomUpdate) {
      const successResponse: any = {
        status: 1,
        message: "Room updated successfully",
        data: roomUpdate,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to update Room",
      };
      return response.status(400).send(errorResponse);
    }
  }

  // Room List API
  /**
   * @api {get} /api/room/room-list Room List API
   * @apiGroup Room
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {Number} branchId branchId
   * @apiParam (Request body) {Number} userId userId
   * @apiParam (Request body) {Number} status status
   * @apiParam (Request body) {Number} count count in number or boolean
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *    "message": "Successfully get Room list",
   *    "data":"{}"
   *    "status": "1"
   *  }
   * @apiSampleRequest /api/room/room-list
   * @apiErrorExample {json} Room error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/room-list")
  @Authorized()
  public async roomList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("branchId") branchId: number,
    @QueryParam("keyword") keyword: number,
    @QueryParam("status") status: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["branchId", "name", "isActive"];
    const whereConditions = [
      {
        name: "branchId",
        op: "where",
        value: branchId,
      },
      {
        name: "name",
        op: "where",
        value: keyword,
      },
      {
        name: "isActive",
        op: "like",
        value: status,
      },
    ];

    const search = [];

    const relation = [];

    const roomList = await this.roomService
      .list(limit, offset, select, search, whereConditions, relation, count)
      .then((val) => {
        const room = val.map(async (value: any) => {
          const temp: any = value;
          const branch = await this.branchService.findOne({
            where: { branchId: temp.branchId },
          });
          temp.branchName = branch.name;
          return temp;
        });
        const results = Promise.all(room);
        return results;
      });
    const successResponse: any = {
      status: 1,
      message: "Successfully get all Room List",
      data: roomList,
    };
    return response.status(200).send(successResponse);
  }
  // Delete Room API
  /**
   * @api {delete} /api/room/delete-room/:id Delete Room API
   * @apiGroup Room
   * @apiHeader {String} Authorization
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully deleted Room.",
   *      "status": "1"
   * }
   * @apiSampleRequest /api/room/delete-room/:id
   * @apiErrorExample {json} Room error
   * HTTP/1.1 500 Internal Server Error
   */
  @Delete("/delete-room/:id")
  @Authorized()
  public async deleteRole(
    @Param("id") id: number,
    @Res() response: any,
    @Req() request: any
  ): Promise<any> {
    const roomId = await this.roomService.findOne({
      where: {
        roomId: id,
      },
    });
    if (!roomId) {
      const errorResponse: any = {
        status: 0,
        message: "Invalid roomId",
      };
      return response.status(400).send(errorResponse);
    }

    const room = await this.roomService.delete(id);
    console.log("room" + room);
    if (room) {
      const successResponse: any = {
        status: 1,
        message: "Successfully deleted Room",
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to delete Room",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
