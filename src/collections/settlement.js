import {
    getBySettlementReferenceSchema,
    getSettlementInfoSchema
} from "../../validators/settlementValidator.js";
import { BaseRequestAPI } from "../base_api.js";


export class Settlement extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    /**
     * Fetch all transactions that belong to a given settlement reference.
     * GET /api/v1/transactions/find-by-settlement-reference
     */
    async getTransactionsBySettlementReference(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = getBySettlementReferenceSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const params = new URLSearchParams(
            Object.fromEntries(Object.entries(result.value).filter(([, v]) => v !== undefined))
        ).toString();
        return await this.get(
            `/api/v1/transactions/find-by-settlement-reference?${params}`,
            authToken
        );
    }

    /**
     * Fetch the settlement breakdown for a specific transaction.
     * GET /api/v1/settlement-detail?transactionReference=
     */
    async getSettlementInfo(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = getSettlementInfoSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const ref = encodeURIComponent(result.value.transactionReference);
        return await this.get(`/api/v1/settlement-detail?transactionReference=${ref}`, authToken);
    }
}
