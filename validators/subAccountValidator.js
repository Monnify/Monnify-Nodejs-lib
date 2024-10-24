import Joi from "joi";




const subAccountObjectSchema = Joi.object({
    currencyCode:Joi.string().optional().default("NGN"),
    accountNumber:Joi.string().regex(/^\d+$/).length(10).required(),
    bankCode:Joi.string().regex(/^\d+$/).min(3).required(),
    defaultSplitPercentage:Joi.number().min(0).precision(2).required(),
    email:Joi.string().required()
})


export const subAccountCreationSchema = Joi.array().items(subAccountObjectSchema).required()


export const updateSubAcountSchema = Joi.object({
    currencyCode:Joi.string().optional().default("NGN"),
    accountNumber:Joi.string().regex(/^\d+$/).length(10).required(),
    bankCode:Joi.string().regex(/^\d+$/).min(3).required(),
    defaultSplitPercentage:Joi.number().min(0).precision(2).required(),
    email:Joi.string().required(),
    subAccountCode:Joi.string().required()
})

export const deleteSubAccountSchema = Joi.object({
    subAccountCode:Joi.string().required()
})