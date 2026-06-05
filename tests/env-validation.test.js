import assert from 'assert/strict';
import { BaseRequestAPI } from '../src/base_api.js';
import { MonnifyAPI }     from '../index.js';

/**
 * These tests exercise the environment-resolution and key-mismatch validation
 * added to BaseRequestAPI and MonnifyAPI.
 *
 * Ordering matters: _lockedEnvironment is a module-level singleton.
 * Tests that throw before reaching the lock assignment are safe to run first.
 * The one test that successfully creates an instance will lock SANDBOX, after
 * which any LIVE-environment test would hit the conflict guard instead — so
 * the LIVE key-mismatch test must run before the successful SANDBOX creation.
 */

describe('BaseRequestAPI — environment validation', () => {

    let savedEnv;
    let savedApiKey;

    beforeEach(() => {
        savedEnv    = process.env.MONNIFY_ENV;
        savedApiKey = process.env.MONNIFY_APIKEY;
    });

    afterEach(() => {
        if (savedEnv !== undefined) process.env.MONNIFY_ENV = savedEnv;
        else delete process.env.MONNIFY_ENV;

        if (savedApiKey !== undefined) process.env.MONNIFY_APIKEY = savedApiKey;
        else delete process.env.MONNIFY_APIKEY;
    });

    // ── Throw-before-lock tests (run before any valid instance is created) ──

    it('throws when MONNIFY_ENV is not set and no constructor arg is provided', () => {
        delete process.env.MONNIFY_ENV;
        assert.throws(
            () => new BaseRequestAPI(),
            /MONNIFY_ENV is not set/
        );
    });

    it('throws when MONNIFY_ENV is set to an invalid value', () => {
        process.env.MONNIFY_ENV = 'PRODUCTION';
        assert.throws(
            () => new BaseRequestAPI(),
            /Invalid environment/
        );
    });

    // ── Creates a valid SANDBOX instance — locks _lockedEnvironment ─────────
    //
    // NOTE: the LIVE+MK_TEST_ key mismatch branch (base_api.js line 64) cannot
    // be tested in-process: a root-level beforeEach in collection.test.js
    // creates a SANDBOX instance before every test in the full suite, locking
    // _lockedEnvironment=SANDBOX. Any attempt to resolve LIVE then hits the
    // environment-conflict guard first. The SANDBOX+MK_PROD_ test below is
    // symmetrical and confirms the validation logic works correctly.

    it('emits a deprecation warning when env is passed as a constructor arg', () => {
        delete process.env.MONNIFY_ENV;

        const warnings = [];
        const _warn = console.warn;
        console.warn = (...args) => warnings.push(args.join(' '));
        try {
            const api = new BaseRequestAPI('SANDBOX');
            assert.ok(warnings.length > 0, 'expected a deprecation warning');
            assert.ok(warnings[0].includes('deprecated'));
            assert.strictEqual(api.environment, 'SANDBOX');
            assert.strictEqual(api.baseUrl, 'https://sandbox.monnify.com');
        } finally {
            console.warn = _warn;
        }
    });

    // ── Tests after SANDBOX is locked ────────────────────────────────────────

    it('throws when MONNIFY_ENV is SANDBOX but the API key starts with MK_PROD_', () => {
        process.env.MONNIFY_ENV    = 'SANDBOX';
        process.env.MONNIFY_APIKEY = 'MK_PROD_BADKEY';
        assert.throws(
            () => new BaseRequestAPI(),
            /Environment mismatch/
        );
    });
});

describe('MonnifyAPI — config.env deprecation', () => {

    let savedEnv;

    beforeEach(() => {
        savedEnv = process.env.MONNIFY_ENV;
    });

    afterEach(() => {
        if (savedEnv !== undefined) process.env.MONNIFY_ENV = savedEnv;
        else delete process.env.MONNIFY_ENV;
    });

    it('emits a deprecation warning when env is passed in the config object', () => {
        delete process.env.MONNIFY_ENV;

        const warnings = [];
        const _warn = console.warn;
        console.warn = (...args) => warnings.push(args.join(' '));
        try {
            const monnify = new MonnifyAPI({
                MONNIFY_APIKEY: process.env.MONNIFY_APIKEY || 'MK_TEST_GC3B8XG2XX',
                MONNIFY_SECRET: process.env.MONNIFY_SECRET || 'A663NRZA544DDPEM7KDN7Z8HRV6YXD8S',
                env: 'SANDBOX',
            });
            assert.ok(warnings.length > 0, 'expected a deprecation warning');
            assert.ok(warnings[0].includes('deprecated'));
            assert.strictEqual(monnify.environment, 'SANDBOX');
        } finally {
            console.warn = _warn;
        }
    });
});
