import { Column, PrimaryGeneratedColumn, Entity, OneToMany } from "typeorm";
import { Branch } from "./Branch";
import { City } from "./City";
import { Customer } from "./Customer";
import { PaymentGateway } from "./PaymentGateway";

@Entity("country")
export class Country {
  @PrimaryGeneratedColumn({ name: "country_id" })
  public countryId: number;

  @Column({ name: "name" })
  public name: string;

  @Column({ name: "iso_code_2" })
  public isoCode2: string;

  @Column({ name: "iso_code_3" })
  public isoCode3: string;

  @Column({ name: "phone_code" })
  public phoneCode: number;

  @Column({ name: "postcode_required" })
  public postcodeRequired: number;

  @Column({ name: "is_eu" })
  public isEU: number;

  @Column({ name: "is_active" })
  public isActive: number;

  @OneToMany((type) => City, (city) => city.country)
  public city: City[];

  @OneToMany((type) => Customer, (customer) => customer.country)
  public customer: Customer[];

  @OneToMany((type) => Branch, (branch) => branch.country)
  public branch: Branch[];

  @OneToMany((type) => PaymentGateway, (paymentGateway) => paymentGateway.country)
  public paymentGateway: PaymentGateway[];
}
