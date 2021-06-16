import {Action} from 'routing-controllers';
import {Container} from 'typedi';
import {Connection} from 'typeorm';
import {Logger} from '../lib/logger';
import {AuthService} from './AuthService';

export function authorizationChecker(connection: Connection): (action: Action, roles: string[]) => Promise<boolean> | boolean {
    const log = new Logger(__filename);
    const authService = Container.get<AuthService>(AuthService);

    return async function innerAuthorizationChecker(action: Action, roles: any): Promise<boolean> {
        // here you can use request/response objects from action
        // also if decorator defines roles it needs to access the action
        // you can use them to provide granular access check
        // checker must return either boolean (true or false)
        // either promise that resolves a boolean value
        const userId = await authService.parseBasicAuthFromRequest(action.request);
        console.log(userId + 'userId');
        if (userId === undefined) {
            log.warn('No credentials given');
            return false;
        }

        console.log(roles);

        if (roles[0] === 'customer') {
            action.request.user = await authService.validateCustomer(userId);
            if (action.request.user === undefined) {
                log.warn('Invalid credentials given');
                return false;
            }

            log.info('Successfully checked credentials');
            return true;

        } else if (roles[0] === 'sales') {
            action.request.user = await authService.validateSales(userId);
            if (action.request.user === undefined) {
                log.warn('Invalid credentials given');
                return false;
            }

            log.info('Successfully checked credentials');
            return true;

        } else if (roles[0] === 'fitness') {
            action.request.user = await authService.validateFitness(userId);
            if (action.request.user === undefined) {
                log.warn('Invalid credentials given');
                return false;
            }

            log.info('Successfully checked credentials');
            return true;

        } else if (roles[0] === 'customer-service') {
            action.request.user = await authService.validateCustomerService(userId);
            if (action.request.user === undefined) {
                log.warn('Invalid credentials given');
                return false;
            }

            log.info('Successfully checked credentials');
            return true;
        } else {

            action.request.user = await authService.validateUser(userId);
            if (action.request.user === undefined) {
                log.warn('Invalid credentials given');
                return false;
            }

            log.info('Successfully checked credentials');
            return true;

        }
    };
}
