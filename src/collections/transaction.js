import {
    authorizeOtpSchema,
    chargeCardSchema,
    chargeTokenSchema,
    getAllTransactionsSchema,
    getTransactionStatusv1Schema,
    getTransactionStatusv2Schema,
    initTransactionSchema,
    payWithBankTransferSchema,
    payWithUSSDSchema,
    ThreeDSAuthTransactionSchema
} from "../../validators/transactionValidator.js";
import { BaseRequestAPI } from "../base_api.js";


export class Transaction extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    /**
     * Initialise a new Monnify payment checkout.
     * POST /api/v1/merchant/transactions/init-transaction
     */
    async initTransaction(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = initTransactionSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/merchant/transactions/init-transaction', authToken, result.value);
    }

    /**
     * Get transaction status using the Monnify transactionReference.
     * GET /api/v2/transactions/{transactionReference}
     */
    async getTransactionStatusv2(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = getTransactionStatusv2Schema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const ref  = encodeURIComponent(result.value.transactionReference);
        return await this.get(`/api/v2/transactions/${ref}`, authToken);
    }

    /**
     * Get transaction status using the merchant paymentReference.
     * GET /api/v2/merchant/transactions/query?paymentReference=
     */
    async getTransactionStatusv1(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = getTransactionStatusv1Schema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const ref = encodeURIComponent(result.value.paymentReference);
        return await this.get(`/api/v2/merchant/transactions/query?paymentReference=${ref}`, authToken);
    }

    /**
     * Search / list all transactions with optional filters.
     * GET /api/v1/transactions/search
     */
    async getAllTransactions(authToken, data = {}) {
        if (arguments.length < 1) {
            throw new Error("Method requires at least one parameter");
        }

        const result = getAllTransactionsSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const params = new URLSearchParams(
            Object.fromEntries(Object.entries(result.value).filter(([, v]) => v !== undefined))
        ).toString();
        return await this.get(`/api/v1/transactions/search?${params}`, authToken);
    }

    /**
     * Pay with USSD code.
     * POST /api/v1/merchant/ussd/initialize
     */
    async payWithUssd(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = payWithUSSDSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/merchant/ussd/initialize', authToken, result.value);
    }

    /**
     * Trigger a bank transfer payment for an already-initialised transaction.
     * POST /api/v1/merchant/bank-transfer/init-payment
     */
    async payWithBankTransfer(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = payWithBankTransferSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/merchant/bank-transfer/init-payment', authToken, result.value);
    }

    /**
     * Charge a card.
     * POST /api/v1/merchant/cards/charge
     */
    async chargeCard(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = chargeCardSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/merchant/cards/charge', authToken, result.value);
    }

    /**
     * Authorize an OTP-protected card transaction.
     * POST /api/v1/merchant/cards/otp/authorize
     */
    async authorizeOtp(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = authorizeOtpSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/merchant/cards/otp/authorize', authToken, result.value);
    }

    /**
     * Complete a 3D Secure card authentication flow.
     * POST /api/v1/sdk/cards/secure-3d/authorize
     */
    async ThreeDsSecureAuthTransaction(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = ThreeDSAuthTransactionSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/sdk/cards/secure-3d/authorize', authToken, result.value);
    }

    /**
     * Charge a previously tokenized card.
     * POST /api/v1/merchant/cards/charge-card-token
     *
     * Fixed: was incorrectly using ThreeDSAuthTransactionSchema.
     */
    async cardTokenization(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = chargeTokenSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/merchant/cards/charge-card-token', authToken, result.value);
    }
}
