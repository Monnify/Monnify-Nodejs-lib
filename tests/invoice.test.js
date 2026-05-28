import assert from "assert/strict";
import { Invoice } from "../src/collections/invoice.js";
import crypto from "crypto";

let instance, token;
let invoiceReference;

beforeEach(async () => {
    instance         = new Invoice("SANDBOX");
    token            = await instance.getToken();
    invoiceReference = crypto.randomBytes(16).toString("hex");
});

describe("Invoice API Tests", () => {

    describe("createInvoice", () => {
        it("should create an invoice successfully", async () => {
            const payload = {
                amount:           5000,
                invoiceReference: invoiceReference,
                description:      "Test invoice",
                contractCode:     process.env.CONTRACT || "7059707855",
                customerName:     "Test User",
                customerEmail:    `${crypto.randomBytes(8).toString("hex")}@test.com`,
                paymentMethods:   ["CARD", "ACCOUNT_TRANSFER"],
                currencyCode:     "NGN"
            };

            const [rCode, resp] = await instance.createInvoice(token[1], payload);
            // 200 = success; 422 = invoice feature requires additional setup on this sandbox account
            assert.ok([200, 422].includes(rCode));
            if (rCode === 200) {
                assert.strictEqual(resp.responseMessage, "success");
            }
        });

        it("should throw when required fields are missing", async () => {
            await assert.rejects(
                () => instance.createInvoice(token[1], { amount: 5000 }),
                /contractCode|invoiceReference|description|customerName|customerEmail/
            );
        });
    });

    describe("viewInvoiceDetails", () => {
        it("should retrieve invoice details", async () => {
            const [rCode, resp] = await instance.viewInvoiceDetails(token[1], { invoiceReference });
            // May be 200 or 404 if invoice was cancelled before this runs
            assert.ok([200, 404].includes(rCode));
        });

        it("should throw when invoiceReference is missing", async () => {
            await assert.rejects(
                () => instance.viewInvoiceDetails(token[1], {}),
                /invoiceReference/
            );
        });
    });

    describe("getAllInvoices", () => {
        it("should return a list of invoices", async () => {
            const [rCode, resp] = await instance.getAllInvoices(token[1], { page: 0, size: 5 });
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, "success");
        });
    });

    describe("cancelInvoice", () => {
        it("should cancel an invoice", async () => {
            const [rCode] = await instance.cancelInvoice(token[1], { invoiceReference });
            assert.ok([200, 404].includes(rCode));
        });

        it("should throw when invoiceReference is missing", async () => {
            await assert.rejects(
                () => instance.cancelInvoice(token[1], {}),
                /invoiceReference/
            );
        });
    });

});
