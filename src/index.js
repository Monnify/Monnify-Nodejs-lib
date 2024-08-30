import { Disbursement } from './disbursement.js';
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { ReservedAccount, Transaction } from './collection.js';
import { Verification } from './verification.js';
import { SubAccount } from './subAccount.js';
import { TransactionRefund } from './refund.js';

const app = express();
const path = '/c/PROJECTS/Monnify';
// Middleware to parse JSON bodies
app.use(express.json());
/*
(async () => {
    try {
        // Set up environment (sandbox or live)
        const disbursement = new Disbursement('sandbox');

        // Example Usage - Get a Token
        const [status, token] = await disbursement.getToken();
        //console.log('Token:', token);

        // Example Usage - Initiate a Single Transfer
        const [transferStatus, transferResponse] = await disbursement.initiateSingleTransfer(
            token,
            5000, // amount
            "Payment for services", // narration
            "035", // destinationBankCode
            "1234567890" // destinationAccountNumber
        );
        console.log('Init Single Transfer Response:', transferResponse);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();
*
(async () => {
    try {
        // Set up environment (sandbox or live)
        const transaction = new Transaction('sandbox');

        // Example Usage - Get a Token
        const [status, token] = await transaction.getToken();
        //console.log('Token:', token);

        // Example Usage - Initiate a Single Transfer
        const [transferStatus, transferResponse] = await transaction.chargeCard(
            token,
            "MNFY|99|20220725110839|000256", // amount
            "API_NOTIFICATION", // narration
            "10", // destinationBankCode
            "2024", // destinationAccountNumber
            "1234",
            "123"
        );
        console.log('Charge Card Response:', transferResponse);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();
*
//bank transfer
(async () => {
    try {
        const transaction = new Transaction('sandbox');
        const [status, token] = await transaction.getToken();
        const response = await transaction.payWithBankTransfer(
            token, "MNFY|30|20240825224511|000115", "058"
        );
        console.log('Pay with Bank Transfer Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();
*
//ussd
//ERROR: 'USSD provider not configured.'
(async () => {
    try {
        const transaction = new Transaction('sandbox');
        const [status, token] = await transaction.getToken();
        const response = await transaction.payWithUssd(
            token, "MNFY|74|20240829163041|000428", "058"
        );
        console.log('Pay with Ussd Transfer Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();
*
//authorize otp
(async () => {
    try {
        const transaction = new Transaction('sandbox');
        const [status, token] = await transaction.getToken();
        const response = await transaction.authorizeOtp(
            token, "MNFY|74|20240829163041|000428", "API_NOTIFICATION", "100.00-b66bef0aa8e660863c4e1177a08fefba", "809851"
        );
        console.log('AUTHORIZE OTP Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();
*
//3ds secure transaction
(async () => {
    try {
        const transaction = new Transaction('sandbox');
        const [status, token] = await transaction.getToken();
        const response = await transaction.ThreeDsSecureAuthTransaction(
            token, "MNFY|74|20240829163041|000428", "API_NOTIFICATION", "4000000000000002",
            "12", "2024","1234","123"
        );
        console.log('3DS SECURE TRANSACTION Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();
*

//card tokenization
(async () => {
    try {
        const transaction = new Transaction('sandbox');
        const [status, token] = await transaction.getToken();
        const response = await transaction.cardTokenization(
            token, "MNFY_6A9DAD234B3E4E3C965B8F1D7BA8E0DE", "50", "Tochukwu",
            "tochukwu.nwokolo@moniepoint.com", "1642776682937", "to pay",
            "NGN", {}
        );
        console.log('Card tokenization Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();
*
//RESERVED ACCOUNT
deallocate reserved account
(async () => {
    try {
        const reservedAccount = new ReservedAccount('sandbox');
        const [status, token] = await reservedAccount.getToken();
        const response = await reservedAccount.deallocateReservedAccount(
            token, "janedoe12235"
        );
        console.log('deallocate resrrved account response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();
*
//update reserved account
(async () => {
    try {
        const reservedAccount = new ReservedAccount('sandbox');
        const [status, token] = await reservedAccount.getToken();
        const response = await reservedAccount.updateReservedAccountKycInfo(
            token, "janedoe12233", "22347160689","12121212121"
        );
        console.log('update reserved account response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();
/*

//VERIFICATION
//validate bank account
(async () => {
    try {
        const verification = new Verification('sandbox');
        const [status, token] = await verification.getToken();
        const response = await verification.validateBankAccount(
            token, "3000246601", "035"
        );
        console.log('Validate bank account Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();
/*
//verify bvn
(async () => {
    try {
        const verification = new Verification('sandbox');
        const [status, token] = await verification.getToken();
        const response = await verification.verifyBvnInformation(
            token, "22222222226", "27-Apr-1993", "08016857829","OLATUNDE JOSIAH OGUNBOYEJO"
        );
        console.log('Pay with Bank Transfer Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();
/*
//match bvn and account name
(async () => {
    try {
        const verification = new Verification('sandbox');
        const [status, token] = await verification.getToken();
        const response = await verification.matchBvnAndAccountName(
            token, "035", "3000246601","22347160689"
        );
        console.log('match bvn and account name Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();

//create sub account
/*/
/*
(async () => {
    try {
        const subAccount = new SubAccount('sandbox');
        const [status, token] = await subAccount.getToken();
        const response = await subAccount.createSubAccount(
            token, "NGN", "035", "3000246602", "tochukwusage4@gmail.com","20.87"
        );
        console.log('Create sub account Response:', JSON.stringify(response, null, 2));

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();



//delete sub account

(async () => {
    try {
        const subAccount = new SubAccount('sandbox');
        const [status, token] = await subAccount.getToken();
        const response = await subAccount.deleteSubAccount(
            token,"MFY_SUB_557404059731"
        );
        console.log('Delete Sub Account Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();
*/


