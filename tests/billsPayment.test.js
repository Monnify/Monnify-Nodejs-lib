import assert from "assert/strict";
import { BillsPayment } from "../src/valueAddedService/billsPayment.js";
import crypto from "crypto";

let instance, token;
let firstCategoryCode;
let firstBillerCode;
let firstProductCode;

beforeEach(async () => {
    instance = new BillsPayment("SANDBOX");
    token    = await instance.getToken();
});

describe("Bills Payment API Tests", () => {

    describe("getBillerCategories", () => {
        it("should return biller categories successfully", async () => {
            const [rCode, resp] = await instance.getBillerCategories(token[1], { page: 0, size: 10 });
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, "success");

            // Capture a category code for downstream tests
            const categories = resp?.responseBody?.content ?? resp?.responseBody ?? [];
            if (Array.isArray(categories) && categories.length > 0) {
                firstCategoryCode = categories[0].categoryCode ?? categories[0].code;
            }
        });

        it("should return categories with default pagination when no data passed", async () => {
            const [rCode] = await instance.getBillerCategories(token[1]);
            assert.strictEqual(rCode, 200);
        });
    });

    describe("listBillers", () => {
        it("should list all billers", async () => {
            const [rCode, resp] = await instance.listBillers(token[1], { page: 0, size: 10 });
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, "success");

            const billers = resp?.responseBody?.content ?? resp?.responseBody ?? [];
            if (Array.isArray(billers) && billers.length > 0) {
                firstBillerCode = billers[0].billerCode ?? billers[0].code;
            }
        });

        it("should filter billers by category when categoryCode is provided", async () => {
            if (!firstCategoryCode) return; // skip if no category was fetched
            const [rCode] = await instance.listBillers(token[1], {
                page:         0,
                size:         5,
                categoryCode: firstCategoryCode
            });
            assert.ok([200, 400].includes(rCode));
        });
    });

    describe("getBillerProducts", () => {
        it("should return biller products for a valid billerCode", async () => {
            if (!firstBillerCode) return; // skip if no biller was fetched
            const [rCode, resp] = await instance.getBillerProducts(token[1], {
                billerCode: firstBillerCode,
                page:       0,
                size:       5
            });
            assert.ok([200, 400, 404].includes(rCode));
            if (rCode === 200) {
                const products = resp?.responseBody?.content ?? resp?.responseBody ?? [];
                if (Array.isArray(products) && products.length > 0) {
                    firstProductCode = products[0].productCode ?? products[0].code;
                }
            }
        });

        it("should throw when billerCode is missing", async () => {
            await assert.rejects(
                () => instance.getBillerProducts(token[1], { page: 0, size: 5 }),
                /billerCode/
            );
        });
    });

    describe("validateCustomer", () => {
        /**
         * validateCustomer validates a customer identifier (e.g. meter number, smart card)
         * before calling vendBill. When vendInstruction.requireValidationRef is true,
         * the returned validationReference must be passed to vendBill.
         */
        it("should call validateCustomer endpoint", async () => {
            if (!firstProductCode) return; // skip if no product was fetched
            const [rCode] = await instance.validateCustomer(token[1], {
                productCode: firstProductCode,
                customerId:  "08130211113"
            });
            // 200 = valid customer; 400/404/422 = customer not found or product not valid
            assert.ok([200, 400, 404, 422].includes(rCode));
        });

        it("should throw when productCode is missing", async () => {
            await assert.rejects(
                () => instance.validateCustomer(token[1], { customerId: "08130211113" }),
                /productCode/
            );
        });

        it("should throw when customerId is missing", async () => {
            await assert.rejects(
                () => instance.validateCustomer(token[1], { productCode: "245" }),
                /customerId/
            );
        });
    });

    describe("vendBill", () => {
        /**
         * vendBill is the actual bill payment step. It requires:
         * - productCode (from getBillerProducts)
         * - customerId  (the customer's identifier, e.g. phone number or meter number)
         * - amount      (the amount to pay)
         * - reference   (unique merchant reference for this transaction)
         * - validationReference (optional — only required when validateCustomer returns requireValidationRef=true)
         *
         * NOTE: vendBill is not called with real data here to avoid live transactions.
         * Tests confirm validation and endpoint reachability only.
         */
        it("should throw when required fields are missing", async () => {
            await assert.rejects(
                () => instance.vendBill(token[1], { productCode: "245" }),
                /customerId|amount|reference/
            );
        });

        it("should throw when reference is missing", async () => {
            await assert.rejects(
                () => instance.vendBill(token[1], {
                    productCode: "245",
                    customerId:  "08130211113",
                    amount:      300
                    // reference omitted
                }),
                /reference/
            );
        });
    });

    describe("requeryBillPayment", () => {
        /**
         * requeryBillPayment re-queries the status of a previously submitted vendBill.
         * Use this when the vendBill response was inconclusive or timed out.
         */
        it("should call requeryBillPayment endpoint", async () => {
            const ref = `REF-${crypto.randomBytes(8).toString("hex")}`;
            const [rCode] = await instance.requeryBillPayment(token[1], { reference: ref });
            // 200 = found; 404 = not found (expected for a fresh random reference)
            assert.ok([200, 400, 404].includes(rCode));
        });

        it("should throw when reference is missing", async () => {
            await assert.rejects(
                () => instance.requeryBillPayment(token[1], {}),
                /reference/
            );
        });
    });

});
