import assert from "assert/strict";
import { Transaction } from "../src/collection.js";
import { ReservedAccount } from "../src/collection.js";
import crypto from 'crypto'


let instance, inst;
let payload = {"customerName":"Tester","customerEmail":"tester@tester.com","accountName":"tester","amount":2000};
let token;


beforeEach(async () =>{
    instance = new Transaction('sandbox')
    inst = new ReservedAccount('sandbox')
    token = await instance.getToken()
    payload.currencyCode = "NGN"
    payload.paymentMethods = []
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
        assert.strictEqual(rCode,200);
        assert.strictEqual(resp.responseMessage, 'success')
        
    })
})

