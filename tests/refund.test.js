import assert from "assert/strict";
import { TransactionRefund } from "../src/disbursements/refund.js";
import crypto from 'crypto';

let transactionRefund;
let token;
let refundPayload;
let refundReference = '0293e4b0xxx4b75ff419b20052b0e'

beforeEach(async () => {
    transactionRefund = new TransactionRefund('SANDBOX');
    token = await transactionRefund.getToken();

    refundPayload = {
        transactionReference: "MNFY|23|20241009140544|000009",
        refundReference: refundReference,
        refundReason: "Customer Request",
        refundAmount: 100,
        customerNote: "Refund Note",
        destinationAccountNumber: "8088523241",
        destinationAccountBankCode: "305"
    };
});

describe('TransactionRefund API Tests', () => {

/*
    describe('Initiate Refund', () => {
        it('should successfully initiate a refund', async () => {
            const [rCode, resp] = await transactionRefund.initiateRefund(token[1],refundPayload);
            console.log(resp)
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
            console.log(resp.responseMessage);
        });

        it('should throw an error if customer note exceeds 16 characters', async () => {
            const longCustomerNote = "This note is way too long";

            await assert.rejects(
                async () => {
                    await transactionRefund.initiateRefund(token[1],refundPayload);
                },
                {
                    message: "Customer note must be at most 16 characters."
                }
            );
        });

        it('should initiate refund without optional parameters', async () => {
            const [rCode, resp] = await transactionRefund.initiateRefund(token[1],refundPayload);
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
            console.log(resp.responseMessage);
        });
    });

    */
    describe('Get All Refunds', () => {
        it('should return a successful on get all refunds', async () => {
            const [rCode, resp] = await transactionRefund.getAllRefunds(token[1], { "page": 0, "size": 10 });
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });

        it('should return a successful on get all refunds', async () => {
            const [rCode, resp] = await transactionRefund.getAllRefunds(token[1], { "page": 1, "size": 5 });
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });
    });

    describe('Get Refund Status', () => {
        it('should return a successful on refund status retrieval', async () => {
            const [rCode, resp] = await transactionRefund.getRefundStatus(token[1], {"refundReference":refundReference});
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });

        it('should return an error for an invalid refund reference', async () => {
            const invalidRefundReference = "INVALID_REF";

            const [rCode, resp] = await transactionRefund.getRefundStatus(token[1], {"refundReference":invalidRefundReference});
            assert.notStrictEqual(rCode, 200);
        });
    });

});
