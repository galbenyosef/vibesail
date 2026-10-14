(function () {
  try {
    var lang = (
      localStorage.getItem("vibesail.language") || "en"
    ).toLowerCase();
    if (lang && lang !== "en") {
      document.documentElement.classList.add("i18n-pending");
    }
  } catch (_) {}
})();
