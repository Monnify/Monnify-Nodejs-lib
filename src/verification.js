import { BaseRequestAPI } from "./base_api.js";

export class Verification extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    async validateBankAccount(authToken, accountNumber, bankCode) {
        const path = `/api/v1/disbursements/account/validate?accountNumber=${accountNumber}&bankCode=${bankCode}`;

        return await this.get(path, authToken);
    }

    async verifyBvnInformation(authToken,
        bvn,
        dateOfBirth,
        mobileNo
    ) {

        const data = {};
        const path = '/api/v1/vas/bvn-details-match';

        data.bvn = bvn;
        
        data.dateOfBirth = dateOfBirth;
        data.mobileNo = mobileNo;

        if (arguments.length<=4) {
            return await this.post(path, authToken, data);
        }
        return await this.post(path, authToken, data);
    }

    async matchBvnAndAccountName(authToken,
        bankCode,
        accountNumber,
        bvn) {

        const data = {};
        const path = '/api/v1/vas/bvn-account-match';

        data.bankCode = bankCode;
        data.accountNumber = accountNumber;
        data.bvn = bvn;

        return await this.post(path, authToken, data);
        }
}