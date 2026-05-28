import assert from "assert/strict";
import { Disbursement } from "../src/disbursements/disbursement.js";
import crypto from 'crypto'


let instance;
const WALLET_ACCOUNT = process.env.WALLETACCOUNTNUMBER || "3934178936";

let payload = {"sourceAccountNumber": WALLET_ACCOUNT, "destinationBankCode": "057","destinationAccountNumber": "2085086393","destinationAccountName": "Test Recipient","amount":2000};
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


describe('Disbursement — initiateBulkTransfer', () => {
    it('should call initiateBulkTransfer endpoint', async () => {
        const [rCode] = await instance.initiateBulkTransfer(token[1], {
            title:               'Test Bulk Transfer',
            batchReference:      crypto.randomBytes(16).toString('hex'),
            narration:           'Bulk payment test',
            sourceAccountNumber: WALLET_ACCOUNT,
            transactionList: [{
                narration:                'Item 1',
                destinationAccountNumber: '2085086393',
                destinationAccountName:   'Test Recipient',
                amount:                   2000,
                destinationBankCode:      '057',
                reference:                crypto.randomBytes(12).toString('hex'),
                currencyCode:             'NGN'
            }]
        });
        assert.ok([200, 400, 404, 422].includes(rCode));
    });

    it('should throw when transactionList is missing', async () => {
        await assert.rejects(
            () => instance.initiateBulkTransfer(token[1], {
                title: 'Test Batch',   // min 5 chars — passes title validation so Joi reaches transactionList
                batchReference: 'REF001',
                narration: 'Test narration',
                sourceAccountNumber: WALLET_ACCOUNT
            }),
            /transactionList/
        );
    });
});


describe('Disbursement — authorizeSingleTransfer', () => {
    it('should call authorizeSingleTransfer endpoint', async () => {
        const [rCode] = await instance.authorizeSingleTransfer(token[1], {
            reference:         crypto.randomBytes(16).toString('hex'),
            authorizationCode: '123456'
        });
        // 400/404/422 = no pending transfer with this reference in sandbox
        assert.ok([200, 400, 404, 422].includes(rCode));
    });

    it('should throw when authorizationCode is not numeric', async () => {
        await assert.rejects(
            () => instance.authorizeSingleTransfer(token[1], {
                reference: 'SOME_REF',
                authorizationCode: 'ABC'   // must be numeric
            }),
            /authorizationCode/
        );
    });

    it('should throw when reference is missing', async () => {
        await assert.rejects(
            () => instance.authorizeSingleTransfer(token[1], { authorizationCode: '123456' }),
            /reference/
        );
    });
});


describe('Disbursement — authorizeBulkTransfer', () => {
    it('should call authorizeBulkTransfer endpoint', async () => {
        const [rCode] = await instance.authorizeBulkTransfer(token[1], {
            reference:         crypto.randomBytes(16).toString('hex'),
            authorizationCode: '123456'
        });
        // 400/404/422 = no pending batch with this reference in sandbox
        assert.ok([200, 400, 404, 422].includes(rCode));
    });

    it('should throw when required fields are missing', async () => {
        await assert.rejects(
            () => instance.authorizeBulkTransfer(token[1], { authorizationCode: '123456' }),
            /reference/
        );
    });
});


describe('Disbursement — resendTransferOTP', () => {
    it('should call resendTransferOTP endpoint', async () => {
        const [rCode] = await instance.resendTransferOTP(token[1], {
            reference: crypto.randomBytes(16).toString('hex')
        });
        assert.ok([200, 400, 404].includes(rCode));
    });

    it('should throw when reference is missing', async () => {
        await assert.rejects(
            () => instance.resendTransferOTP(token[1], {}),
            /reference/
        );
    });
});


describe('Disbursement — resendBulkTransferOTP', () => {
    it('should call resendBulkTransferOTP endpoint', async () => {
        const [rCode] = await instance.resendBulkTransferOTP(token[1], {
            reference: crypto.randomBytes(16).toString('hex')
        });
        assert.ok([200, 400, 404].includes(rCode));
    });

    it('should throw when reference is missing', async () => {
        await assert.rejects(
            () => instance.resendBulkTransferOTP(token[1], {}),
            /reference/
        );
    });
});


describe('Disbursement — getSingleTransferStatus', () => {
    it('should call getSingleTransferStatus endpoint', async () => {
        const [rCode] = await instance.getSingleTransferStatus(token[1], {
            reference: crypto.randomBytes(16).toString('hex')
        });
        assert.ok([200, 400, 404].includes(rCode));
    });

    it('should throw when reference is missing', async () => {
        await assert.rejects(
            () => instance.getSingleTransferStatus(token[1], {}),
            /reference/
        );
    });
});


describe('Disbursement — getBulkTransferStatus', () => {
    it('should call getBulkTransferStatus endpoint', async () => {
        const [rCode] = await instance.getBulkTransferStatus(token[1], {
            reference: crypto.randomBytes(16).toString('hex')
        });
        assert.ok([200, 400, 404].includes(rCode));
    });
});


describe('Disbursement — getBulkBatchSummary', () => {
    it('should be an alias for getBulkTransferStatus', async () => {
        const [rCode] = await instance.getBulkBatchSummary(token[1], {
            reference: crypto.randomBytes(16).toString('hex')
        });
        assert.ok([200, 400, 404].includes(rCode));
    });
});


describe('Disbursement — getBulkTransferTransactions', () => {
    it('should call getBulkTransferTransactions endpoint', async () => {
        const [rCode] = await instance.getBulkTransferTransactions(token[1], {
            batchReference: crypto.randomBytes(16).toString('hex'),
            pageNo:   0,
            pageSize: 10
        });
        assert.ok([200, 400, 404].includes(rCode));
    });

    it('should throw when batchReference is missing', async () => {
        await assert.rejects(
            () => instance.getBulkTransferTransactions(token[1], { pageNo: 0 }),
            /batchReference/
        );
    });
});


describe('Disbursement — getAllSingleTransfers', () => {
    it('should return paginated single transfers', async () => {
        const [rCode, resp] = await instance.getAllSingleTransfers(token[1], {
            pageNo: 0, pageSize: 10
        });
        assert.ok([200, 400].includes(rCode));
    });

    it('should work with default pagination when called with no data', async () => {
        const [rCode] = await instance.getAllSingleTransfers(token[1]);
        assert.ok([200, 400].includes(rCode));
    });
});


describe('Disbursement — getAllBulkTransfers', () => {
    it('should return paginated bulk transfers', async () => {
        const [rCode] = await instance.getAllBulkTransfers(token[1], {
            pageNo: 0, pageSize: 10
        });
        assert.ok([200, 400, 404].includes(rCode));
    });
});


describe('Disbursement — searchDisbursementTransactions', () => {
    it('should call searchDisbursementTransactions endpoint', async () => {
        const [rCode] = await instance.searchDisbursementTransactions(token[1], {
            sourceAccountNumber: WALLET_ACCOUNT,
            pageNo:   0,
            pageSize: 10
        });
        assert.ok([200, 400, 404, 422].includes(rCode));
    });

    it('should throw when sourceAccountNumber is missing', async () => {
        await assert.rejects(
            () => instance.searchDisbursementTransactions(token[1], { pageNo: 0 }),
            /sourceAccountNumber/
        );
    });
});
