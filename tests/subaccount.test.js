import assert from "assert/strict";
import { SubAccount } from "../src/collections/subaccount.js";

let subAccount;
let token;
let subAccountPayload;
let subAccountCode
let defaultSplitPercentage = 20.87
let updatedDefaultSplitPercentage = 60.0
let accountNumber = '8569214283'

beforeEach(async () => {
    subAccount = new SubAccount('SANDBOX');
    token = await subAccount.getToken();


    subAccountPayload = {
        "currencyCode": "NGN",
        "bankCode": "057",
        "accountNumber":"2085886393",
        "email": "tochukwusage4@gmail.com",
        "defaultSplitPercentage": defaultSplitPercentage
    };
});

describe('SubAccount API Tests', () => {

    describe('Get SubAccounts', () => {
        it('should retrieve sub-accounts successfully', async () => {
            const [rCode, resp] = await subAccount.getSubAccounts(token[1]);
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });
    });
   
    describe('Create SubAccount', () => {
        it('should create a sub-account successfully', async () => {
            // Remove any leftover account from a previous CI run to ensure idempotency
            const [listCode, listResp] = await subAccount.getSubAccounts(token[1]);
            if (listCode === 200 && Array.isArray(listResp?.responseBody)) {
                const existing = listResp.responseBody.find(
                    a => a.accountNumber === subAccountPayload.accountNumber
                );
                if (existing?.subAccountCode) {
                    await subAccount.deleteSubAccount(token[1], { subAccountCode: existing.subAccountCode });
                }
            }

            const [rCode, resp] = await subAccount.createSubAccount(token[1],[subAccountPayload]);
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
            subAccountCode = resp["responseBody"][0]["subAccountCode"];
        });

    });


    describe('Update SubAccount', () => {
        it('should update a sub-account successfully', async () => {
            assert.ok(subAccountCode, 'subAccountCode not set — Create SubAccount test must pass first');
            subAccountPayload.subAccountCode = subAccountCode;
            const updatedPayload = subAccountPayload;

            const [rCode, resp] = await subAccount.updateSubAccount(token[1],updatedPayload);
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });

        it('should throw when called without data argument', async () => {
            await assert.rejects(
                async () => await subAccount.updateSubAccount(token[1]),
                /Method requires exactly two parameters/
            );
        });

        it('should throw when required fields are missing', async () => {
            await assert.rejects(
                async () => await subAccount.updateSubAccount(token[1], { bankCode: '058' }),
                /is required/
            );
        });
    });

    describe('Delete SubAccount', () => {
        it('should delete a sub-account successfully', async () => {
            assert.ok(subAccountCode, 'subAccountCode not set — Create SubAccount test must pass first');
            const [rCode, resp] = await subAccount.deleteSubAccount(token[1], {"subAccountCode":subAccountCode});
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });

        it('should throw when called without data argument', async () => {
            await assert.rejects(
                async () => await subAccount.deleteSubAccount(token[1]),
                /Method requires exactly two parameters/
            );
        });

        it('should throw when subAccountCode is missing', async () => {
            await assert.rejects(
                async () => await subAccount.deleteSubAccount(token[1], {}),
                /subAccountCode/
            );
        });
    });
   

});
