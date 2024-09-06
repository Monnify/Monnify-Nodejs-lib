/*
Monnify API wrapper
@authors: Tochukwu Nwokolo & Benjamin Ononogbu
*/
import { BaseRequestAPI } from "./src/base_api.js";
import { ReservedAccount, Transaction } from './src/collection.js';
import { Disbursement } from './src/disbursement.js';
import { TransactionRefund } from './src/refund.js';
import { SubAccount } from './src/subaccount.js';
import { Verification } from './src/verification.js';


export class MonnifyAPI extends BaseRequestAPI {
    constructor(env) {
        super(env);
        this.disbursement = new Disbursement(env);
        this.subAccount = new SubAccount(env);
        this.verification = new Verification(env);
        this.refund = new TransactionRefund(env);
        this.reservedAccount = new ReservedAccount(env);
        this.transaction = new Transaction(env);
    }
}
