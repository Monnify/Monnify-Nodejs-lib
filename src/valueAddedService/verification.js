import {
    bvnInformationSchema,
    bvnMatchSchema,
    ninVerificationSchema,
    validateAccountSchema
} from "../../validators/verificationValidator.js";
import { BaseRequestAPI } from "../base_api.js";


export class Verification extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    /**
     * Validate that a bank account exists and return its name.
     * GET /api/v1/disbursements/account/validate
     */
    async validateBankAccount(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = validateAccountSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const params = new URLSearchParams(result.value).toString();
        const path   = `/api/v1/disbursements/account/validate?${params}`;
        return await this.get(path, authToken);
    }

    /**
     * Verify BVN details (name, DOB, phone) against Monnify's identity service.
     * POST /api/v1/vas/bvn-details-match
     */
    async verifyBvnInformation(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = bvnInformationSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/vas/bvn-details-match', authToken, result.value);
    }

    /**
     * Match a BVN against a bank account number to confirm ownership.
     * POST /api/v1/vas/bvn-account-match
     */
    async matchBvnAndAccountName(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = bvnMatchSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/vas/bvn-account-match', authToken, result.value);
    }

    /**
     * Verify a National Identification Number (NIN).
     * POST /api/v1/vas/nin-details
     */
    async verifyNin(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = ninVerificationSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/vas/nin-details', authToken, result.value);
    }
}
