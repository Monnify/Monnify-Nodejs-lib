import assert from "assert/strict";
import { SubAccount } from "../src/subaccount.js";
import crypto from 'crypto';

let subAccount;
let token;
let subAccountPayload;
let subAccountCode = 'MFY_SUB_059647088628';

beforeEach(async () => {
    subAccount = new SubAccount('sandbox');
    token = await subAccount.getToken(); 


    subAccountPayload = {
        currencyCode: "NGN",
        bankCode: "035",

        accountNumber: "0016158090",
});

describe('SubAccount API Tests', () => {
    /*
    describe('Create SubAccount', () => {
        it('should create a sub-account successfully', async () => {
            const [rCode, resp] = await subAccount.createSubAccount(
                token[1],
                subAccountPayload.currencyCode,
                subAccountPayload.bankCode,
                subAccountPayload.accountNumber,
                subAccountPayload.email,
                subAccountPayload.defaultSplitPercentage
            );
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });

    });
    /*
    describe('Update SubAccount', () => {
        it('should update a sub-account successfully', async () => {
            const updatedPayload = {
                ...subAccountPayload,
                defaultSplitPercentage: 60.0
            };

            const [rCode, resp] = await subAccount.updateSubAccount(
                token[1],
                subAccountCode,
                updatedPayload.currencyCode,
                updatedPayload.bankCode,
                updatedPayload.accountNumber,
                updatedPayload.email,
                updatedPayload.defaultSplitPercentage
            );
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });
    });
tochukwu-working-branch
    
    describe('Delete SubAccount', () => {
        it('should delete a sub-account successfully', async () => {
            const [rCode, resp] = await subAccount.deleteSubAccount(token[1], subAccountCode);
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
            console.log(resp.responseMessage);
        });
tochukwu-working-branch
    });*/
    });


});
