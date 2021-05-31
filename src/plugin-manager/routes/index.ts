import * as express from 'express';
import {AuthRoute} from './AuthRouter';
import {HomeRoute} from './HomeRouter';
// import {PaypalRoute, PaypalNoAuthRoute} from './PaypalRouter';
// import {StripeRoute, StripeNoAuthRoute} from './StripeRouter';

// API keys and Passport configuration
import * as passportConfig from '../config/passport';
import * as globalMiddleware from '../middlewares/environment';

interface IROUTER {
    path: string;
    middleware: any[];
    handler: express.Router;
}

export const ROUTER: IROUTER[] = [
    {
        handler: AuthRoute,
        middleware: [globalMiddleware.index],
        path: '/',
    },
    {
        handler: HomeRoute,
        middleware: [globalMiddleware.index , passportConfig.isAuthenticated],
        path: '/home',
    },
    // {
    //     handler: PaypalRoute,
    //     middleware: [globalMiddleware.index , passportConfig.isAuthenticated],
    //     path: '/paypal',
    // },
    // {
    //     handler: PaypalNoAuthRoute,
    //     middleware: [globalMiddleware.index],
    //     path: '/paypal-payment',
    // },
    // {
    //     handler: StripeRoute,
    //     middleware: [globalMiddleware.index , passportConfig.isAuthenticated],
    //     path: '/stripe',
    // },
    // {
    //     handler: StripeNoAuthRoute,
    //     middleware: [globalMiddleware.index],
    //     path: '/stripe-payment',
    // },
];
