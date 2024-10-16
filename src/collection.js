import { BaseRequestAPI } from "./base_api.js";
import crypto from 'crypto'




export class ReservedAccount extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    async createReservedAccount(
        authToken,
        customerName,
        customerEmail,
        accountName,
        { currencyCode = "NGN",
            bvn = "",
            accountReference = "",
            getAllAvailableBanks = true,
            preferredBanks = [],
            incomeSplitConfig = {},
            restrictPaymentSource = false,
            allowedPaymentSource = {} } = {}) {

        const data = {}
        const path = '/api/v2/bank-transfer/reserved-accounts';
        data.customerName = customerName
        data.customerEmail = customerEmail
        data.accountName = accountName
        data.contractCode = this.contract

        if (arguments.length <= 4) {
            data.getAllAvailableBanks = true
            data.accountReference = crypto.randomBytes(20).toString('hex')
            data.currencyCode = 'NGN'
            return await this.post(path, authToken, data);
        }


        accountReference = accountReference.length !== 0 ? accountReference : crypto.randomBytes(20).toString('hex')
        data.currencyCode = currencyCode
        data.accountReference = accountReference
        if (bvn.length !== 0) {
            data.bvn = bvn
        }
        if (Object.keys(incomeSplitConfig).length !== 0) {
            data.incomeSplitConfig = incomeSplitConfig
        }
        if (restrictPaymentSource) {
            data.restrictPaymentSource = restrictPaymentSource
        }
        if (Object.keys(allowedPaymentSource).length !== 0) {
            data.allowedPaymentSource = allowedPaymentSource
        }
        if (getAllAvailableBanks === true) {
            data.getAllAvailableBanks = true
        } else {
            data.getAllAvailableBanks = false
            data.preferredBanks = preferredBanks
        }
        return await this.post(path, authToken, data);
    }


    async addLinkedAccounts(authToken, accountReference, preferredBanks) {
        const data = {}
        data.getAllAvailableBanks = false
        data.preferredBanks = preferredBanks
        const encodedReference = encodeURI(accountReference);
        const path = '/api/v1/bank-transfer/reserved-accounts/add-linked-accounts/' + encodedReference;
        return await this.put(path, authToken, data);
    }

    async reservedAccountDetails(authToken, accountReference) {
        const encodedReference = encodeURI(accountReference);
        const path = '/api/v2/bank-transfer/reserved-accounts/' + encodedReference;
        return await this.get(path, authToken);
    }

    async reservedAccountTransactions(authToken, accountReference, { page = 0, size = 10 }) {
        const encodedReference = encodeURI(accountReference);

        const path = '/api/v1/bank-transfer/reserved-accounts/transactions?accountReference='
            + encodedReference + '&page=' + page + '&' + 'size=' + size;

        return await this.get(path, authToken);
    }

    async deallocateReservedAccount(authToken, accountReference) {
        const encodedReference = encodeURI(accountReference);
        const path = '/api/v1/bank-transfer/reserved-accounts/reference/' + encodedReference;
        return await this.delete(path, authToken);
    }

    async updateReservedAccountKycInfo(authToken,
        accountReference,
        bvn,
        nin) {
        const data = {}
        const encodedReference = encodeURI(accountReference);
        const path = '/api/v1/bank-transfer/reserved-accounts/' + encodedReference + '/kyc-info';
        if (bvn) {
            data.bvn = bvn;
        }
        if (nin) {
            data.nin = nin;
        }
        return await this.put(path, authToken, data)
    }
}





export class Transaction extends BaseRequestAPI {
    constructor(env) {
        super(env);
    }

