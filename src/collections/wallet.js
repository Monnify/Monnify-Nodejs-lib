import { getWalletBalanceSchema } from "../../validators/walletValidator.js";
import { BaseRequestAPI } from "../base_api.js";


export class Wallet extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    /**
     * Get the current balance of a Monnify wallet / disbursement source account.
     * GET /api/v2/disbursements/wallet-balance?accountNumber=
     */
    async getWalletBalance(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = getWalletBalanceSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const accountNumber = encodeURIComponent(result.value.accountNumber);
        return await this.get(
            `/api/v2/disbursements/wallet-balance?accountNumber=${accountNumber}`,
            authToken
        );
    }
}
