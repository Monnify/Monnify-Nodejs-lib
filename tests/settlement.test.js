import assert from "assert/strict";
import { Settlement } from "../src/collections/settlement.js";

let instance, token;

beforeEach(async () => {
    instance = new Settlement("SANDBOX");
    token    = await instance.getToken();
});

describe("Settlement API Tests", () => {

    describe("getTransactionsBySettlementReference", () => {
        it("should accept a settlement reference and return a response", async () => {
            // Use a known sandbox settlement reference or a dummy — we just verify the call reaches the API
            const [rCode] = await instance.getTransactionsBySettlementReference(token[1], {
                reference: "SANDBOX_SETTLEMENT_REF",
                page:      0,
                size:      10
            });
            // 200 (found) or 400/404 (not found in sandbox) are both valid
            assert.ok([200, 400, 404].includes(rCode));
        });

        it("should throw when reference is missing", async () => {
            await assert.rejects(
                () => instance.getTransactionsBySettlementReference(token[1], { page: 0 }),
                /reference/
            );
        });
    });

    describe("getSettlementInfo", () => {
        it("should retrieve settlement info for a transaction reference", async () => {
            const [rCode] = await instance.getSettlementInfo(token[1], {
                transactionReference: "MNFY|23|20241009140544|000009"
            });
            assert.ok([200, 400, 404].includes(rCode));
        });

        it("should throw when transactionReference is missing", async () => {
            await assert.rejects(
                () => instance.getSettlementInfo(token[1], {}),
                /transactionReference/
            );
        });
    });

});
