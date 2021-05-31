// import 'reflect-metadata';
// import * as express from 'express';
// import {getManager} from 'typeorm';
// import {Plugins} from '../models/Plugin';
// import {Order} from '../../api/models/Order';
// import {OrderProduct} from '../../api/models/OrderProduct';
// import {EmailTemplate} from '../../api/models/EmailTemplate';
// import {OrderOption} from '../../api/models/OrderOption';
// import {Product} from '../../api/models/ProductModel';
// import {ProductImage} from '../../api/models/ProductImage';
// import {PaypalOrder} from '../models/PaypalOrder';
// import {Settings} from '../../api/models/Setting';
// import {Currency} from '../../api/models/Currency';
// import {User} from '../../api/models/User';
// import {Payment as Payments} from '../../api/models/Payment';
// import {PaymentItems} from '../../api/models/PaymentItems';
// import {VendorPayment} from '../../api/models/VendorPayment';
// import {VendorProducts} from '../../api/models/VendorProducts';
// import {Vendor} from '../../api/models/Vendor';
// import {VendorOrders} from '../../api/models/VendorOrders';
// import {VendorGlobalSetting} from '../../api/models/VendorGlobalSettings';
// import {PaypalOrderTransaction} from '../models/PaypalOrderTransaction';
// import {env} from '../../env';
// import {MAILService} from '../../auth/mail.services';
// import * as paypal from 'paypal-rest-sdk';
// import {Payment, Item, ConfigureOptions} from 'paypal-rest-sdk';
// import moment = require('moment');

// export class PaypalController {

//     public static async payPalSuccess(config: ConfigureOptions, payerId: string, paymentId: string): Promise<any> {
//         return new Promise((resolve, reject) => {
//             paypal.configure(config);
//             const execute_payment_json = {
//                 payer_id: payerId,
//             };
//             paypal.payment.execute(paymentId, execute_payment_json, (error, payment) => {
//                 if (error) {
//                     console.log(error.response);
//                     return reject(error);
//                 } else {
//                     console.log('Get Payment Response');
//                     console.log(JSON.stringify(payment));
//                     return resolve(payment);
//                 }
//             });
//         });
//     }

//     constructor() {
//         // ---
//     }

//     public async index(req: express.Request | any, res: express.Response): Promise<any> {
//         const pluginRepository = getManager().getRepository(Plugins);
//         const pluginDetail = await pluginRepository.findOne({
//             where : {
//                 pluginName: 'paypal',
//             },
//         });
//         if (!pluginDetail) {
//             req.flash('errors', ['You not install this plugin. or problem in installation']);
//             return res.redirect('home');
//         }
//         const paypalAdditionalInfo = pluginDetail.pluginAdditionalInfo ? JSON.parse(pluginDetail.pluginAdditionalInfo) : {};
//         res.render('pages/paypal/form', {
//             title: 'Paypal',
//             clientId: paypalAdditionalInfo.clientId ? paypalAdditionalInfo.clientId : '',
//             clientSecret: paypalAdditionalInfo.clientSecret ? paypalAdditionalInfo.clientSecret : '',
//             isTest: paypalAdditionalInfo.isTest,
//         });
//     }

//     public async updateSettings(req: express.Request | any, res: express.Response): Promise<any> {
//         req.assert('clientId', 'Client Id cannot be blank').notEmpty();
//         req.assert('clientSecret', 'Client Secret cannot be blank').notEmpty();

//         const errors = req.validationErrors();

//         console.log(errors);

//         if (errors) {
//             req.flash('errors', errors);
//             return res.redirect('paypal');
//         }

