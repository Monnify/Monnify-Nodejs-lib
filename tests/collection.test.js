import assert from "assert/strict";
import { Transaction } from "../src/collection.js";
import { ReservedAccount } from "../src/collection.js";
import crypto from 'crypto'

let accountReference
let transactionReference
let instance, inst;
let payload = {"customerName":"Tester","customerEmail":"tester@tester.com","accountName":"tester","amount":2000};
let token;


beforeEach(async () =>{
    instance = new Transaction('sandbox')
    inst = new ReservedAccount('sandbox')
    token = await instance.getToken()
    payload.currencyCode = "NGN"
    payload.paymentMethods = ["CARD", "ACCOUNT_TRANSFER"]
    payload.paymentReference = crypto.randomBytes(20).toString('hex')
    payload.paymentDescription = "Payment Attempt"
    payload.redirectUrl = "https://google.com"
})


describe('Assert Access Token Request', ()=>{
    it('confirm that request is successful', async()=>{
        assert.strictEqual(token[0],200);
        //assert.strictEqual(token[1].responseMessage,'success')
    })
})


describe('Check Init Transaction Method', ()=>{
    it('confirm that transaction initialisation works', async()=>{
        
        const [rCode,resp] = await instance.initTransaction(
            token[1],
            payload.amount,
            payload.customerName,
            payload.customerEmail,
            payload.paymentDescription)
        transactionReference = resp["responseBody"]["transactionReference"]
        assert.strictEqual(rCode,200);
        assert.strictEqual(resp.responseMessage,'success')
    })
})


describe('Check Reserved Account Creation', ()=>{
    it('confirm that reserved account creation works', async()=>{
        
        const [rCode,resp] = await inst.createReservedAccount(
            token[1],
            payload.customerName,
            payload.customerEmail,
            payload.accountName)
        accountReference = resp["responseBody"]["accountReference"]
        assert.strictEqual(rCode,200);
        assert.strictEqual(resp.responseMessage, 'success')
        
    })
})


//describe('Check that linked accounts are added successfully')



describe('Check Linked Accounts Addition', () => {
    it('confirm that linked accounts are added successfully', async () => {
        const preferredBanks = ["035"];
        const [rCode, resp] = await inst.addLinkedAccounts(token[1], accountReference, preferredBanks);
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});

describe('Check Reserved Account Details', () => {
    it('confirm that reserved account details retrieval works', async () => {
        //const accountReference = 'test-account-ref'; // use a real account reference
        const [rCode, resp] = await inst.reservedAccountDetails(token[1], accountReference);
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});


describe('Check Reserved Account Transactions', () => {
    it('confirm that reserved account transactions retrieval works', async () => {
        //const accountReference = 'test-account-ref'; // use a real account reference
        const [rCode, resp] = await inst.reservedAccountTransactions(token[1], accountReference, { page: 0, size: 10 });
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});


describe('Check Reserved Account KYC Update', () => {
    it('confirm that reserved account KYC info is updated', async () => {
        const bvn = '22347160689';
        const nin = '23456789012';
        const [rCode, resp] = await inst.updateReservedAccountKycInfo(token[1], accountReference, bvn, nin);
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});

describe('Check Reserved Account Deallocation', () => {
    it('confirm that reserved account deallocation works', async () => {
        //const accountReference = 'test-account-ref'; // use a real account reference
        const [rCode, resp] = await inst.deallocateReservedAccount(token[1], accountReference);
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});


describe('Check Get Transaction Status (v2)', () => {
    it('confirm that transaction status retrieval (v2) works', async () => {
        const [rCode, resp] = await instance.getTransactionStatusv2(token[1], transactionReference);
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});

describe('Check Get Transaction Status (v1)', () => {
    it('confirm that transaction status retrieval (v1) works', async () => {
        const paymentReference = 'test-payment-ref'; // use a real payment reference
        const [rCode, resp] = await instance.getTransactionStatusv1(token[1], paymentReference);
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});

describe('Check Pay with Bank Transfer', () => {
    it('confirm that payment with bank transfer works', async () => {
        //const transactionReference = 'test-transaction-ref'; // use a real transaction reference
        const bankCode = '035'; // example bank code
        const [rCode, resp] = await instance.payWithBankTransfer(token[1], transactionReference, { bankCode });
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});

describe('Check Card Charge', () => {
    it('confirm that card charge works', async () => {
        const collectionChannel = 'API_NOTIFICATION';
        const cardDetails = {
            number: '4111111111111111', // example card number
            expiryMonth: '10',
            expiryYear: '2022',
            pin: '1234',
            cvv: '123'
        };
        const [rCode, resp] = await instance.chargeCard(token[1], transactionReference, collectionChannel, cardDetails);
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});
