import Joi from "joi";


const limitProfileBodySchema = {
    limitProfileName:      Joi.string().min(3).required(),
    singleTransactionValue: Joi.number().min(1).precision(2).required(),
    dailyTransactionVolume: Joi.number().integer().min(1).required(),
    dailyTransactionValue:  Joi.number().min(1).precision(2).required()
};


/** POST /api/v1/limit-profile/ */
export const createLimitProfileSchema = Joi.object({
    ...limitProfileBodySchema
});


/** PUT /api/v1/limit-profile/{limitProfileCode} */
export const updateLimitProfileSchema = Joi.object({
    limitProfileCode: Joi.string().required(),
    ...limitProfileBodySchema
});


const reservedAccountWithLimitBase = {
    customerName:     Joi.string().min(3).required(),
    customerEmail:    Joi.string().email().required(),
    accountName:      Joi.string().min(3).required(),
    accountReference: Joi.string().required(),
    currencyCode:     Joi.string().optional().default('NGN'),
    contractCode:     Joi.string().required(),
    limitProfileCode: Joi.string().required(),
    bvn: Joi.string().trim().length(11).when('nin', {
        is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required()
    }),
    nin:                 Joi.string().trim().length(11).optional(),
    getAllAvailableBanks: Joi.boolean().default(true),
    preferredBanks: Joi.array().items(Joi.string()).when('getAllAvailableBanks', {
        is: Joi.equal(false), then: Joi.required(), otherwise: Joi.optional()
    })
};


/** POST /api/v1/bank-transfer/reserved-accounts/limit */
export const reserveAccountWithLimitSchema = Joi.object({
    ...reservedAccountWithLimitBase
});


/** PUT /api/v1/bank-transfer/reserved-accounts/limit */
export const updateReserveAccountLimitSchema = Joi.object({
    accountReference: Joi.string().required(),
    limitProfileCode: Joi.string().required()
});
