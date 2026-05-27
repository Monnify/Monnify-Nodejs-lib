import Joi from "joi";


// ─── Schemas already present (unchanged) ──────────────────────────────────────

export const reservedAccountSchema = Joi.object({
    customerName:  Joi.string().min(3).required(),
    customerEmail: Joi.string().required(),
    accountName:   Joi.string().min(3).required(),
    accountReference: Joi.string().required(),
    currencyCode:  Joi.string().optional().default('NGN'),
    contractCode:  Joi.string().required(),
    bvn: Joi.string().trim().length(11).when('nin', {
        is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required()
    }),
    nin:                  Joi.string().trim().length(11).optional(),
    getAllAvailableBanks:  Joi.boolean().default(true),
    preferredBanks: Joi.array().items(Joi.string()).when('getAllAvailableBanks', {
        is: Joi.equal(false), then: Joi.required(), otherwise: Joi.optional()
    }),
    incomeSplitConfig: Joi.array().items(Joi.object({
        subAccountCode:  Joi.string().required(),
        splitPercentage: Joi.number().min(0).precision(2).optional(),
        feePercentage:   Joi.number().min(0).precision(2).optional(),
        feeBearer:       Joi.boolean().optional()
    })).optional(),
    metaData:               Joi.object().optional(),
    restrictPaymentSource:  Joi.boolean().optional().default(false),
    allowedPaymentSources:  Joi.object().when('restrictPaymentSource', {
        is: Joi.equal(true), then: Joi.required()
    })
});


export const addLinkAccountSchema = Joi.object({
    accountReference:    Joi.string().required(),
    getAllAvailableBanks: Joi.boolean().required().default(true),
    preferredBanks: Joi.array().items(Joi.string()).when('getAllAvailableBanks', {
        is: Joi.equal(false), then: Joi.required(), otherwise: Joi.optional()
    })
});


export const kycInfoSchema = Joi.object({
    accountReference: Joi.string().required(),
    bvn: Joi.string().trim().length(11).when('nin', {
        is: Joi.exist(), then: Joi.optional(), otherwise: Joi.required()
    }),
    nin: Joi.string().trim().length(11).optional()
});


export const reservedAccountDetailSchema = Joi.object({
    accountReference: Joi.string().required()
});


export const reservedAccountTransactionSchema = Joi.object({
    accountReference: Joi.string().required(),
    page: Joi.number().integer().min(0).default(0),
    size: Joi.number().integer().min(1).default(10)
});


const splitConfigItemSchema = Joi.object({
    subAccountCode:  Joi.string().required(),
    splitPercentage: Joi.number().min(0).precision(2).optional(),
    feePercentage:   Joi.number().min(0).precision(2).optional(),
    feeBearer:       Joi.boolean().optional()
});

export const updateReservedAccountSplitSchema = Joi.array().items(splitConfigItemSchema).required();


// ─── New schemas ───────────────────────────────────────────────────────────────

/** POST /api/v1/bank-transfer/reserved-accounts — invoice-type reserved account */
export const invoiceReservedAccountSchema = Joi.object({
    customerName:     Joi.string().min(3).required(),
    customerEmail:    Joi.string().email().required(),
    accountName:      Joi.string().min(3).required(),
    accountReference: Joi.string().required(),
    currencyCode:     Joi.string().optional().default('NGN'),
    contractCode:     Joi.string().required(),
    amount:           Joi.number().min(1).precision(2).required(),
    expiryDate:       Joi.string().optional(),
    incomeSplitConfig: Joi.array().items(splitConfigItemSchema).optional(),
    restrictPaymentSource: Joi.boolean().optional().default(false)
});


/** PUT .../update-customer-bvn/{reservedAccountReference} */
export const updateBvnSchema = Joi.object({
    reservedAccountReference: Joi.string().required(),
    bvn: Joi.string().regex(/^\d+$/).length(11).required()
});


/** PUT .../update-payment-source-filter/{accountReference} */
export const updatePaymentSourcesSchema = Joi.object({
    accountReference:      Joi.string().required(),
    restrictPaymentSource: Joi.boolean().required(),
    allowedPaymentSources: Joi.object({
        accountNames:   Joi.array().items(Joi.string()).optional(),
        accountNumbers: Joi.array().items(Joi.string()).optional(),
        bankCodes:      Joi.array().items(Joi.string()).optional()
    }).when('restrictPaymentSource', { is: true, then: Joi.required() })
});


/** PUT .../update-income-split-config/{accountReference} */
export const updateIncomeSplitConfigSchema = Joi.object({
    accountReference: Joi.string().required(),
    splitConfig:      Joi.array().items(splitConfigItemSchema).required()
});
