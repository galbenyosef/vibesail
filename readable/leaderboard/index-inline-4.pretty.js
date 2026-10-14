(function () {
  var posthogConfig = {
    apiKey: "phc_QpnLTX0cSBjRoazL8i0oLC7R6AaimXfBnYjkuJ7kx5D",
    apiHost: "https://us.i.posthog.com",
  };
  var posthogReadyEventName = "vibesail:posthog-ready";

  var initPostHog = function () {
    if (!window.posthog || typeof window.posthog.init !== "function") return;
    if (window.__vibesailPostHogInitialized) return;
    window.__vibesailPostHogInitialized = true;
    window.posthog.init(posthogConfig.apiKey, {
      api_host: posthogConfig.apiHost,
      capture_pageview: false,
      capture_pageleave: false,
      autocapture: false,
      persistence: "localStorage+cookie",
    });
    window.dispatchEvent(new CustomEvent(posthogReadyEventName));
  };

  window.__vibesailInitPostHog = initPostHog;

  // PostHog SDK script is loaded by the shared deferred analytics loader.
  // Register a helper so external code can trigger an eager load if needed.
  window.__vibesailLoadPostHogSdk = function () {
    if (window.__vibesailPostHogSdkLoaded) return;
    window.__vibesailPostHogSdkLoaded = true;
    var p = document.createElement("script");
    p.async = true;
    p.src = "https://us-assets.i.posthog.com/static/array.js";
    p.onload = function () {
      window.__vibesailInitPostHog && window.__vibesailInitPostHog();
    };
    document.head.appendChild(p);
  };
})();
