import { getAllRefundSchema, getRefundStatusSchema, refundSchema } from "../../validators/refundValidator.js";
import { BaseRequestAPI } from "../base_api.js";

export class TransactionRefund extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    async initiateRefund(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = refundSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const path = '/api/v1/refunds/initiate-refund';
        return await this.post(path, authToken, result.value);

    }
    async getAllRefunds(authToken, data ) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = getAllRefundSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const path = `/api/v1/refunds?${Object.entries(result.value).map(k=>k.join("=")).join('&')}`
        
        return await this.get(path, authToken);
    }

    async getRefundStatus(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }
        
        const result = getRefundStatusSchema.validate(data,{allowUnknown:true})
        
        if (result.error){
            throw new Error(result.error);
        };

        const encodedRefundReference = encodeURI(result.value.refundReference);
        const path = '/api/v1/refunds/' + encodedRefundReference;
        return await this.get(path, authToken);
    }
}
