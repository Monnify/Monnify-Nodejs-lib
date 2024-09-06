import { BaseRequestAPI } from "./base_api.js";

export class TransactionRefund extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    async initiateRefund(
        authToken,
        transactionReference,
        refundReference,      
        refundReason,
        refundAmount,
        {
            customerNote="",
            destinationAccountNumber,
            destinationAccountBankCode,
        }
    ) {
        const data = {};
        const path = '/api/v1/refunds/initiate-refund';
        data.transactionReference = transactionReference;
        data.refundReference = refundReference;
        data.refundReason = refundReason;
        data.refundAmount = refundAmount;
        

        
        if (arguments.length > 4) {
            
            if (customerNote.length !== 0) {
                
                if (customerNote.length > 16) {
                    throw new Error("Customer note must be at most 16 characters.");
                }
                data.customerNote = customerNote
            }
            if (destinationAccountNumber && destinationAccountBankCode) {
                data.destinationAccountNumber = destinationAccountNumber;
                data.destinationAccountBankCode = destinationAccountBankCode;                     
            }
            
        }

        return await this.post(path, authToken, data);

    }
    async getAllRefunds(authToken, { page = 0, size = 10 } ) {

        const path = `/api/v1/refunds?page=${page}&size=${size}`
        
        return await this.get(path, authToken);
    }

    async getRefundStatus(authToken, refundReference) {
        const encodedRefundReference = encodeURI(refundReference);
        const path = '/api/v1/refunds/' + encodedRefundReference;
        return await this.get(path, authToken);
    }
}
