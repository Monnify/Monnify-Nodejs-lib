import Joi from "joi";




export const reservedAccountSchema = Joi.object({
    customerName:Joi.string().min(3).required(),
    customerEmail:Joi.string().required(),
    accountName:Joi.string().alphanum().min(3).required(),
    accountReference:Joi.string().required(),
    currencyCode:Joi.string().optional().default("NGN"),
  	contractCode:Joi.string().required(),
    bvn:Joi.string().trim().length(11).when('nin',{is:Joi.exist(),then:Joi.optional(),otherwise:Joi.required()}),
    nin:Joi.string().trim().length(11).optional(),
    getAllAvailableBanks:Joi.boolean().default(true),
    preferredBanks:Joi.array().items(Joi.string()).when('getAllAvailableBanks',{
        is:Joi.equal(false),
        then:Joi.required(),
        otherwise:Joi.optional()
    }),
    incomeSplitConfig:Joi.array().items(Joi.object({
      subAccountCode:Joi.required(),
      splitPercentage:Joi.number().min(0).precision(2).optional(),
      feePercentage:Joi.number().min(0).precision(2).optional(),
      feeBearer:Joi.boolean().optional()
    })).optional(),
    metaData:Joi.object().optional(),
    restrictPaymentSource:Joi.boolean().optional().default(false),
    allowedPaymentSources:Joi.object().when('restrictPaymentSource',{is:Joi.equal(true),then:Joi.required()})
});


export const addLinkAccountSchema = Joi.object({
    accountReference:Joi.string().required(),
    getAllAvailableBanks:Joi.boolean().required().default(true),
    preferredBanks:Joi.array().items(Joi.string()).when('getAllAvailableBanks',{
        is:Joi.equal(false),
        then:Joi.required(),
        otherwise:Joi.optional()
    }),
});


export const kycInfoSchema = Joi.object({
    accountReference:Joi.string().required(),
    bvn:Joi.string().trim().length(11).when('nin',{is:Joi.exist(),then:Joi.optional(),otherwise:Joi.required()}),
    nin:Joi.string().trim().length(11).optional()
});


export const reservedAccountDetailSchema = Joi.object({
    accountReference:Joi.string().required()
});


export const reservedAccountTransactionSchema = Joi.object({
    accountReference:Joi.string().required(),
    page:Joi.number().integer().min(0).default(0),
    size:Joi.number().integer().min(1).default(10)
});


const arrayOfSplitSchema = Joi.object({
    subAccountCode:Joi.required(),
    splitPercentage:Joi.number().min(0).precision(2).optional(),
    feePercentage:Joi.number().min(0).precision(2).optional(),
    feeBearer:Joi.boolean().optional() 
})

export const updateReservedAccountSplitSchema = Joi.array().items(arrayOfSplitSchema).required();
