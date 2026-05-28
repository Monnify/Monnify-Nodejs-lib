import Joi from "joi";


/** GET /api/v1/transactions/find-by-settlement-reference */
export const getBySettlementReferenceSchema = Joi.object({
    reference: Joi.string().required(),
    page:      Joi.number().integer().min(0).default(0),
    size:      Joi.number().integer().min(1).default(10)
});


/** GET /api/v1/settlement-detail */
export const getSettlementInfoSchema = Joi.object({
    transactionReference: Joi.string().required()
});
