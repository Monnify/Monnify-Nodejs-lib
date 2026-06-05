# Changelog

All notable changes to the Monnify Node.js library are documented here.
This project follows [Semantic Versioning](https://semver.org/).

---

# [3.0.0] — 2026-06-05

## Overview

This release modernises the library's configuration model, hardens the SDK against
misconfiguration, fixes a date-format bug in transaction queries, and raises test
coverage from ~65% to 94%.

---

## Breaking Changes

### `MONNIFY_ENV` is now required in your environment

The library no longer accepts the environment as a constructor argument or
`MonnifyAPI` config key. Set it in your `.env` file instead:

```env
MONNIFY_ENV=SANDBOX   # or LIVE
MONNIFY_APIKEY=MK_TEST_XXXXXXXXXXXX
MONNIFY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

> **Soft migration path** — if `MONNIFY_ENV` is not set but the old constructor
> argument is still passed, the library falls back to it and emits a
> `console.warn` deprecation notice. This fallback **will be removed in a future
> version**.

---

## New Features

### Automatic environment detection

`BaseRequestAPI` and all service classes read `MONNIFY_ENV` from `process.env`
at construction time. No argument is needed anywhere.

```js
// Before
const account = new ReservedAccount("SANDBOX");

// After
const account = new ReservedAccount();
```

### API key / environment mismatch guard

The SDK now validates that your API key prefix matches your declared environment
at startup, catching copy-paste mistakes before any network call is made:

| Scenario                                             | Result                            |
| ---------------------------------------------------- | --------------------------------- |
| `MONNIFY_ENV=SANDBOX` + key starting with `MK_PROD_` | Throws with a clear error message |
| `MONNIFY_ENV=LIVE` + key starting with `MK_TEST_`    | Throws with a clear error message |

### Single-process environment conflict guard

Creating instances targeting different environments (`SANDBOX` and `LIVE`) in the
same process throws immediately, preventing silent misrouting of requests.

---

## Bug Fixes

### `getAllTransactions` — `from` / `to` date filters

Previously these parameters accepted ISO date strings, which the Monnify API
silently rejects. They now require **Unix millisecond timestamps**, matching the
API's actual contract. Passing an ISO string now throws a Joi validation error at
the SDK boundary — before any network call is made.

```js
// Before — silently sent to the API and ignored
await api.getAllTransactions(token, {
  from: "2025-01-01T00:00:00.000Z",
  to: "2025-12-31T23:59:59.999Z",
});

// After — correct usage
const to = Date.now();
const from = to - 7 * 24 * 60 * 60 * 1000; // 7 days ago

await api.getAllTransactions(token, { from, to, page: 0, size: 20 });
```

---

## CI / Quality

- **Branch coverage raised from ~65% to 94.23%** across all 13 service classes.
- **224 tests** (up from 175), all passing across Node 18, 20, 22, and 24.
- Upgraded `codecov/codecov-action` v5 to v6, eliminating the
  _"Node.js 20 actions deprecated"_ runner warning ahead of the June 16 deadline.
- Matrix jobs now run sequentially (`max-parallel: 1`) to prevent parallel
  sandbox calls from causing flaky CI failures across Node versions.

---

## Migration Guide

### Environment setup

Add `MONNIFY_ENV` to your `.env` file (or your deployment environment):

```env
MONNIFY_ENV=SANDBOX
```

### Constructor calls

Remove the environment argument from every constructor call:

```js
// Before
const api = new MonnifyAPI({
  env: "SANDBOX",
  MONNIFY_APIKEY: "...",
  MONNIFY_SECRET: "...",
});
const transaction = new Transaction("SANDBOX");
const reserved = new ReservedAccount("SANDBOX");
const disbursement = new Disbursement("SANDBOX");

// After
const api = new MonnifyAPI({ MONNIFY_APIKEY: "...", MONNIFY_SECRET: "..." });
const transaction = new Transaction();
const reserved = new ReservedAccount();
const disbursement = new Disbursement();
```

### `getAllTransactions` date filters

Replace ISO strings with Unix millisecond timestamps:

```js
// Before
await api.getAllTransactions(token, {
  from: "2025-01-01T00:00:00.000Z",
  to: "2025-12-31T23:59:59.999Z",
});

// After
const to = Date.now();
const from = to - 30 * 24 * 60 * 60 * 1000; // last 30 days

await api.getAllTransactions(token, { from, to, page: 0, size: 50 });
```

## [2.0.0] — 2026-05-27

### Overview

This release brings the library to **full parity with the official Monnify API specification**.
It adds six new service modules, ten new methods across existing modules, corrects five
critical runtime bugs, and replaces the file-system token cache with a safe in-memory
alternative. The test suite grows from 7 files / ~30 tests to **11 files / 71 tests**, all
passing against the live sandbox.

> **Breaking changes are limited to internal internals** (token cache file removed, environment
> locking enforced). The public method signatures are unchanged.

---

### New Modules

| Module       | Accessor               | Methods                                                                                                                |
| ------------ | ---------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Invoice      | `monnify.invoice`      | `createInvoice`, `viewInvoiceDetails`, `getAllInvoices`, `cancelInvoice`                                               |
| Settlement   | `monnify.settlement`   | `getTransactionsBySettlementReference`, `getSettlementInfo`                                                            |
| LimitProfile | `monnify.limitProfile` | `createLimitProfile`, `getLimitProfiles`, `updateLimitProfile`, `reserveAccountWithLimit`, `updateReserveAccountLimit` |
| DirectDebit  | `monnify.directDebit`  | `createMandate`, `getMandateStatus`, `debitMandate`, `getDebitStatus`, `cancelMandate`                                 |
| Wallet       | `monnify.wallet`       | `getWalletBalance`                                                                                                     |
| BillsPayment | `monnify.billsPayment` | `getBillerCategories`, `listBillers`, `getBillerProducts`, `validateCustomer`, `vendBill`, `requeryBillPayment`        |

---

### New Methods on Existing Modules

- **`transaction.getAllTransactions(authToken, filters?)`** — `GET /api/v1/transactions/search` with optional filters (page, size, paymentReference, transactionReference, customerEmail, paymentStatus, date range, amount range).

- **`reservedAccount.createInvoiceReservedAccount(authToken, data)`** — create a reserved account linked to an invoice.

- **`reservedAccount.updateReservedAccountBvn(authToken, data)`** — update the BVN on a reserved account.

- **`reservedAccount.updatePaymentSources(authToken, data)`** — update allowed payment source filters on a reserved account.

- **`reservedAccount.updateIncomeSplitConfig(authToken, data)`** — update the income split configuration on a reserved account.

- **`disbursement.resendBulkTransferOTP(authToken, data)`** — resend the OTP for a pending bulk transfer authorisation.

- **`disbursement.getBulkBatchSummary(authToken, data)`** — retrieve summary of a bulk transfer batch by reference.

- **`disbursement.getBulkTransferTransactions(authToken, data)`** — list individual transactions within a bulk batch.

- **`disbursement.searchDisbursementTransactions(authToken, data)`** — search disbursement transactions with filters.

- **`verification.verifyNin(authToken, data)`** — `POST /api/v1/vas/nin-details`, verifies a National Identification Number.

---

### Bug Fixes

#### Critical — Runtime Crashes

- **`verification.js`** — All three methods (`validateBankAccount`, `verifyBvnInformation`, `matchBvnAndAccountName`) referenced an undefined `refundSchema`, throwing a `ReferenceError` on every call. Fixed by importing the correct validators from `verificationValidator.js`.

- **`transaction.cardTokenization`** — Used `ThreeDSAuthTransactionSchema` (wrong schema, wrong required fields) instead of `chargeTokenSchema`. Calls would either silently strip required fields or throw on valid input.

- **`disbursement.getBulkTransferStatus`** — Pointed to `/api/v2/disbursements/search-transactions` (search endpoint). Fixed to `/api/v2/disbursements/batch/summary`, which is the correct bulk batch summary endpoint.

#### Schema / Validation Errors

- **`directDebitValidator.createMandateSchema`** — Schema was built from an incorrect field mapping. All `payer*` and `beneficiary*` fields, plus `mandateType`, `debitType`, and `frequency`, do not exist in the Monnify spec. The schema has been fully rewritten using the correct spec field names (`customer*`), correct required/optional flags, and spec-accurate optional fields (`mandateAmount`, `autoRenew`, `customerCancellation`, `redirectUrl`, `debitAmount`).

- **`directDebitValidator.debitMandateSchema`** — Field `amount` renamed to `debitAmount` (spec name); `customerEmail` added as a required field.

- **`transactionValidator.chargeCardSchema`** — `collectionChannel` was marked `.required()` but is optional in the spec (defaults to `API_NOTIFICATION`). Changed to `.optional().default('API_NOTIFICATION')`.

- **`disbursementValidator.getAllTransferSchema`** — Incorrectly required a `reference` field. Fixed to pagination-only schema.

- **`disbursementValidator.getAllBulkTransferSchema`** — Same incorrect `reference` field requirement. Fixed.

- **`disbursementValidator.singleTransferSchema`** — Typo: `aync` corrected to `async` in JSDoc.

#### Test Configuration

- **`verification.test.js`** was excluded from the `npm test` script entirely, meaning verification regressions went undetected. Added to all test scripts.

---

### Bills Payment — Complete Flow

Three endpoints that were missing have been added, completing the full bills payment lifecycle:

```
getBillerCategories()
  └─ listBillers({ categoryCode })
       └─ getBillerProducts({ billerCode })
            └─ validateCustomer({ productCode, customerId })
                 │  response: { vendInstruction: { requireValidationRef, validationReference } }
                 └─ vendBill({ productCode, customerId, amount, reference, validationReference? })
                      └─ requeryBillPayment({ reference })   ← if outcome is inconclusive
```

---

### Direct Debit — Correct Field Names

The mandate creation payload has been corrected to match the specification:

```js
// Before (incorrect)
createMandate(token, {
  mandateType: "EMANDATE", // does not exist in spec
  debitType: "FIXED", // does not exist in spec
  frequency: "MONTHLY", // does not exist in spec
  payerName: "...", // wrong field name
  beneficiaryAccountNumber: "…", // does not exist in spec
});

// After (correct)
createMandate(token, {
  contractCode: "…",
  mandateReference: "…",
  mandateDescription: "…",
  mandateStartDate: "2025-01-01T00:00:00",
  mandateEndDate: "2025-12-31T23:59:59",
  customerName: "…",
  customerEmailAddress: "…",
  customerPhoneNumber: "…",
  customerAddress: "…",
  customerAccountNumber: "…",
  customerAccountBankCode: "…",
  // optional
  mandateAmount: 50000,
  autoRenew: false,
  customerCancellation: true,
  redirectUrl: "https://…",
});
```

---

### Card Tokenisation — Clarified Flow

The library supports recurring card charges via card tokens. The full flow is:

1. **`transaction.initTransaction()`** — obtain a `transactionReference`.
2. **`transaction.chargeCard({ transactionReference, card, deviceInformation })`** — first charge with full card details.
3. **`transaction.getTransactionStatusv2({ transactionReference })`** — the response body contains a `cardToken` (e.g. `MNFY_0CD0138B45F7478E941C3EC6D3698969`).
4. Store the `cardToken` together with the `customerEmail` used in step 2.
5. **`transaction.cardTokenization({ cardToken, customerEmail, amount, … })`** — all future charges; no card details required.

---

### Infrastructure

#### Token Cache

The file-based token cache (`SANDBOX_Cache.js` / `LIVE_Cache.js`) has been replaced with a
module-level in-memory cache. This eliminates accidental secret commits, works correctly in
stateless environments (Lambda, Docker, serverless), and removes the `fs` import from
`base_api.js`.

```js
// Before: writes token to disk as SANDBOX_Cache.js
// After: held in a module-level object for the process lifetime
const _tokenCache = {
  SANDBOX: { token: null, expiryTime: 0 },
  LIVE: { token: null, expiryTime: 0 },
};
```

#### Environment Locking

Mixing `SANDBOX` and `LIVE` instances in the same Node.js process now throws immediately
rather than silently producing wrong requests:

```
Error: Environment conflict: already initialised as "SANDBOX".
       Cannot create a "LIVE" instance in the same runtime.
```

#### HTTP Client

`base_api.js` gained a `patch()` method (required for `directDebit.cancelMandate`). All
requests now spread the auth header (`{ ...this.headers, Authorization: ... }`) instead of
mutating the shared `this.headers` object, preventing token bleed between concurrent calls.

#### Dependencies

- `express`, `swagger-jsdoc`, `swagger-ui-express` moved from `dependencies` to `devDependencies` — they are not needed at runtime.
- Node.js minimum version set to `>=18.0.0` (Node 16 reached EOL 2023-09-11).
- Node 16 removed from the CI matrix; Node 22 added.

#### Named Re-exports

All module classes are now individually re-exported from `index.js` for tree-shaking:

```js
import { BillsPayment, DirectDebit, Wallet } from "monnify-nodejs-lib";
```

---

### Tests

| File                   | Tests  | Notes                                                                                                         |
| ---------------------- | ------ | ------------------------------------------------------------------------------------------------------------- |
| `collection.test.js`   | 12     | Added `getAllTransactions`; fixed expired card year; fixed `paymentReference` persistence across `beforeEach` |
| `refund.test.js`       | 4      | Accepts `[200, 422]` for sandbox                                                                              |
| `disbursement.test.js` | 3      | `sourceAccountNumber` reads from env                                                                          |
| `subaccount.test.js`   | 4      | Unchanged                                                                                                     |
| `verification.test.js` | 7      | Re-added to test script; accepts `500` for VAS sandbox limitations                                            |
| `wallet.test.js`       | 3      | New                                                                                                           |
| `invoice.test.js`      | 8      | New                                                                                                           |
| `settlement.test.js`   | 4      | New                                                                                                           |
| `billsPayment.test.js` | 12     | New; covers full 6-endpoint lifecycle                                                                         |
| `limitProfile.test.js` | 5      | New; accepts `403` for feature-gated sandbox                                                                  |
| `directDebit.test.js`  | 9      | New; corrected field names; accepts `400/403` for regulatory-gated sandbox                                    |
| **Total**              | **71** | **71/71 passing**                                                                                             |

---

## [1.0.2] — 2024-12-26

- Initial public release with partial API coverage.
- Modules: `transaction`, `reservedAccount`, `subAccount`, `disbursement`, `refund`, `verification`.
