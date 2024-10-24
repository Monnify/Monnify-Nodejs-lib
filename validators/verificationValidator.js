import Joi from "joi";



export const validateAccountSchema = Joi.object({
    accountNumber:Joi.string().regex(/^\d+$/).length(10).required(),
    bankCode:Joi.string().regex(/^\d+$/).min(3).required()
});


export const bvnInformationSchema = Joi.object({
    bvn:Joi.string().regex(/^\d+$/).length(11).required(),
    dateOfBirth:Joi.string().required(),
    mobileNo:Joi.string().min(11).required(),
    name:Joi.string().optional()
});


export const bvnMatchSchema = Joi.object({
    bvn:Joi.string().regex(/^\d+$/).length(11).required(),
    accountNumber:Joi.string().regex(/^\d+$/).length(10).required(),
    bankCode:Joi.string().regex(/^\d+$/).min(3).required()
})