import assert from "assert/strict";
import { Verification } from "../src/verification.js";
import crypto from 'crypto';

let instance, token;


const payload = {
    accountNumber: "1234567890",
    bankCode: "011",
    bvn: "12345678901",
    dateOfBirth: "1990-01-01",
    mobileNo: "08012345678"
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

            assert.strictEqual(statusCode, 200); // Ensure the status code is 200
            assert.strictEqual(response.responseMessage, 'success'); // Check if the response message is 'success'
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

            assert.strictEqual(statusCode, 200); // Ensure the status code is 200
            assert.strictEqual(response.responseMessage, 'success'); // Check if the response message is 'success'
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

            assert.strictEqual(statusCode, 200); // Ensure the status code is 200
            assert.strictEqual(response.responseMessage, 'success'); // Check if the response message is 'success'
        });
    });

});
