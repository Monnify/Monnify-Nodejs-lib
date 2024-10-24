import { BaseRequestAPI } from "../base_api.js";

export class Verification extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    async validateBankAccount(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = refundSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const path = `/api/v1/disbursements/account/validate?${Object.entries(result.value).map(k=>k.join("=")).join('&')}`;

        return await this.get(path, authToken);
    }

    async verifyBvnInformation(authToken, data) {
         if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = refundSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const path = '/api/v1/vas/bvn-details-match';
        return await this.post(path, authToken, result.value);
    }

    async matchBvnAndAccountName(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = refundSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const path = '/api/v1/vas/bvn-account-match';
        return await this.post(path, authToken, result.value);
        }
}