import Joi from "joi";




export const initTransactionSchema = Joi.object({
    customerName:Joi.string().min(3).required(),
    customerEmail:Joi.string().required(),
    amount:Joi.number().min(20).precision(2).required(),
    paymentDescription:Joi.string().min(3).required(),
    paymentReference:Joi.string().required(),
    currencyCode:Joi.string().optional().default("NGN"),
  	contractCode:Joi.string().required(),
    redirectUrl:Joi.string().uri().optional(),
    paymentMethods:Joi.array().items(Joi.string()).default([]),
    incomeSplitConfig:Joi.array().items(Joi.object({
      subAccountCode:Joi.required(),
      splitAmount:Joi.number().min(1).precision(2).optional(),
      splitPercentage:Joi.number().min(1).precision(2).optional(),
      feePercentage:Joi.number().min(0).precision(2).optional(),
      feeBearer:Joi.boolean().optional()
    })).optional(),
    metaData:Joi.object().optional()
});


export const getTransactionStatusv2Schema = Joi.object({
    transactionReference: Joi.string().required()
});


export const getTransactionStatusv1Schema = Joi.object({
    //transactionReference: Joi.string().when('paymentReference',{is:Joi.exist(),then:Joi.optional(),otherwise:Joi.required()}),
    paymentReference:Joi.string().required()
});


export const payWithUSSDSchema = Joi.object({
    transactionReference: Joi.string().required(),
    bankUssdCode: Joi.string().required()
});


export const payWithBankTransferSchema =  Joi.object({
    transactionReference: Joi.string().required(),
    bankCode: Joi.string().optional()
});


export  const  chargeCardSchema = Joi.object({
    transactionReference: Joi.string().required(),
    collectionChannel: Joi.string().required(),
    card:Joi.object({
        number:Joi.string().regex(/^\d+$/).required(),
        expiryMonth:Joi.string().regex(/^\d+$/).length(2).required(),
        expiryYear:Joi.string().regex(/^\d+$/).length(4).required(),
        cvv:Joi.string().regex(/^\d+$/).length(3).required()
    }).required(),
    deviceInformation:Joi.object().required()
});



export const authorizeOtpSchema = Joi.object({
    transactionReference: Joi.string().required(),
    collectionChannel: Joi.string().required(),
    tokenId:Joi.string().alphanum().required(),
    token:Joi.string().regex(/^\d+$/).required()
});


export const ThreeDSAuthTransactionSchema = Joi.object({
    transactionReference: Joi.string().required(),
    collectionChannel: Joi.string().required(),
    card:Joi.object({
        number:Joi.string().regex(/^\d+$/).required(),
        expiryMonth:Joi.string().regex(/^\d+$/).length(2).required(),
        expiryYear:Joi.string().regex(/^\d+$/).length(4).required(),
        cvv:Joi.string().regex(/^\d+$/).length(3).required()}).required(),
    apiKey:Joi.string().required()
})


export const chargeTokenSchema = Joi.object({
    customerName:Joi.string().min(3).required(),
    customerEmail:Joi.string().required(),
    amount:Joi.number().min(20).precision(2).required(),
    paymentDescription:Joi.string().min(3).required(),
    paymentReference:Joi.string().required(),
    currencyCode:Joi.string().optional().default("NGN"),
  	contractCode:Joi.string().required(),
    cardToken:Joi.string().required(),
    apiKey:Joi.string().required()
});