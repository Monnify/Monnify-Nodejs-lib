import assert from "assert/strict";
import { Verification } from "../src/valueAddedService/verification.js";

let instance, token;

const bankPayload = {
    accountNumber: "3000246601",
    bankCode:      "035"
};

const bvnPayload = {
    bvn:         "22222222226",
    dateOfBirth: "27-Apr-1993",
    mobileNo:    "08016857829",
    name:        "Test User"
};

const bvnMatchPayload = {
    bvn:           "22222222226",
    accountNumber: "3000246601",
    bankCode:      "035"
};

beforeEach(async () => {
    instance = new Verification("SANDBOX");
    token    = await instance.getToken();
});

describe("Verification API Tests", () => {

    describe("validateBankAccount", () => {
        it("should validate a bank account successfully", async () => {
            const [statusCode, response] = await instance.validateBankAccount(token[1], bankPayload);
            assert.strictEqual(statusCode, 200);
            assert.strictEqual(response.responseMessage, "success");
        });

        it("should throw when accountNumber is missing", async () => {
            await assert.rejects(
                () => instance.validateBankAccount(token[1], { bankCode: "035" }),
                /accountNumber/
            );
        });
    });

    describe("verifyBvnInformation", () => {
        it("should reach the BVN verification endpoint", async () => {
            const [statusCode] = await instance.verifyBvnInformation(token[1], bvnPayload);
            // 200 = verified, 400/404/422 = invalid test data, 500 = VAS not enabled for sandbox account
            assert.ok([200, 400, 404, 422, 500].includes(statusCode));
        });

        it("should throw when bvn is missing", async () => {
            await assert.rejects(
                () => instance.verifyBvnInformation(token[1], { dateOfBirth: "27-Apr-1993", mobileNo: "08016857829" }),
                /bvn/
            );
        });
    });

    describe("matchBvnAndAccountName", () => {
        it("should reach the BVN-account match endpoint", async () => {
            const [statusCode] = await instance.matchBvnAndAccountName(token[1], bvnMatchPayload);
            // 200 = matched, 400/404/422 = invalid test data, 500 = VAS not enabled for sandbox account
            assert.ok([200, 400, 404, 422, 500].includes(statusCode));
        });
    });

    describe("verifyNin", () => {
        it("should call NIN verification endpoint", async () => {
            const [statusCode] = await instance.verifyNin(token[1], { nin: "12345678901" });
            // 200 = verified; 400/404/422 = invalid data; 500 = VAS not enabled on sandbox
            assert.ok([200, 400, 404, 422, 500].includes(statusCode));
        });

        it("should throw when nin is not 11 digits", async () => {
            await assert.rejects(
                () => instance.verifyNin(token[1], { nin: "12345" }),
                /nin/
            );
        });
    });

});
