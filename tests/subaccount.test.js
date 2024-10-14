import assert from "assert/strict";
import { SubAccount } from "../src/subaccount.js";
import crypto from 'crypto';

let subAccount;
let token;
let subAccountPayload;
let subAccountCode = 'MFY_SUB_779463462482';
let defaultSplitPercentage = 20.87
let updatedDefaultSplitPercentage = 60.0
let accountNumber = '6782923573'
let updatedAccountNumber = '8569214283'

beforeEach(async () => {
    subAccount = new SubAccount('sandbox');
    token = await subAccount.getToken();


    subAccountPayload = {
        currencyCode: "NGN",
        bankCode: "035",
        email: "tochukwusage4@gmail.com",
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
            const [rCode, resp] = await subAccount.createSubAccount(
                token[1],
                subAccountPayload.currencyCode,
                subAccountPayload.bankCode,
                accountNumber,
                subAccountPayload.email,
                defaultSplitPercentage
            );
            console.log(resp)
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });

    });

    
    describe('Update SubAccount', () => {
        it('should update a sub-account successfully', async () => {
            const updatedPayload = {
                ...subAccountPayload
            };

            const [rCode, resp] = await subAccount.updateSubAccount(
                token[1],
                subAccountCode,
                updatedPayload.currencyCode,
                updatedPayload.bankCode,
                updatedAccountNumber,
                updatedPayload.email,
                updatedDefaultSplitPercentage
            );
            console.log(resp)
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });
    });
    
    describe('Delete SubAccount', () => {
        it('should delete a sub-account successfully', async () => {
            const [rCode, resp] = await subAccount.deleteSubAccount(token[1], subAccountCode);
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
            console.log(resp.responseMessage);
        });
    });
    

});
