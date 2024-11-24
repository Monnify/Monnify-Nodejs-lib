
import {
    authorizeOtpSchema,
    chargeCardSchema,
    getTransactionStatusv1Schema,
    getTransactionStatusv2Schema,
    initTransactionSchema,
    payWithBankTransferSchema,
    payWithUSSDSchema,
    ThreeDSAuthTransactionSchema
} from "../../validators/transactionValidator.js";
import { BaseRequestAPI } from "../base_api.js";





export class Transaction extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    async initTransaction(authToken,data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }

        const result = initTransactionSchema.validate(data,{allowUnknown:true})

        if (result.error){
            throw new Error(result.error);
        };

        const path = '/api/v1/merchant/transactions/init-transaction';
        return await this.post(path, authToken, result.value);
    }



    async getTransactionStatusv2(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }

        const result = getTransactionStatusv2Schema.validate(data,{allowUnknown:true})

        if (result.error){
            throw new Error(result.error);
        };

        const encodedReference = encodeURIComponent(result.value.transactionReference);
        const path = '/api/v2/transactions/' + encodedReference;
        return await this.get(path, authToken);
    }



    async getTransactionStatusv1(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }

        const result = getTransactionStatusv1Schema.validate(data,{allowUnknown:true})

        if (result.error){
            throw new Error(result.error);
        };

        const encodedReference = encodeURIComponent(result.value.paymentReference);
        const path = '/api/v2/merchant/transactions/query?paymentReference=' + encodedReference;
        return await this.get(path, authToken);
    }

    async payWithUssd(authToken,data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }

        const result = payWithUSSDSchema.validate(data,{allowUnknown:true})

        if (result.error){
            throw new Error(result.error);
        };

        const path = '/api/v1/merchant/ussd/initialize';
        return await this.post(path, authToken, result.value);
    }



    async payWithBankTransfer(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }

        const result = payWithBankTransferSchema.validate(data,{allowUnknown:true})

        if (result.error){
            throw new Error(result.error);
        };

        const path = '/api/v1/merchant/bank-transfer/init-payment'
        return await this.post(path, authToken, result.value);
    }

    async chargeCard(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }

        const result = chargeCardSchema.validate(data,{allowUnknown:true})

        if (result.error){
            throw new Error(result.error);
        };
        const path = "/api/v1/merchant/cards/charge";

        return await this.post(path, authToken, result.value);
    }

    async authorizeOtp(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }

        const result = authorizeOtpSchema.validate(data,{allowUnknown:true})

        if (result.error){
            throw new Error(result.error);
        };

        const path = "/api/v1/merchant/cards/otp/authorize";
        return await this.post(path, authToken, result.value)

    }


    async ThreeDsSecureAuthTransaction(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }

        const result = ThreeDSAuthTransactionSchema.validate(data,{allowUnknown:true})

        if (result.error){
            throw new Error(result.error);
        };

        const path = '/api/v1/sdk/cards/secure-3d/authorize';
        return await this.post(path, authToken, result.value);
    }

    async cardTokenization(authToken, data) {
        if(arguments.length !== 2){
            throw new Error("Method requires exactly two parameters");
        }

        const result = ThreeDSAuthTransactionSchema.validate(data,{allowUnknown:true})

        if (result.error){
            throw new Error(result.error);
        };

        const path = '/api/v1/merchant/cards/charge-card-token';
        return await this.post(path, authToken, result.value);
    }
}