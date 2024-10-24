import { deleteSubAccountSchema, subAccountCreationSchema, updateSubAcountSchema } from "../../validators/subAccountValidator.js";
import { BaseRequestAPI } from "../base_api.js";
import crypto from 'crypto'

export class SubAccount extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    async createSubAccount(authToken,data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = subAccountCreationSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const path = '/api/v1/sub-accounts';

        return await this.post(path, authToken, result.value);
    }

    async deleteSubAccount(authToken,data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = deleteSubAccountSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const encodedSubAccountCode = encodeURI(result.value.subAccountCode);
        const path = '/api/v1/sub-accounts/' + encodedSubAccountCode;

        return await this.delete(path, authToken);
    }

    
    async getSubAccounts(authToken) {
        const path = '/api/v1/sub-accounts';
        return await this.get(path, authToken);

    }

    async updateSubAccount(authToken,data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = updateSubAcountSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const path = '/api/v1/sub-accounts'
        return await this.put(path, authToken, result.value);

    }
}
