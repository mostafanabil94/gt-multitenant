import {
    Column,
    Entity,
    BeforeInsert,
    BeforeUpdate,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    OneToMany,
} from "typeorm";
import { BaseModel } from "./BaseModel";
import moment = require("moment/moment");
import { Country } from "./Country";
import { BranchPaymentGateway } from "./BranchPaymentGateway";
import { CustomerPaymentToken } from "./CustomerPaymentToken";

@Entity("payment_gateway")
export class PaymentGateway extends BaseModel {
    @PrimaryGeneratedColumn({ name: "payment_gateway_id" })
    public paymentGatewayId: number;

    @Column({ name: "country_id" })
    public countryId: number;

    @Column({ name: "name" })
    public name: string;

    @ManyToOne((type) => Country, (country) => country.paymentGateway)
    @JoinColumn({ name: "country_id" })
    public country: Country;

    @OneToMany((type) => BranchPaymentGateway, (branchPaymentGateway) => branchPaymentGateway.paymentGateway)
    public branchPaymentGateway: BranchPaymentGateway[];

    @OneToMany((type) => CustomerPaymentToken, (customerPaymentToken) => customerPaymentToken.paymentGateway)
    public customerPaymentToken: CustomerPaymentToken[];

    @BeforeInsert()
    public async createDetails(): Promise<void> {
        this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    }

    @BeforeUpdate()
    public async updateDetails(): Promise<void> {
        this.modifiedDate = moment().format("YYYY-MM-DD HH:mm:ss");
    }
}
