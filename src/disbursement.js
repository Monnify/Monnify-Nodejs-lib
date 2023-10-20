import { BaseRequestAPI } from "./base_api.js";



export class Disbursement extends BaseRequestAPI{
    constructor(env){
        super(env);
    }

    async initiateSingleTransfer(authToken, data, async=false){
        const path = '/api/v2/disbursements/single';
        data.sourceAccountNumber = this.sourceAccountNumber;
        if (async===true){
            data.async = true
        }
        return await this.post(path,authToken,data);
    }

    async initiateBulkTransfer(authToken, data){
        const path = '/api/v2/disbursements/batch';
        data.sourceAccountNumber = this.sourceAccountNumber;
        return await this.post(path,authToken,data);
    }

    async authorizeSingleTransfer(authToken, data){
        const path = '/api/v2/disbursements/single/validate-otp';
        return await this.post(path,authToken,data);
    }
    
    async authorizeBulkTransfer(authToken, data){
        const path = '/api/v2/disbursements/batch/validate-otp';
        return await this.post(path,authToken,data);
    }

    async resendTransferOTP(authToken, data){
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