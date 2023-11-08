import { ReservedAccount } from "./src/collection.js";
import { Transaction } from "./src/collection.js";




const inst = new ReservedAccount('sandbox')
const instance = new Transaction('sandbox')
//const inst1 = new ReservedAccount('sandbox')

let payload = {"customerName":"Tester","customerEmail":"tester@tester.com",
"amount":2000,"paymentDescription":"Hello World","accountName":"benji"};

//console.log(instance.isTokenSet)
//console.log(await instance.getToken(true))

/*function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

for(let i=0;i<11;i=i+1){
    await new Promise(resolve => setTimeout(resolve, 10000));
    console.log(await instance.getToken(true))  
}*/



const [codes,token] = await instance.getToken()

const [rCode,resp] = await instance.initTransaction(
  token,
  payload.amount,
  payload.customerName,
  payload.customerEmail,
  payload.paymentDescription)


  const [rCodes,resps] = await inst.createReservedAccount(
    token,
    payload.customerName,
    payload.customerEmail,
    payload.accountName,
    {preferredBanks:["035"],getAllAvailableBanks:false})


//console.log(token)

//console.log(resp)

console.log(resps)


//const [code,response] = await instance.createReservedAccountV2(token,'test','test@tester.com','test')
