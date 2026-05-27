import {
    cancelMandateSchema,
    createMandateSchema,
    debitMandateSchema,
    getDebitStatusSchema,
    getMandateStatusSchema
} from "../../validators/directDebitValidator.js";
import { BaseRequestAPI } from "../base_api.js";


export class DirectDebit extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    /**
     * Create a new direct debit mandate (e-mandate or paper mandate).
     * POST /api/v1/direct-debit/mandate/create
     */
    async createMandate(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = createMandateSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/direct-debit/mandate/create', authToken, result.value);
    }

    /**
     * Retrieve the current status of one or more mandates.
     * GET /api/v1/direct-debit/mandate/?mandateReferences=
     *
     * @param {string} data.mandateReferences - Comma-separated mandate codes.
     */
    async getMandateStatus(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = getMandateStatusSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const refs = encodeURIComponent(result.value.mandateReferences);
        return await this.get(
            `/api/v1/direct-debit/mandate/?mandateReferences=${refs}`,
            authToken
        );
    }

    /**
     * Trigger a debit against an approved mandate.
     * POST /api/v1/direct-debit/mandate/debit
     */
    async debitMandate(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = debitMandateSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/direct-debit/mandate/debit', authToken, result.value);
    }

    /**
     * Check the status of a mandate debit request.
     * GET /api/v1/direct-debit/mandate/debit-status?paymentReference=
     */
    async getDebitStatus(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = getDebitStatusSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const ref = encodeURIComponent(result.value.paymentReference);
        return await this.get(
            `/api/v1/direct-debit/mandate/debit-status?paymentReference=${ref}`,
            authToken
        );
    }

    /**
     * Cancel an active mandate.
     * PATCH /api/v1/direct-debit/mandate/cancel-mandate/{mandateCode}
     */
    async cancelMandate(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = cancelMandateSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const code = encodeURIComponent(result.value.mandateCode);
        return await this.patch(
            `/api/v1/direct-debit/mandate/cancel-mandate/${code}`,
            authToken
        );
    }
}
