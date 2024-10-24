/*
Monnify API wrapper
@authors: Tochukwu Nwokolo & Benjamin Ononogbu
*/
import { BaseRequestAPI } from "./src/base_api.js";
import { ReservedAccount } from './src/collections/reservedAccount.js';
import { Transaction } from "./src/collections/transaction.js";
import { Disbursement } from './src/disbursements/disbursement.js';
import { TransactionRefund } from './src/disbursements/refund.js';
import { SubAccount } from './src/collections/subaccount.js';
import { Verification } from './src/valueAddedService/verification.js';


export class MonnifyAPI extends BaseRequestAPI {
    constructor(config) {
        process.env.MONNIFY_APIKEY = config.MONNIFY_APIKEY
        process.env.MONNIFY_SECRET = config.MONNIFY_SECRET
        super(config.env);
        this.disbursement = new Disbursement(config.env);
        this.subAccount = new SubAccount(config.env);
        this.verification = new Verification(config.env);
        this.refund = new TransactionRefund(config.env);
        this.reservedAccount = new ReservedAccount(config.env);
        this.transaction = new Transaction(config.env);
    }
}


