import Joi from "joi";


/** GET /api/v2/disbursements/wallet-balance?accountNumber= */
export const getWalletBalanceSchema = Joi.object({
    accountNumber: Joi.string().regex(/^\d+$/).length(10).required()
});
