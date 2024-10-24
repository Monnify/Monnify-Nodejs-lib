import assert from "assert/strict";
import { Transaction } from "../src/collections/transaction.js";
import { ReservedAccount } from "../src/collections/reservedAccount.js";
import crypto from 'crypto'

let accountReference
let transactionReference
let instance, inst;
let payload = {"customerName":"Tester","customerEmail":"tester@tester.com",
    "accountName":"tester","amount":2000,"contractCode":"7059707855","bvn": "21212121212"};
let token;


beforeEach(async () =>{
    instance = new Transaction('SANDBOX')
    inst = new ReservedAccount('SANDBOX')
    token = await instance.getToken()
    payload.paymentMethods = ["CARD", "ACCOUNT_TRANSFER"]
    payload.paymentReference = crypto.randomBytes(20).toString('hex')
    payload.paymentDescription = "Payment Attempt"
    payload.redirectUrl = "https://google.com"
})


describe('Assert Access Token Request', ()=>{
    it('confirm that request is successful', async()=>{
        assert.strictEqual(token[0],200);
    })
})


describe('Check Init Transaction Method', ()=>{
    it('confirm that transaction initialisation works', async()=>{
        
        const [rCode,resp] = await instance.initTransaction(token[1],payload)
        transactionReference = resp["responseBody"]["transactionReference"]
        payload.paymentReference = resp["responseBody"]["paymentReference"]
        assert.strictEqual(rCode,200);
        assert.strictEqual(resp.responseMessage,'success')
    })
})


describe('Check Reserved Account Creation', ()=>{
    it('confirm that reserved account creation works', async()=>{
        payload.accountReference = crypto.randomBytes(20).toString('hex')
        const [rCode,resp] = await inst.createReservedAccount(token[1],payload)
        accountReference = resp["responseBody"]["accountReference"]
        assert.strictEqual(rCode,200);
        assert.strictEqual(resp.responseMessage, 'success')
        
    })
})



describe('Check Linked Accounts Addition', () => {
    it('confirm that linked accounts are added successfully', async () => {
        const preferredBanks = ["035"];
        const [rCode, resp] = await inst.addLinkedAccounts(token[1], {"accountReference":accountReference, 
            "preferredBanks":preferredBanks,"getAllAvailableBanks":false});
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});

describe('Check Reserved Account Details', () => {
    it('confirm that reserved account details retrieval works', async () => {
        const [rCode, resp] = await inst.reservedAccountDetails(token[1], {"accountReference":accountReference});
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});


describe('Check Reserved Account Transactions', () => {
    it('confirm that reserved account transactions retrieval works', async () => {
        const [rCode, resp] = await inst.reservedAccountTransactions(token[1], { "page": 0, "size": 10, "accountReference":accountReference });
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});


describe('Check Reserved Account KYC Update', () => {
    it('confirm that reserved account KYC info is updated', async () => {
        const bvn = '22347160689';
        const nin = '23456789012';
        const [rCode, resp] = await inst.updateReservedAccountKycInfo(token[1], {"accountReference":accountReference,"bvn":bvn, "nin":nin});
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});


describe('Check Reserved Account Deallocation', () => {
    it('confirm that reserved account deallocation works', async () => {
        const [rCode, resp] = await inst.deallocateReservedAccount(token[1], {"accountReference":accountReference});
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});


describe('Check Get Transaction Status (v2)', () => {
    it('confirm that transaction status retrieval (v2) works', async () => {
        const [rCode, resp] = await instance.getTransactionStatusv2(token[1], {"transactionReference":transactionReference});
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});

describe('Check Get Transaction Status (v1)', () => {
    it('confirm that transaction status retrieval (v1) works', async () => {
        const paymentReference = '18897cd39f1e14f47aba8ef6f7ec43d197cf312b'
        const [rCode, resp] = await instance.getTransactionStatusv1(token[1], {"paymentReference":paymentReference});
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});

describe('Check Pay with Bank Transfer', () => {
    it('confirm that payment with bank transfer works', async () => {
        const bankCode = '035';
        const [rCode, resp] = await instance.payWithBankTransfer(token[1], {"transactionReference":transactionReference,"bankCode":bankCode });
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});

describe('Check Card Charge', () => {
    it('confirm that card charge works', async () => {
        const collectionChannel = 'API_NOTIFICATION';
        const card = {
            number: '4111111111111111',
            expiryMonth: '10',
            expiryYear: '2022',
            pin: '1234',
            cvv: '123'
        };
        const deviceInformation = {
        "httpBrowserLanguage":"en-US",
        "httpBrowserJavaEnabled":false,
        "httpBrowserJavaScriptEnabled":true,
        "httpBrowserColorDepth":24,
       "httpBrowserScreenHeight":1203,
       "httpBrowserScreenWidth":2138,
      "httpBrowserTimeDifference":"",
      "userAgentBrowserValue":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)     Chrome/105.0.0.0 Safari/537.36"
   }
        const [rCode, resp] = await instance.chargeCard(token[1], {
            "transactionReference":transactionReference, 
            "collectionChannel":collectionChannel,
            "card":card,
            "deviceInformation":deviceInformation
    });
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});