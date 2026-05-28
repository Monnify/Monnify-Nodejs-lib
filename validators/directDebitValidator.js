import Joi from "joi";


/** POST /api/v1/direct-debit/mandate/create */
export const createMandateSchema = Joi.object({
    contractCode:             Joi.string().required(),
    mandateReference:         Joi.string().required(),
    mandateDescription:       Joi.string().required(),
    mandateStartDate:         Joi.string().required(),      // "YYYY-MM-DDTHH:MM:SS"
    mandateEndDate:           Joi.string().required(),
    customerName:             Joi.string().min(3).required(),
    customerEmailAddress:     Joi.string().email().required(),
    customerPhoneNumber:      Joi.string().required(),
    customerAddress:          Joi.string().required(),
    customerAccountNumber:    Joi.string().regex(/^\d+$/).required(),
    customerAccountBankCode:  Joi.string().required(),
    mandateAmount:            Joi.number().min(1).precision(2).optional(),
    debitAmount:              Joi.number().precision(2).allow(null).optional(),
    autoRenew:                Joi.boolean().optional(),
    customerCancellation:     Joi.boolean().optional(),
    redirectUrl:              Joi.string().uri().optional()
});


/** GET /api/v1/direct-debit/mandate/?mandateReferences= */
export const getMandateStatusSchema = Joi.object({
    mandateReferences: Joi.string().required()  // comma-separated mandate codes
});


/** POST /api/v1/direct-debit/mandate/debit */
export const debitMandateSchema = Joi.object({
    mandateCode:      Joi.string().required(),
    debitAmount:      Joi.number().min(1).precision(2).required(),
    paymentReference: Joi.string().required(),
    narration:        Joi.string().min(3).required(),
    customerEmail:    Joi.string().email().required(),
    incomeSplitConfig: Joi.array().items(Joi.object({
        subAccountCode:  Joi.string().optional(),
        feePercentage:   Joi.number().precision(2).optional(),
        splitAmount:     Joi.number().precision(2).optional(),
        splitPercentage: Joi.number().precision(2).optional(),
        feeBearer:       Joi.boolean().optional()
    })).optional()
});


/** GET /api/v1/direct-debit/mandate/debit-status?paymentReference= */
export const getDebitStatusSchema = Joi.object({
    paymentReference: Joi.string().required()
});


/** PATCH /api/v1/direct-debit/mandate/cancel-mandate/{mandateCode} */
export const cancelMandateSchema = Joi.object({
    mandateCode: Joi.string().required()
});
