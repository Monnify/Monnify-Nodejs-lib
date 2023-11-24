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
                                {
                                currency="NGN",
                                reference="",
                                async=false}={}){

        const data = {}
        const path = '/api/v2/disbursements/single';
        data.amount = amount
        data.narration = narration
        data.destinationAccountNumber = destinationAccountNumber
        data.destinationBankCode = destinationBankCode
        data.currency = currency
        data.sourceAccountNumber = this.sourceAccountNumber

        if(arguments.length <=5){
            data.reference = crypto.randomBytes(20).toString('hex')
            data.currency = 'NGN'
            return await this.post(path,authToken,data);
        }

        reference = reference.length !== 0 ? reference : crypto.randomBytes(20).toString('hex')
        data.reference = reference
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
                                {
                                batchReference='',
                                onValidationFailure='CONTINUE',
                                notificationInterval=25}={}){
        
        const data = {}
        data.title = title
        data.narration = narration
        data.transactionList = transactionList
        const path = '/api/v2/disbursements/batch';

        if(arguments.length <=4){
            data.batchReference = crypto.randomBytes(20).toString('hex')
            data.currency = 'NGN'
            data.onValidationFailure = 'CONTINUE'
            data.notificationInterval=25
            return await this.post(path,authToken,data);
        }

        data.onValidationFailure = onValidationFailure
        data.notificationInterval = notificationInterval
        batchReference = batchReference.length !==0 ? batchReference : crypto.randomBytes(20).toString('hex')
        data.batchReference = batchReference
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
        const path = `/api/v2/disbursements/single/summary?reference=${encodedReference}`;
        return await this.get(path,authToken,data);
    }

    async getBulkTransferStatus(authToken, pageNo=0,pageSize=10){
        const sourceAccountNumber = this.sourceAccountNumber;
        const path = `/api/v2/disbursements/search-transactions?sourceAccountNumber=${sourceAccountNumber}&pageNo=${pageNo}&pageSize=${pageSize}`;
        return await this.get(path,authToken);
    }

    async getAllSingleTransfers(authToken,{pageNo=0,pageSize=10}={}){
        if(arguments.length<=1){
            const path = '/api/v2/disbursements/single/transactions?pageSize=10&pageNo=0';
            return await this.get(path,authToken);
        }
        const path = `/api/v2/disbursements/single/transactions?pageSize=${pageSize}&pageNo=${pageNo}`;
        return await this.get(path,authToken);
    }

    async getAllBulkTransfers(authToken,{pageNo=0,pageSize=10}={}){
        if(arguments.length<=1){
            const path = '/api/v2/disbursements/bulk/transactions?pageNo=0&pageSize=10';
            return await this.get(path,authToken);
        }
        const path = `/api/v2/disbursements/bulk/transactions?pageNo=${pageNo}&pageSize=${pageSize}`;
        return await this.get(path,authToken);
    }
}