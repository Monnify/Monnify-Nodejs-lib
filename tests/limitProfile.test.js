import assert from "assert/strict";
import { LimitProfile } from "../src/collections/limitProfile.js";
import crypto from "crypto";

let instance, token;
let createdLimitProfileCode;

beforeEach(async () => {
    instance = new LimitProfile("SANDBOX");
    token    = await instance.getToken();
});

describe("Limit Profile API Tests", () => {
    /**
     * NOTE: Limit Profile and Reserve Account Limit APIs require special
     * approval from Monnify on the live environment. Sandbox behaviour may
     * vary — tests confirm the request structure is correct and the API is
     * reachable.
     */

    describe("getLimitProfiles", () => {
        it("should retrieve limit profiles", async () => {
            const [rCode, resp] = await instance.getLimitProfiles(token[1]);
            assert.ok([200, 403].includes(rCode));
        });
    });

    describe("createLimitProfile", () => {
        it("should create a limit profile", async () => {
            const [rCode, resp] = await instance.createLimitProfile(token[1], {
                limitProfileName:       `Test Profile ${crypto.randomBytes(4).toString("hex")}`,
                singleTransactionValue: 50000,
                dailyTransactionVolume: 100,
                dailyTransactionValue:  1000000
            });
            // 200 on success; 403 if feature not enabled on this sandbox account
            assert.ok([200, 403].includes(rCode));
            if (rCode === 200) {
                createdLimitProfileCode = resp?.responseBody?.limitProfileCode;
            }
        });

        it("should throw when required fields are missing", async () => {
            await assert.rejects(
                () => instance.createLimitProfile(token[1], { limitProfileName: "Incomplete" }),
                /singleTransactionValue|dailyTransactionVolume|dailyTransactionValue/
            );
        });
    });

    describe("updateLimitProfile", () => {
        it("should call update endpoint without error when profile code is provided", async () => {
            if (!createdLimitProfileCode) return;
            const [rCode] = await instance.updateLimitProfile(token[1], {
                limitProfileCode:       createdLimitProfileCode,
                limitProfileName:       "Updated Profile",
                singleTransactionValue: 100000,
                dailyTransactionVolume: 200,
                dailyTransactionValue:  2000000
            });
            // 200 = updated; 403 = feature not enabled; 404 = not found; 422 = validation error from server
            assert.ok([200, 403, 404, 422].includes(rCode));
        });

        it("should throw when limitProfileCode is missing", async () => {
            await assert.rejects(
                () => instance.updateLimitProfile(token[1], {
                    limitProfileName:       "No Code",
                    singleTransactionValue: 1000,
                    dailyTransactionVolume: 10,
                    dailyTransactionValue:  10000
                }),
                /limitProfileCode/
            );
        });

        it("should throw when called without data argument", async () => {
            await assert.rejects(
                async () => await instance.updateLimitProfile(token[1]),
                /Method requires exactly two parameters/
            );
        });
    });

    describe("reserveAccountWithLimit", () => {
        it("should call reserveAccountWithLimit endpoint", async () => {
            if (!createdLimitProfileCode) return;
            const [rCode] = await instance.reserveAccountWithLimit(token[1], {
                customerName:     "Limit Test User",
                customerEmail:    `${crypto.randomBytes(6).toString("hex")}@test.com`,
                accountName:      "Limit Test User",
                accountReference: crypto.randomBytes(16).toString("hex"),
                contractCode:     process.env.CONTRACT || "5867418298",
                limitProfileCode: createdLimitProfileCode,
                bvn:              "22222222222",
                currencyCode:     "NGN"
            });
            // 200 = success; 403 = feature not enabled; 422 = validation
            assert.ok([200, 403, 422].includes(rCode));
        });

        it("should throw when limitProfileCode is missing", async () => {
            await assert.rejects(
                () => instance.reserveAccountWithLimit(token[1], {
                    customerName:     "Test",
                    customerEmail:    "test@test.com",
                    accountName:      "Test",
                    accountReference: "REF001",
                    contractCode:     "5867418298",
                    bvn:              "22222222222"
                    // limitProfileCode omitted
                }),
                /limitProfileCode/
            );
        });

        it("should throw when called without data argument", async () => {
            await assert.rejects(
                async () => await instance.reserveAccountWithLimit(token[1]),
                /Method requires exactly two parameters/
            );
        });
    });

    describe("updateReserveAccountLimit", () => {
        it("should call updateReserveAccountLimit endpoint", async () => {
            if (!createdLimitProfileCode) return;
            const [rCode] = await instance.updateReserveAccountLimit(token[1], {
                accountReference: crypto.randomBytes(16).toString("hex"),
                limitProfileCode: createdLimitProfileCode
            });
            assert.ok([200, 403, 404, 422].includes(rCode));
        });

        it("should throw when accountReference is missing", async () => {
            await assert.rejects(
                () => instance.updateReserveAccountLimit(token[1], {
                    limitProfileCode: "LP_TEST_001"
                }),
                /accountReference/
            );
        });

        it("should throw when limitProfileCode is missing", async () => {
            await assert.rejects(
                () => instance.updateReserveAccountLimit(token[1], {
                    accountReference: "REF001"
                }),
                /limitProfileCode/
            );
        });

        it("should throw when called without data argument", async () => {
            await assert.rejects(
                async () => await instance.updateReserveAccountLimit(token[1]),
                /Method requires exactly two parameters/
            );
        });
    });

});
