import "reflect-metadata";
import {
  Get,
  JsonController,
  Authorized,
  Res,
  QueryParam,
} from "routing-controllers";
import { CountryService } from "../../services/CountryService";

@JsonController("/country")
export class CountryController {
  constructor(private countryService: CountryService) {}

  // Country List API
  /**
   * @api {get} /api/country/country-list Country List API
   * @apiGroup Country
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {String} keyword keyword
   * @apiParam (Request body) {String} status status
   * @apiParam (Request body) {Number} count count should be number or boolean
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully got country list",
   *      "data":{
   *      "countryId"
   *      "name"
   *      "isoCode2"
   *      "isoCode3"
   *      "phoneCode"
   *      "postcodeRequired"
   *      "isEU"
   *      "status"
   *      }
   *      "status": "1"
   * }
   * @apiSampleRequest /api/country/country-list
   * @apiErrorExample {json} Country error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/country-list")
  @Authorized()
  public async countryList(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("keyword") keyword: string,
    @QueryParam("status") status: string,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = [
      "countryId",
      "name",
      "isoCode2",
      "isoCode3",
      "phoneCode",
      "postcodeRequired",
      "isEU",
      "isActive",
    ];
    const search = [
      {
        name: "name",
        op: "like",
        value: keyword,
      },
      {
        name: "isActive",
        op: "like",
        value: status,
      },
    ];
    const WhereConditions = [];
    const countryList = await this.countryService.list(
      limit,
      offset,
      select,
      search,
      WhereConditions,
      count
    );
    if (countryList) {
      const successResponse: any = {
        status: 1,
        message: "Successfully got country List",
        data: countryList,
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 0,
        message: "unable to get countryList",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
