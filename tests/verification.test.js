import assert from "assert/strict";
import { Verification } from "../src/verification.js";
import crypto from 'crypto';

let instance, token;


const payload = {
    accountNumber: "3000246601",
    bankCode: "035",
    bvn: "22222222226",
    dateOfBirth: "27-Apr-1993",
    mobileNo: "08016857829"
};


beforeEach(async () => {
    instance = new Verification('sandbox');
    token = await instance.getToken();
});

describe('Verification Class Tests', () => {

    describe('validateBankAccount', () => {
        it('should validate the bank account successfully', async () => {
            const [statusCode, response] = await instance.validateBankAccount(
                token[1],
                payload.accountNumber,
                payload.bankCode
            );

            assert.strictEqual(statusCode, 200);
            assert.strictEqual(response.responseMessage, 'success');
        });
    });

    // Test the verifyBvnInformation method
    describe('verifyBvnInformation', () => {
        it('should verify BVN information successfully', async () => {
            const [statusCode, response] = await instance.verifyBvnInformation(
                token[1],
                payload.bvn,
                payload.dateOfBirth,
                payload.mobileNo
            );

            assert.strictEqual(statusCode, 200);
            assert.strictEqual(response.responseMessage, 'success');
        });
    });

    // Test the matchBvnAndAccountName method
    describe('matchBvnAndAccountName', () => {
        it('should match BVN and account name successfully', async () => {
            const [statusCode, response] = await instance.matchBvnAndAccountName(
                token[1],
                payload.bankCode,
                payload.accountNumber,
                payload.bvn
            );

            assert.strictEqual(statusCode, 200);
            assert.strictEqual(response.responseMessage, 'success');
        });
    });

});
