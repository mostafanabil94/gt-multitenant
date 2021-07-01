import { Service } from "typedi";
import { Checkout } from 'checkout-sdk-node';

@Service()
export class CheckoutService {
    public static checkout: any;
    constructor(private secretKey: string, private publicKey: string) {
        CheckoutService.checkout = new Checkout(this.secretKey, { pk: this.publicKey, timeout: 7000 });
    }

    public createToken = async (cardNumber, expMonth, expYear, cvc) => {
        const token = await CheckoutService.checkout.tokens.request({
            card: {
                number: cardNumber,
                expiry_month: expMonth,
                expiry_year: expYear,
                cvv: cvc,
            },
        });

        return token;
    }

    public createCharge = async (amount, currency, source, description) => {
        const charge = await CheckoutService.checkout.charges.create({
            amount,
            currency,
            source,
            description,
        });

        return charge;
    }

    public retrieveCharge = async (chargeId) => {
        const charge = await CheckoutService.checkout.charges.retrieve(
            chargeId
        );

        return charge;
    }

    public createRefund = async (chargeId, amount) => {
        const charge = await CheckoutService.checkout.refunds.create({
            charge: chargeId,
            amount,
        });

        return charge;
    }

    public retrieveRefund = async (refundId) => {
        const refund = await CheckoutService.checkout.refunds.retrieve(
            refundId
        );

        return refund;
    }
}
