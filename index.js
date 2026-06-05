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
    constructor(config = {}) {
        if (config.MONNIFY_APIKEY) process.env.MONNIFY_APIKEY = config.MONNIFY_APIKEY;
        if (config.MONNIFY_SECRET) process.env.MONNIFY_SECRET = config.MONNIFY_SECRET;
        if (config.env && !process.env.MONNIFY_ENV) {
            console.warn(
                `[monnify] Passing env in the MonnifyAPI config is deprecated and will be removed in a future version. ` +
                `Add MONNIFY_ENV=${config.env} to your .env file instead.`
            );
            process.env.MONNIFY_ENV = config.env;
        }
        super();

        // ── Collections ──────────────────────────────────────────────────────
        this.reservedAccount = new ReservedAccount();
        this.transaction     = new Transaction();
        this.subAccount      = new SubAccount();
        this.invoice         = new Invoice();
        this.settlement      = new Settlement();
        this.limitProfile    = new LimitProfile();
        this.directDebit     = new DirectDebit();

        // ── Disbursements ────────────────────────────────────────────────────
        this.disbursement    = new Disbursement();
        this.refund          = new TransactionRefund();
        this.wallet          = new Wallet();

        // ── Value-added services ─────────────────────────────────────────────
        this.verification    = new Verification();
        this.billsPayment    = new BillsPayment();
    }
}

// Named re-exports so consumers can tree-shake or import individual classes
export {
    ReservedAccount, Transaction, SubAccount, Invoice,
    Settlement, LimitProfile, DirectDebit, Wallet,
    Disbursement, TransactionRefund, Verification, BillsPayment
};
