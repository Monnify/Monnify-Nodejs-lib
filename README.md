# Monnify Node.js Library

[![CI](https://github.com/Monnify/Monnify-Nodejs-lib/actions/workflows/monnifytest.yml/badge.svg)](https://github.com/Monnify/Monnify-Nodejs-lib/actions/workflows/monnifytest.yml)
[![codecov](https://codecov.io/gh/Monnify/Monnify-Nodejs-lib/graph/badge.svg)](https://codecov.io/gh/Monnify/Monnify-Nodejs-lib)
[![npm version](https://img.shields.io/npm/v/monnify-nodejs-lib)](https://www.npmjs.com/package/monnify-nodejs-lib)
[![Node.js](https://img.shields.io/node/v/monnify-nodejs-lib)](https://nodejs.org)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

A Node.js wrapper for the [Monnify API](https://developers.monnify.com), giving you clean, validated access to every Monnify service — collections, disbursements, invoices, direct debit, bills payment, and more — without having to hand-craft HTTP requests yourself.

---

## Table of Contents

- [Requirements](#requirements)
- [Installation](#installation)
- [Setup & Credentials](#setup--credentials)
- [How Authentication Works](#how-authentication-works)
- [Modules at a Glance](#modules-at-a-glance)
- [Reserved Accounts](#reserved-accounts)
- [Transactions](#transactions)
- [Sub Accounts](#sub-accounts)
- [Invoices](#invoices)
- [Settlements](#settlements)
- [Disbursements](#disbursements)
- [Refunds](#refunds)
- [Wallet](#wallet)
- [Limit Profiles](#limit-profiles)
- [Direct Debit](#direct-debit)
- [Bills Payment](#bills-payment)
- [Verification (Value-Added Services)](#verification-value-added-services)
- [Error Handling](#error-handling)
- [Running the Tests](#running-the-tests)
- [Contributing](#contributing)

---

## Requirements

- Node.js **18 or higher**
- A Monnify account — get your API key and secret from the [Monnify dashboard](https://app.monnify.com)

---

## Installation

```bash
npm install monnify-nodejs-lib
```

---

## Setup & Credentials

You need three things from your Monnify dashboard:

| Variable | Where to find it |
|---|---|
| `MONNIFY_APIKEY` | Dashboard → Settings → API Keys |
| `MONNIFY_SECRET` | Dashboard → Settings → API Keys |
| `CONTRACT` | Dashboard → Settings → Contract Code |

The recommended approach is a `.env` file so credentials never appear in source code:

```bash
# .env
MONNIFY_APIKEY=MK_TEST_XXXXXXXXXX
MONNIFY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
CONTRACT=1234567890
WALLETACCOUNTNUMBER=0123456789   # only needed for disbursement wallet balance
```

Then load it at the top of your app:

```js
import dotenv from 'dotenv';
dotenv.config();
```

> ⚠️ Add `.env` to your `.gitignore`. Never commit credentials to source control.

---

## How Authentication Works

Every Monnify API call needs a **bearer token**. The library handles token fetching and caching automatically — you just call `getToken()` once and pass the result to each method.

```js
import { Transaction } from 'monnify-nodejs-lib';

const api = new Transaction('SANDBOX'); // or 'LIVE'

const [statusCode, token] = await api.getToken();
// token is the raw bearer string — pass it to every method call below
```

The token is cached in memory and reused until it expires, so calling `getToken()` multiple times is cheap.

> The environment value must be `'SANDBOX'` or `'LIVE'` (uppercase). All instances in the same process must use the same environment.

---

## Modules at a Glance

```js
import {
  MonnifyAPI,           // single entry point — all modules in one object
  Transaction,          // individual import — useful for tree-shaking
  ReservedAccount,
  SubAccount,
  Invoice,
  Settlement,
  Disbursement,
  TransactionRefund,
  Wallet,
  LimitProfile,
  DirectDebit,
  Verification,
  BillsPayment
} from 'monnify-nodejs-lib';
```

Using the unified `MonnifyAPI` class:

```js
import { MonnifyAPI } from 'monnify-nodejs-lib';

const monnify = new MonnifyAPI({
  MONNIFY_APIKEY: process.env.MONNIFY_APIKEY,
  MONNIFY_SECRET: process.env.MONNIFY_SECRET,
  env: 'SANDBOX'
});

const [, token] = await monnify.getToken();

// Access every module through the same instance
await monnify.transaction.initTransaction(token, payload);
await monnify.reservedAccount.createReservedAccount(token, payload);
await monnify.disbursement.initiateSingleTransfer(token, payload);
// ...and so on
```

---

## Reserved Accounts

A reserved account is a **dedicated virtual bank account** assigned to a specific customer. Any transfer made to it is automatically matched to that customer.

```js
import { ReservedAccount } from 'monnify-nodejs-lib';

const api = new ReservedAccount('SANDBOX');
const [, token] = await api.getToken();
```

### Methods

| Method | Description |
|---|---|
| `createReservedAccount(token, data)` | Create a permanent virtual account for a customer |
| `createInvoiceReservedAccount(token, data)` | Create a one-time virtual account tied to an invoice |
| `addLinkedAccounts(token, data)` | Add preferred banks to an existing reserved account |
| `reservedAccountDetails(token, data)` | Retrieve details of a reserved account |
| `reservedAccountTransactions(token, data)` | List transactions received on a reserved account |
| `updateReservedAccountKycInfo(token, data)` | Update BVN / NIN on a reserved account |
| `updateReservedAccountBvn(token, data)` | Update just the BVN |
| `updatePaymentSources(token, data)` | Restrict which payment sources are accepted |
| `updateIncomeSplitConfig(token, data)` | Update how incoming funds are split across sub-accounts |
| `deallocateReservedAccount(token, data)` | Permanently delete a reserved account |

### Example

```js
import crypto from 'crypto';

const [statusCode, response] = await api.createReservedAccount(token, {
  customerName:    'Ada Obi',
  customerEmail:   'ada@example.com',
  accountName:     'Ada Obi',
  accountReference: crypto.randomBytes(16).toString('hex'), // your unique ref
  contractCode:    process.env.CONTRACT,
  bvn:             '22222222222',
  currencyCode:    'NGN',
  paymentMethods:  ['ACCOUNT_TRANSFER']
});

console.log(response.responseBody.accountNumber); // the virtual account number
```

---

## Transactions

Manage the full payment lifecycle — from initialising a checkout to charging a card or generating a bank transfer.

```js
import { Transaction } from 'monnify-nodejs-lib';

const api = new Transaction('SANDBOX');
const [, token] = await api.getToken();
```

### Methods

| Method | Description |
|---|---|
| `initTransaction(token, data)` | Start a new payment — returns a `transactionReference` |
| `getTransactionStatusv2(token, data)` | Check status by `transactionReference` (recommended) |
| `getTransactionStatusv1(token, data)` | Check status by `paymentReference` (your own reference) |
| `getAllTransactions(token, filters?)` | Search / list transactions with optional filters |
| `payWithBankTransfer(token, data)` | Generate a one-time bank account for an existing transaction |
| `payWithUssd(token, data)` | Generate a USSD string for an existing transaction |
| `chargeCard(token, data)` | Charge a card directly (requires `transactionReference`) |
| `authorizeOtp(token, data)` | Submit the OTP for a card charge that requires one |
| `ThreeDsSecureAuthTransaction(token, data)` | Complete a 3DS card authentication |
| `cardTokenization(token, data)` | Charge a previously saved card token |

### Example — Basic Payment Flow

```js
import crypto from 'crypto';

// 1. Initialise the transaction
const [, initResp] = await api.initTransaction(token, {
  customerName:       'Emeka Dike',
  customerEmail:      'emeka@example.com',
  amount:             5000,           // in Naira
  paymentDescription: 'Order #1042',
  paymentReference:   crypto.randomBytes(16).toString('hex'),
  contractCode:       process.env.CONTRACT,
  currencyCode:       'NGN',
  paymentMethods:     ['CARD', 'ACCOUNT_TRANSFER'],
  redirectUrl:        'https://yourapp.com/payment/callback'
});

const { transactionReference, paymentReference, checkoutUrl } = initResp.responseBody;
// Redirect your customer to checkoutUrl, or continue with one of the methods below

// 2a. Pay via bank transfer
const [, transferResp] = await api.payWithBankTransfer(token, {
  transactionReference,
  bankCode: '058' // optional — generates USSD string for this bank
});

// 2b. OR charge a card directly
const [, cardResp] = await api.chargeCard(token, {
  transactionReference,
  card: {
    number:      '4111111111111111',
    expiryMonth: '10',
    expiryYear:  '2025',
    pin:         '1234',
    cvv:         '123'
  },
  deviceInformation: {
    httpBrowserLanguage:          'en-US',
    httpBrowserJavaEnabled:       false,
    httpBrowserJavaScriptEnabled: true,
    httpBrowserColorDepth:        24,
    httpBrowserScreenHeight:      1203,
    httpBrowserScreenWidth:       2138,
    httpBrowserTimeDifference:    '',
    userAgentBrowserValue:        'Mozilla/5.0 ...'
  }
});

// 3. Check the outcome
const [, statusResp] = await api.getTransactionStatusv2(token, { transactionReference });
console.log(statusResp.responseBody.paymentStatus); // 'PAID', 'PENDING', etc.
```

### Recurring Payments — Card Tokenisation

After a successful first charge, Monnify returns a `cardToken` in the transaction status response. Save it alongside the customer email and use it for all future charges — no card details needed again.

```js
// After a successful chargeCard call, query the status:
const [, statusResp] = await api.getTransactionStatusv2(token, { transactionReference });
const cardToken    = statusResp.responseBody.cardToken;    // e.g. "MNFY_0CD0138B..."
const customerEmail = 'emeka@example.com';                  // same email used in initTransaction

// Save cardToken + customerEmail in your database, then for future charges:
const [, recurringResp] = await api.cardTokenization(token, {
  cardToken,
  customerEmail,
  customerName:       'Emeka Dike',
  amount:             5000,
  paymentReference:   crypto.randomBytes(16).toString('hex'),
  paymentDescription: 'Monthly subscription',
  contractCode:       process.env.CONTRACT,
  currencyCode:       'NGN',
  apiKey:             process.env.MONNIFY_APIKEY
});
```

---

## Sub Accounts

Split incoming payments automatically across multiple bank accounts.

```js
import { SubAccount } from 'monnify-nodejs-lib';

const api = new SubAccount('SANDBOX');
const [, token] = await api.getToken();
```

### Methods

| Method | Description |
|---|---|
| `createSubAccount(token, data)` | Create a new sub-account |
| `getSubAccounts(token)` | List all sub-accounts |
| `updateSubAccount(token, data)` | Update a sub-account |
| `deleteSubAccount(token, data)` | Remove a sub-account |

### Example

```js
const [statusCode, response] = await api.createSubAccount(token, [{
  currencyCode:           'NGN',
  bankCode:               '058',
  accountNumber:          '2085086393',
  email:                  'partner@example.com',
  defaultSplitPercentage: 20   // this account gets 20% of every payment
}]);
```

---

## Invoices

Create payment invoices with an expiry date and track their status.

```js
import { Invoice } from 'monnify-nodejs-lib';

const api = new Invoice('SANDBOX');
const [, token] = await api.getToken();
```

### Methods

| Method | Description |
|---|---|
| `createInvoice(token, data)` | Create a new invoice |
| `viewInvoiceDetails(token, data)` | Get details of a specific invoice |
| `getAllInvoices(token, data?)` | List all invoices with pagination |
| `cancelInvoice(token, data)` | Cancel an unpaid invoice |

### Example

```js
import crypto from 'crypto';

const [statusCode, response] = await api.createInvoice(token, {
  amount:           10000,
  invoiceReference: crypto.randomBytes(16).toString('hex'),
  description:      'Consulting fee - May 2026',
  contractCode:     process.env.CONTRACT,
  customerName:     'Bola Tinubu Ltd',
  customerEmail:    'accounts@bolaLtd.com',
  paymentMethods:   ['CARD', 'ACCOUNT_TRANSFER'],
  currencyCode:     'NGN'
});

console.log(response.responseBody.invoiceLink); // share this link with your customer
```

---

## Settlements

Query how funds from transactions have been settled to your bank account.

```js
import { Settlement } from 'monnify-nodejs-lib';

const api = new Settlement('SANDBOX');
const [, token] = await api.getToken();
```

### Methods

| Method | Description |
|---|---|
| `getTransactionsBySettlementReference(token, data)` | List all transactions in a settlement batch |
| `getSettlementInfo(token, data)` | Get settlement details for a specific transaction |

### Example

```js
// Find all transactions in a settlement batch
const [, response] = await api.getTransactionsBySettlementReference(token, {
  reference: 'MSP_20260101_001'
});

// Or look up the settlement for one transaction
const [, info] = await api.getSettlementInfo(token, {
  transactionReference: 'MNFY|24|20260115120000|000001'
});
```

---

## Disbursements

Send money out of your Monnify wallet — single transfers, bulk transfers, and everything in between.

```js
import { Disbursement } from 'monnify-nodejs-lib';

const api = new Disbursement('SANDBOX');
const [, token] = await api.getToken();
```

### Methods

| Method | Description |
|---|---|
| `initiateSingleTransfer(token, data)` | Send money to one bank account |
| `initiateBulkTransfer(token, data)` | Send money to many accounts in one request |
| `authorizeSingleTransfer(token, data)` | Authorise a single transfer (OTP step) |
| `authorizeBulkTransfer(token, data)` | Authorise a bulk transfer (OTP step) |
| `resendTransferOTP(token, data)` | Resend the OTP for a single transfer |
| `resendBulkTransferOTP(token, data)` | Resend the OTP for a bulk transfer |
| `getSingleTransferStatus(token, data)` | Check the status of a single transfer |
| `getBulkTransferStatus(token, data)` | Check the summary of a bulk batch |
| `getBulkBatchSummary(token, data)` | Alias for `getBulkTransferStatus` |
| `getBulkTransferTransactions(token, data)` | List individual transactions within a bulk batch |
| `getAllSingleTransfers(token, data?)` | Paginated list of all single transfers |
| `getAllBulkTransfers(token, data?)` | Paginated list of all bulk transfers |
| `searchDisbursementTransactions(token, data)` | Search disbursement transactions with filters |

### Example

```js
import crypto from 'crypto';

const [statusCode, response] = await api.initiateSingleTransfer(token, {
  sourceAccountNumber:    process.env.WALLETACCOUNTNUMBER,
  destinationBankCode:    '058',
  destinationAccountNumber: '2085086393',
  amount:                 5000,
  currency:               'NGN',
  narration:              'Freelancer payment - May 2026',
  reference:              crypto.randomBytes(16).toString('hex')
});
```

---

## Refunds

Reverse a payment back to the customer's original payment method.

```js
import { TransactionRefund } from 'monnify-nodejs-lib';

const api = new TransactionRefund('SANDBOX');
const [, token] = await api.getToken();
```

### Methods

| Method | Description |
|---|---|
| `initiateRefund(token, data)` | Start a refund for a completed transaction |
| `getAllRefunds(token, data?)` | List all refunds |
| `getRefundStatus(token, data)` | Check the status of a specific refund |

### Example

```js
import crypto from 'crypto';

const [statusCode, response] = await api.initiateRefund(token, {
  transactionReference:      'MNFY|24|20260115120000|000001',
  refundReference:           crypto.randomBytes(16).toString('hex'),
  refundReason:              'Customer requested cancellation',
  refundAmount:              5000,
  customerNote:              'Your refund is on the way',
  destinationAccountNumber:  '2085086393',
  destinationAccountBankCode: '058'
});
```

---

## Wallet

Check the available balance in your Monnify disbursement wallet.

```js
import { Wallet } from 'monnify-nodejs-lib';

const api = new Wallet('SANDBOX');
const [, token] = await api.getToken();
```

### Methods

| Method | Description |
|---|---|
| `getWalletBalance(token, data)` | Get available and ledger balance for a wallet account |

### Example

```js
const [statusCode, response] = await api.getWalletBalance(token, {
  accountNumber: process.env.WALLETACCOUNTNUMBER
});

const { availableBalance, ledgerBalance } = response.responseBody;
console.log(`Available: ₦${availableBalance}`);
```

---

## Limit Profiles

Create and manage transaction limit profiles, then attach them to reserved accounts for spending controls.

```js
import { LimitProfile } from 'monnify-nodejs-lib';

const api = new LimitProfile('SANDBOX');
const [, token] = await api.getToken();
```

### Methods

| Method | Description |
|---|---|
| `createLimitProfile(token, data)` | Create a new limit profile |
| `getLimitProfiles(token)` | List all limit profiles on your account |
| `updateLimitProfile(token, data)` | Update an existing limit profile |
| `reserveAccountWithLimit(token, data)` | Create a reserved account with a limit profile attached |
| `updateReserveAccountLimit(token, data)` | Change the limit profile on an existing reserved account |

### Example

```js
// Create a profile that caps daily spending at ₦500,000
const [, profileResp] = await api.createLimitProfile(token, {
  limitProfileName:       'Retail Customer Limit',
  singleTransactionValue: 100000,   // max per transaction: ₦100,000
  dailyTransactionVolume: 10,       // max 10 transactions per day
  dailyTransactionValue:  500000    // max ₦500,000 per day
});

const limitProfileCode = profileResp.responseBody.limitProfileCode;
```

---

## Direct Debit

Set up recurring debit mandates — charge a customer's bank account on a schedule without them needing to be present for each payment.

```js
import { DirectDebit } from 'monnify-nodejs-lib';

const api = new DirectDebit('SANDBOX');
const [, token] = await api.getToken();
```

> **Note:** Direct Debit requires regulatory approval from Monnify. Contact your account manager to get it enabled.

### Methods

| Method | Description |
|---|---|
| `createMandate(token, data)` | Create a new debit mandate |
| `getMandateStatus(token, data)` | Check the status of a mandate |
| `debitMandate(token, data)` | Trigger a debit against an active mandate |
| `getDebitStatus(token, data)` | Check the outcome of a debit attempt |
| `cancelMandate(token, data)` | Cancel an active mandate |

### Example

```js
import crypto from 'crypto';

// 1. Create the mandate
const [, mandateResp] = await api.createMandate(token, {
  contractCode:            process.env.CONTRACT,
  mandateReference:        crypto.randomBytes(12).toString('hex'),
  mandateDescription:      'Monthly gym subscription',
  mandateStartDate:        '2026-01-01T00:00:00',
  mandateEndDate:          '2026-12-31T23:59:59',
  customerName:            'Ngozi Eze',
  customerEmailAddress:    'ngozi@example.com',
  customerPhoneNumber:     '08011223344',
  customerAddress:         '12 Adeola Odeku, Victoria Island, Lagos',
  customerAccountNumber:   '2085086393',
  customerAccountBankCode: '058',
  mandateAmount:           120000,    // total lifetime cap
  autoRenew:               false,
  customerCancellation:    true,
  redirectUrl:             'https://yourapp.com/direct-debit/callback'
});

// 2. Once approved, debit the mandate
const [, debitResp] = await api.debitMandate(token, {
  mandateCode:      mandateResp.responseBody.mandateCode,
  debitAmount:      10000,
  paymentReference: crypto.randomBytes(12).toString('hex'),
  narration:        'May 2026 subscription',
  customerEmail:    'ngozi@example.com'
});
```

---

## Bills Payment

Pay utility bills, buy airtime, subscribe to cable TV, and more. The flow always goes in the same order:

```
getBillerCategories()            → pick a category (e.g. "CABLE_TV")
  └─ listBillers({ categoryCode }) → pick a biller (e.g. "DSTV")
       └─ getBillerProducts({ billerCode }) → pick a product / plan
            └─ validateCustomer({ productCode, customerId }) → validate the customer
                 └─ vendBill({ productCode, customerId, amount, reference })
                      └─ requeryBillPayment({ reference }) → confirm outcome if needed
```

```js
import { BillsPayment } from 'monnify-nodejs-lib';

const api = new BillsPayment('SANDBOX');
const [, token] = await api.getToken();
```

### Methods

| Method | Description |
|---|---|
| `getBillerCategories(token, data?)` | List all biller categories (Airtime, Cable TV, Electricity, etc.) |
| `listBillers(token, data?)` | List billers, optionally filtered by `categoryCode` |
| `getBillerProducts(token, data)` | List products / plans for a specific biller |
| `validateCustomer(token, data)` | Validate a customer's identifier before paying |
| `vendBill(token, data)` | **Actually pay the bill** |
| `requeryBillPayment(token, data)` | Re-check the outcome of a bill payment |

### Example — End-to-End Bill Payment

```js
import crypto from 'crypto';

// 1. Find categories
const [, categoriesResp] = await api.getBillerCategories(token);
// e.g. categories: [{ categoryCode: 'CABLE_TV', categoryName: 'Cable TV' }, ...]

// 2. Find billers in a category
const [, billersResp] = await api.listBillers(token, { categoryCode: 'CABLE_TV' });
const { billerCode } = billersResp.responseBody.content[0];

// 3. Find products for the biller
const [, productsResp] = await api.getBillerProducts(token, { billerCode });
const { productCode, amount } = productsResp.responseBody.content[0];

// 4. Validate the customer's smart card number
const [, validateResp] = await api.validateCustomer(token, {
  productCode,
  customerId: '1234567890'  // e.g. DSTV smart card number
});

const validationReference = validateResp.responseBody?.vendInstruction?.requireValidationRef
  ? validateResp.responseBody.vendInstruction.validationReference
  : undefined;

// 5. Pay the bill
const reference = crypto.randomBytes(16).toString('hex');

const [statusCode, vendResp] = await api.vendBill(token, {
  productCode,
  customerId:  '1234567890',
  amount,
  reference,
  validationReference,  // include only if step 4 said it was required
  emailAddress: 'customer@example.com'
});

// 6. If the outcome was unclear, requery
if (statusCode !== 200) {
  const [, requery] = await api.requeryBillPayment(token, { reference });
  console.log(requery.responseBody);
}
```

---

## Verification (Value-Added Services)

Validate bank accounts and verify customer identity documents.

```js
import { Verification } from 'monnify-nodejs-lib';

const api = new Verification('SANDBOX');
const [, token] = await api.getToken();
```

### Methods

| Method | Description |
|---|---|
| `validateBankAccount(token, data)` | Confirm that an account number belongs to the expected name |
| `verifyBvnInformation(token, data)` | Retrieve BVN holder details |
| `matchBvnAndAccountName(token, data)` | Check that a BVN and bank account belong to the same person |
| `verifyNin(token, data)` | Retrieve NIN holder details |

### Example

```js
// Verify a bank account before sending money
const [statusCode, response] = await api.validateBankAccount(token, {
  accountNumber: '2085086393',
  bankCode:      '058'
});

console.log(response.responseBody.accountName); // the registered account name

// Verify NIN
const [, ninResp] = await api.verifyNin(token, { nin: '12345678901' });
```

---

## Error Handling

Every method returns a two-element array: `[httpStatusCode, responseBody]`. Check the status code before reading the body.

```js
const [statusCode, response] = await api.initiateSingleTransfer(token, payload);

if (statusCode === 200) {
  console.log('Transfer successful:', response.responseBody);
} else {
  console.error(`Transfer failed (${statusCode}):`, response);
}
```

If you pass an invalid or incomplete payload, the library throws a validation error **before** making any network request:

```js
try {
  await api.createMandate(token, { mandateReference: 'REF001' }); // missing required fields
} catch (err) {
  console.error(err.message); // "mandateDescription" is required ...
}
```

---

## Running the Tests

Clone the repo and install dependencies:

```bash
git clone https://github.com/Monnify/Monnify-Nodejs-lib.git
cd Monnify-Nodejs-lib
npm install
```

Export your sandbox credentials, then run the full test suite:

```bash
export MONNIFY_APIKEY=MK_TEST_XXXXXXXXXX
export MONNIFY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
export CONTRACT=1234567890
export WALLETACCOUNTNUMBER=0123456789

npm test
```

The suite runs **71 tests** across all 11 modules. All tests target the Monnify sandbox — no real money moves.

---

## Contributing

Contributions are welcome. Please open a pull request with a clear description of your changes. All PRs must:

- Pass `npm test` with no failures
- Follow the existing pattern: class extends `BaseRequestAPI`, Joi validators in `/validators/`, tests in `/tests/`
- Target the `dev` branch, not `main`
