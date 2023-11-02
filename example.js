import { BaseRequestAPI } from "./src/base_api.js";
import { ReservedAccount } from "./src/collection.js";




const instance = new ReservedAccount('sandbox')
const inst = new ReservedAccount('sandbox')
const inst1 = new ReservedAccount('sandbox')

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

const [code1,tk1] = await inst.getToken()
const [code2,tk2] = await inst.getToken()

console.log('------------------\n',token)

console.log('ppppppppppppppppp\n',tk1)

console.log('aaaaaaaaaaaaaaaa\n',tk2)


//const [code,response] = await instance.createReservedAccountV2(token,'test','test@tester.com','test')
