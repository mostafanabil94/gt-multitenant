import "reflect-metadata";
import {
  Get,
  JsonController,
  Res,
  QueryParam,
} from "routing-controllers";
import { CityService } from "../../services/CityService";
import { classToPlain } from "class-transformer";
import { CountryService } from "../../services/CountryService";
import { PaymentGatewayService } from "../../services/PaymentGatewayService";

@JsonController("/common-lists")
export class CommonListsController {
  constructor(private cityService: CityService,
              private countryService: CountryService,
              private paymentGatewayService: PaymentGatewayService) {}

  // City List API
  /**
   * @api {get} /api/common-lists/city-list City List API
   * @apiGroup Common Lists
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
   *      "cityId"
   *      "name"
   *      }
   *      "status": "1"
   * }
   * @apiSampleRequest /api/common-lists/city-list
   * @apiErrorExample {json} city error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/city-list")
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

  // Country List API
  /**
   * @api {get} /api/common-lists/country-list Country List API
   * @apiGroup Common Lists
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
   * @apiSampleRequest /api/common-lists/country-list
   * @apiErrorExample {json} Country error
   * HTTP/1.1 500 Internal Server Error
   */
   @Get("/country-list")
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

   // Payment Gateway List API
  /**
   * @api {get} /api/common-lists/payment-gateway-list Payment Gateway List API
   * @apiGroup Common Lists
   * @apiHeader {String} Authorization
   * @apiParam (Request body) {Number} limit limit
   * @apiParam (Request body) {Number} offset offset
   * @apiParam (Request body) {String} keyword keyword
   * @apiParam (Request body) {Number} countryId countryId
   * @apiParam (Request body) {String} status status
   * @apiParam (Request body) {Number} count count should be number or boolean
   * @apiSuccessExample {json} Success
   * HTTP/1.1 200 OK
   * {
   *      "message": "Successfully get Payment Gateways list",
   *      "data":{
   *      "countryId"
   *      "paymentGatewayId"
   *      "name"
   *      }
   *      "status": "1"
   * }
   * @apiSampleRequest /api/common-lists/payment-gateway-list
   * @apiErrorExample {json} payment gateway error
   * HTTP/1.1 500 Internal Server Error
   */
  @Get("/payment-gateway-list")
  public async paymentGatewaylist(
    @QueryParam("limit") limit: number,
    @QueryParam("offset") offset: number,
    @QueryParam("keyword") keyword: string,
    @QueryParam("countryId") countryId: string,
    @QueryParam("count") count: number | boolean,
    @Res() response: any
  ): Promise<any> {
    const select = ["paymentGatewayId", "countryId", "name"];
    const search = [
      {
        name: "name",
        op: "like",
        value: keyword,
      },
    ];

    if (countryId !== undefined) {
      search.push({
        name: "countryId",
        op: "where",
        value: countryId,
      });
    }

    const WhereConditions = [];
    const relation = [];

    const paymentGatewayList = await this.paymentGatewayService.list(
      limit,
      offset,
      select,
      search,
      WhereConditions,
      relation,
      count
    );
    if (paymentGatewayList) {
      const successResponse: any = {
        status: 1,
        message: "Successfully get all Payment Gateway List",
        data: classToPlain(paymentGatewayList),
      };
      return response.status(200).send(successResponse);
    } else {
      const errorResponse: any = {
        status: 1,
        message: "unable to get Payment Gateway List",
      };
      return response.status(400).send(errorResponse);
    }
  }
}
