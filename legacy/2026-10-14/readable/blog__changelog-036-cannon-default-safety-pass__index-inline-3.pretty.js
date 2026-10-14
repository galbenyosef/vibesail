window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}
window.gtag = gtag;
(function () {
  function loadAnalytics() {
    if (window.__analyticsLoaded) return;
    window.__analyticsLoaded = true;
    gtag("js", new Date());
    gtag("config", "G-CQ7NQJ8CHX");
    var g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=G-CQ7NQJ8CHX";
    document.head.appendChild(g);
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://simple.vibesail.com/latest.js";
    s.dataset.collectDnt = "true";
    s.onerror = function () {
      this.onerror = null;
      this.src = "https://scripts.simpleanalyticscdn.com/latest.js";
    };
    document.head.appendChild(s);
    var a = document.createElement("script");
    a.async = true;
    a.src = "https://analytics.ahrefs.com/analytics.js";
    a.dataset.key = "/Aj7gMpdyzFnZH3EIv88xA";
    document.head.appendChild(a);
    if (typeof window.__vibesailLoadPostHogSdk === "function")
      window.__vibesailLoadPostHogSdk();
  }
  if (typeof requestIdleCallback === "function") {
    requestIdleCallback(loadAnalytics, { timeout: 5000 });
  } else {
    setTimeout(loadAnalytics, 5000);
  }
})();
