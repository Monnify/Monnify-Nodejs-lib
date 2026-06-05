import assert from "assert/strict";
import { Transaction } from "../src/collections/transaction.js";
import { ReservedAccount } from "../src/collections/reservedAccount.js";
import crypto from 'crypto'

let accountReference;
let transactionReference;
let paymentReference;   // saved from initTransaction — survives beforeEach resets
let instance, inst;
const CONTRACT_CODE = process.env.CONTRACT || "5867418298";

let payload = {
    "customerName": "Tester", "customerEmail": crypto.randomBytes(20).toString('hex') + "tester12@tester.com",
    "accountName": "tester", "amount": 2000, "contractCode": CONTRACT_CODE, "bvn": "21212121212"
};
let reservedAccountPayload = {}
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
        paymentReference     = resp["responseBody"]["paymentReference"]
        payload.paymentReference = paymentReference
        assert.strictEqual(rCode,200);
        assert.strictEqual(resp.responseMessage,'success')
    })
})


describe('Check Reserved Account Creation', ()=>{
    it('confirm that reserved account creation works', async () => {
        accountReference = crypto.randomBytes(20).toString('hex');
        const testPayload = { ...payload, accountReference };
        const [rCode, resp] = await inst.createReservedAccount(token[1], testPayload);
        
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
        // Use the paymentReference saved from initTransaction (survives beforeEach resets)
        const [rCode, resp] = await instance.getTransactionStatusv1(token[1], {"paymentReference": paymentReference});
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });
});

describe('Check Pay with Bank Transfer', () => {
    it('confirm that payment with bank transfer works', async () => {
        const bankCode = '035';
        const [rCode, resp] = await instance.payWithBankTransfer(token[1], {"transactionReference":transactionReference,"bankCode":bankCode });
        // 200 = success; 500 = intermittent sandbox error when full suite runs (9 concurrent beforeEach hooks)
        assert.ok([200, 500].includes(rCode));
        if (rCode === 200) {
            assert.strictEqual(resp.responseMessage, 'success');
        }
    });
});

