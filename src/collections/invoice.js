import {
    createInvoiceSchema,
    getAllInvoicesSchema,
    invoiceReferenceSchema
} from "../../validators/invoiceValidator.js";
import { BaseRequestAPI } from "../base_api.js";


export class Invoice extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    /**
     * Create a new invoice that can be paid by a customer.
     * POST /api/v1/invoice/create
     */
    async createInvoice(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = createInvoiceSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        return await this.post('/api/v1/invoice/create', authToken, result.value);
    }

    /**
     * Retrieve the details of an invoice by its reference.
     * GET /api/v1/invoice/{invoiceReference}/details
     */
    async viewInvoiceDetails(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = invoiceReferenceSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const ref = encodeURIComponent(result.value.invoiceReference);
        return await this.get(`/api/v1/invoice/${ref}/details`, authToken);
    }

    /**
     * Retrieve a paginated list of all invoices for the merchant.
     * GET /api/v1/invoice/all
     */
    async getAllInvoices(authToken, data = {}) {
        if (arguments.length < 1) {
            throw new Error("Method requires at least one parameter");
        }

        const result = getAllInvoicesSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const params = new URLSearchParams(result.value).toString();
        return await this.get(`/api/v1/invoice/all?${params}`, authToken);
    }

    /**
     * Cancel (void) an existing invoice.
     * DELETE /api/v1/invoice/{invoiceReference}/cancel
     */
    async cancelInvoice(authToken, data) {
        if (arguments.length !== 2) {
            throw new Error("Method requires exactly two parameters");
        }

        const result = invoiceReferenceSchema.validate(data, { allowUnknown: true });
        if (result.error) throw new Error(result.error);

        const ref = encodeURIComponent(result.value.invoiceReference);
        return await this.delete(`/api/v1/invoice/${ref}/cancel`, authToken);
    }
}
