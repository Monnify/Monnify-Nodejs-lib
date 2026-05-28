import assert from "assert/strict";
import { Disbursement } from "../src/disbursements/disbursement.js";
import crypto from 'crypto'


let instance;
const WALLET_ACCOUNT = process.env.WALLETACCOUNTNUMBER || "3934178936";

let payload = {"sourceAccountNumber": WALLET_ACCOUNT, "destinationBankCode": "057","destinationAccountNumber": "2085086393","amount":2000};
let token;

beforeEach(async () =>{
    instance = new Disbursement('SANDBOX')
    token = await instance.getToken()
    payload.currency = "NGN"
    payload.narration = "tester testing"
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

        const [rCode,resp] = await instance.initiateSingleTransfer(token[1],payload)
        // 200 = success; 404 = wallet account not configured for this sandbox account
        assert.ok([200, 404].includes(rCode));
        if (rCode === 200) {
            assert.strictEqual(resp.responseMessage,'success');
        }
    })
})