    async initTransaction(
        authToken,
        amount,
        customerName,
        customerEmail,
        paymentDescription,
        {
            currencyCode = "NGN",
            redirectUrl = "",
            paymentMethods = [],
            paymentReference = "",
            metaData = {},
            incomeSplitConfig = {} } = {}) {

        const data = {}
        const path = '/api/v1/merchant/transactions/init-transaction';
        data.amount = amount
        data.customerName = customerName
        data.customerEmail = customerEmail
        data.paymentDescription = paymentDescription
        data.contractCode = this.contract

        if (arguments.length <= 5) {
            data.paymentMethods = []
            data.paymentReference = paymentReference.length !== 0 ? paymentReference : crypto.randomBytes(20).toString('hex')
            data.currencyCode = 'NGN'
            return await this.post(path, authToken, data);
        }

        paymentReference = paymentReference.length !== 0 ? paymentReference : crypto.randomBytes(20).toString('hex')
        data.currencyCode = currencyCode
        data.paymentMethods = paymentMethods
        data.contractCode = this.contract 
        data.paymentReference = paymentReference
        data.metaData = metaData

        if (redirectUrl.length !== 0) {
            data.redirectUrl = redirectUrl
        }
        if (Object.keys(incomeSplitConfig).length !== 0) {
            data.incomeSplitConfig = incomeSplitConfig
        }
        return await this.post(path, authToken, data);
    }

    async getTransactionStatusv2(authToken, transactionReference) {
        const encodedReference = encodeURIComponent(transactionReference);
        const path = '/api/v2/transactions/' + encodedReference;
        return await this.get(path, authToken);
    }

    async getTransactionStatusv1(authToken, paymentReference) {
        const encodedReference = encodeURIComponent(paymentReference);
        const path = '/api/v2/merchant/transactions/query?paymentReference=' + encodedReference;
        return await this.get(path, authToken);
    }

    async payWithUssd(authToken,
        transactionReference,
        bankUssdCode) {
        const data = {};
        const path = '/api/v1/merchant/ussd/initialize';

        data.transactionReference = transactionReference;
        data.bankUssdCode = bankUssdCode;

        return await this.post(path, authToken, data);
    }

    async payWithBankTransfer(authToken,
        transactionReference,
        {
            bankCode
        }
    ) {

        const data = {}
        const path = '/api/v1/merchant/bank-transfer/init-payment'

        data.transactionReference = transactionReference;

        if (arguments.length <= 2) {
            return await this.post(path, authToken, data);
        }
        data.bankCode = bankCode;

        return await this.post(path, authToken, data);
    }

    async chargeCard(authToken,
        transactionReference,
        collectionChannel,
        {
            number,
            expiryMonth,
            expiryYear,
            pin,
            cvv
        } = {}) {
        const data = {}
        const path = "/api/v1/merchant/cards/charge";
        data.transactionReference = transactionReference
        data.collectionChannel = collectionChannel

        const card = {
            number: number,
            expiryMonth: expiryMonth,
            expiryYear: expiryYear,
            pin: pin,
            cvv: cvv
        };

        data.card = card
        return await this.post(path, authToken, data);
    }

    async authorizeOtp(authToken,
        transactionReference,
        collectionChannel,
        tokenId,
        token
    ) {
        const data = {}
        const path = "/api/v1/merchant/cards/otp/authorize";
        data.transactionReference = transactionReference;
        data.collectionChannel = collectionChannel;
        data.tokenId = tokenId;
        data.token = token;

        return await this.post(path, authToken, data)

    }


    async ThreeDsSecureAuthTransaction(authToken,
        transactionReference,
        collectionChannel,
        {
            number,
            expiryMonth,
            expiryYear,
            pin,
            cvv
        } = {}) {

        const data = {};
        const path = '/api/v1/sdk/cards/secure-3d/authorize';
        data.transactionReference = transactionReference;
        data.apiKey = this.apiKey;
        data.collectionChannel = collectionChannel;
        const card = {
            number: number,
            expiryMonth: expiryMonth,
            expiryYear: expiryYear,
            pin: pin,
            cvv: cvv
        };

        data.card = card
        return await this.post(path, authToken, data);
    }

    async cardTokenization(authToken,
        cardToken,
        amount,
        customerName,
        customerEmail,
        paymentReference,
        paymentDescription,
        currencyCode,
        metadata = {}) {

        const data = {};
        const path = '/api/v1/merchant/cards/charge-card-token';
        data.cardToken = cardToken;
        data.amount = amount;
        data.customerName = customerName;
        data.customerEmail = customerEmail;
        data.paymentReference = paymentReference;
        data.paymentDescription = paymentDescription;
        data.currencyCode = currencyCode;
        data.contractCode = this.contract;
        data.apiKey = this.apiKey;
        data.metaData = metadata;
        

        return await this.post(path, authToken, data);
    }
}