import { 
    authorizeTransferSchema, 
    bulkTransferSchema, 
    getAllTransferSchema, 
    getStatusSchema, 
    getAllBulkTransferSchema,
    resendTransferOTPSchema, 
    singleTransferSchema 
} from "../../validators/disbursementValidator.js";
import { BaseRequestAPI } from "../base_api.js";
import crypto from 'crypto'

export class Disbursement extends BaseRequestAPI{
    constructor(env){
        super(env);
    }

    async initiateSingleTransfer(authToken, data){
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = singleTransferSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const path = '/api/v2/disbursements/single';
        return await this.post(path,authToken,result.value);
    }



    async initiateBulkTransfer(authToken, data){
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = bulkTransferSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const path = '/api/v2/disbursements/batch';
        return await this.post(path,authToken,result.value);
    }

    async authorizeSingleTransfer(authToken, data){
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = authorizeTransferSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const path = '/api/v2/disbursements/single/validate-otp';
        return await this.post(path,authToken,result.value);
    }
    
    async authorizeBulkTransfer(authToken, data){
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = authorizeTransferSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };


        const path = '/api/v2/disbursements/batch/validate-otp';
        return await this.post(path,authToken,result.value);
    }

    async resendTransferOTP(authToken, data){
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = resendTransferOTPSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        
        const path = '/api/v2/disbursements/single/resend-otp';
        return await this.post(path,authToken,result.value);
    }

    async getSingleTransferStatus(authToken, data){
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = getStatusSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const encodedReference = encodeURI(result.value.reference);
        const path = `/api/v2/disbursements/single/summary?reference=${encodedReference}`;
        return await this.get(path,authToken);
    }

    async getBulkTransferStatus(authToken, data){
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = getStatusSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const sourceAccountNumber = result.value.sourceAccountNumber;
        const path = `/api/v2/disbursements/search-transactions?${Object.entries(result.value).map(k=>k.join("=")).join('&')}`;
        return await this.get(path,authToken);
    }

    async getAllSingleTransfers(authToken, data){
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = getAllTransferSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const path = `/api/v2/disbursements/single/transactions?${Object.entries(result.value).map(k=>k.join("=")).join('&')}`;
        return await this.get(path,authToken);
    }

    async getAllBulkTransfers(authToken, data){
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = getAllBulkTransferSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const path = `/api/v2/disbursements/bulk/transactions?${Object.entries(result.value).map(k=>k.join("=")).join('&')}`;
        return await this.get(path,authToken);
    }
}