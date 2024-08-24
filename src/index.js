import { Disbursement } from './disbursement.js';
import express from 'express';
import { Transaction } from './collection.js';

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

*/
(async () => {
    try {
        // Set up environment (sandbox or live)
        const transaction = new Transaction('sandbox');

        // Example Usage - Get a Token
        const [status, token] = await transaction.getToken();
        console.log('BT Token:', token);

        // Example Usage - Pay with bank transfer
        const response = await transaction.payWithBankTransfer(
            token, "MNFY|88|20240823220442|000052"
        );
        console.log('Pay with Bank Transfer Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();


(async () => {
    try {
        // Set up environment (sandbox or live)
        const transaction = new Transaction('sandbox');

        // Example Usage - Get a Token
        const [status, token] = await transaction.getToken();

        console.log('OTP Token:', token)

        // Example Usage - Pay with bank transfer
        const response = await transaction.authorizeOtp(
            token,
            "MNFY|00|20240824143224|000076",
            "API_NOTIFICATION",
            "100.00-b66bef0aa8e660863c4e1177a08fefba",
            "152547"
        );
        console.log('Authorize OTP Response:', response);

    } catch (err) {
        console.error("Error during operations:", err);
    }
})();




// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
    console.log('Swagger docs available at http://localhost:3000/api-docs');
});