//         const pluginRepository = getManager().getRepository(Plugins);
//         const pluginDetail = await pluginRepository.findOne({
//             where : {
//                 pluginName: 'paypal',
//             },
//         });
//         if (!pluginDetail) {
//             req.flash('errors', ['You not install this plugin. or problem in installation']);
//             return res.redirect('home');
//         }
//         const paypalAdditionalInfo = pluginDetail.pluginAdditionalInfo ? JSON.parse(pluginDetail.pluginAdditionalInfo) : {};
//         paypalAdditionalInfo.clientId = req.body.clientId;
//         paypalAdditionalInfo.clientSecret = req.body.clientSecret;
//         paypalAdditionalInfo.isTest = req.body.isTest;
//         pluginDetail.pluginAdditionalInfo = JSON.stringify(paypalAdditionalInfo);
//         const saveResponse = await pluginRepository.save(pluginDetail);
//         if (saveResponse) {
//             req.flash('success', ['Paypal settings updated successfully']);
//             return res.redirect('home');
//         }
//         req.flash('errors', ['Unable to update the paypal settings']);
//         return res.redirect('home');
//     }

//     public async process(req: express.Request | any, res: express.Response): Promise<any> {
//         const orderPrefixId = req.params.orderPrefixId;
//         const orderRepository = getManager().getRepository(Order);
//         const order = await orderRepository.findOne({where: {orderPrefixId}, select: ['orderId']});
//         const orderId = order.orderId;
//         const orderDetail = await orderRepository.findOne(orderId);
//         if (!orderDetail) {
//             req.flash('errors', ['Invalid Order Id']);
//             return res.redirect('error');
//         }
//        const pluginRepository = getManager().getRepository(Plugins);
//         const pluginDetail = await pluginRepository.findOne({
//             where : {
//                 pluginName: 'paypal',
//             },
//         });
//         if (!pluginDetail) {
//             req.flash('errors', ['You not install this plugin. or problem in installation']);
//             return res.redirect('home');
//         }
//         res.render('pages/paypal/process', {
//             title: 'Paypal',
//             orderId,
//             layout: 'pages/layouts/auth',
//         });
//     }

//     public async proceed(req: express.Request | any, res: express.Response): Promise<any> {
//         const orderId = req.params.orderId;
//         console.log(orderId);
//         const orderRepository = getManager().getRepository(Order);
//         const paypalOrderRepository = getManager().getRepository(PaypalOrder);
//         const orderProductRepository = getManager().getRepository(OrderProduct);
//         const orderOptionRepository = getManager().getRepository(OrderOption);
//         const productRepository = getManager().getRepository(Product);
//         const orderDetail = await orderRepository.findOne(orderId);
//         if (!orderDetail) {
//             req.flash('errors', ['Invalid Order Id']);
//             return res.redirect('error');
//         }

//         const pluginRepository = getManager().getRepository(Plugins);
//         const pluginDetail = await pluginRepository.findOne({
//             where : {
//                 pluginName: 'paypal',
//             },
//         });
//         if (!pluginDetail) {
//             req.flash('errors', ['You not install this plugin. or problem in installation']);
//             return res.redirect('home');
//         }
//         const paypalAdditionalInfo = pluginDetail.pluginAdditionalInfo ? JSON.parse(pluginDetail.pluginAdditionalInfo) : {};
//         paypal.configure({
//             mode: paypalAdditionalInfo.isTest ? 'sandbox' : 'live', // sandbox or live
//             client_id: paypalAdditionalInfo.clientId,
//             client_secret: paypalAdditionalInfo.clientSecret,
//         });
//         const product = await orderProductRepository.find({where: {orderId: orderDetail.orderId}, select: ['orderProductId', 'orderId', 'productId', 'name', 'model', 'quantity', 'total', 'productPrice']});

