module.exports = {
    //Description: Create token in stripe for user.
    //Params:
    //Param 1: cardNumber: Card number.
    //Param 2: cvc: Card cvc.
    //Param 3: expMonth: Card expiry month.
    //Param 4: expYear: Card expiry year.
    //Returns: promise
    createToken: async function (cardNumber, cvc, expMonth, expYear, zipCode) {
        try{
            var token = await stripe.tokens.create({
                card: {
                    'number': cardNumber,
                    'exp_month': expMonth,
                    'exp_year': expYear,
                    'cvc': cvc,
                    'address_zip': zipCode
                }});
        }catch(error){
            ErrorService.log('stripe.tokens.create', error);
            throw error;
        }
        return token.id;
    },

    //Description: Retrieve payment intent.
    //Params:
    //Param 1: paymentIntent: Payment Intent
    //Returns: promise
    checkPaymentIntent: async function (paymentIntent) {
        try{
            var processedPaymentIntent = await stripe.paymentIntents.retrieve(paymentIntent.id);
            return processedPaymentIntent;
        }catch(error){
            ErrorService.log('stripe.paymentIntents.retrieve', error);
            throw error;
        }
    },

    //Description: Create customer in stripe for  user.
    //Params:
    //Param 1: stripeToken: Token generated from frontend
    //Param 2: user: User details
    //Returns: promise
    createCustomer: async function (email, companyName) {

        try{
            var customer = await stripe.customers.create({
                email: email,
                description: companyName
            });
            return customer.id;
        } catch(error) {
            ErrorService.log('stripe.customers.create', error);
            throw error;
        }
    },

    // eslint-disable-next-line no-unused-vars
    addPayment: async function (customerId, stripeToken) {
        try{
            var card = await stripe.customers.createSource(
                customerId,
            );
        }catch(error){
            ErrorService.log('stripe.customers.createSource', error);
            throw error;
        }
        return card;
    },

    //Description: Subscribe plan to user.
    //Params:
    //Param 1: stripePlanId: Id generated from frontend.
    //Param 2: stripeCustomerId: Stripe customer id.
    //Returns : promise
    subscribePlan: async function (stripePlanId, stripeCustomerId, coupon) {

        var items = [];
        items.push({
            plan: stripePlanId,
            quantity: 1
        });

        var subscriptionObj = {};

        if (coupon) {
            subscriptionObj = { customer: stripeCustomerId, items: items, coupon: coupon, trial_period_days: 14 };
        }

        else {
            subscriptionObj = { customer: stripeCustomerId, items: items, trial_period_days: 14 };
        }

        try{
            var subscription = await stripe.subscriptions.create(subscriptionObj);
        }catch(error){
            ErrorService.log('stripe.subscriptions.create', error);
            throw error;
        }
        return ({
            stripeSubscriptionId: subscription.id,
        });
    },

    //Description: Call this fuction when you add and remove a team member from Fyipe. This would add and remove seats based on how many users are in the project.
    //Params:
    //Param 1: stripePlanId: Id generated from frontend.
    //Param 2: stripeCustomerId: Stripe customer id.
    //Returns : promise
    changeSeats: async function (subscriptionId, seats) {
        try{
            var subscription = await stripe.subscriptions.retrieve(subscriptionId);
        }catch(error){
            ErrorService.log('stripe.subscriptions.retrieve', error);
            throw error;
        }
        var plan = null;
        var items = [];
        if (!subscription || !subscription.items || !subscription.items.data || !subscription.items.data.length > 0) {
            let error = new Error('Your subscription cannot be retrieved.');
            error.code = 400;
            ErrorService.log('PaymentService.changeSeats', error);
            throw error;
        } else {
            for (var i = 0; i < subscription.items.data.length; i++) {
                try{
                    plan = await Plans.getPlanById(subscription.items.data[i].plan.id);
                }catch(error){
                    ErrorService.log('Plans.getPlanById', error);
                    throw error;
                }
                if (plan) {
                    var item = {
                        plan: plan.planId,
                        id: subscription.items.data[i].id,
                        quantity: seats
                    };

                    items.push(item);
                }

            }
            try{
                subscription = await stripe.subscriptions.update(subscriptionId, { items: items });
            }catch(error){
                ErrorService.log('stripe.subscriptions.update', error);
                throw error;
            }
            return(subscription.id);
        }
    },

    removeSubscription: async function (stripeSubscriptionId) {

        var confirmations = [];
        try{
            confirmations[0] = await stripe.subscriptions.del(stripeSubscriptionId);
        }catch(error){
            ErrorService.log('stripe.subscriptions.del', error);
            throw error;
        }
        return confirmations;
    },


    changePlan: async function (subscriptionId, planId, seats ,trialLeft) {
        var subscriptionObj = {};
        try{
            var subscription = await stripe.subscriptions.retrieve(subscriptionId);
        }catch(error){
            ErrorService.log('stripe.subscriptions.retrieve', error);
            throw error;
        }
        try{
            await stripe.subscriptions.del(subscriptionId);
        }catch(error){
            ErrorService.log('stripe.subscriptions.del', error);
            throw error;
        }
        var items = [];
        items.push({
            plan: planId,
            quantity: seats
        });
        if (trialLeft && trialLeft < 14) {
            trialLeft = 14 - trialLeft;
            subscriptionObj = { customer: subscription.customer, items: items,trial_period_days: trialLeft };
        }
        else {
            subscriptionObj = { customer: subscription.customer, items: items,};
        }
        try{
            var subscriptions = await stripe.subscriptions.create(subscriptionObj);
        }catch(error){
            ErrorService.log('stripe.subscriptions.create', error);
            throw error;
        }
        return subscriptions.id;
    },
    chargeAlert: async function(userId, projectId, chargeAmount){
        try{
            var project = await ProjectService.findOneBy({
                _id: projectId
            });
            var { balance } = project;
            var { minimumBalance, rechargeToBalance } = project.alertOptions;
            if ( balance < minimumBalance ){
                var chargeForBalance = await StripeService.chargeCustomerForBalance(userId, rechargeToBalance, project.id);
                if (!(chargeForBalance.paid)){
                    //create notification
                    var message = 'Your balance has fallen below minimum balance set in Alerts option. Click here to authorize payment';
                    var meta = {
                        type: 'action',
                        client_secret: chargeForBalance.client_secret
                    };
                    await NotificationService.create(projectId, message, userId, null, meta);
                }
            }
            var balanceAfterAlertSent = balance - chargeAmount;
            var updatedProject = await ProjectModel.findByIdAndUpdate(
                projectId, {
                    $set: {
                        balance: balanceAfterAlertSent
                    }
                }, { new: true });
            return updatedProject;
        } catch (error) {
            ErrorService.log('PaymentService.chargeAlert', error);
            throw error;
        }
    },

    //Description: Call this fuction to bill for extra users added to an account.
    //Params:
    //Param 1: stripeCustomerId: Received during signup process.
    //Returns : promise
    chargeExtraUser: async function (stripeCustomerId, extraUserPlanId, extraUsersToAdd) {
        try{
            var subscription = await stripe.subscriptions.create({
                customer: stripeCustomerId,
                items: [
                    {
                        plan: extraUserPlanId,
                        quantity: extraUsersToAdd
                    },
                ]
            });
        }catch(error){
            ErrorService.log('stripe.subscriptions.create', error);
            throw error;
        }
        return subscription;
    },

    //Description: Call this fuction when a user is almost done with signing up.
    //             This verifies if the card is billable during sign-up
    //             by charging $1 on the user's account.
    //Params:
    //Param 1: stripeCustomerId: Received during signup process.
    //Returns : promise
    testCardCharge: async function(customerId) {
        var testChargeValue = 100;
        try{
            var charge = await stripe.charges.create(
                {
                    amount: testChargeValue,
                    currency: 'usd',
                    customer: customerId,
                    description: 'Verify if card is billable.'
                });
        }catch(error){
            ErrorService.log('stripe.charges.create', error);
            throw error;
        }
        if (!charge || !charge.paid) {
            let error = new Error('Card is not billable. Account will be disabled in 15 days.');
            error.code;
            ErrorService.log('paymentService.create', error);
            throw error;
        }
        return charge;
    }
};

var payment = require('../config/payment');
var stripe = require('stripe')(payment.paymentPrivateKey);
var Plans = require('../config/plans');
var ErrorService = require('./errorService');
var ProjectService = require('./projectService');
var ProjectModel = require('../models/project');
var StripeService = require('./stripeService');
var NotificationService = require('./notificationService');