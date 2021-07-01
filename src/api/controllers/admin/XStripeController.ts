// import "reflect-metadata";
// import { Post, JsonController, Res, Req } from "routing-controllers";
// import { StripeService } from "../../services/StripeService";

// @JsonController("/gt-stripe-test")
// export class GTStripeTestController {
//   constructor() { console.log('GTStripe'); }

//   @Post("/create-stripe-card-token")
//   public async createStripeCardToken(
//     @Req() request: any,
//     @Res() response: any
//   ): Promise<any> {
//     const cardNumber = request.body.cardNumber;
//     const expMonth = request.body.expMonth;
//     const expYear = request.body.expYear;
//     const cvc = request.body.cvc;

//     const result = await StripeService.createToken(cardNumber, expMonth, expYear, cvc);

//     const successResponse: any = {
//         status: 1,
//         data: result,
//     };
//     return response.status(200).send(successResponse);
//   }

//   @Post("/create-stripe-card-token-charge")
//   public async createStripeCardTokenCharge(
//     @Req() request: any,
//     @Res() response: any
//   ): Promise<any> {
//     const amount = request.body.amount;
//     const currency = request.body.currency;
//     const source = request.body.source;
//     const description = request.body.description;

//     const result = await StripeService.createCharge(amount, currency, source, description);

//     const successResponse: any = {
//         status: 1,
//         data: result,
//     };
//     return response.status(200).send(successResponse);
//   }

//   @Post("/retrieve-stripe-card-token-charge")
//   public async retrieveStripeCardTokenCharge(
//     @Req() request: any,
//     @Res() response: any
//   ): Promise<any> {
//     const chargeId = request.body.chargeId;

//     const result = await StripeService.retrieveCharge(chargeId);

//     const successResponse: any = {
//         status: 1,
//         data: result,
//     };
//     return response.status(200).send(successResponse);
//   }

//   @Post("/create-stripe-refund")
//   public async createStripeRefund(
//     @Req() request: any,
//     @Res() response: any
//   ): Promise<any> {
//     const chargeId = request.body.chargeId;
//     const amount = request.body.amount;

//     const result = await StripeService.createRefund(chargeId, amount);

//     const successResponse: any = {
//         status: 1,
//         data: result,
//     };
//     return response.status(200).send(successResponse);
//   }

//   @Post("/retrieve-stripe-refund")
//   public async retrieveStripeRefund(
//     @Req() request: any,
//     @Res() response: any
//   ): Promise<any> {
//     const refundId = request.body.refundId;

//     const result = await StripeService.retrieveRefund(refundId);

//     const successResponse: any = {
//         status: 1,
//         data: result,
//     };
//     return response.status(200).send(successResponse);
//   }
// }
