import { BaseRequestAPI } from "./base_api.js";
import crypto from 'crypto'

export class SubAccount extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    async createSubAccounts(authToken,
        currencyCode,
        bankCode,
        accountNumber,
        email,
        defaultSplitPercentage,
        subAccountCode,
    {
        accountName,
        bankName
    }) {

        const path = '/api/v1/sub-accounts';
        const data = {};

        data.currencyCode = currencyCode;
        data.bankCode = bankCode;
        data.accountNumber = accountNumber;
        data.email = email;
        data.defaultSplitPercentage = defaultSplitPercentage;
        data.subAccountCode = subAccountCode;

        if (arguments.length<=6) {
            return await this.post(path, authToken, data);
        }

        data.accountName = accountName;
        data.bankName = bankName;

        return await this.post(path, authToken, data);
    }

    async deleteSubAccount(authToken,
        subAccountCode) {
        const encodedSubAccountCode = encodeURI(subAccountCode);
        const path = '/api/v1/sub-accounts/' + encodedSubAccountCode;

        return await this.delete(path, authToken);
    }

    async getSubAccounts(authToken) {
        const path = '/api/v1/sub-accounts';
        return await this.get(path, authToken);

    }

    async updateSubAccount(authToken,
        subAccountCode,
        currencyCode,
        bankCode,
        accountNumber,
        email,
        defaultSplitPercentage,
        {
            accountName,
            bankName
        }) {

        const data = {};
        const path = '/api/v1/sub-accounts'
        data.subAccountCode = subAccountCode;
        data.currencyCode = currencyCode;
        data.bankCode = bankCode;
        data.accountNumber = accountNumber;
        data.email = email;
        data.defaultSplitPercentage = defaultSplitPercentage;

        if (arguments.length <= 6) {
            return await this.put(path, authToken);
        }

        data.accountName = accountName;
        data.bankName = bankName;        

        return await this.put(path, authToken, data);

    }
}