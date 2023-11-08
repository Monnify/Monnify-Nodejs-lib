import { BaseRequestAPI } from "./base_api.js";
import crypto from 'crypto'




export class ReservedAccount extends BaseRequestAPI{
    constructor(env){
        super(env);
    }

    async createReservedAccount(
                                authToken,
                                customerName,
                                customerEmail,
                                accountName,
                                {currencyCode="NGN",
                                bvn="",
                                accountReference="",
                                getAllAvailableBanks=true,
                                preferredBanks=[],
                                incomeSplitConfig={},
                                restrictPaymentSource=false,
                                allowedPaymentSource={}}={}){
                                
        const data = {}
        const path = '/api/v2/bank-transfer/reserved-accounts';
        data.customerName = customerName
        data.customerEmail = customerEmail
        data.accountName = accountName
        data.contractCode = this.contract

        if(arguments.length <=4){
            data.getAllAvailableBanks = true
            data.accountReference = crypto.randomBytes(20).toString('hex')
            data.currencyCode = 'NGN'
            return await this.post(path,authToken,data);
        }

        
        accountReference = accountReference.length !== 0 ? accountReference : crypto.randomBytes(20).toString('hex')
        data.currencyCode = currencyCode
        data.accountReference = accountReference
        if(bvn.length !== 0){
            data.bvn = bvn
        }
        if(Object.keys(incomeSplitConfig).length !==0){
            data.incomeSplitConfig = incomeSplitConfig
        }
        if(restrictPaymentSource){
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
        console.log(data)
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
                        {
                        currencyCode="NGN",
                        redirectUrl="",
                        paymentMethods=[],
                        paymentReference="",
                        metaData={},
                        incomeSplitConfig={}}={}){

        const data = {}
        const path = '/api/v1/merchant/transactions/init-transaction';
        data.amount = amount
        data.customerName = customerName
        data.customerEmail = customerEmail
        data.paymentDescription = paymentDescription
        data.contractCode = this.contract

        if(arguments.length <=5){
            data.paymentMethods = []
            data.paymentReference = crypto.randomBytes(20).toString('hex')
            data.currencyCode = 'NGN'
            console.log(data)
            return await this.post(path,authToken,data);
        }

        paymentReference = paymentReference.length !== 0 ? paymentReference : crypto.randomBytes(20).toString('hex')
        data.currencyCode = currencyCode
        data.paymentMethods = paymentMethods
        data.contractCode = this.contract
        data.paymentReference = paymentReference
        data.metaData = metaData

        if(redirectUrl.length !== 0){
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