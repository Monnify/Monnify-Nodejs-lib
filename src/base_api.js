
import axios from 'axios';
import crypto from 'crypto';
import promises from 'fs';
import dotenv from 'dotenv';


const TOKENEXPIRATIONTHRESHOLD = process.env.TOKENEXPIRATIONTHRESHOLD || 500
const TOKENFILE = process.env.TOKENFILE || 'Cache'

let singletonInstance
dotenv.config({ path: './.env' })


export class BaseRequestAPI{

    constructor(environment){
        if(singletonInstance){
            if(singletonInstance.environment!==environment){
                throw new Error('You cannot instantiate multiple environment at one runtime')
            }
        }
        this.headers = {
            "Content-Type":"application/json",
            "Authorization":""
        }
        if (environment === 'sandbox'){
            this.environment = 'sandbox'
            this.baseUrl = "https://sandbox.monnify.com";
            this.contract = process.env.CONTRACT;
            this.apiKey = process.env.APIKEY;
            this.secretKey = process.env.SECRET;
            this.sourceAccountNumber = process.env.WALLETACCOUNTNUMBER;
            this.isTokenSet = false
            this.expiryTime = 0
            this.cacheFile = `sandbox_${TOKENFILE}.js`
            singletonInstance = this
        }
        else if (environment === 'live'){
            this.environment = 'live'
            this.baseUrl = "https://live.monnify.com";
            this.contract = process.env.CONTRACT;
            this.apiKey = process.env.APIKEY;
            this.secretKey = process.env.SECRET;
            this.sourceAccountNumber = process.env.WALLETACCOUNTNUMBER;
            this.isTokenSet = false
            this.expiryTime = 0
            this.cacheFile = `live_${TOKENFILE}.js`
            singletonInstance = this
        }
        else{
            throw new Error("Unknown environment passed: ",environment,". Specify between sandbox and live");
        }
    }

    async getToken(cached=true){

        if(this.isTokenSet && (this.expiryTime > Math.floor(Date.now()/1000))){
            const token = await this.getCachedToken()
            return [200, token]
        }
        const url = this.baseUrl + '/api/v1/auth/login';
        const data = {};
        this.headers.Authorization = `Basic ${Buffer.from(this.apiKey + ":" + this.secretKey).toString('base64')}`;

        try{
            const response = await axios.post(url, data, {'headers':this.headers});
            if(cached && (response.data.responseBody.expiresIn >= TOKENEXPIRATIONTHRESHOLD)){
                await this.setToken(response.data.responseBody.accessToken,
                                    response.data.responseBody.expiresIn+Math.floor(Date.now()/1000)
                                    )
            }
            return [response.status, response.data.responseBody.accessToken];
        }catch(e){
            console.log(e)
            return [e.response.status,e.response.data]
        }
    }

    async setToken(tokenObject,timeStamp){
        try{
            const handler = promises.writeFileSync(this.cacheFile,tokenObject);
            this.isTokenSet = true
            this.expiryTime = timeStamp

        }catch(e){
            console.log(e)
        }
    }

    async getCachedToken(){
        return promises.readFileSync(this.cacheFile,{ encoding: 'utf8' });

    }

    async get(url_path,authorization){

        const url = this.baseUrl + url_path;
        this.headers.Authorization = `Bearer ${authorization}`;

        try{
            const response = await axios.get(url, {'headers':this.headers});
            return [response.status, response.data];
        }catch(e){
            return [e.response.status,e.response.data]
        }
        
    }


    async post(url_path,authorization,data){

        const url = this.baseUrl + url_path;
        this.headers.Authorization = `Bearer ${authorization}`;

        try{
            const response = await axios.post(url, data, {'headers':this.headers});
            return [response.status, response.data];
        }catch(e){
            return [e.response.status,e.response.data]
        }
    }


    async put(url_path,authorization,data){

        const url = this.baseUrl + url_path;
        this.headers.Authorization = `Bearer ${authorization}`;
        
        try{
            const response = await axios.put(url, data, {'headers':this.headers});
            return [response.status, response.data];
        }catch(e){
            return [e.response.status,e.response.data]
        }
    }


    async delete(url_path,authorization){
        const url = this.baseUrl + url_path;
        this.headers.Authorization = `Bearer ${authorization}`;

        try{
            const response = await axios.delete(url, {'headers':this.headers});
            return [response.status, response.data];
        }catch(e){
            return [e.response.status,e.response.data]
        }
    }

    async computeTransactionHash(payload,signature){
        try{
            const hmac = crypto.createHmac('sha512', this.secret_key);
            const hash = hmac.update(JSON.stringify(payload));
            const hash_in_hex = hash.digest('hex');
            return signature === hash_in_hex;
          } catch(err){
            throw new Error(err.message)
          }
    }
}




