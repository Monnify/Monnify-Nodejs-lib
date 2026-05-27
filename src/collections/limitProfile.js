import {
    createLimitProfileSchema,
    reserveAccountWithLimitSchema,
    updateLimitProfileSchema,
    updateReserveAccountLimitSchema
} from "../../validators/limitProfileValidator.js";
import { BaseRequestAPI } from "../base_api.js";


export class LimitProfile extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    /**
     * Create one or more transaction limit profiles.
     * POST /api/v1/limit-profile/
     */
    async createLimitProfile(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = createLimitProfileSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/limit-profile/', authToken, result.value);
    }

    /**
     * Retrieve all limit profiles for the merchant.
     * GET /api/v1/limit-profile/
     */
    async getLimitProfiles(authToken) {
        if (arguments.length < 1) {
            throw new Error("Method requires at least one parameter");
        }

        return await this.get('/api/v1/limit-profile/', authToken);
    }

    /**
     * Update an existing limit profile.
     * PUT /api/v1/limit-profile/{limitProfileCode}
     */
    async updateLimitProfile(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = updateLimitProfileSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const { limitProfileCode, ...body } = result.value;
        const code = encodeURIComponent(limitProfileCode);
        return await this.put(`/api/v1/limit-profile/${code}`, authToken, body);
    }

    /**
     * Create a reserved account pre-bound to a specific limit profile.
     * POST /api/v1/bank-transfer/reserved-accounts/limit
     */
    async reserveAccountWithLimit(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = reserveAccountWithLimitSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post(
            '/api/v1/bank-transfer/reserved-accounts/limit',
            authToken,
            result.value
        );
    }

    /**
     * Change the limit profile applied to an existing reserved account.
     * PUT /api/v1/bank-transfer/reserved-accounts/limit
     */
    async updateReserveAccountLimit(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = updateReserveAccountLimitSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.put(
            '/api/v1/bank-transfer/reserved-accounts/limit',
            authToken,
            result.value
        );
    }
}