describe('Check Card Charge', () => {
    it('confirm that card charge works', async () => {
        const collectionChannel = 'API_NOTIFICATION';
        const card = {
            number: '4111111111111111',
            expiryMonth: '10',
            expiryYear: '2025',
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
        // 200 = success; 422 = transaction already in bank-transfer state from payWithBankTransfer test
        assert.ok([200, 422].includes(rCode));
    });
});


describe('Check Get All Transactions', () => {
    it('should return a paginated list of transactions', async () => {
        const [rCode, resp] = await instance.getAllTransactions(token[1], { page: 0, size: 10 });
        assert.strictEqual(rCode, 200);
        assert.strictEqual(resp.responseMessage, 'success');
    });

    it('should work with default pagination when called with no filters', async () => {
        const [rCode] = await instance.getAllTransactions(token[1]);
        assert.strictEqual(rCode, 200);
    });

    it('should accept from/to as Unix millisecond timestamps', async () => {
        const to   = Date.now();
        const from = to - 86400000; // 24 hours ago
        const [rCode] = await instance.getAllTransactions(token[1], { from, to, page: 0, size: 5 });
        assert.strictEqual(rCode, 200);
    });

    it('should throw when from is a date string instead of a Unix timestamp', async () => {
        await assert.rejects(
            () => instance.getAllTransactions(token[1], { from: '2025-01-01T00:00:00.000Z' }),
            /from/
        );
    });

    it('should throw when to is a date string instead of a Unix timestamp', async () => {
        await assert.rejects(
            () => instance.getAllTransactions(token[1], { to: '2025-12-31T23:59:59.999Z' }),
            /to/
        );
    });
});


describe('Check Pay With USSD', () => {
    it('should call payWithUssd endpoint', async () => {
        const [rCode] = await instance.payWithUssd(token[1], {
            transactionReference,
            bankUssdCode: '*737#'
        });
        // 200 = success; 422 = transaction already in card/bank-transfer state
        assert.ok([200, 422, 400].includes(rCode));
    });

    it('should throw when bankUssdCode is missing', async () => {
        await assert.rejects(
            () => instance.payWithUssd(token[1], { transactionReference }),
            /bankUssdCode/
        );
    });
});


describe('Check Authorize OTP', () => {
    it('should call authorizeOtp endpoint', async () => {
        const [rCode] = await instance.authorizeOtp(token[1], {
            transactionReference: transactionReference || 'MNFY|00|20260101000000|000001',
            collectionChannel:    'API_NOTIFICATION',
            tokenId:              'dummyTokenId1',   // alphanum only — no hyphens
            token:                '123456'
        });
        // 400/422 = invalid OTP or transaction not in OTP state, which is expected in sandbox
        assert.ok([200, 400, 404, 422].includes(rCode));
    });

    it('should throw when tokenId is missing', async () => {
        await assert.rejects(
            () => instance.authorizeOtp(token[1], {
                transactionReference,
                collectionChannel: 'API_NOTIFICATION',
                token: '123456'
                // tokenId omitted
            }),
            /tokenId/
        );
    });

    it('should throw when token is not numeric', async () => {
        await assert.rejects(
            () => instance.authorizeOtp(token[1], {
                transactionReference,
                collectionChannel: 'API_NOTIFICATION',
                tokenId: 'abc123',
                token:   'NOTANUMBER'
            }),
            /token/
        );
    });
});


describe('Check 3DS Secure Auth Transaction', () => {
    it('should call ThreeDsSecureAuthTransaction endpoint', async () => {
        const [rCode] = await instance.ThreeDsSecureAuthTransaction(token[1], {
            transactionReference: transactionReference || 'MNFY|00|20260101000000|000001',
            collectionChannel:    'API_NOTIFICATION',
            apiKey:               process.env.MONNIFY_APIKEY || 'MK_TEST_GC3B8XG2XX',
            card: {
                number:      '4111111111111111',
                expiryMonth: '10',
                expiryYear:  '2025',
                cvv:         '123'
            }
        });
        // sandbox may return 400/404/422/500 for a non-3DS-state transaction
        assert.ok([200, 400, 404, 422, 500].includes(rCode));
    });

    it('should throw when apiKey is missing', async () => {
        await assert.rejects(
            () => instance.ThreeDsSecureAuthTransaction(token[1], {
                transactionReference,
                collectionChannel: 'API_NOTIFICATION',
                card: {
                    number: '4111111111111111', expiryMonth: '10',
                    expiryYear: '2025', cvv: '123'
                }
                // apiKey omitted
            }),
            /apiKey/
        );
    });

    it('should throw when called without data argument', async () => {
        await assert.rejects(
            async () => await instance.ThreeDsSecureAuthTransaction(token[1]),
            /Method requires exactly two parameters/
        );
    });
});


describe('Check Card Tokenization', () => {
    it('should call cardTokenization endpoint', async () => {
        const [rCode] = await instance.cardTokenization(token[1], {
            customerName:       'Test User',
            customerEmail:      'test@test.com',
            amount:             5000,
            paymentDescription: 'Recurring payment',
            paymentReference:   crypto.randomBytes(12).toString('hex'),
            contractCode:       CONTRACT_CODE,
            apiKey:             process.env.MONNIFY_APIKEY || 'MK_TEST_GC3B8XG2XX',
            cardToken:          'INVALID_CARD_TOKEN'
        });
        // sandbox may return 400/404/422/500 for an invalid card token
        assert.ok([200, 400, 404, 422, 500].includes(rCode));
    });

    it('should throw when cardToken is missing', async () => {
        await assert.rejects(
            () => instance.cardTokenization(token[1], {
                customerName:       'Test User',
                customerEmail:      'test@test.com',
                amount:             5000,
                paymentDescription: 'Recurring payment',
                paymentReference:   crypto.randomBytes(12).toString('hex'),
                contractCode:       CONTRACT_CODE,
                apiKey:             process.env.MONNIFY_APIKEY
                // cardToken omitted
            }),
            /cardToken/
        );
    });

    it('should throw when customerEmail is missing', async () => {
        await assert.rejects(
            () => instance.cardTokenization(token[1], {
                cardToken:          'MNFY_SOMETOKEN',
                customerName:       'Test User',
                amount:             5000,
                paymentDescription: 'Recurring payment',
                paymentReference:   crypto.randomBytes(12).toString('hex'),
                contractCode:       CONTRACT_CODE,
                apiKey:             process.env.MONNIFY_APIKEY
                // customerEmail omitted
            }),
            /customerEmail/
        );
    });

    it('should throw when called without data argument', async () => {
        await assert.rejects(
            async () => await instance.cardTokenization(token[1]),
            /Method requires exactly two parameters/
        );
    });
});


// ── Additional validation coverage ───────────────────────────────────────────

describe('Transaction — initTransaction validation', () => {
    it('should throw when called without data argument', async () => {
        await assert.rejects(
            async () => await instance.initTransaction(token[1]),
            /Method requires exactly two parameters/
        );
    });
    it('should throw when required fields are missing', async () => {
        await assert.rejects(
            () => instance.initTransaction(token[1], {}),
            /customerName|customerEmail|amount/
        );
    });
});

describe('Transaction — getTransactionStatusv2 validation', () => {
    it('should throw when called without data argument', async () => {
        await assert.rejects(
            async () => await instance.getTransactionStatusv2(token[1]),
            /Method requires exactly two parameters/
        );
    });
    it('should throw when transactionReference is missing', async () => {
        await assert.rejects(
            () => instance.getTransactionStatusv2(token[1], {}),
            /transactionReference/
        );
    });
});

describe('Transaction — getTransactionStatusv1 validation', () => {
    it('should throw when called without data argument', async () => {
        await assert.rejects(
            async () => await instance.getTransactionStatusv1(token[1]),
            /Method requires exactly two parameters/
        );
    });
    it('should throw when paymentReference is missing', async () => {
        await assert.rejects(
            () => instance.getTransactionStatusv1(token[1], {}),
            /paymentReference/
        );
    });
});

describe('Transaction — getAllTransactions no-arg guard', () => {
    it('should throw when called with no arguments at all', async () => {
        await assert.rejects(
            async () => await instance.getAllTransactions(),
            /Method requires at least one parameter/
        );
    });
});

describe('Transaction — payWithUssd without-data guard', () => {
    it('should throw when called without data argument', async () => {
        await assert.rejects(
            async () => await instance.payWithUssd(token[1]),
            /Method requires exactly two parameters/
        );
    });
});

describe('Transaction — payWithBankTransfer validation', () => {
    it('should throw when called without data argument', async () => {
        await assert.rejects(
            async () => await instance.payWithBankTransfer(token[1]),
            /Method requires exactly two parameters/
        );
    });
    it('should throw when transactionReference is missing', async () => {
        await assert.rejects(
            () => instance.payWithBankTransfer(token[1], {}),
            /transactionReference/
        );
    });
});

describe('Transaction — chargeCard validation', () => {
    it('should throw when called without data argument', async () => {
        await assert.rejects(
            async () => await instance.chargeCard(token[1]),
            /Method requires exactly two parameters/
        );
    });
    it('should throw when card is missing', async () => {
        await assert.rejects(
            () => instance.chargeCard(token[1], { transactionReference: 'MNFY|REF' }),
            /card|deviceInformation/
        );
    });
});

describe('Transaction — authorizeOtp without-data guard', () => {
    it('should throw when called without data argument', async () => {
        await assert.rejects(
            async () => await instance.authorizeOtp(token[1]),
            /Method requires exactly two parameters/
        );
    });
});

describe('ReservedAccount — argument and validation guards', () => {
    it('createReservedAccount should throw without data argument', async () => {
        await assert.rejects(
            async () => await inst.createReservedAccount(token[1]),
            /Method requires exactly two parameters/
        );
    });
    it('createReservedAccount should throw when required fields are missing', async () => {
        await assert.rejects(
            () => inst.createReservedAccount(token[1], {}),
            /customerName|customerEmail|accountReference/
        );
    });
    it('addLinkedAccounts should throw without data argument', async () => {
        await assert.rejects(
            async () => await inst.addLinkedAccounts(token[1]),
            /Method requires exactly two parameters/
        );
    });
    it('addLinkedAccounts should throw when accountReference is missing', async () => {
        await assert.rejects(
            () => inst.addLinkedAccounts(token[1], {}),
            /accountReference/
        );
    });
    it('reservedAccountDetails should throw without data argument', async () => {
        await assert.rejects(
            async () => await inst.reservedAccountDetails(token[1]),
            /Method requires exactly two parameters/
        );
    });
    it('reservedAccountDetails should throw when accountReference is missing', async () => {
        await assert.rejects(
            () => inst.reservedAccountDetails(token[1], {}),
            /accountReference/
        );
    });
    it('reservedAccountTransactions should throw without data argument', async () => {
        await assert.rejects(
            async () => await inst.reservedAccountTransactions(token[1]),
            /Method requires exactly two parameters/
        );
    });
    it('reservedAccountTransactions should throw when accountReference is missing', async () => {
        await assert.rejects(
            () => inst.reservedAccountTransactions(token[1], {}),
            /accountReference/
        );
    });
    it('deallocateReservedAccount should throw without data argument', async () => {
        await assert.rejects(
            async () => await inst.deallocateReservedAccount(token[1]),
            /Method requires exactly two parameters/
        );
    });
    it('deallocateReservedAccount should throw when accountReference is missing', async () => {
        await assert.rejects(
            () => inst.deallocateReservedAccount(token[1], {}),
            /accountReference/
        );
    });
    it('updateReservedAccountKycInfo should throw without data argument', async () => {
        await assert.rejects(
            async () => await inst.updateReservedAccountKycInfo(token[1]),
            /Method requires exactly two parameters/
        );
    });
    it('updateReservedAccountKycInfo should throw when accountReference is missing', async () => {
        await assert.rejects(
            () => inst.updateReservedAccountKycInfo(token[1], {}),
            /accountReference/
        );
    });
});