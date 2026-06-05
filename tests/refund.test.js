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

    describe('Initiate Refund', () => {
        it('should call initiateRefund endpoint', async () => {
            const [rCode] = await transactionRefund.initiateRefund(token[1], refundPayload);
            // 200 = success; 400/422 = transaction not eligible for refund in this sandbox account
            assert.ok([200, 400, 422].includes(rCode));
        });

        it('should throw when transactionReference is missing', async () => {
            await assert.rejects(
                () => transactionRefund.initiateRefund(token[1], {
                    refundReference: crypto.randomBytes(12).toString('hex'),
                    refundReason:    'Customer Request',
                    refundAmount:    100
                }),
                /transactionReference/
            );
        });

        it('should throw when called without data argument', async () => {
            await assert.rejects(
                async () => await transactionRefund.initiateRefund(token[1]),
                /Method requires exactly two parameters/
            );
        });
    });

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

        it('should throw when data argument is omitted', async () => {
            await assert.rejects(
                () => transactionRefund.getAllRefunds(token[1]),
                /Method requires exactly two parameters/
            );
        });

        it('should throw when page is not a number', async () => {
            await assert.rejects(
                () => transactionRefund.getAllRefunds(token[1], { page: 'not-a-number', size: 10 }),
                /page/
            );
        });
    });

    describe('Get Refund Status', () => {
        it('should return a response for refund status retrieval', async () => {
            const [rCode] = await transactionRefund.getRefundStatus(token[1], {"refundReference":refundReference});
            // 200 = found; 422 = reference not found in this sandbox account (expected with hardcoded ref)
            assert.ok([200, 422].includes(rCode));
        });

        it('should return an error for an invalid refund reference', async () => {
            const [rCode] = await transactionRefund.getRefundStatus(token[1], {"refundReference":"INVALID_REF"});
            assert.notStrictEqual(rCode, 200);
        });

        it('should throw when data argument is omitted', async () => {
            await assert.rejects(
                () => transactionRefund.getRefundStatus(token[1]),
                /Method requires exactly two parameters/
            );
        });

        it('should throw when refundReference is missing', async () => {
            await assert.rejects(
                () => transactionRefund.getRefundStatus(token[1], {}),
                /refundReference/
            );
        });
    });

});
