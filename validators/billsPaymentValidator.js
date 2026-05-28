import Joi from "joi";


/** GET /api/v1/vas/bills-payment/biller-categories */
export const getBillerCategoriesSchema = Joi.object({
    size: Joi.number().integer().min(1).default(10),
    page: Joi.number().integer().min(0).default(0)
});


/** GET /api/v1/vas/bills-payment/billers */
export const listBillersSchema = Joi.object({
    size:         Joi.number().integer().min(1).default(10),
    page:         Joi.number().integer().min(0).default(0),
    categoryCode: Joi.string().optional()    // maps to API query param category_code
});


/** GET /api/v1/vas/bills-payment/biller-products */
export const getBillerProductsSchema = Joi.object({
    page:        Joi.number().integer().min(0).default(0),
    size:        Joi.number().integer().min(1).default(10),
    billerCode:  Joi.string().required()    // maps to API query param biller_code
});


/** POST /api/v1/vas/bills-payment/validate-customer */
export const validateCustomerSchema = Joi.object({
    productCode: Joi.string().required(),
    customerId:  Joi.string().required()
});


/**
 * POST /api/v1/vas/bills-payment/vend
 * "Process a bill" — purchase a biller product for a customer.
 * If validate-customer returned requireValidationRef=true, supply validationReference.
 */
export const vendBillSchema = Joi.object({
    productCode:         Joi.string().required(),
    customerId:          Joi.string().required(),
    amount:              Joi.number().min(1).precision(2).required(),
    reference:           Joi.string().required(),   // merchant unique reference
    validationReference: Joi.string().optional(),   // from validate-customer if required
    emailAddress:        Joi.string().email().optional(),
    phoneNumber:         Joi.string().optional()
});


/** GET /api/v1/vas/bills-payment/requery */
export const requeryBillPaymentSchema = Joi.object({
    reference: Joi.string().required()
});
