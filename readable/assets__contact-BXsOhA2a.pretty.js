import "./modulepreload-polyfill-Dezn_h7o.js";
/* empty css               */ import "./init-CC0aACO2.js";
/* empty css                  */ var e =
    document.getElementById(`email-contact`),
  t = document.getElementById(`copy-email-contact`),
  n = document.getElementById(`contact-status`);
function r() {
  let t = [`info`, `vibesail.com`].join(`@`),
    n = e?.querySelector(`span`);
  return (
    n && (n.textContent = t),
    e?.setAttribute(`aria-label`, `Email ${t}`),
    t
  );
}
async function i(e) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(e);
    return;
  }
  let t = document.createElement(`textarea`);
  ((t.value = e),
    t.setAttribute(`readonly`, ``),
    (t.style.position = `fixed`),
    (t.style.opacity = `0`),
    document.body.appendChild(t),
    t.select());
  let n = document.execCommand?.(`copy`);
  if ((t.remove(), !n)) throw Error(`Clipboard unavailable`);
}
(e?.addEventListener(`click`, () => {
  let e = r();
  (n && (n.textContent = `Opening your email app for ${e}…`),
    (window.location.href = `mailto:${e}`));
}),
  t?.addEventListener(`click`, async () => {
    let e = r();
    try {
      (await i(e),
        (t.textContent = `Copied`),
        n && (n.textContent = `Copied ${e} to your clipboard.`));
    } catch {
      n &&
        (n.textContent = `Could not copy automatically. The address is ${e}.`);
    }
  }));
