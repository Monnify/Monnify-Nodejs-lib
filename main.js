import { ReservedAccount } from "./collection.js";
import { Transaction } from "./collection.js";
import {Disbursement} from "./disbursement.js"


const instance = new Disbursement('sandbox');

const [code,resp] = await instance.getToken();

const [cd,resps] = await instance.getAllSingleTransfers(resp.responseBody.accessToken);

console.log(cd,resps.responseBody.content);