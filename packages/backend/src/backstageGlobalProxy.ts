/*
 * Copyright (c) 2026. Cloud Software Group, Inc. All Rights Reserved. Confidential & Proprietary
 */

import http from 'http';
import https from 'https';
import { setGlobalDispatcher, EnvHttpProxyAgent } from 'undici';
import { isV4Format, isV6Format, cidrSubnet } from 'ip';

function isNoProxy(host: string, noProxy: string) {
  if (!host || !noProxy) return false;

  // Extract hostname from a full URL or bare host:port string
  let hostname;
  try {
    hostname = new URL(host).hostname;
  } catch {
    hostname = host.split(':')[0];
  }
  const rules = noProxy
    .split(',')
    .map(rule => rule.trim())
    .filter(Boolean);

  return rules.some(rule => {
    // Exact IP or CIDR
    if (isV4Format(rule) || isV6Format(rule)) {
      return hostname === rule;
    }

    if (rule.includes('/')) {
      // CIDR range
      try {
        return cidrSubnet(rule).contains(hostname);
      } catch {
        return false;
      }
    }

    // Wildcard subdomain e.g., *.example.com or *.example.com*
    if (rule.startsWith('*.')) {
      const domain = rule.slice(2).replace(/\*$/, '');
      return hostname.endsWith(domain);
    }

    // Leading dot for subdomain match e.g., .example.com
    if (rule.startsWith('.')) {
      return hostname.endsWith(rule);
    }

    // Exact hostname match
    return hostname === rule;
  });
}

const DEVHUB_HTTP_PROXY = process.env.HTTP_PROXY;
const DEVHUB_HTTPS_PROXY = process.env.HTTPS_PROXY;
const DEVHUB_NO_PROXY = process.env.NO_PROXY;

if (DEVHUB_HTTP_PROXY || DEVHUB_HTTPS_PROXY) {
  setGlobalDispatcher(new EnvHttpProxyAgent());
  (async () => {
    const { HttpsProxyAgent } = await import('https-proxy-agent');
    const { HttpProxyAgent } = await import('http-proxy-agent');
    function extractHostname(url: string | URL): string {
      return (url instanceof URL ? url : new URL(String(url))).hostname;
    }

    function shouldProxy(hostname: string | null | undefined): boolean {
      if (!hostname) return true;
      if (!DEVHUB_NO_PROXY) return true;
      return !isNoProxy(hostname, DEVHUB_NO_PROXY);
    }

    if (DEVHUB_HTTP_PROXY) {
      const agentHttp = new HttpProxyAgent(DEVHUB_HTTP_PROXY);
      const originalHttpRequest = http.request.bind(http);

      (http as any).request = function patchedHttpRequest(
        urlOrOptions: string | URL | http.RequestOptions,
        optionsOrCallback?: http.RequestOptions | Function,
        callback?: Function,
      ) {
        if (typeof urlOrOptions === 'string' || urlOrOptions instanceof URL) {
          const url = urlOrOptions;
          let options: http.RequestOptions;
          let cb: Function | undefined;

          if (typeof optionsOrCallback === 'function') {
            options = {};
            cb = optionsOrCallback;
          } else {
            options = { ...(optionsOrCallback ?? {}) };
            cb = callback;
          }

          if (shouldProxy(extractHostname(url))) {
            options.agent = agentHttp;
          }

          return originalHttpRequest(url as any, options, cb as any);
        }

        const options = { ...urlOrOptions } as http.RequestOptions;
        const cb = optionsOrCallback as Function | undefined;

        if (shouldProxy(options.host || options.hostname)) {
          options.agent = agentHttp;
        }

        return originalHttpRequest(options, cb as any);
      };

      (http as any).get = function patchedHttpGet(
        urlOrOptions: any,
        optionsOrCallback?: any,
        callback?: any,
      ) {
        const req = (http as any).request(
          urlOrOptions,
          optionsOrCallback,
          callback,
        );
        req.end();
        return req;
      };
    }
    if (DEVHUB_HTTPS_PROXY) {
      const agentHttps = new HttpsProxyAgent(DEVHUB_HTTPS_PROXY);
      const originalHttpsRequest = https.request.bind(https);

      // Patch https.request — handles all 3 signatures
      (https as any).request = function patchedRequest(
        urlOrOptions: string | URL | https.RequestOptions,
        optionsOrCallback?: https.RequestOptions | Function,
        callback?: Function,
      ) {
        // Signature: request(url, options, callback) or request(url, callback)
        if (typeof urlOrOptions === 'string' || urlOrOptions instanceof URL) {
          const url = urlOrOptions;
          let options: https.RequestOptions;
          let cb: Function | undefined;

          if (typeof optionsOrCallback === 'function') {
            options = {};
            cb = optionsOrCallback;
          } else {
            options = { ...(optionsOrCallback ?? {}) };
            cb = callback;
          }

          if (shouldProxy(extractHostname(url))) {
            options.agent = agentHttps;
          }

          return originalHttpsRequest(url as any, options, cb as any);
        }

        // Signature: request(options, callback)
        const options = { ...urlOrOptions } as https.RequestOptions;
        const cb = optionsOrCallback as Function | undefined;

        if (shouldProxy(options.host || options.hostname)) {
          options.agent = agentHttps;
        }

        return originalHttpsRequest(options, cb as any);
      };

      // https.get is just request() + req.end()
      (https as any).get = function patchedGet(
        urlOrOptions: any,
        optionsOrCallback?: any,
        callback?: any,
      ) {
        const req = (https as any).request(
          urlOrOptions,
          optionsOrCallback,
          callback,
        );
        req.end();
        return req;
      };
    }
  })();
}
