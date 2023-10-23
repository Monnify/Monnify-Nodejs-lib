import { BaseRequestAPI } from "./base_api.js";




export class ReservedAccount extends BaseRequestAPI{
    constructor(env){
        super(env);
    }

    async createReservedAccountV2(
                                authToken,
                                customerName,
                                customerEmail,
                                accountName,
                                currencyCode="NGN",
                                bvn="",
                                accountReference="",
                                getAllAvailableBanks=true,
                                preferredBanks=[],
                                incomeSplitConfig={},
                                restrictPaymentSource={},
                                allowedPaymentSource={}){
                                
        
        const data = {}
        const path = '/api/v2/bank-transfer/reserved-accounts';
        accountReference = accountReference.length !== 0 ? accountReference : crypto.randomBytes(20).toString('hex')
        data.customerName = customerName
        data.customerEmail = customerEmail
        data.accountName = accountName
        data.currencyCode = currencyCode
        data.contractCode = this.contract
        if(bvn.length === 0){
            data.bvn = bvn
        }
        if(Object.keys(incomeSplitConfig).length !==0){
            data.incomeSplitConfig = incomeSplitConfig
        }
        if(Object.keys(restrictPaymentSource).length !==0){
            data.restrictPaymentSource = restrictPaymentSource
        }
        if(Object.keys(allowedPaymentSource).length !==0){
            data.allowedPaymentSource = allowedPaymentSource
        }
        if(getAllAvailableBanks===true){
            data.getAllAvailableBanks = true
        }else{
            data.getAllAvailableBanks = false
            data.preferredBanks = preferredBanks
        }
        return await this.post(path,authToken,data);
    }


    async addLinkedAccounts(authToken,accountReference,preferredBanks){
        const data = {}
        data.getAllAvailableBanks = false
        data.preferredBanks = preferredBanks
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

    async initTransaction(
                        authToken,
                        amount,
                        customerName,
                        customerEmail,
                        paymentDescription,
                        currencyCode="NGN",
                        redirectUrl="",
                        paymentMethods=[],
                        paymentReference="",
                        metaData={},
                        incomeSplitConfig={}){

        const data = {}
        const path = '/api/v1/merchant/transactions/init-transaction';
        paymentReference = paymentReference.length !== 0 ? paymentReference : crypto.randomBytes(20).toString('hex')
        data.amount = amount
        data.customerName = customerName
        data.customerEmail = customerEmail
        data.paymentDescription = paymentDescription
        data.currencyCode = currencyCode
        data.paymentMethods = paymentMethods
        data.contractCode = this.contract
        data.paymentReference = paymentReference
        data.metaData = metaData

        if(redirectUrl.length === 0){
            data.redirectUrl = redirectUrl
        }
        if(Object.keys(incomeSplitConfig).length !==0){
            data.incomeSplitConfig = incomeSplitConfig
        }
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