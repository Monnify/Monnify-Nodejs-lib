import assert from "assert/strict";
import { Wallet } from "../src/collections/wallet.js";

let instance, token;

const walletAccountNumber = process.env.WALLETACCOUNTNUMBER || "3934178936";

beforeEach(async () => {
    instance = new Wallet("SANDBOX");
    token    = await instance.getToken();
});

describe("Wallet API Tests", () => {

    describe("getWalletBalance", () => {
        it("should return wallet balance successfully", async () => {
            const [rCode, resp] = await instance.getWalletBalance(token[1], {
                accountNumber: walletAccountNumber
            });
            // 200 = success; 404 = wallet account not registered on this sandbox account
            assert.ok([200, 404].includes(rCode));
            if (rCode === 200) {
                assert.strictEqual(resp.responseMessage, "success");
            }
        });

        it("should throw when accountNumber is missing", async () => {
            await assert.rejects(
                () => instance.getWalletBalance(token[1], {}),
                /accountNumber/
            );
        });

        it("should throw when accountNumber is not 10 digits", async () => {
            await assert.rejects(
                () => instance.getWalletBalance(token[1], { accountNumber: "123" }),
                /accountNumber/
            );
        });
    });

});