//         const productVal = product.map(async (value: any) => {
//             const productDetail = await productRepository.findOne({
//                 where: {productId: value.productId},
//                 select: ['name', 'quantity', 'minimumQuantity', 'image',
//                     'imagePath', 'shipping', 'price', 'dateAvailable', 'amount', 'rating', 'discount', 'isActive']});
//                 const orderOption = await orderOptionRepository.find({where: {orderProductId: value.orderProductId},
//                 select: ['name', 'value', 'type', 'orderOptionId', 'orderProductId']});
//             const tempVal: any = value;
//             tempVal.productDetail = productDetail;
//             tempVal.orderOptions = orderOption;
//             return tempVal;
//         });
//         const results = await Promise.all(productVal);
//         const items: Item[] = [];
//         results.forEach((element) => {
//             const price = Math.round(element.productPrice * 100) / 100;
//             items.push({
//                 name: element.name,
//                 price: price.toString(),
//                 currency: orderDetail.currencyCode,
//                 quantity: element.quantity,
//             });
//         });
//         const orderAmount = Math.round(orderDetail.total * 100) / 100;
//         const create_payment_json: Payment = {
//             intent: 'sale',
//             payer: {
//                 payment_method: 'paypal',
//             },
//             redirect_urls: {
//                 return_url: env.baseUrl + paypalAdditionalInfo.successRoute,
//                 cancel_url: env.baseUrl  + paypalAdditionalInfo.cancelRoute,
//             },
//             transactions: [{
//                 item_list: {
//                     items,
//                 },
//                 amount: {
//                     currency: orderDetail.currencyCode,
//                     total: orderAmount.toString(),
//                 },
//                 description: 'Product you ordered',
//             }],
//         };

//         console.log(JSON.stringify(create_payment_json));

//         paypal.payment.create(create_payment_json, (error, payment) => {
//             if (error) {
//                 throw error;
//             } else {
//                 const paypalParams = new PaypalOrder();
//                 paypalParams.orderId = orderDetail.orderId;
//                 paypalParams.paypalRefId = payment.id;
//                 paypalParams.total = orderAmount.toString();
//                 paypalParams.status = 0;
//                 paypalOrderRepository.save(paypalParams).then((val) => {
//                     // ---
//                     console.log(val);
//                     for (const item of payment.links) {
//                         // Redirect user to this endpoint for redirect url
//                         if (item.rel === 'approval_url') {
//                             res.redirect(item.href);
//                         }
//                     }
//                     console.log(payment);
//                 }).catch( (err) => {
//                     console.error(err);
//                 });
//             }
//         });
//     }

//     public async success(req: express.Request | any, res: express.Response): Promise<any> {
//         const pluginRepository = getManager().getRepository(Plugins);
//         const EmailTemplateRepository = getManager().getRepository(EmailTemplate);
//         const orderProductRepository = getManager().getRepository(OrderProduct);
//         const orderOptionRepository = getManager().getRepository(OrderOption);
//         const productImageRepository = getManager().getRepository(ProductImage);
//         const productRepository = getManager().getRepository(Product);
//         const settingRepository = getManager().getRepository(Settings);
//         const currencyRepository = getManager().getRepository(Currency);
//         const userRepository = getManager().getRepository(User);
//         const paymentRepository = getManager().getRepository(Payments);
//         const paymentItemsRepository = getManager().getRepository(PaymentItems);
//         const vendorPaymentRepository = getManager().getRepository(VendorPayment);
//         const VendorProductsRepository = getManager().getRepository(VendorProducts);
//         const VendorRepository = getManager().getRepository(Vendor);
//         const VendorOrdersRepository = getManager().getRepository(VendorOrders);
//         const VendorGlobalSettingRepository = getManager().getRepository(VendorGlobalSetting);
//         const pluginDetail = await pluginRepository.findOne({
//             where : {
//                 pluginName: 'paypal',
//             },
//         });
//         if (!pluginDetail) {
//             req.flash('errors', ['You not install this plugin. or problem in installation']);
//             return res.redirect('home');
//         }
//         const paypalAdditionalInfo = pluginDetail.pluginAdditionalInfo ? JSON.parse(pluginDetail.pluginAdditionalInfo) : {};
//         const config: ConfigureOptions = {
//             mode: paypalAdditionalInfo.isTest ? 'sandbox' : 'live', // sandbox or live
//             client_id: paypalAdditionalInfo.clientId,
//             client_secret: paypalAdditionalInfo.clientSecret,
//         };

//         const paymentDetails = await PaypalController.payPalSuccess(config, req.query.PayerID, req.query.paymentId);

//         const paypalOrderRepository = getManager().getRepository(PaypalOrder);
//         const paypalOrderTransactionRepository = getManager().getRepository(PaypalOrderTransaction);

//         console.log(paymentDetails);

