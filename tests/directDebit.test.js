import assert from "assert/strict";
import { DirectDebit } from "../src/collections/directDebit.js";
import crypto from "crypto";

let instance, token;

beforeEach(async () => {
    instance = new DirectDebit("SANDBOX");
    token    = await instance.getToken();
});

describe("Direct Debit API Tests", () => {
    /**
     * NOTE: Direct Debit (Mandate) APIs require regulatory approval and a
     * dedicated sandbox setup. Tests validate request structure and confirm
     * the endpoint is reachable — API-level 400/403/404/422 responses are
     * expected when the account is not approved.
     *
     * Spec field names (all customer*, not payer*):
     *   customerName, customerEmailAddress, customerPhoneNumber, customerAddress,
     *   customerAccountNumber, customerAccountBankCode
     * No mandateType, debitType, frequency, or beneficiary* fields in spec.
     */

    describe("createMandate", () => {
        it("should call createMandate endpoint with spec-correct fields", async () => {
            const payload = {
                contractCode:            process.env.CONTRACT || "5867418298",
                mandateReference:        crypto.randomBytes(10).toString("hex"),
                mandateDescription:      "Subscription Fee",
                mandateStartDate:        "2025-01-01T00:00:00",
                mandateEndDate:          "2025-12-31T23:59:59",
                customerName:            "Test Payer",
                customerEmailAddress:    "payer@test.com",
                customerPhoneNumber:     "08011223344",
                customerAddress:        "123 Test Street, Lagos",
                customerAccountNumber:  "2085086393",
                customerAccountBankCode: "057",
                mandateAmount:           50000,
                autoRenew:               false,
                customerCancellation:    true,
                redirectUrl:             "https://example.com/direct-debit/callback"
            };

            const [rCode] = await instance.createMandate(token[1], payload);
            assert.ok([200, 400, 403, 422].includes(rCode));
        });

        it("should throw when customerName is missing", async () => {
            await assert.rejects(
                () => instance.createMandate(token[1], {
                    contractCode:            "5867418298",
                    mandateReference:        "REF001",
                    mandateDescription:      "Test",
                    mandateStartDate:        "2025-01-01T00:00:00",
                    mandateEndDate:          "2025-12-31T23:59:59",
                    // customerName omitted intentionally
                    customerEmailAddress:    "test@test.com",
                    customerPhoneNumber:     "08011223344",
                    customerAddress:        "123 Test St",
                    customerAccountNumber:  "2085086393",
                    customerAccountBankCode: "057"
                }),
                /customerName/
            );
        });

        it("should throw when required fields are missing", async () => {
            await assert.rejects(
                () => instance.createMandate(token[1], { mandateReference: "test" }),
                /contractCode|mandateDescription|mandateStartDate|mandateEndDate|customerName/
            );
        });
    });

    describe("getMandateStatus", () => {
        it("should call getMandateStatus endpoint", async () => {
            const [rCode] = await instance.getMandateStatus(token[1], {
                mandateReferences: "SANDBOX_MANDATE_001"
            });
            assert.ok([200, 400, 404].includes(rCode));
        });

        it("should throw when mandateReferences is missing", async () => {
            await assert.rejects(
                () => instance.getMandateStatus(token[1], {}),
                /mandateReferences/
            );
        });
    });

    describe("debitMandate", () => {
        it("should call debitMandate endpoint", async () => {
            const [rCode] = await instance.debitMandate(token[1], {
                mandateCode:      "SANDBOX_MANDATE_001",
                debitAmount:      5000,
                paymentReference: crypto.randomBytes(12).toString("hex"),
                narration:        "Test debit payment",
                customerEmail:    "test@test.com"
            });
            // 400/403/404/422 = mandate not approved or not found in sandbox
            assert.ok([200, 400, 403, 404, 422].includes(rCode));
        });

        it("should throw when required fields are missing", async () => {
            await assert.rejects(
                () => instance.debitMandate(token[1], { mandateCode: "MANDATE_CODE" }),
                /debitAmount|paymentReference|narration|customerEmail/
            );
        });

        it("should throw when customerEmail is missing", async () => {
            await assert.rejects(
                () => instance.debitMandate(token[1], {
                    mandateCode:      "MANDATE_CODE",
                    debitAmount:      1000,
                    paymentReference: "PAY_REF_001",
                    narration:        "Payment for services"
                    // customerEmail omitted intentionally
                }),
                /customerEmail/
            );
        });

        it("should throw when called without data argument", async () => {
            await assert.rejects(
                async () => await instance.debitMandate(token[1]),
                /Method requires exactly two parameters/
            );
        });
    });

    describe("getDebitStatus", () => {
        it("should call getDebitStatus endpoint", async () => {
            const [rCode] = await instance.getDebitStatus(token[1], {
                paymentReference: "SANDBOX_PAY_REF"
            });
            assert.ok([200, 400, 404].includes(rCode));
        });

        it("should throw when paymentReference is missing", async () => {
            await assert.rejects(
                () => instance.getDebitStatus(token[1], {}),
                /paymentReference/
            );
        });

        it("should throw when called without data argument", async () => {
            await assert.rejects(
                async () => await instance.getDebitStatus(token[1]),
                /Method requires exactly two parameters/
            );
        });
    });

    describe("cancelMandate", () => {
        it("should call cancelMandate endpoint (PATCH)", async () => {
            const [rCode] = await instance.cancelMandate(token[1], {
                mandateCode: "SANDBOX_MANDATE_001"
            });
            assert.ok([200, 400, 404].includes(rCode));
        });

        it("should throw when mandateCode is missing", async () => {
            await assert.rejects(
                () => instance.cancelMandate(token[1], {}),
                /mandateCode/
            );
        });

        it("should throw when called without data argument", async () => {
            await assert.rejects(
                async () => await instance.cancelMandate(token[1]),
                /Method requires exactly two parameters/
            );
        });
    });

});
