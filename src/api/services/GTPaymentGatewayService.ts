import { Service } from "typedi";
import { BranchPaymentGatewayService } from "./BranchPaymentGatewayService";
import { PaymentGatewayService } from "./PaymentGatewayService";
import { StripeService } from "./StripeService";
import { CheckoutService } from "./CheckoutService";

@Service()
export class GTPaymentGatewayService {
    public static paymentGatewayName: any;
    public static paymentGatewayData: any;

    constructor(private paymentGatewayService: PaymentGatewayService, private branchPaymentGatewayService: BranchPaymentGatewayService) {
        console.log('GTPaymentGateway');
    }

    public getPaymentProcessor = async (branchId: number) => {
        const branchPaymentGateway = await this.branchPaymentGatewayService.findOne({ where: {branchId}});
        GTPaymentGatewayService.paymentGatewayData = branchPaymentGateway.paymentGatewayData;
        console.log('paymentGatewayData', GTPaymentGatewayService.paymentGatewayData);
        const paymentGateway = await this.paymentGatewayService.findOne({select: ['paymentGatewayId', 'name'], where: {paymentGatewayId: branchPaymentGateway.paymentGatewayId}});
        GTPaymentGatewayService.paymentGatewayName = paymentGateway.name;
        console.log('paymentGatewayName', GTPaymentGatewayService.paymentGatewayName);
        return paymentGateway;
    }

    public createToken = async (cardNumber, expMonth, expYear, cvc) => {
        let paymentProcessor: any;
        if (GTPaymentGatewayService.paymentGatewayName === 'stripe') {
            paymentProcessor = new StripeService(JSON.parse(GTPaymentGatewayService.paymentGatewayData).secret_key);
        } else if (GTPaymentGatewayService.paymentGatewayName === 'checkout') {
            paymentProcessor = new CheckoutService(JSON.parse(GTPaymentGatewayService.paymentGatewayData).secret_key, JSON.parse(GTPaymentGatewayService.paymentGatewayData).public_key);
        }
        const token = await paymentProcessor.createToken(cardNumber, expMonth, expYear, cvc);
        console.log('token', token);
        return token;
    }

    // public static createCharge = async (amount, currency, source, description) => {
    //     const charge = await StripeService.stripe.charges.create({
    //         amount,
    //         currency,
    //         source,
    //         description,
    //     });

    //     return charge;
    // }

    // public static retrieveCharge = async (chargeId) => {
    //     const charge = await StripeService.stripe.charges.retrieve(
    //         chargeId
    //     );

    //     return charge;
    // }

    // public static createRefund = async (chargeId, amount) => {
    //     const charge = await StripeService.stripe.refunds.create({
    //         charge: chargeId,
    //         amount,
    //     });

    //     return charge;
    // }

    // public static retrieveRefund = async (refundId) => {
    //     const refund = await StripeService.stripe.refunds.retrieve(
    //         refundId
    //     );

    //     return refund;
    // }
}
