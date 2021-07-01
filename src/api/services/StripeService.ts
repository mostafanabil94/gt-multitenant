import { Service } from "typedi";

@Service()
export class StripeService {
    public static stripe: any;
    constructor(private secretKey: string) {
        StripeService.stripe = require("stripe")(this.secretKey);
    }

    public createToken = async (cardNumber, expMonth, expYear, cvc) => {
        const token = await StripeService.stripe.tokens.create({
            card: {
                number: cardNumber,
                exp_month: expMonth,
                exp_year: expYear,
                cvc,
            },
        });

        return token;
    }

    public createCharge = async (amount, currency, source, description) => {
        const charge = await StripeService.stripe.charges.create({
            amount,
            currency,
            source,
            description,
        });

        return charge;
    }

    public retrieveCharge = async (chargeId) => {
        const charge = await StripeService.stripe.charges.retrieve(
            chargeId
        );

        return charge;
    }

    public createRefund = async (chargeId, amount) => {
        const charge = await StripeService.stripe.refunds.create({
            charge: chargeId,
            amount,
        });

        return charge;
    }

    public retrieveRefund = async (refundId) => {
        const refund = await StripeService.stripe.refunds.retrieve(
            refundId
        );

        return refund;
    }
}
