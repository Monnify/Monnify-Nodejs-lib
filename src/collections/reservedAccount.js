import {
    addLinkAccountSchema,
    invoiceReservedAccountSchema,
    kycInfoSchema,
    reservedAccountDetailSchema,
    reservedAccountSchema,
    updateBvnSchema,
    updateIncomeSplitConfigSchema,
    updatePaymentSourcesSchema
} from "../../validators/reservedAccountValidator.js";
import { BaseRequestAPI } from "../base_api.js";


export class ReservedAccount extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    /**
     * Create a general-purpose virtual account for a customer.
     * POST /api/v2/bank-transfer/reserved-accounts
     */
    async createReservedAccount(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = reservedAccountSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v2/bank-transfer/reserved-accounts', authToken, result.value);
    }

    /**
     * Create an invoice-type (one-time) virtual account.
     * POST /api/v1/bank-transfer/reserved-accounts
     */
    async createInvoiceReservedAccount(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = invoiceReservedAccountSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/bank-transfer/reserved-accounts', authToken, result.value);
    }

    /**
     * Add additional bank accounts (preferred banks) to a reserved account.
     * PUT /api/v1/bank-transfer/reserved-accounts/add-linked-accounts/{accountReference}
     */
    async addLinkedAccounts(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = addLinkAccountSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const ref  = encodeURIComponent(result.value.accountReference);
        return await this.put(
            `/api/v1/bank-transfer/reserved-accounts/add-linked-accounts/${ref}`,
            authToken,
            data
        );
    }

    /**
     * Fetch full details of a reserved account.
     * GET /api/v2/bank-transfer/reserved-accounts/{accountReference}
     */
    async reservedAccountDetails(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = reservedAccountDetailSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const ref = encodeURIComponent(result.value.accountReference);
        return await this.get(`/api/v2/bank-transfer/reserved-accounts/${ref}`, authToken);
    }

    /**
     * Fetch paginated list of transactions on a reserved account.
     * GET /api/v1/bank-transfer/reserved-accounts/transactions
     */
    async reservedAccountTransactions(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = reservedAccountDetailSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const params = new URLSearchParams(
            Object.fromEntries(Object.entries(result.value).filter(([, v]) => v !== undefined))
        ).toString();
        return await this.get(`/api/v1/bank-transfer/reserved-accounts/transactions?${params}`, authToken);
    }

    /**
     * Permanently deallocate (delete) a reserved account.
     * DELETE /api/v1/bank-transfer/reserved-accounts/reference/{accountReference}
     */
    async deallocateReservedAccount(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = reservedAccountDetailSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const ref = encodeURIComponent(result.value.accountReference);
        return await this.delete(`/api/v1/bank-transfer/reserved-accounts/reference/${ref}`, authToken);
    }

    /**
     * Update KYC (BVN/NIN) information linked to a reserved account.
     * PUT /api/v1/bank-transfer/reserved-accounts/{accountReference}/kyc-info
     */
    async updateReservedAccountKycInfo(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = kycInfoSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const ref = encodeURIComponent(result.value.accountReference);
        return await this.put(
            `/api/v1/bank-transfer/reserved-accounts/${ref}/kyc-info`,
            authToken,
            result.value
        );
    }

    /**
     * Update the BVN associated with a reserved account.
     * PUT /api/v1/bank-transfer/reserved-accounts/update-customer-bvn/{reservedAccountReference}
     */
    async updateReservedAccountBvn(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = updateBvnSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const { reservedAccountReference, ...body } = result.value;
        const ref = encodeURIComponent(reservedAccountReference);
        return await this.put(
            `/api/v1/bank-transfer/reserved-accounts/update-customer-bvn/${ref}`,
            authToken,
            body
        );
    }

    /**
     * Configure which sources are allowed to pay into a reserved account.
     * PUT /api/v1/bank-transfer/reserved-accounts/update-payment-source-filter/{accountReference}
     */
    async updatePaymentSources(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = updatePaymentSourcesSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const { accountReference, ...body } = result.value;
        const ref = encodeURIComponent(accountReference);
        return await this.put(
            `/api/v1/bank-transfer/reserved-accounts/update-payment-source-filter/${ref}`,
            authToken,
            body
        );
    }

    /**
     * Update the income-split (sub-account distribution) config for a reserved account.
     * PUT /api/v1/bank-transfer/reserved-accounts/update-income-split-config/{accountReference}
     */
    async updateIncomeSplitConfig(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = updateIncomeSplitConfigSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const { accountReference, splitConfig } = result.value;
        const ref = encodeURIComponent(accountReference);
        return await this.put(
            `/api/v1/bank-transfer/reserved-accounts/update-income-split-config/${ref}`,
            authToken,
            splitConfig
        );
    }
}
