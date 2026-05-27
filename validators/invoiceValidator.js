import Joi from "joi";


const splitConfigItemSchema = Joi.object({
    subAccountCode:  Joi.string().required(),
    splitPercentage: Joi.number().min(0).precision(2).optional(),
    feePercentage:   Joi.number().min(0).precision(2).optional(),
    feeBearer:       Joi.boolean().optional()
});


/** POST /api/v1/invoice/create */
export const createInvoiceSchema = Joi.object({
    amount:           Joi.number().min(1).precision(2).required(),
    invoiceReference: Joi.string().required(),
    description:      Joi.string().min(3).required(),
    currencyCode:     Joi.string().optional().default('NGN'),
    contractCode:     Joi.string().required(),
    customerName:     Joi.string().min(3).required(),
    customerEmail:    Joi.string().email().required(),
    paymentMethods:   Joi.array().items(Joi.string()).optional().default([]),
    redirectUrl:      Joi.string().uri().optional(),
    expiryDate:       Joi.string().optional(),          // "2021-09-28 12:00:00"
    metaData:         Joi.object().optional(),
    incomeSplitConfig: Joi.array().items(splitConfigItemSchema).optional()
});


/** GET /api/v1/invoice/{invoiceReference}/details  &  DELETE /api/v1/invoice/{invoiceReference}/cancel */
export const invoiceReferenceSchema = Joi.object({
    invoiceReference: Joi.string().required()
});


/** GET /api/v1/invoice/all */
export const getAllInvoicesSchema = Joi.object({
    page: Joi.number().integer().min(0).default(0),
    size: Joi.number().integer().min(1).default(10)
});
