/*
 * Monnify API wrapper — main entry point
 * @authors: Tochukwu Nwokolo & Benjamin Ononogbu
 */

import { BaseRequestAPI }   from "./src/base_api.js";
import { ReservedAccount }  from "./src/collections/reservedAccount.js";
import { Transaction }      from "./src/collections/transaction.js";
import { SubAccount }       from "./src/collections/subaccount.js";
import { Invoice }          from "./src/collections/invoice.js";
import { Settlement }       from "./src/collections/settlement.js";
import { LimitProfile }     from "./src/collections/limitProfile.js";
import { DirectDebit }      from "./src/collections/directDebit.js";
import { Wallet }           from "./src/collections/wallet.js";
import { Disbursement }     from "./src/disbursements/disbursement.js";
import { TransactionRefund } from "./src/disbursements/refund.js";
import { Verification }     from "./src/valueAddedService/verification.js";
import { BillsPayment }     from "./src/valueAddedService/billsPayment.js";


export class MonnifyAPI extends BaseRequestAPI {
    constructor(config) {
        process.env.MONNIFY_APIKEY = config.MONNIFY_APIKEY;
        process.env.MONNIFY_SECRET = config.MONNIFY_SECRET;
        super(config.env);

        // ── Collections ──────────────────────────────────────────────────────
        this.reservedAccount = new ReservedAccount(config.env);
        this.transaction     = new Transaction(config.env);
        this.subAccount      = new SubAccount(config.env);
        this.invoice         = new Invoice(config.env);
        this.settlement      = new Settlement(config.env);
        this.limitProfile    = new LimitProfile(config.env);
        this.directDebit     = new DirectDebit(config.env);

        // ── Disbursements ────────────────────────────────────────────────────
        this.disbursement    = new Disbursement(config.env);
        this.refund          = new TransactionRefund(config.env);
        this.wallet          = new Wallet(config.env);

        // ── Value-added services ─────────────────────────────────────────────
        this.verification    = new Verification(config.env);
        this.billsPayment    = new BillsPayment(config.env);
    }
}

// Named re-exports so consumers can tree-shake or import individual classes
export {
    ReservedAccount, Transaction, SubAccount, Invoice,
    Settlement, LimitProfile, DirectDebit, Wallet,
    Disbursement, TransactionRefund, Verification, BillsPayment
};
