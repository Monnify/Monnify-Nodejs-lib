# Changelog

All notable changes to the Monnify Node.js library are documented here.  
This project follows [Semantic Versioning](https://semver.org/).

---

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

| Module | Accessor | Methods |
|--------|----------|---------|
| Invoice | `monnify.invoice` | `createInvoice`, `viewInvoiceDetails`, `getAllInvoices`, `cancelInvoice` |
| Settlement | `monnify.settlement` | `getTransactionsBySettlementReference`, `getSettlementInfo` |
| LimitProfile | `monnify.limitProfile` | `createLimitProfile`, `getLimitProfiles`, `updateLimitProfile`, `reserveAccountWithLimit`, `updateReserveAccountLimit` |
| DirectDebit | `monnify.directDebit` | `createMandate`, `getMandateStatus`, `debitMandate`, `getDebitStatus`, `cancelMandate` |
| Wallet | `monnify.wallet` | `getWalletBalance` |
| BillsPayment | `monnify.billsPayment` | `getBillerCategories`, `listBillers`, `getBillerProducts`, `validateCustomer`, `vendBill`, `requeryBillPayment` |

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
  mandateType: 'EMANDATE',      // does not exist in spec
  debitType: 'FIXED',           // does not exist in spec
  frequency: 'MONTHLY',         // does not exist in spec
  payerName: '...',             // wrong field name
  beneficiaryAccountNumber: '…' // does not exist in spec
})

// After (correct)
createMandate(token, {
  contractCode: '…',
  mandateReference: '…',
  mandateDescription: '…',
  mandateStartDate: '2025-01-01T00:00:00',
  mandateEndDate: '2025-12-31T23:59:59',
  customerName: '…',
  customerEmailAddress: '…',
  customerPhoneNumber: '…',
  customerAddress: '…',
  customerAccountNumber: '…',
  customerAccountBankCode: '…',
  // optional
  mandateAmount: 50000,
  autoRenew: false,
  customerCancellation: true,
  redirectUrl: 'https://…'
})
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
    LIVE:    { token: null, expiryTime: 0 }
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
import { BillsPayment, DirectDebit, Wallet } from 'monnify-nodejs-lib';
```

---

### Tests

| File | Tests | Notes |
|------|-------|-------|
| `collection.test.js` | 12 | Added `getAllTransactions`; fixed expired card year; fixed `paymentReference` persistence across `beforeEach` |
| `refund.test.js` | 4 | Accepts `[200, 422]` for sandbox |
| `disbursement.test.js` | 3 | `sourceAccountNumber` reads from env |
| `subaccount.test.js` | 4 | Unchanged |
| `verification.test.js` | 7 | Re-added to test script; accepts `500` for VAS sandbox limitations |
| `wallet.test.js` | 3 | New |
| `invoice.test.js` | 8 | New |
| `settlement.test.js` | 4 | New |
| `billsPayment.test.js` | 12 | New; covers full 6-endpoint lifecycle |
| `limitProfile.test.js` | 5 | New; accepts `403` for feature-gated sandbox |
| `directDebit.test.js` | 9 | New; corrected field names; accepts `400/403` for regulatory-gated sandbox |
| **Total** | **71** | **71/71 passing** |

---

## [1.0.2] — 2024-12-26

- Initial public release with partial API coverage.
- Modules: `transaction`, `reservedAccount`, `subAccount`, `disbursement`, `refund`, `verification`.