//         const paypalDetail = await paypalOrderRepository.findOne({
//             where : {
//                 paypalRefId : paymentDetails.id,
//             },
//         });
//         if (!paypalDetail) {
//             req.flash('errors', ['Invalid Payment Details']);
//             return res.redirect('error');
//         }
//         const orderRepository = getManager().getRepository(Order);
//         const orderData: any = await orderRepository.findOne(paypalDetail.orderId);
//         if (!orderData) {
//             req.flash('errors', ['Invalid Order Id']);
//             return res.redirect('error');
//         }
//         const setting = await settingRepository.findOne();
//         const currencySymbol = await currencyRepository.findOne(setting.storeCurrencyId);
//         orderData.currencyRight = currencySymbol.symbolRight;
//         orderData.currencyLeft = currencySymbol.symbolLeft;

//         const orderStatus = await orderRepository.findOne({where: {orderId: paypalDetail.orderId, paymentFlag: 1}});
//         if (orderStatus) {
//             req.flash('errors', ['Already Paid for this Order']);
//             return res.redirect('error');
//         }

//         const paidDetails = paymentDetails.transactions[0].related_resources[0];
//         console.log(paidDetails.sale.amount.total + 'paidDetails');
//         console.log(paypalDetail.total + 'total');
//         const intvalue = Math.round(paidDetails.sale.amount.total );
//         if (paidDetails.sale.state === 'completed' && intvalue === +paypalDetail.total) {
//             const transactionsParams = new PaypalOrderTransaction();
//             transactionsParams.paymentType = paidDetails.sale.payment_mode;
//             transactionsParams.paypalOrderId = paypalDetail.id;
//             transactionsParams.paymentData = JSON.stringify(paymentDetails);
//             transactionsParams.paymentStatus = 1;
//             await paypalOrderTransactionRepository.save(transactionsParams);
//             paypalDetail.status = 1;
//             await paypalOrderRepository.save(paypalDetail);
//             orderData.paymentFlag = 1;
//             orderData.paymentStatus = 1;
//             orderData.paymentProcess = 1;
//             orderData.paymentType = 'paypal';
//             orderData.paymentDetails = paymentDetails.id;
//             await orderRepository.save(orderData);
//             const paymentParams = new Payments();
//             paymentParams.orderId = paypalDetail.orderId;
//             const date = new Date();
//             paymentParams.paidDate = moment(date).format('YYYY-MM-DD HH:mm:ss');
//             paymentParams.paymentNumber = paymentDetails.id;
//             paymentParams.paymentAmount = orderData.total;
//             paymentParams.paymentInformation = JSON.stringify(paymentDetails);
//             const payments = await paymentRepository.save(paymentParams);
//             const productDetailData = [];
//             let i;
//             const orderProduct = await orderProductRepository.find({where: {orderId: orderData.orderId}, select: ['orderProductId', 'orderId', 'productId', 'name', 'model', 'quantity', 'total', 'productPrice']});
//             for (i = 0; i < orderProduct.length; i++) {
//                 const paymentItems = new PaymentItems();
//                 paymentItems.paymentId = payments.paymentId;
//                 paymentItems.orderProductId = orderProduct[i].orderProductId;
//                 paymentItems.totalAmount = orderProduct[i].total;
//                 paymentItems.productName = orderProduct[i].name;
//                 paymentItems.productQuantity = orderProduct[i].quantity;
//                 paymentItems.productPrice = orderProduct[i].productPrice;
//                 const payItem = await paymentItemsRepository.save(paymentItems);
//                 const vendorProduct = await VendorProductsRepository.findOne({where: {productId: orderProduct[i].productId}});
//                 if (vendorProduct) {
//                     const vendor = await VendorRepository.findOne({where: {vendorId: vendorProduct.vendorId}});
//                     const vendorOrders = await VendorOrdersRepository.findOne({where: {vendorId: vendorProduct.vendorId, orderProductId: orderProduct[i].orderProductId}});
//                     const vendorPayments = new VendorPayment();
//                     vendorPayments.vendorId = vendorProduct.vendorId;
//                     vendorPayments.paymentItemId = payItem.paymentItemId;
//                     vendorPayments.vendorOrderId = vendorOrders.vendorOrderId;
//                     vendorPayments.amount = orderProduct[i].total;
//                     if (vendorProduct.vendorProductCommission > 0) {
//                         vendorPayments.commissionAmount = orderProduct[i].total * (vendorProduct.vendorProductCommission / 100);
//                         // vendorPayments.commissionAmount = vendorProduct.vendorProductCommission;
//                     } else if (vendor.commission  > 0) {
//                         vendorPayments.commissionAmount = orderProduct[i].total * (vendor.commission / 100);
//                         // vendorPayments.commissionAmount = vendor.commission;
//                     } else  {
//                         const defaultCommission = await VendorGlobalSettingRepository.findOne();
//                         const defCommission = defaultCommission.defaultCommission;
//                         vendorPayments.commissionAmount = orderProduct[i].total * (defCommission / 100);
//                         // vendorPayments.commissionAmount = defCommission;
//                     }
//                     await vendorPaymentRepository.save(vendorPayments);
//                 }
//                 const productInformation = await orderProductRepository.findOne({where: {orderProductId: orderProduct[i].orderProductId}, select: ['orderProductId', 'orderId', 'productId', 'name', 'model', 'quantity', 'total', 'productPrice']});
//                 const productImageData: any = await productRepository.findOne(productInformation.productId);
//                 const productImageDetail = await productImageRepository.findOne({where: {productId: productInformation.productId}});
//                 productImageData.productInformationData = productInformation;
//                 productImageData.productImage = productImageDetail;
//                 const productOptionValue = await orderOptionRepository.find({
//                     where: {
//                         orderProductId: productInformation.orderProductId,
//                         orderId: orderData.orderId,
//                     }, select: ['name', 'value'],
//                 });
//                 productImageData.productOption = productOptionValue;
//                 productDetailData.push(productImageData);
//             }
//             const emailContent = await EmailTemplateRepository.findOne(5);
//             const adminEmailContent = await EmailTemplateRepository.findOne(6);
//             const nowDate = new Date();
//             const today = ('0' + nowDate.getDate()).slice(-2) + '.' + ('0' + (nowDate.getMonth() + 1)).slice(-2) + '.' + nowDate.getFullYear();
//             const customerFirstName = orderData.shippingFirstname;
//             const customerLastName = orderData.shippingLastname;
//             const customerName = customerFirstName + ' ' + customerLastName;
//             const adminMessage = adminEmailContent.content.replace('{name}', customerName).replace('{orderId}', orderData.orderId);
//             const customerMessage = emailContent.content.replace('{name}', customerName);
//             const adminId: any = [];
//             const adminUser = await userRepository.find({select: ['username'], where: {userGroupId : 1}});
//             for (const user of adminUser) {
//                 const val = user.username;
//                 adminId.push(val);
//             }
//             const adminRedirectUrl = env.adminRedirectUrl;
//             MAILService.adminOrderMail(adminMessage, orderData, adminEmailContent.subject, productDetailData, today, adminId, adminRedirectUrl );
//             const storeRedirectUrl = env.storeRedirectUrl;
//             MAILService.customerOrderMail(customerMessage, orderData, emailContent.subject, productDetailData, today, storeRedirectUrl);
//         } else {
//             const transactionsParams = new PaypalOrderTransaction();
//             transactionsParams.paymentType = 'FAILURE';
//             transactionsParams.paypalOrderId = paypalDetail.id;
//             transactionsParams.paymentData = JSON.stringify(paymentDetails);
//             transactionsParams.paymentStatus = 2;
//             await paypalOrderTransactionRepository.save(transactionsParams);
//             paypalDetail.status = 2;
//             await paypalOrderRepository.save(paypalDetail);
//             orderData.paymentFlag = 2;
//             await orderRepository.save(orderData);
//         }

//         res.render('pages/paypal/success', {
//             title: 'Paypal',
//             storeUrl: env.storeUrl,
//             layout: 'pages/layouts/auth',
//         });

//     }

//     public async cancel(req: express.Request | any, res: express.Response): Promise<any> {
//         res.render('pages/paypal/cancel', {
//             title: 'Paypal',
//             layout: 'pages/layouts/auth',
//         });
//     }

// }
