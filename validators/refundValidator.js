import Joi from "joi";



export const refundSchema = Joi.object({
    refundReason:Joi.string().max(64).required(),
    destinationAccountNumber:Joi.string().regex(/^\d+$/).length(10).optional(),
    refundAmount:Joi.number().min(20).precision(2).required(),
    destinationBankCode:Joi.string().regex(/^\d+$/).min(3).optional(),
    refundReference:Joi.string().required(),
    currencyCode:Joi.string().optional().default("NGN"),
  	transactionReference:Joi.string().required(),
    customerNote:Joi.string().max(16).required()
});


export const getAllRefundSchema = Joi.object({
    transactionReference:Joi.string().optional(),
    page:Joi.number().integer().min(0).default(0),
    size:Joi.number().integer().min(1).default(10),
    refundStatus:Joi.string().optional(),
    from:Joi.date().timestamp('javascript').optional(),
    to:Joi.date().timestamp('javascript').optional()
});


export const getRefundStatusSchema = Joi.object({
    refundReference:Joi.string().required()
})