// contact 01 — textcontent
// Lines 1-46 of readable/assets/contact-BXsOhA2a.pretty.js (statement-aligned).
import "./modulepreload-polyfill-Dezn_h7o.js";
/* empty css               */ import "./init-CC0aACO2.js";
/* empty css                  */ var emailLinkEl =
    document.getElementById(`email-contact`),
  copyButtonEl = document.getElementById(`copy-email-contact`),
  statusEl = document.getElementById(`contact-status`);
function buildContactEmail() {
  let t = [`info`, `vibesail.com`].join(`@`),
    n = emailLinkEl?.querySelector(`span`);
  return (
    n && (n.textContent = t),
    emailLinkEl?.setAttribute(`aria-label`, `Email ${t}`),
    t
  );
}
async function copyToClipboard(e) {
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
(emailLinkEl?.addEventListener(`click`, () => {
  let e = buildContactEmail();
  (statusEl && (statusEl.textContent = `Opening your email app for ${e}…`),
    (window.location.href = `mailto:${e}`));
}),
  copyButtonEl?.addEventListener(`click`, async () => {
    let e = buildContactEmail();
    try {
      (await copyToClipboard(e),
        (copyButtonEl.textContent = `Copied`),
        statusEl && (statusEl.textContent = `Copied ${e} to your clipboard.`));
    } catch {
      statusEl &&
        (statusEl.textContent = `Could not copy automatically. The address is ${e}.`);
    }
  }));
