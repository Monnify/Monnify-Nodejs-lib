import assert from "assert/strict";
import { BaseRequestAPI } from "../src/base_api.js";


let instance

beforeEach(async () =>{
    instance = new BaseRequestAPI('sandbox')
})


describe('Check Environment', ()=>{
    it('confirm that the environment is set', async()=>{
        assert.strictEqual(instance.baseUrl,'https://sandbox.monnify.com');
        assert.notStrictEqual(instance.baseUrl,'https://api.monnify.com');
    })
})


describe('Assert Access Token Request', ()=>{
    it('confirm that request is successful', async()=>{
        const [code,token] = await instance.getToken()
        assert.strictEqual(code,200);
        assert.strictEqual(token.responseMessage,'success')
    })
})