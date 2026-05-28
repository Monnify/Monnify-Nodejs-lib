import Joi from "joi";


export const singleTransferSchema = Joi.object({
    narration:                Joi.string().min(3).required(),
    destinationAccountNumber: Joi.string().regex(/^\d+$/).length(10).required(),
    destinationAccountName:   Joi.string().required(),
    amount:                   Joi.number().min(20).precision(2).required(),
    destinationBankCode:      Joi.string().regex(/^\d+$/).min(3).required(),
    reference:                Joi.string().required(),
    currencyCode:             Joi.string().optional().default('NGN'),
    sourceAccountNumber:      Joi.string().regex(/^\d+$/).length(10).required(),
    async:                    Joi.boolean().optional().default(false)   // fixed typo: was "aync"
});


export const bulkTransferSchema = Joi.object({
    title:               Joi.string().min(5).required(),
    batchReference:      Joi.string().required(),
    onValidationFailure: Joi.string().uppercase().optional().default('CONTINUE'),
    notificationInterval:Joi.number().integer().min(10).optional().default(20),
    narration:           Joi.string().min(3).required(),
    sourceAccountNumber: Joi.string().regex(/^\d+$/).length(10).required(),
    transactionList:     Joi.array().items(Joi.object({
        narration:                Joi.string().min(3).required(),
        destinationAccountNumber: Joi.string().regex(/^\d+$/).length(10).required(),
        destinationAccountName:   Joi.string().required(),
        amount:                   Joi.number().min(20).precision(2).required(),
        destinationBankCode:      Joi.string().regex(/^\d+$/).min(3).required(),
        reference:                Joi.string().required(),
        currencyCode:             Joi.string().optional().default('NGN')
    })).required()
});


export const authorizeTransferSchema = Joi.object({
    reference:         Joi.string().required(),
    authorizationCode: Joi.string().regex(/^\d+$/).required()
});


export const resendSingleTransferOTPSchema = Joi.object({
    reference: Joi.string().required()
});

/** @deprecated use resendSingleTransferOTPSchema — kept for back-compat */
export const resendTransferOTPSchema = resendSingleTransferOTPSchema;


export const resendBulkTransferOTPSchema = Joi.object({
    reference: Joi.string().required()
});


export const getStatusSchema = Joi.object({
    reference: Joi.string().required()
});


// Fixed: removed incorrect `reference` requirement — API only uses pageNo/pageSize
export const getAllTransferSchema = Joi.object({
    pageNo:   Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).default(10)
});


// Fixed: simplified to pagination only — search fields belong to searchDisbursementTransactionsSchema
export const getAllBulkTransferSchema = Joi.object({
    pageNo:   Joi.number().integer().min(0).default(0),
    pageSize: Joi.number().integer().min(1).default(10)
});


// For GET /api/v2/disbursements/batch/summary?reference=
export const getBulkBatchSummarySchema = Joi.object({
    reference: Joi.string().required()
});


// For GET /api/v2/disbursements/bulk/{batchReference}/transactions
export const getBulkTransferTransactionsSchema = Joi.object({
    batchReference: Joi.string().required(),
    pageNo:         Joi.number().integer().min(0).default(0),
    pageSize:       Joi.number().integer().min(1).default(10)
});


// For GET /api/v2/disbursements/search-transactions
export const searchDisbursementTransactionsSchema = Joi.object({
    sourceAccountNumber: Joi.string().regex(/^\d+$/).length(10).required(),
    pageSize:            Joi.number().integer().min(1).default(10),
    pageNo:              Joi.number().integer().min(0).default(0),
    startDate:           Joi.date().optional(),
    endDate:             Joi.date().optional(),
    amountFrom:          Joi.number().precision(2).min(0).optional(),
    amountTo:            Joi.number().precision(2).min(0).optional()
});
