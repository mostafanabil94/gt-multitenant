import "reflect-metadata";
import {
  Get,
  JsonController,
  Authorized,
  Res,
  QueryParam,
} from "routing-controllers";
import { CityService } from "../../services/CityService";
import { classToPlain } from "class-transformer";

@JsonController("/city")
export class CityController {
  constructor(private cityService: CityService) {}

  // City List API
  /**
   * @api {get} /api/city/city-list City List API
   * @apiGroup City
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {String} keyword keyword
   * @apiParam (Request body) {String} status status
   * @apiParam (Request body) {Number} count count should be number or boolean
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get City list",
   *      "data":{
   *      "countryId"
   *      "name"
   *      }
   *      "status": "1"
   * }
   * @apiSampleRequest /api/city/city-list
   * @apiErrorExample {json} city error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/city-list")
  @Authorized()
  public async citylist(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("keyword") keyword: string,
    @QueryParam("countryId") countryId: number,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["cityId", "countryId", "name"];
    const search = [
      {
        name: "name",
        op: "like",
        value: keyword,
      },
      {
        name: "countryId",
        op: "where",
        value: countryId,
      },
    ];

    const WhereConditions = [];
    // const relation = ["country"];
    const relation = [];

    const cityList = await this.cityService.list(
      limit,
      offset,
      select,
      search,
      WhereConditions,
      relation,
      count
    );
    if (cityList) {
      const successResponse: any = {
        status: 1,
        message: "Successfully get all city List",
        data: classToPlain(cityList),
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 1,
        message: "unable to get city List",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
