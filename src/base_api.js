/*
 * Monnify API wrapper — Base HTTP client
 * Provides shared auth, HTTP verbs, and webhook hash verification.
 */

import axios from 'axios';
import crypto from 'crypto';

const TOKENEXPIRATIONTHRESHOLD = Number(process.env.TOKENEXPIRATIONTHRESHOLD) || 500;

// Shared in-memory token store keyed by environment.
// All module instances that share the same environment reuse the same token,
// eliminating redundant /auth/login calls without touching the file system.
const _tokenCache = {
    SANDBOX: { token: null, expiryTime: 0 },
    LIVE:    { token: null, expiryTime: 0 }
};

// Prevent mixing environments in a single runtime.
let _lockedEnvironment = null;

export class BaseRequestAPI {

    constructor(environment) {
        if (_lockedEnvironment && _lockedEnvironment !== environment) {
            throw new Error(
                `Environment conflict: already initialised as "${_lockedEnvironment}". ` +
                `Cannot create a "${environment}" instance in the same runtime.`
            );
        }
        if (!['SANDBOX', 'LIVE'].includes(environment)) {
            throw new Error(
                `Unknown environment "${environment}". Specify "SANDBOX" or "LIVE".`
            );
        }

        _lockedEnvironment = environment;
        this.environment  = environment;
        this.baseUrl      = environment === 'SANDBOX'
            ? 'https://sandbox.monnify.com'
            : 'https://api.monnify.com';
        this.apiKey    = process.env.MONNIFY_APIKEY;
        this.secretKey = process.env.MONNIFY_SECRET;
        this.headers   = { 'Content-Type': 'application/json', Authorization: '' };
    }

    // ─── Authentication ───────────────────────────────────────────────────────

    async getToken() {
        const cache = _tokenCache[this.environment];
        const now   = Math.floor(Date.now() / 1000);

        if (cache.token && cache.expiryTime > now) {
            return [200, cache.token];
        }

        const url         = `${this.baseUrl}/api/v1/auth/login`;
        const credentials = Buffer.from(`${this.apiKey}:${this.secretKey}`).toString('base64');

        try {
            const response = await axios.post(url, {}, {
                headers: { ...this.headers, Authorization: `Basic ${credentials}` }
            });
            const { accessToken, expiresIn } = response.data.responseBody;
            if (expiresIn >= TOKENEXPIRATIONTHRESHOLD) {
                cache.token      = accessToken;
                cache.expiryTime = now + expiresIn;
            }
            return [response.status, accessToken];
        } catch (e) {
            return [e.response?.status ?? 500, e.response?.data ?? { message: e.message }];
        }
    }

    // ─── HTTP verbs ───────────────────────────────────────────────────────────

    async get(urlPath, authorization) {
        try {
            const response = await axios.get(this.baseUrl + urlPath, {
                headers: { ...this.headers, Authorization: `Bearer ${authorization}` }
            });
            return [response.status, response.data];
        } catch (e) {
            return [e.response?.status ?? 500, e.response?.data ?? { message: e.message }];
        }
    }

    async post(urlPath, authorization, data) {
        try {
            const response = await axios.post(this.baseUrl + urlPath, data, {
                headers: { ...this.headers, Authorization: `Bearer ${authorization}` }
            });
            return [response.status, response.data];
        } catch (e) {
            return [e.response?.status ?? 500, e.response?.data ?? { message: e.message }];
        }
    }

    async put(urlPath, authorization, data) {
        try {
            const response = await axios.put(this.baseUrl + urlPath, data, {
                headers: { ...this.headers, Authorization: `Bearer ${authorization}` }
            });
            return [response.status, response.data];
        } catch (e) {
            return [e.response?.status ?? 500, e.response?.data ?? { message: e.message }];
        }
    }

    async patch(urlPath, authorization, data = {}) {
        try {
            const response = await axios.patch(this.baseUrl + urlPath, data, {
                headers: { ...this.headers, Authorization: `Bearer ${authorization}` }
            });
            return [response.status, response.data];
        } catch (e) {
            return [e.response?.status ?? 500, e.response?.data ?? { message: e.message }];
        }
    }

    async delete(urlPath, authorization) {
        try {
            const response = await axios.delete(this.baseUrl + urlPath, {
                headers: { ...this.headers, Authorization: `Bearer ${authorization}` }
            });
            return [response.status, response.data];
        } catch (e) {
            return [e.response?.status ?? 500, e.response?.data ?? { message: e.message }];
        }
    }

    // ─── Webhook verification ─────────────────────────────────────────────────

    async computeTransactionHash(payload, signature) {
        try {
            const hmac       = crypto.createHmac('sha512', this.secretKey);
            const hashInHex  = hmac.update(JSON.stringify(payload)).digest('hex');
            return signature === hashInHex;
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
