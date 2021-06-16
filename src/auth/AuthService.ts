import * as express from 'express';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { OrmRepository } from 'typeorm-typedi-extensions';
import { User } from '../api/models/User';
import { UserRepository } from '../api/repositories/UserRepository';
import { CustomerRepository } from '../api/repositories/CustomerRepository';
import { CustomerServiceRepository } from '../api/repositories/CustomerServiceRepository';
import { FitnessRepository } from '../api/repositories/FitnessRepository';
import { SalesRepository } from '../api/repositories/SalesRepository';
import { Logger, LoggerInterface } from '../decorators/Logger';

@Service()
export class AuthService {

    constructor(
        @Logger(__filename) private log: LoggerInterface,
        @OrmRepository() private userRepository: UserRepository,
        @OrmRepository() private customerRepository: CustomerRepository,
        @OrmRepository() private salesRepository: SalesRepository,
        @OrmRepository() private customerServiceRepository: CustomerServiceRepository,
        @OrmRepository() private fitnessRepository: FitnessRepository
    ) { }

    public async parseBasicAuthFromRequest(req: express.Request): Promise<number> {
        console.log('hi');
        const authorization = req.header('authorization');

        console.log(authorization);
        console.log(authorization.split(' ')[0]);

        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            console.log('Credentials provided by the client');
            this.log.info('Credentials provided by the client');
            if (!authorization) {
                return undefined;
            }
            console.log(authorization.split(' ')[1]);

            const UserId = await this.decryptToken(authorization.split(' ')[1]);

            return UserId;
            console.log('I m here');
        }

        this.log.info('No credentials provided by the client');
        return undefined;
    }

    public async decryptToken(encryptString: string): Promise<number> {
        return new Promise<number>((subresolve, subreject) => {
            jwt.verify(encryptString, '123##$$)(***&', {ignoreExpiration: true }, (err, decoded) => {
                if (err) {
                    console.log(err);
                    return subresolve(undefined);
                }
                console.log(decoded);
                return subresolve(decoded.id);
            });
        });
    }

    public async validateUser(userId: number): Promise<User> {
        console.log('userId' + userId);
        const user = await this.userRepository.findOne({
            where: {
                userId,
            },
        });
        console.log(user);

        if (user) {
            return user;
        }

        return undefined;
    }

    public async validateCustomer(userId: number): Promise<any> {
        console.log('customerId' + userId);
        const customer = await this.customerRepository.findOne({
            where: {
                id : userId,
            },
        });
        console.log(customer);

        if (customer) {
            return customer;
        }

        return undefined;
    }

    public async validateCustomerService(userId: number): Promise<any> {
        console.log('customerServiceId' + userId);
        const customerService = await this.customerServiceRepository.findOne({
            where: {
                customerServiceId : userId,
            },
        });
        console.log(customerService);

        if (customerService) {
            return customerService;
        }

        return undefined;
    }

    public async validateSales(userId: number): Promise<any> {
        console.log('salesId' + userId);
        const sales = await this.salesRepository.findOne({
            where: {
                salesId : userId,
            },
        });
        console.log(sales);

        if (sales) {
            return sales;
        }

        return undefined;
    }

    public async validateFitness(userId: number): Promise<any> {
        console.log('fitnessId' + userId);
        const fitness = await this.fitnessRepository.findOne({
            where: {
                fitnessId : userId,
            },
        });
        console.log(fitness);

        if (fitness) {
            return fitness;
        }

        return undefined;
    }
}
