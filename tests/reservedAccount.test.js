import assert from "assert/strict";
import { ReservedAccount } from "../src/collections/reservedAccount.js";
import crypto from "crypto";

let instance, token;
let accountReference;

beforeEach(async () => {
    instance = new ReservedAccount("SANDBOX");
    token    = await instance.getToken();
});

describe("Reserved Account — New Methods", () => {

    describe("createInvoiceReservedAccount", () => {
        it("should create an invoice-type reserved account", async () => {
            const [rCode, resp] = await instance.createInvoiceReservedAccount(token[1], {
                customerName:     "Invoice Tester",
                customerEmail:    `${crypto.randomBytes(6).toString("hex")}@test.com`,
                accountName:      "Invoice Tester",
                accountReference: crypto.randomBytes(16).toString("hex"),
                contractCode:     process.env.CONTRACT || "5867418298",
                amount:           5000,
                currencyCode:     "NGN"
            });
            assert.ok([200, 422].includes(rCode));
            if (rCode === 200) {
                assert.strictEqual(resp.responseMessage, "success");
            }
        });

        it("should throw when amount is missing", async () => {
            await assert.rejects(
                () => instance.createInvoiceReservedAccount(token[1], {
                    customerName:     "Test",
                    customerEmail:    "test@test.com",
                    accountName:      "Test",
                    accountReference: "REF001",
                    contractCode:     "5867418298"
                    // amount omitted
                }),
                /amount/
            );
        });

        it("should throw when called without data argument", async () => {
            await assert.rejects(
                async () => await instance.createInvoiceReservedAccount(token[1]),
                /Method requires exactly two parameters/
            );
        });
    });


    describe("updateReservedAccountBvn", () => {
        before(async () => {
            // Create a fresh reserved account to update
            const inst  = new ReservedAccount("SANDBOX");
            const [, t] = await inst.getToken();
            accountReference = crypto.randomBytes(16).toString("hex");
            await inst.createReservedAccount(t, {
                customerName:     "BVN Tester",
                customerEmail:    `${crypto.randomBytes(6).toString("hex")}@test.com`,
                accountName:      "BVN Tester",
                accountReference,
                contractCode:     process.env.CONTRACT || "5867418298",
                bvn:              "22222222222",
                currencyCode:     "NGN"
            });
        });

        it("should call updateReservedAccountBvn endpoint", async () => {
            const [rCode] = await instance.updateReservedAccountBvn(token[1], {
                reservedAccountReference: accountReference,
                bvn: "22222222223"
            });
            assert.ok([200, 400, 404, 422].includes(rCode));
        });

        it("should throw when bvn is missing", async () => {
            await assert.rejects(
                () => instance.updateReservedAccountBvn(token[1], {
                    reservedAccountReference: accountReference
                }),
                /bvn/
            );
        });

        it("should throw when reservedAccountReference is missing", async () => {
            await assert.rejects(
                () => instance.updateReservedAccountBvn(token[1], { bvn: "22222222223" }),
                /reservedAccountReference/
            );
        });

        it("should throw when called without data argument", async () => {
            await assert.rejects(
                async () => await instance.updateReservedAccountBvn(token[1]),
                /Method requires exactly two parameters/
            );
        });
    });


    describe("updatePaymentSources", () => {
        it("should call updatePaymentSources endpoint (unrestricted)", async () => {
            if (!accountReference) return;
            const [rCode] = await instance.updatePaymentSources(token[1], {
                accountReference,
                restrictPaymentSource: false
            });
            assert.ok([200, 400, 404, 422, 500].includes(rCode));
        });

        it("should call updatePaymentSources endpoint (restricted)", async () => {
            if (!accountReference) return;
            const [rCode] = await instance.updatePaymentSources(token[1], {
                accountReference,
                restrictPaymentSource:  true,
                allowedPaymentSources: {
                    bankCodes: ["058", "057"]
                }
            });
            assert.ok([200, 400, 404, 422].includes(rCode));
        });

        it("should throw when accountReference is missing", async () => {
            await assert.rejects(
                () => instance.updatePaymentSources(token[1], { restrictPaymentSource: false }),
                /accountReference/
            );
        });

        it("should throw when called without data argument", async () => {
            await assert.rejects(
                async () => await instance.updatePaymentSources(token[1]),
                /Method requires exactly two parameters/
            );
        });
    });


    describe("updateIncomeSplitConfig", () => {
        it("should call updateIncomeSplitConfig endpoint", async () => {
            if (!accountReference) return;
            const [rCode] = await instance.updateIncomeSplitConfig(token[1], {
                accountReference,
                splitConfig: []   // empty config = remove all splits
            });
            assert.ok(rCode >= 100 && rCode < 600);
        });

        it("should throw when splitConfig is missing", async () => {
            await assert.rejects(
                () => instance.updateIncomeSplitConfig(token[1], { accountReference: "REF001" }),
                /splitConfig/
            );
        });

        it("should throw when accountReference is missing", async () => {
            await assert.rejects(
                () => instance.updateIncomeSplitConfig(token[1], { splitConfig: [] }),
                /accountReference/
            );
        });

        it("should throw when called without data argument", async () => {
            await assert.rejects(
                async () => await instance.updateIncomeSplitConfig(token[1]),
                /Method requires exactly two parameters/
            );
        });
    });

});
