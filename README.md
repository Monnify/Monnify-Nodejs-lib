# Monnify-Nodejs-lib (Beta Version)

This library is a Node.js wrapper for the Monnify API, providing seamless access to Monnify's core functionalities,
including handling disbursements, reserved accounts, subaccounts, transactions, refunds, and value-added services such as BVN and account validation.
It abstracts the API complexities, allowing developers to integrate Monnify services into their applications efficiently.


## Note: This is a beta version and is currently under review

---

### Table of Contents

- [Monnify-Nodejs-lib](#monnify-nodejs-lib)
    - [Table of Contents](#table-of-contents)
      - [Technologies](#technologies)
  - [To contribute](#to-contribute)
      - [Already Have node runtime Installed](#already-have-node-runtime-installed)
    - [Usage](usage)
        - [Test](#test)
        - [Installation](#installation)
        - [Configuration](#configuration)
        - [Usage](#usage)
        - [Initializing the MonnifyAPI Class](#initializing-the-monnifyApi-class)
        - [Main Entry Point - index.js](#main-entry-point-indexjs)
        - [Reserved Accounts API]()#reserved-accounts-api)
        - [Transactions API](#transactions-api)
        - [Sub Accounts API](#subaccounts-api)      
        - [Disbursements API](#disbursements-api)
        - [Refunds API](#refunds-api)
        - [Value-Added Services API](#value-added-services-api)

---

#### Technologies
This library was built and tested with node(version 16.14), but should also work for other versions. 

- axios
- crypto
  
[Back To The Top](#read-me-template)

---

## To contribute
Contributions are welcome! Please open a pull request with a detailed description of your changes.

#### Already Have node runtime Installed
```bash
clone the repo:

git clone https://github.com/Monnify/Monnify-Nodejs-lib.git

change to Monnify-Nodejs-lib directory:

cd Monnify-Nodejs-lib

install dependencies:

run npm install


set necessary environment variables:
    for *nix operating systems (MacOs and Linux)
            export MONNIFY_SECRET={your monnify secret key}
            export MONNIFY_APIKEY = {your monnify API key}
            export CONTRACT - {your monnif contract code}
            export WALLETACCOUNTNUMBER = {your monnify wallet account number}
            export MONNIFY_IP=35.242.133.146

    for windows OS
    You can use the set command
            set SECRET={your monnify secret key}
            
```

---

### Test
After Installation, you can run tests by running
```bash
npm test
```
---

#### Usage
### Installation
```bash
npm install monnify-api-wrapper
```

### Configuration
To use this library, you need Monnify API credentials, which include an API_KEY and SECRET_KEY. These should be obtained from your Monnify account on the developer page of your dashboard.

Import the library and initialize the MonnifyAPI class with your configuration settings.

```bash
import { MonnifyAPI } from 'monnify-api-wrapper';

You can set up your credentials however you want. Some examples include the following listed below:
const config = {
    MONNIFY_APIKEY: 'YOUR_API_KEY',
    MONNIFY_SECRET: 'YOUR_SECRET_KEY',
    env: 'sandbox' // or 'live'
};

const monnify = new MonnifyAPI(config);
```
OR

```bash
process.env.MONNIFY_APIKEY = 'YOUR_API_KEY'
process.env.MONNIFY_SECRET = 'YOUR_SECRET_KEY'
process.env.environment = 'sandbox' // or 'live'
```
You could also make use of the dotenv library, passing your credentials into a .env file and doing the following:
```bash
npm install dotenv
```

Then in your base class:

```bash
import dotenv from 'dotenv';
dotenv.config({ path: './.env' })
```

### Main Entry Point - index.js
The index.js file in this library serves as the primary entry point for accessing all the Monnify API functionalities through the MonnifyAPI class.
This class integrates the various components of the API wrapper (e.g., Reserved Accounts, Transactions, Disbursements, etc.)
and provides a streamlined way to initialize and access all available API methods.

Initialization Example
Here's how to initialize the MonnifyAPI class to start using the library:
```bash
import { MonnifyAPI } from 'monnify-api-wrapper';

const config = {
    MONNIFY_APIKEY: 'YOUR_API_KEY',
    MONNIFY_SECRET: 'YOUR_SECRET_KEY',
    env: 'sandbox' // or 'live'
};

const monnify = new MonnifyAPI(config);
```
With this single instance, you can now access all API modules provided by Monnify:
```bash
 Reserved Accounts via monnify.reservedAccount
 Transactions via monnify.transaction
 Disbursements via monnify.disbursement
 Refunds via monnify.refund
 Sub Accounts via monnify.subAccount
 Value-Added Services via monnify.verification
 Each API module contains methods that map directly to Monnify’s API, allowing you to perform operations such as initiating transfers,
 validating bank accounts, and retrieving transaction details, all from a single initialized instance.
 ```

### Reserved Accounts API
Manage reserved accounts for seamless transaction tracking.

#### Methods:
```bash
 createReservedAccount(authToken, data): Creates a new reserved account.
 addLinkedAccounts(authToken, data): Links accounts to a reserved account.
 reservedAccountDetails(authToken, data): Retrieves reserved account details.
 reservedAccountTransactions(authToken, data): Fetches transactions associated with a reserved account.
 deallocateReservedAccount(authToken, data): Deletes a reserved account.
 updateReservedAccountKycInfo(authToken, data): Updates the KYC information for a reserved account.
 ```
#### Example Usage:
```bash
let payload = {"customerName":"Tester","customerEmail":"tester@tester.com",
    "accountName":"tester","amount":2000,"contractCode":"7059707855","bvn": "21212121212"};

await monnify.reservedAccount.createReservedAccount(authToken,payload);
```

### Transactions API
Facilitate various payment methods and track transaction statuses.

#### Methods:
```bash
 initTransaction(authToken, data): Initializes a new transaction.
 getTransactionStatusv2(authToken, data): Retrieves transaction status (version 2).
 getTransactionStatusv1(authToken, data): Retrieves transaction status (version 1).
 payWithUssd(authToken, data): Initiates payment using USSD.
 payWithBankTransfer(authToken, data): Initiates payment via bank transfer.
 chargeCard(authToken, data): Charges a card.
 authorizeOtp(authToken, data): Authorizes a transaction using OTP.
 ThreeDsSecureAuthTransaction(authToken, data): Completes 3D Secure transaction authorization.
 cardTokenization(authToken, data): Tokenizes a card for future use.
 ```
#### Example Usage:

```bash
let payload = {"customerName":"Tester","customerEmail":"tester@tester.com",
    "accountName":"tester","amount":2000,"contractCode":"7059707855","bvn": "21212121212"};

payload.paymentMethods = ["CARD", "ACCOUNT_TRANSFER"]
payload.paymentReference = crypto.randomBytes(20).toString('hex')
payload.paymentDescription = "Payment Attempt"
payload.redirectUrl = "https://google.com"

await monnify.transaction.initTransaction(authToken, payload);
```
### Sub Accounts API
Manage subaccounts linked to the main Monnify account.

#### Methods:
```bash
 createSubAccount(authToken, data): Creates a new sub-account.
 deleteSubAccount(authToken, data): Deletes an existing sub-account.
 getSubAccounts(authToken): Retrieves all sub-accounts.
 updateSubAccount(authToken, data): Updates an existing sub-account.
 ```
#### Example Usage:

```bash
let subAccountPayload;
subAccountPayload = {
        "currencyCode": "NGN",
        "bankCode": "057",
        "accountNumber":"2085886393",
        "email": "tochukwusage4@gmail.com",
        "defaultSplitPercentage": defaultSplitPercentage
    };

await monnify.subAccount.createSubAccount(authToken, [subAccountPayload]);
```



### Disbursements API
Facilitate single and bulk disbursements.

#### Methods:
```bash
 initiateSingleTransfer(authToken, data): Initiates a single disbursement.
 initiateBulkTransfer(authToken, data): Initiates a bulk disbursement.
 authorizeSingleTransfer(authToken, data): Authorizes a single transfer.
 authorizeBulkTransfer(authToken, data): Authorizes a bulk transfer.
 resendTransferOTP(authToken, data): Resends the OTP for a transfer.
 getSingleTransferStatus(authToken, data): Retrieves status of a single transfer.
 getBulkTransferStatus(authToken, data): Retrieves status of a bulk transfer.
 getAllSingleTransfers(authToken, data): Retrieves all single transfers.
 getAllBulkTransfers(authToken, data): Retrieves all bulk transfers.
 ```
#### Example Usage:
```bash
let payload = {"sourceAccountNumber": "3934178936", "destinationBankCode": "057","destinationAccountNumber": "2085086393","amount":2000};

await monnify.disbursement.initiateSingleTransfer(authToken, payload);
```
### Refunds API
Handle refunds for transactions.

#### Methods:
```bash
 initiateRefund(authToken, data): Initiates a transaction refund.
 getAllRefunds(authToken, data): Retrieves all refunds.
 getRefundStatus(authToken, data): Gets the status of a specific refund.
 ```bash

#### Example Usage:
```bash
refundPayload = {
        transactionReference: "MNFY|23|20241009140544|000009",
        refundReference: refundReference,
        refundReason: "Customer Request",
        refundAmount: 100,
        customerNote: "Refund Note",
        destinationAccountNumber: "8088523241",
        destinationAccountBankCode: "305"
    };

await monnify.refund.initiateRefund(authToken, refundPayload);
```
### Value-Added Services API
Access additional verification services for enhanced security.

#### Methods:
```bash
 validateBankAccount(authToken, data): Validates a bank account.
 verifyBvnInformation(authToken, data): Verifies BVN information.
 matchBvnAndAccountName(authToken, data): Matches BVN and account names.
 ```
#### Example Usage:
```bash
const payload = {
    accountNumber: "3000246601",
    bankCode: "035",
    bvn: "22222222226",
    dateOfBirth: "27-Apr-1993",
    mobileNo: "08016857829"
};

await monnify.verification.validateBankAccount(authToken, payload);
```

