import { BaseRequestAPI } from "./src/base_api.js";
import { ReservedAccount } from "./src/collection.js";




const instance = new ReservedAccount('sandbox')

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

//console.log(token)


const [code,response] = await instance.createReservedAccountV2(token,'test','test@tester.com','test')

console.log(response)