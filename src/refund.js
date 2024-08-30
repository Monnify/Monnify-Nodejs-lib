import { BaseRequestAPI } from "./base_api.js";
import crypto from 'crypto'

export class TransactionRefund extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    async initiateRefund(
        authToken,
        transactionReference,
        refundReference,      
        refundReason,
        {
            refundAmount,
            customerNote="hello",
            destinationAccountNumber,
            destinationAccountBankCode,
        }
    ) {
        const data = {};
        const path = '/api/v1/refunds/initiate-refund';
        data.transactionReference = transactionReference;
        data.refundReference = refundReference;
        data.refundReason = refundReason;

        if (arguments.length > 4) {
            data.refundAmount = refundAmount;
            data.customerNote = customerNote;
            if (destinationAccountNumber || destinationAccountBankCode) {
                if (!destinationAccountNumber || !destinationAccountBankCode) {
                    throw new Error("Both destinationAccountNumber and destinationAccountBankCode must be provided together.");
                }
                data.destinationAccountNumber = destinationAccountNumber;
                data.destinationAccountBankCode = destinationAccountBankCode;
                if (customerNote.length > 16) {
                    customerNote = customerNote.substring(0, 16);
                }
            }
        }

        return await this.post(path, authToken, data);

    }
    //untested and seems there are additional parameters
    async getAllRefunds(authToken, page = 0, size = 10 ) {
        const data = {};
        data.page = page;
        data.size = size;

        const path = `/api/v1/refunds?page=${data.page}&size=${data.size}`

        
        return await this.get(path, authToken);
    }

    async getRefundStatus(authToken, refundReference) {
        const encodedRefundReference = encodeURI(refundReference);
        const path = '/api/v1/refunds/' + encodedRefundReference;
        return await this.get(path, authToken);
    }
}