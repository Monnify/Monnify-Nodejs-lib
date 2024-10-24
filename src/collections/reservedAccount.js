import { BaseRequestAPI } from "../base_api.js";
import crypto from 'crypto'
 import { 
    reservedAccountSchema, 
    addLinkAccountSchema,
    reservedAccountDetailSchema,
    updateReservedAccountSplitSchema,
    kycInfoSchema,
    reservedAccountTransactionSchema

} 
    from "../../validators/reservedAccountValidator.js";



export class ReservedAccount extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    async createReservedAccount(authToken,data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = reservedAccountSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };
        const path = '/api/v2/bank-transfer/reserved-accounts';

        return await this.post(path, authToken, result.value);
    };




    async addLinkedAccounts(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }

        const result = addLinkAccountSchema.validate(data,{allowUnknown:true});

        if (result.error){
            throw new Error(result.error);
        }

        const encodedReference = encodeURI(result.value.accountReference);
        const path = '/api/v1/bank-transfer/reserved-accounts/add-linked-accounts/' + encodedReference;
        return await this.put(path, authToken, data);
    }



    async reservedAccountDetails(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }

        const result = reservedAccountDetailSchema.validate(data,{allowUnknown:true});

        if (result.error){
            throw new Error(result.error);
        }

        const encodedReference = encodeURI(result.value.accountReference);
        const path = '/api/v2/bank-transfer/reserved-accounts/' + encodedReference;
        return await this.get(path, authToken);
    }



    async reservedAccountTransactions(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }

        const result = reservedAccountDetailSchema.validate(data,{allowUnknown:true});

        if (result.error){
            throw new Error(result.error);
        }
        const encodedReference = encodeURI(result.value.accountReference);

        const path = `/api/v1/bank-transfer/reserved-accounts/transactions?${Object.entries(result.value).map(k=>k.join("=")).join('&')}`;

        return await this.get(path, authToken);
    }



    async deallocateReservedAccount(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }

        const result = reservedAccountDetailSchema.validate(data,{allowUnknown:true});

        if (result.error){
            throw new Error(result.error);
        }
        const encodedReference = encodeURI(result.value.accountReference)

        const path = '/api/v1/bank-transfer/reserved-accounts/reference/' + encodedReference;
        return await this.delete(path, authToken);
    }



    async updateReservedAccountKycInfo(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = kycInfoSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        }

        const encodedReference = encodeURI(result.value.accountReference);
        const path = '/api/v1/bank-transfer/reserved-accounts/' + encodedReference + '/kyc-info';

        return await this.put(path, authToken, result.value)
    }
}

