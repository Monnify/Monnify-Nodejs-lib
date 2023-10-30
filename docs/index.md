# Monnify-Nodejs-lib
This is Nodejs wrapper for the Monnify API

---

### Table of Contents

- [Monnify-Nodejs-lib](#monnify-nodejs-lib)
    - [Table of Contents](#table-of-contents)
      - [Installation](#installation)
      - [Examples](#examples)
      - [API Reference Guide](#api-reference-guide)
        - [Class BaseRequestAPI](#class-baserequestapi)
        - [Class ReservedAccount](#class-reservedaccount)
        - [Class Transaction](#class-transaction)
        - [Class Disbursement](#class-disbursement)

---

#### Installation

To install the library, simply run:

```bash
npm install monnify-nodejs
```

#### Examples

```js
import Transaction, ReservedAccount from monnify-nodejs

const instance0 = new ReservedAccount('sandbox');

//Get access token
const [code, token] = instance0.getToken()

console.log(code, token);

//Generate Reserved Account

const [responseCode,response] = instance0.createReservedAccountV2(
    token,
    customerName,
    customerEmail,
    accountName
)

console.log(responseCode,response)

```

---

#### API Reference Guide

##### Class BaseRequestAPI

This is an Internal base class and should be used when you intend to extend the capability of the base class

**Parameters:**
        environment - This is the Monnify environment being used; this could either be sandbox or live.  

**Returns:** An instance of the BaseRequestAPI
  

**async BaseRequestAPI.getToken**(cache=true : Boolean):
Fetches the Monnify access token

**Parameters:**
        cache - A boolean that determines wether the access token is cached or not. If cached, the access token is regenerated once its expiration  is less than the set TOKENEXPIRATION environment variable

**Returns:** An array containing the statusCode and access token in order.


**async BaseRequestAPI.getCachedToken**():
Fetches the Monnify access token from cache.
By default, this method reads access token from a file with environment variable name TOKENFILE. override this method if you want to use a different retrieval source.


**Returns:** A string of access token


**async BaseRequestAPI.getCachedToken**():
Fetches the Monnify access token from cache.
By default, this method reads access token from a file with environment variable name TOKENFILE. override this method if you want to use a different retrieval source.


**Returns:** A string of access token

**async BaseRequestAPI.setToken**(tokenObject: String, timeStamp: Unixtimestamp):  
Writes the Monnify access token to cache.
By default, this method write access token to a file with environment variable name TOKENFILE. override this method if you want to write to a different data source.

**Parameters:**
        tokenObject - The generated access token
        timeStamp - A unix time stamp of how long

**Returns:** None


**async BaseRequestAPI.get**(url_path: String, authorization: String):  
Makes a get request to Monnify

**Parameters:**
        url_path - The Monnify path url called
        authorization - The Monnify access token
    
**Returns:** An array of statusCode and API response in order

**async BaseRequestAPI.post**(url_path: String, authorization: String,data: Object):  
Makes a post request to Monnify

**Parameters:**
        url_path - The Monnify path url called
        authorization - The Monnify access token
        data: An object of the request payload sent

**Returns:** An array of statusCode and API response in order


**async BaseRequestAPI.put**(url_path: String, authorization: String,data: Object):  
Makes a put request to Monnify

**Parameters:**
        url_path - The Monnify path url called
        authorization - The Monnify access token
        data: An object of the request payload sent

**Returns:** An array of statusCode and API response in order

**async BaseRequestAPI.delete**(url_path: String, authorization: String):  
Makes a delete request to Monnify

**Parameters:**
        url_path - The Monnify path url called
        authorization - The Monnify access token

**Returns:** An array of statusCode and API response in order

**async BaseRequestAPI.computeTransactionHash**(payload: Object, signature: String):  
Compute webhook transaction hash

**Parameters:**
        payload - The webhook payload from Monnify
        signature - The transaction hash from Monnify

**Returns:** A boolean value that confirms if signature mathches calculated hash  





##### Class ReservedAccount
An importable class for interacting with the Monnify reserved account API

**Parameters:**
        environment - This is the Monnify environment being used; this could either be sandbox or live.  

**Returns:** An instance of the ReservedAccount class

**Usage:**
```js
import ReservedAccount from 'monnify-node'

const instance = new ReservedAccount('sandbox')

const [code,token] = await instance.getToken()

const [code,response] = await instance.createReservedAccount(token,'test','test@tester.com','test',preferredBanks=['50515','232'])

console.log(response)

{
  requestSuccessful: true,
  responseMessage: 'success',
  responseCode: '0',
  responseBody: {
    contractCode: '7059707855',
    accountReference: 'c5bd9ca8484f325ff205e283c8d32f326d74031b',
    accountName: 'tes',
    currencyCode: 'NGN',
    customerEmail: 'test@tester.com',
    customerName: 'mao  Zhang',
    accounts: [ [Object], [Object] ],
    collectionChannel: 'RESERVED_ACCOUNT',
    reservationReference: 'LHDDZ0ZZZMN9ZSWTTW22',
    reservedAccountType: 'GENERAL',
    status: 'ACTIVE',
    createdOn: '2023-10-29 18:31:30.808',
    incomeSplitConfig: [],
    restrictPaymentSource: false
  }
}

```

**async ReservedAccount.createReservedAccount**( authToken: String,customerName:String,customerEmail:String,accountName:String,{accountReference='': String,getAllAvailableBanks=true: Boolean,preferredBanks=[]: Array,bvn='': String,currencyCode='NGN': String,incomeSplitConfig={}: Object,restrictPaymentSource=false: Boolean,allowPaymentSource={}: Object}):  

Creates Reserved account

**Parameters:**
        authToken - The access token
        customerName - The customer's name
        customerEmail - The customer's email
        accountName - The name to be displayed during name enquiry
        optional.accountReference - A unique reference generated by the developer or the library auto generates it
        optional.bvn - The customer's bvn
        optional.currencyCode - The currency unit, default is NGN
        optional.
        optional.incomeSplitConfig - A configuration on how payments are to be split among subaccounts
        optional.restrictPaymentSource - Decides if payment should be restricted to some reserved accounts
        optional.allowPaymentSource - This captures bvns or account numbers or account names that are permitted to fund a reserved account. This is mandatory if restrictPaymentSource is set to true


**Returns:** An array of statusCode and API response in order


**async ReservedAccount.addLinkedAccounts**(authToken: String,accountReference: String, preferredBanks: Array)
Adds extra banks to existing reserved account

**Parameters:**
            authToken - The access token
            accountReference - The accountReference of the existing reserved account
            preferredBanks - An array of desired bank codes


**Returns:** An array of statusCode and API response in order


**async ReservedAccount.getReservedAccountDetails**(authToken: String,accountReference: String)

Fetches details of a reserved account given its account reference

**Parameters:**
            authToken - The access token
            accountReference - The accountReference of the existing reserved account

**Returns:** An array of statusCode and API response in order


**async ReservedAccount.getReservedAccountTransactions**(authToken: String,accountReference: String)

Fetches transactions made by a reserved account

**Parameters:**
            authToken - The access token
            accountReference - The accountReference of the existing reserved account

**Returns:** An array of statusCode and API response in order  



##### Class Transaction
An importable class for interacting with the Monnify transaction account API

**Parameters:**
        environment - This is the Monnify environment being used; this could either be sandbox or live.  

**Returns:** An instance of the Transaction class


**async Transaction.InitTransactions**(authToken: String,amount: float,customerName: String,customerEmail: String,paymentDescription: String,{paymentReference='': String,currencyCode='NGN': String,metaData={}: Object})

**Parameters:**
            authToken - The access token
            amount - The amount to be paid
            customerName - The customer's name
            customerEmail - The customer's email
            paymentDescription - The payment description
            optional.paymentReference - The merchant's unique reference, this will be automatically generated if not provided
            optional.currencyCode - The currency to be paid, default is NGN
            optional.metaData - The metaData allows passing extra request parameter.

**Returns:** An array of statusCode and API response in order  

**async Transaction.getTransactionStatusV2**(authToken: String, transactionReference)
Gets the status of a transaction via the Monnify transactionReference


**Parameters:**
            authToken - The access token
            transactionReference - The Monnify transaction reference

**Returns:** An array of statusCode and API response in order


**async Transaction.getTransactionStatusV1**(authToken: String, paymentReference)
Gets the status of a transaction via the Monnify transactionReference


**Parameters:**
            authToken - The access token
            paymentReference - The merchant generated payment reference

**Returns:** An array of statusCode and API response in order  



##### Class Disbursement
An importable class for interacting with the Monnify disbursement API

**Parameters:**
        environment - This is the Monnify environment being used; this could either be sandbox or live.  

**Returns:** An instance of the Disbursement class


**async Disbursement.initiateSingleTransfer**(authToken: String,amount: Float,narration: String,destinationBankCode: String,destinationAccountNumber: String,{currency='NGN': String,reference: String,async=false: Boolean})

Initiates single transfers

**Parameters:**
            authToken - The access token
            amount - The amount to be paid
            destinationBankCode - The bank code of the destination bank
            destinationAccountNumber - The receiver's account number
            narration - The payout narration
            optional.reference - The merchant's unique reference, this will be automatically generated if not provided
            optional.currency - The currency to be disbursed, default is NGN
            optional.async - Set to true if you want disbursement to processed asynchronously


**Returns:** An array of statusCode and API response in order  


**async Disbursement.initiateBulkTransfer**(authToken: String,title: String,narration: String,transactionList: Array,{batchReference='': String,onValidationFailure='CONTINUE': String,notificationInterval=25: Integer})

Initiates bulk transfers

**Parameters:**
            authToken - The access token
            title - The title of the batch disbursement
            narration - The payout narration
            transactionList - A list of transactions to be processed
            optional.batchReference - The merchant's unique reference, this will be automatically generated if not provided
            optional.onValidationFailure - Decision to be taken if any of the disbursement batches fail. Either BREAK or CONTINUE.
            optional.notificationInterval - This determines how often Monnify should notify the merchant of its progress when processing a batch transfer


**Returns:** An array of statusCode and API response in order  


**async Disbursement.authorizeSingleTransfer**(authToken: String,reference: String,authorizationCode: String)

Authorizes a single transfer

**Parameters:**
            authToken - The access token
            reference - The reference used for the disbursement
            authorizationCode - The OTP sent to merchant's email

**Returns:** An array of statusCode and API response in order  


**async Disbursement.authorizeBulkTransfer**(authToken: String,reference: String,authorizationCode: String)

Authorizes a bulk transfer

**Parameters:**
            authToken - The access token
            reference - The batchreference used for the disbursement
            authorizationCode - The OTP sent to merchant's email

**Returns:** An array of statusCode and API response in order  


**async Disbursement.resendTransferOTP**(authToken: String,reference: String)

Resends OTP for transfer

**Parameters:**
            authToken - The access token
            reference - The reference used for the disbursement

**Returns:** An array of statusCode and API response in order  


**async Disbursement.getSingleTransferStatus**(authToken: String,reference: String)

Get status for single transfer

**Parameters:**
            authToken - The access token
            reference - The reference used for the disbursement

**Returns:** An array of statusCode and API response in order  


**async Disbursement.getBulkTransferStatus**(authToken: String,reference: String)

Get status for single transfer

**Parameters:**
            authToken - The access token
            reference - The reference used for the disbursement

**Returns:** An array of statusCode and API response in order  


**async Disbursement.getAllSingleTransfers**(authToken: String,{pageNo=0: Integer,pageSize=10: Integer})

Fetches all single transfers done

**Parameters:**
            authToken - The access token
            optional.pageNo - A number specifying what page of transfers to be retrieved
            optional.pageSize - The number of transfer records to returned

**Returns:** An array of statusCode and API response in order  


**async Disbursement.getAllBulkTransfers**(authToken: String,{pageNo=0: Integer,pageSize=10: Integer})

Fetches all single transfers done

**Parameters:**
            authToken - The access token
            optional.pageNo - A number specifying what page of transfers to be retrieved
            optional.pageSize - The number of transfer records to returned

**Returns:** An array of statusCode and API response in order  




  

