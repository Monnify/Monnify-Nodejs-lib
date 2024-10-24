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
            const [rCode, resp] = await subAccount.createSubAccount(token[1],[subAccountPayload]);
            //console.log(resp)
            subAccountCode = resp["responseBody"][0]["subAccountCode"]
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });

    });


    describe('Update SubAccount', () => {
        it('should update a sub-account successfully', async () => {
            subAccountPayload.subAccountCode = subAccountCode
            const updatedPayload = subAccountPayload

            const [rCode, resp] = await subAccount.updateSubAccount(token[1],updatedPayload);
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });
    });
    
    describe('Delete SubAccount', () => {
        it('should delete a sub-account successfully', async () => {
            const [rCode, resp] = await subAccount.deleteSubAccount(token[1], {"subAccountCode":subAccountCode});
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });
    });
   

});
