//const axios = require('axios');

import axios from 'axios';
import crypto from 'crypto'



export class BaseRequestAPI{
    constructor(environment){
        this.headers = {
            "Content-Type":"application/json",
            "Authorization":""
        }
        if (environment === 'sandbox'){
            this.baseUrl = "https://sandbox.monnify.com";
            this.contract = process.env.CONTRACT;
            this.apiKey = process.env.APIKEY;
            this.secretKey = process.env.SECRET;
            this.sourceAccountNumber = process.env.WALLETACCOUNTNUMBER;
        }
        else if (environment === 'live'){
            this.baseUrl = "https://live.monnify.com";
            this.contract = process.env.CONTRACT;
            this.apiKey = process.env.APIKEY;
            this.secretKey = process.env.SECRET;
            this.sourceAccountNumber = process.env.WALLETACCOUNTNUMBER;
        }
        else{
            throw new Error("Unknown environment passed: ",environment,". Specify between sandbox and live");
        }
    }

    async getToken(){

        const url = this.baseUrl + '/api/v1/auth/login';
        const data = {};
        this.headers.Authorization = `Basic ${Buffer.from(this.apiKey + ":" + this.secretKey).toString('base64')}`;

        try{
            const response = await axios.post(url, data, {'headers':this.headers});
            return [response.status, response.data];
        }catch(e){
            return [e.response.status,e.response.data]
        }
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
            const response = await axios.get(url, data, {'headers':this.headers});
            return [response.status, response.data];
        }catch(e){
            return [e.response.status,e.response.data]
        }
    }


    async put(url_path,authorization,data){

        const url = this.baseUrl + url_path;
        this.headers.Authorization = `Bearer ${authorization}`;
        
        try{
            const response = await axios.get(url, data, {'headers':this.headers});
            return [response.status, response.data];
        }catch(e){
            return [e.response.status,e.response.data]
        }
    }


    async delete(url_path,authorization){
        const url = this.baseUrl + url_path;
        this.headers.Authorization = `Bearer ${authorization}`;

        try{
            const response = await axios.get(url, {'headers':this.headers});
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