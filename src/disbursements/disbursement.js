import {
    authorizeTransferSchema,
    bulkTransferSchema,
    getAllBulkTransferSchema,
    getAllTransferSchema,
    getBulkBatchSummarySchema,
    getBulkTransferTransactionsSchema,
    getStatusSchema,
    resendBulkTransferOTPSchema,
    resendSingleTransferOTPSchema,
    searchDisbursementTransactionsSchema,
    singleTransferSchema
} from "../../validators/disbursementValidator.js";
import { BaseRequestAPI } from "../base_api.js";


export class Disbursement extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    /**
     * Initiate a single bank transfer.
     * POST /api/v2/disbursements/single
     */
    async initiateSingleTransfer(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = singleTransferSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v2/disbursements/single', authToken, result.value);
    }

    /**
     * Initiate a bulk (batch) bank transfer.
     * POST /api/v2/disbursements/batch
     */
    async initiateBulkTransfer(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = bulkTransferSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v2/disbursements/batch', authToken, result.value);
    }

    /**
     * Authorize a single transfer using the OTP sent to the account.
     * POST /api/v2/disbursements/single/validate-otp
     */
    async authorizeSingleTransfer(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = authorizeTransferSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v2/disbursements/single/validate-otp', authToken, result.value);
    }

    /**
     * Authorize a bulk (batch) transfer using the OTP.
     * POST /api/v2/disbursements/batch/validate-otp
     */
    async authorizeBulkTransfer(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = authorizeTransferSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v2/disbursements/batch/validate-otp', authToken, result.value);
    }

    /**
     * Resend the OTP for a pending single transfer.
     * POST /api/v2/disbursements/single/resend-otp
     */
    async resendTransferOTP(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = resendSingleTransferOTPSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v2/disbursements/single/resend-otp', authToken, result.value);
    }

    /**
     * Resend the OTP for a pending bulk transfer.
     * POST /api/v2/disbursements/batch/resend-otp
     */
    async resendBulkTransferOTP(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = resendBulkTransferOTPSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v2/disbursements/batch/resend-otp', authToken, result.value);
    }

    /**
     * Get the status summary of a single transfer by its reference.
     * GET /api/v2/disbursements/single/summary?reference=
     */
    async getSingleTransferStatus(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = getStatusSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const ref = encodeURIComponent(result.value.reference);
        return await this.get(`/api/v2/disbursements/single/summary?reference=${ref}`, authToken);
    }

    /**
     * Get the status summary of a bulk transfer batch.
     * GET /api/v2/disbursements/batch/summary?reference=
     *
     * Fixed: was incorrectly pointing to /search-transactions.
     * Also accessible as getBulkBatchSummary (spec-aligned alias).
     */
    async getBulkTransferStatus(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = getBulkBatchSummarySchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const ref = encodeURIComponent(result.value.reference);
        return await this.get(`/api/v2/disbursements/batch/summary?reference=${ref}`, authToken);
    }

    /** Spec-aligned alias for getBulkTransferStatus. */
    async getBulkBatchSummary(authToken, data) {
        return this.getBulkTransferStatus(authToken, data);
    }

    /**
     * Get all individual transactions within a bulk transfer batch.
     * GET /api/v2/disbursements/bulk/{batchReference}/transactions
     */
    async getBulkTransferTransactions(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = getBulkTransferTransactionsSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const { batchReference, pageNo, pageSize } = result.value;
        const ref = encodeURIComponent(batchReference);
        return await this.get(
            `/api/v2/disbursements/bulk/${ref}/transactions?pageNo=${pageNo}&pageSize=${pageSize}`,
            authToken
        );
    }

    /**
     * Paginated list of all single transfers.
     * GET /api/v2/disbursements/single/transactions
     *
     * Fixed: was requiring an incorrect `reference` field.
     */
    async getAllSingleTransfers(authToken, data = {}) {
        if (arguments.length < 1) {
            throw new Error("Method requires at least one parameter");
        }

        const result = getAllTransferSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const params = new URLSearchParams(result.value).toString();
        return await this.get(`/api/v2/disbursements/single/transactions?${params}`, authToken);
    }

    /**
     * Paginated list of all bulk transfer batches.
     * GET /api/v2/disbursements/bulk/transactions
     *
     * Fixed: was using wrong schema (required transactionReference + sourceAccountNumber).
     */
    async getAllBulkTransfers(authToken, data = {}) {
        if (arguments.length < 1) {
            throw new Error("Method requires at least one parameter");
        }

        const result = getAllBulkTransferSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const params = new URLSearchParams(result.value).toString();
        return await this.get(`/api/v2/disbursements/bulk/transactions?${params}`, authToken);
    }

    /**
     * Search disbursement transactions across a source account with date/amount filters.
     * GET /api/v2/disbursements/search-transactions
     */
    async searchDisbursementTransactions(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = searchDisbursementTransactionsSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const params = new URLSearchParams(
            Object.fromEntries(Object.entries(result.value).filter(([, v]) => v !== undefined))
        ).toString();
        return await this.get(`/api/v2/disbursements/search-transactions?${params}`, authToken);
    }
}