//update sub accounts
/*
(async () => {
    try {
        const subAccount = new SubAccount('sandbox');
        const [status, token] = await subAccount.getToken();
        const response = await subAccount.getSubAccounts(
            token
        );
        console.log('GET ALL SUB ACCOUNTS Response:', JSON.stringify(response, null, 2));

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();


//update sub account
(async () => {
    try {
        const subAccount = new SubAccount('sandbox');
        const [status, token] = await subAccount.getToken();
        const response = await subAccount.updateSubAccount(
            token, "MFY_SUB_325381128054", "NGN", "035", "3000246602","tochukwusage4@gmail.com","20"
        );
        console.log('UPDATE SUB ACCOUNT Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();
*/

//REFUND API
//initiate refund
(async () => {
    try {
        const refund = new TransactionRefund('sandbox');
        const [status, token] = await refund.getToken();
        const response = await refund.initiateRefund(
            token, "MNFY|30|20240825224511|000115", "merchantRefundRef",
            "yap sesh yap sesh yap sesh yap sesh yap sesh",1000
        );
        console.log('INITIATE REFUND Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();


//get all refunds
(async () => {
    try {
        const refund = new TransactionRefund('sandbox');
        const [status, token] = await refund.getToken();
        const response = await refund.getAllRefunds(
            token, 2, 15
        );
        console.log('GET ALL REFUNDS Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();


//get refund status
(async () => {
    try {
        const refund = new TransactionRefund('sandbox');
        const [status, token] = await refund.getToken();
        const response = await refund.getRefundStatus(
            token, "merchantRefundRef",
        );
        console.log('GET REFUND STATUS Response:', JSON.stringify(response, null, 2));

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();


(async () => {
    try {
        const reservedAccount = new ReservedAccount('sandbox');
        const [status, token] = await reservedAccount.getToken();
        const response = await reservedAccount.reservedAccountTransactions(
            token, "reference12345"
        );
        console.log('GET REFUND STATUS Response:', JSON.stringify(response, null, 2));

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();



// Swagger definition setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Monnify API',
            version: '1.0.0',
            description: 'API for Monnify operations',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Local server',
            },
        ],
    },
    apis: ['./*.js'],
};

// Initialize swagger-jsdoc
const swaggerSpecs = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));

// Example route
app.get('/api', (req, res) => {
    res.send('Hello World!');
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    console.log('Swagger docs available at http://localhost:3000/api-docs');
});
