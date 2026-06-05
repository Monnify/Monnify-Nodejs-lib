import assert from "assert/strict";
import crypto from "crypto";
import { MonnifyAPI } from "../index.js";

/**
 * Tests for the unified MonnifyAPI entry point (index.js).
 * These are synchronous — no network calls needed.
 */
describe("MonnifyAPI — unified entry point", () => {

    let monnify;

    before(() => {
        monnify = new MonnifyAPI({
            MONNIFY_APIKEY: process.env.MONNIFY_APIKEY || "MK_TEST_GC3B8XG2XX",
            MONNIFY_SECRET: process.env.MONNIFY_SECRET || "A663NRZA544DDPEM7KDN7Z8HRV6YXD8S",
        });
    });

    it("should expose all 12 service modules on a single instance", () => {
        // Collections
        assert.ok(monnify.transaction,     "transaction module missing");
        assert.ok(monnify.reservedAccount, "reservedAccount module missing");
        assert.ok(monnify.subAccount,      "subAccount module missing");
        assert.ok(monnify.invoice,         "invoice module missing");
        assert.ok(monnify.settlement,      "settlement module missing");
        assert.ok(monnify.limitProfile,    "limitProfile module missing");
        assert.ok(monnify.directDebit,     "directDebit module missing");
        // Disbursements
        assert.ok(monnify.disbursement,    "disbursement module missing");
        assert.ok(monnify.refund,          "refund module missing");
        assert.ok(monnify.wallet,          "wallet module missing");
        // Value-added services
        assert.ok(monnify.verification,    "verification module missing");
        assert.ok(monnify.billsPayment,    "billsPayment module missing");
    });

    it("should set SANDBOX environment on every module", () => {
        assert.strictEqual(monnify.environment,                "SANDBOX");
        assert.strictEqual(monnify.transaction.environment,    "SANDBOX");
        assert.strictEqual(monnify.reservedAccount.environment,"SANDBOX");
        assert.strictEqual(monnify.disbursement.environment,   "SANDBOX");
        assert.strictEqual(monnify.billsPayment.environment,   "SANDBOX");
    });

    it("should expose the correct baseUrl for SANDBOX", () => {
        assert.strictEqual(monnify.baseUrl, "https://sandbox.monnify.com");
    });

    describe("computeTransactionHash", () => {
        const SECRET = process.env.MONNIFY_SECRET || "A663NRZA544DDPEM7KDN7Z8HRV6YXD8S";

        it("should return true when signature matches the payload", async () => {
            const payload = { amount: 5000, transactionReference: "MNFY|TEST|001" };
            const sig = crypto.createHmac("sha512", SECRET)
                .update(JSON.stringify(payload))
                .digest("hex");
            const result = await monnify.transaction.computeTransactionHash(payload, sig);
            assert.strictEqual(result, true);
        });

        it("should return false when signature does not match", async () => {
            const result = await monnify.transaction.computeTransactionHash(
                { amount: 5000 },
                "incorrect_signature_value"
            );
            assert.strictEqual(result, false);
        });
    });
});
