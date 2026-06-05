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
        const envFromProcess = process.env.MONNIFY_ENV?.trim().toUpperCase();
        const envFromArg     = typeof environment === 'string' ? environment.trim().toUpperCase() : undefined;

        let resolvedEnv;
        if (envFromProcess) {
            resolvedEnv = envFromProcess;
        } else if (envFromArg) {
            console.warn(
                `[monnify] Passing the environment to the constructor is deprecated and will be removed in a future version. ` +
                `Add MONNIFY_ENV=${envFromArg} to your .env file instead.`
            );
            resolvedEnv = envFromArg;
        } else {
            throw new Error(
                `MONNIFY_ENV is not set. Add MONNIFY_ENV=SANDBOX or MONNIFY_ENV=LIVE to your environment variables.`
            );
        }

        if (!['SANDBOX', 'LIVE'].includes(resolvedEnv)) {
            throw new Error(
                `Invalid environment "${resolvedEnv}". Must be "SANDBOX" or "LIVE".`
            );
        }

        if (_lockedEnvironment && _lockedEnvironment !== resolvedEnv) {
            throw new Error(
                `Environment conflict: already initialised as "${_lockedEnvironment}". ` +
                `Cannot create a "${resolvedEnv}" instance in the same runtime.`
            );
        }

        const apiKey = process.env.MONNIFY_APIKEY;
        if (apiKey) {
            if (resolvedEnv === 'SANDBOX' && apiKey.startsWith('MK_PROD_')) {
                throw new Error(
                    `Environment mismatch: MONNIFY_ENV is "SANDBOX" but your API key starts with "MK_PROD_". ` +
                    `Use your sandbox key (starts with "MK_TEST_") or set MONNIFY_ENV=LIVE.`
                );
            }
            if (resolvedEnv === 'LIVE' && apiKey.startsWith('MK_TEST_')) {
                throw new Error(
                    `Environment mismatch: MONNIFY_ENV is "LIVE" but your API key starts with "MK_TEST_". ` +
                    `Use your live key (starts with "MK_PROD_") or set MONNIFY_ENV=SANDBOX.`
                );
            }
        }

        _lockedEnvironment = resolvedEnv;
        this.environment  = resolvedEnv;
        this.baseUrl      = resolvedEnv === 'SANDBOX'
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
