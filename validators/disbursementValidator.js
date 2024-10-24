import Joi from "joi";



export const singleTransferSchema = Joi.object({
    narration:Joi.string().min(3).required(),
    destinationAccountNumber:Joi.string().regex(/^\d+$/).length(10).required(),
    amount:Joi.number().min(20).precision(2).required(),
    destinationBankCode:Joi.string().regex(/^\d+$/).min(3).required(),
    reference:Joi.string().required(),
    currencyCode:Joi.string().optional().default("NGN"),
  	sourceAccountNumber:Joi.string().regex(/^\d+$/).length(10).required(),
    aync:Joi.boolean().optional().default(false)
});


export const bulkTransferSchema = Joi.object({
    title:Joi.string().min(5).required(),
    batchReference:Joi.string().required(),
    onValidationFailure:Joi.string().uppercase().optional().default('CONTINUE'),
    notificationInterval:Joi.number().integer().min(10).optional().default(20),
    narration:Joi.string().min(3).required(),
    sourceAccountNumber:Joi.string().regex(/^\d+$/).length(10).required(),
    transactionList:Joi.array().items(Joi.object({
        narration:Joi.string().min(3).required(),
        destinationAccountNumber:Joi.string().regex(/^\d+$/).length(10).required(),
        amount:Joi.number().min(20).precision(2).required(),
        destinationBankCode:Joi.string().regex(/^\d+$/).min(3).required(),
        reference:Joi.string().required(),
        currencyCode:Joi.string().optional().default("NGN"),
    })).required()
})

export const authorizeTransferSchema = Joi.object({
    reference:Joi.string().required(),
    authorizationCode:Joi.string().regex(/^\d+$/).required()
});


export const resendTransferOTPSchema = Joi.object({
    reference:Joi.string().required()
})


export const getStatusSchema = Joi.object({
    reference:Joi.string().required()
})

export const getAllTransferSchema = Joi.object({
    reference:Joi.string().required(),
    pageNo:Joi.number().integer().min(0).default(0),
    pageSize:Joi.number().integer().min(1).default(10)
})


export const getAllBulkTransferSchema = Joi.object({
    transactionReference:Joi.string().required(),
    pageNo:Joi.number().integer().min(0).default(0),
    pageSize:Joi.number().integer().min(1).default(10),
    sourceAccountNumber:Joi.string().regex(/^\d+$/).length(10).required(),
    startDate:Joi.date().timestamp('javascript').optional(),
    endDate:Joi.date().timestamp('javascript').optional(),
    amountFrom:Joi.number().precision(2).min(1).optional(),
    amountTo:Joi.number().precision(2).min(1).optional()
})
