import assert from "assert/strict";
import { TransactionRefund } from "../src/refund.js";
import crypto from 'crypto';

let transactionRefund;
let token;
let refundPayload;
let refundReference = 'REF123456';

beforeEach(async () => {
    transactionRefund = new TransactionRefund('sandbox');
    token = await transactionRefund.getToken();

    refundPayload = {
        transactionReference: crypto.randomBytes(16).toString('hex'),
        refundReference: refundReference,
        refundReason: "Customer Request",
        refundAmount: 1000,
        customerNote: "Refund Note",
        destinationAccountNumber: "1234567890",
        destinationAccountBankCode: "044"
    };
});

describe('TransactionRefund API Tests', () => {

    describe('Initiate Refund', () => {
        it('should successfully initiate a refund', async () => {
            const [rCode, resp] = await transactionRefund.initiateRefund(
                token[1],
                refundPayload.transactionReference,
                refundPayload.refundReference,
                refundPayload.refundReason,
                refundPayload.refundAmount,
                {
                    customerNote: refundPayload.customerNote,
                    destinationAccountNumber: refundPayload.destinationAccountNumber,
                    destinationAccountBankCode: refundPayload.destinationAccountBankCode,
                }
            );
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });

        it('should throw an error if customer note exceeds 16 characters', async () => {
            const longCustomerNote = "This note is way too long";

            await assert.rejects(
                async () => {
                    await transactionRefund.initiateRefund(
                        token[1],
                        refundPayload.transactionReference,
                        refundPayload.refundReference,
                        refundPayload.refundReason,
                        refundPayload.refundAmount,
                        {
                            customerNote: longCustomerNote,
                            destinationAccountNumber: refundPayload.destinationAccountNumber,
                            destinationAccountBankCode: refundPayload.destinationAccountBankCode,
                        }
                    );
                },
                {
                    message: "Customer note must be at most 16 characters."
                }
            );
        });

        it('should initiate refund without optional parameters', async () => {
            const [rCode, resp] = await transactionRefund.initiateRefund(
                token[1],
                refundPayload.transactionReference,
                refundPayload.refundReference,
                refundPayload.refundReason,
                refundPayload.refundAmount,
                {}
            );
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
        });
    });

    describe('Get All Refunds', () => {
        it('should retrieve all refunds with default pagination', async () => {
            const [rCode, resp] = await transactionRefund.getAllRefunds(token[1], { page: 0, size: 10 });
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
            assert(Array.isArray(resp.data));
        });

        it('should retrieve refunds with custom pagination', async () => {
            const [rCode, resp] = await transactionRefund.getAllRefunds(token[1], { page: 1, size: 5 });
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
            assert(Array.isArray(resp.data));
        });
    });

    describe('Get Refund Status', () => {
        it('should retrieve the refund status successfully', async () => {
            const [rCode, resp] = await transactionRefund.getRefundStatus(token[1], refundReference);
            assert.strictEqual(rCode, 200);
            assert.strictEqual(resp.responseMessage, 'success');
            assert.strictEqual(resp.data.refundReference, refundReference);
        });

        it('should return an error for an invalid refund reference', async () => {
            const invalidRefundReference = "INVALID_REF";

            const [rCode, resp] = await transactionRefund.getRefundStatus(token[1], invalidRefundReference);
            assert.notStrictEqual(rCode, 200);
        });
    });

});
