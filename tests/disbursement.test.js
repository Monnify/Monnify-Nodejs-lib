import assert from "assert/strict";
import { Disbursement } from "../src/disbursement.js";
import crypto from 'crypto'


let instance;
let payload = {"sourceAccountNumber": "8622792723", "destinationBankCode": "057","destinationAccountNumber": "2085086393","amount":2000};
let token;

beforeEach(async () =>{
    instance = new Disbursement('sandbox')
    token = await instance.getToken()
    payload.currency = "NGN"
    payload.naration = "tester testing"
    payload.reference = crypto.randomBytes(20).toString('hex')
})


describe('Assert Access Token Request', ()=>{
    it('confirm that request is successful', async()=>{
        assert.strictEqual(token[0],200);
        //assert.strictEqual(token[1].responseMessage,'success')
    })
})


describe('Check Init Transfer Method', ()=>{
    it('confirm that single transfer works', async()=>{
        
        const [rCode,resp] = await instance.initiateSingleTransfer(
            token[1],
            payload.amount,
            payload.naration,
            payload.destinationBankCode,
            payload.destinationAccountNumber)
        assert.strictEqual(rCode,200);
        assert.strictEqual(resp.responseMessage,'success')
    })
})

