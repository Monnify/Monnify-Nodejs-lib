import {
    getBillerCategoriesSchema,
    getBillerProductsSchema,
    listBillersSchema,
    validateCustomerSchema,
    vendBillSchema,
    requeryBillPaymentSchema
} from "../../validators/billsPaymentValidator.js";
import { BaseRequestAPI } from "../base_api.js";


export class BillsPayment extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    /**
     * Retrieve all available biller categories (e.g. Airtime, Utilities, Cable TV).
     * GET /api/v1/vas/bills-payment/biller-categories
     */
    async getBillerCategories(authToken, data = {}) {
        if (arguments.length < 1) {
            throw new Error("Method requires at least one parameter");
        }

        const result = getBillerCategoriesSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const params = new URLSearchParams(result.value).toString();
        return await this.get(
            `/api/v1/vas/bills-payment/biller-categories?${params}`,
            authToken
        );
    }

    /**
     * List all billers, optionally filtered by category.
     * GET /api/v1/vas/bills-payment/billers
     *
     * @param {string} [data.categoryCode] - Filter results by biller category code.
     */
    async listBillers(authToken, data = {}) {
        if (arguments.length < 1) {
            throw new Error("Method requires at least one parameter");
        }

        const result = listBillersSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        // Map camelCase 'categoryCode' → snake_case 'category_code' expected by the API
        const { categoryCode, ...rest } = result.value;
        const queryObj = { ...rest };
        if (categoryCode !== undefined) queryObj.category_code = categoryCode;

        const params = new URLSearchParams(
            Object.fromEntries(Object.entries(queryObj).filter(([, v]) => v !== undefined))
        ).toString();
        return await this.get(`/api/v1/vas/bills-payment/billers?${params}`, authToken);
    }

    /**
     * Retrieve the available products / plans for a specific biller.
     * GET /api/v1/vas/bills-payment/biller-products
     *
     * @param {string} data.billerCode - Required. The biller's unique code.
     */
    async getBillerProducts(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = getBillerProductsSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        // Map camelCase 'billerCode' → snake_case 'biller_code' expected by the API
        const { billerCode, ...rest } = result.value;
        const queryObj = { ...rest, biller_code: billerCode };

        const params = new URLSearchParams(
            Object.fromEntries(Object.entries(queryObj).filter(([, v]) => v !== undefined))
        ).toString();
        return await this.get(`/api/v1/vas/bills-payment/biller-products?${params}`, authToken);
    }

    /**
     * Validate a customer's identifier (e.g. smart card number, meter number) before paying.
     * Must be called first when the product requires a validation step.
     * POST /api/v1/vas/bills-payment/validate-customer
     *
     * @param {string} data.productCode - Required. The product code from getBillerProducts.
     * @param {string} data.customerId  - Required. The customer identifier (e.g. meter number).
     *
     * Response includes `vendInstruction.requireValidationRef` (boolean).
     * If true, pass the returned `validationReference` into vendBill.
     */
    async validateCustomer(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = validateCustomerSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post(
            '/api/v1/vas/bills-payment/validate-customer',
            authToken,
            result.value
        );
    }

    /**
     * Process (vend) a bill payment — the actual purchase step.
     *
     * Typical flow:
     * 1. getBillerCategories() → pick a category
     * 2. listBillers({ categoryCode }) → pick a biller
     * 3. getBillerProducts({ billerCode }) → pick a product
     * 4. validateCustomer({ productCode, customerId }) → optional but recommended
     *    (required when vendInstruction.requireValidationRef === true)
     * 5. vendBill({ productCode, customerId, amount, reference, validationReference? })
     *
     * POST /api/v1/vas/bills-payment/vend
     *
     * @param {string}  data.productCode          - Required. Product code from getBillerProducts.
     * @param {string}  data.customerId            - Required. Customer identifier.
     * @param {number}  data.amount                - Required. Amount to pay.
     * @param {string}  data.reference             - Required. Unique merchant transaction reference.
     * @param {string}  [data.validationReference] - From validateCustomer when requireValidationRef is true.
     * @param {string}  [data.emailAddress]        - Customer email for receipt/notification.
     * @param {string}  [data.phoneNumber]         - Customer phone number.
     */
    async vendBill(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = vendBillSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post(
            '/api/v1/vas/bills-payment/vend',
            authToken,
            result.value
        );
    }

    /**
     * Re-query the status of a previously submitted bill payment.
     * Useful when the vendBill response was inconclusive or timed out.
     * GET /api/v1/vas/bills-payment/requery?reference=
     *
     * @param {string} data.reference - Required. The same merchant reference used in vendBill.
     */
    async requeryBillPayment(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = requeryBillPaymentSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const ref = encodeURIComponent(result.value.reference);
        return await this.get(
            `/api/v1/vas/bills-payment/requery?reference=${ref}`,
            authToken
        );
    }
}
