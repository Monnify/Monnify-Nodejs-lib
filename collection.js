import { BaseRequestAPI } from "./base_api.js";




export class ReservedAccount extends BaseRequestAPI{
    constructor(env){
        super(env);
    }

    async createReservedAccountV2(authToken,data){
        const path = '/api/v2/bank-transfer/reserved-accounts';
        data.contractCode = this.contract;
        return await this.post(path,authToken,data);
    }

    async addLinkedAccounts(authToken,accountReference,data){
        const encodedReference = encodeURI(accountReference);
        const path = '/api/v1/bank-transfer/reserved-accounts/add-linked-accounts/' + encodedReference;
        return await this.put(path,authToken,data);
    }

    async reservedAccountDetails(authToken,accountReference){
        const encodedReference = encodeURI(accountReference);
        const path = '/api/v2/bank-transfer/reserved-accounts/' + encodedReference;
        return await this.get(path,authToken);
    }

    async reservedAccountTransactions(authToken,accountReference, page=0,size=10){
        const encodedReference = encodeURI(accountReference);
        const path = `/api/v2/bank-transfer/reserved-accounts?accountReference=${encodedReference}&page=${page}&size=${size}`;
        return await this.get(path,authToken);
    }
}





export class Transaction extends BaseRequestAPI{
    constructor(env){
        super(env);
    }

    async initTransaction(authToken,data){
        const path = '/api/v1/merchant/transactions/init-transaction';
        data.contractCode = this.contract;
        return await this.post(path,authToken,data);
    }

    async getTransactionStatusv2(authToken,transactionReference){
        const encodedReference = encodeURI(transactionReference);
        const path = '/api/v2/transactions/' + encodedReference;
        return await this.get(path,authToken);
    }

    async getTransactionStatusv1(authToken,paymentReference){
        const encodedReference = encodeURI(paymentReference);
        const path = '/api/v2/merchant/transactions/query?paymentReference=' + encodedReference;
        return await this.get(path,authToken);
    }

}