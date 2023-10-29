import { BaseRequestAPI } from "./base_api.js";
import crypto from 'crypto'



export class Disbursement extends BaseRequestAPI{
    constructor(env){
        super(env);
    }

    async initiateSingleTransfer(
                                authToken,
                                amount,
                                narration,
                                destinationBankCode,
                                destinationAccountNumber,
                                currency="NGN",
                                reference="",
                                async=false){

        const data = {}
        const path = '/api/v2/disbursements/single';
        reference = reference.length !== 0 ? reference : crypto.randomBytes(20).toString('hex')
        data.amount = amount
        data.narration = narration
        data.destinationAccountNumber = destinationAccountNumber
        data.destinationBankCode = destinationBankCode
        data.currency = currency
        data.reference = reference
        data.sourceAccountNumber = this.sourceAccountNumber
        if (async===true){
            data.async = true
        }
        return await this.post(path,authToken,data);
    }

    async initiateBulkTransfer(
                                authToken,
                                title,
                                narration,
                                transactionList,
                                batchReference='',
                                onValidationFailure='CONTINUE',
                                notificationInterval=25){
        
        const data = {}
        batchReference = batchReference.length !==0 ? batchReference : crypto.randomBytes(20).toString('hex')
        data.title = title
        data.narration = narration
        data.batchReference = batchReference
        data.notificationInterval = notificationInterval
        data.onValidationFailure = onValidationFailure
        data.transactionList = transactionList

        const path = '/api/v2/disbursements/batch';
        data.sourceAccountNumber = this.sourceAccountNumber;
        return await this.post(path,authToken,data);
    }

    async authorizeSingleTransfer(authToken,reference,authorizationCode){

        const data = {}
        data.reference = reference
        data.authorizationCode = authorizationCode

        const path = '/api/v2/disbursements/single/validate-otp';
        return await this.post(path,authToken,data);
    }
    
    async authorizeBulkTransfer(authToken,reference,authorizationCode){

        const data = {}
        data.reference = reference
        data.authorizationCode = authorizationCode

        const path = '/api/v2/disbursements/batch/validate-otp';
        return await this.post(path,authToken,data);
    }

    async resendTransferOTP(authToken, reference){

        const data = {}
        data.reference = reference
        
        const path = '/api/v2/disbursements/single/resend-otp';
        return await this.post(path,authToken,data);
    }

    async getSingleTransferStatus(authToken, reference){
        const encodedReference = encodeURI(reference);
        const path = `/api/v2/disbursements/single/summary?reference=${reference}`;
        return await this.get(path,authToken,data);
    }

    async getBulkTransferStatus(authToken, pageNo=0,pageSize=10){
        const sourceAccountNumber = this.sourceAccountNumber;
        const path = `/api/v2/disbursements/search-transactions?sourceAccountNumber=${sourceAccountNumber}&pageNo=${pageNo}&pageSize=${pageSize}`;
        return await this.get(path,authToken);
    }

    async getAllSingleTransfers(authToken,pageNo=0,pageSize=10){
        const path = `/api/v2/disbursements/single/transactions?pageSize=${pageSize}&pageNo=${pageNo}`;
        return await this.get(path,authToken);
    }

    async getAllSingleTransfers(authToken,pageNo=0,pageSize=10){
        const path = `/api/v2/disbursements/single/transactions?pageSize=${pageSize}&pageNo=${pageNo}`;
        return await this.get(path,authToken);
    }

    async getAllBulkTransfers(authToken,pageNo=0,pageSize=10){
        const path = `/api/v2/disbursements/bulk/transactions?pageNo=${page}&pageSize=${pageSize}`;
        return await this.get(path,authToken);
    }
}