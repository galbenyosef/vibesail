var emailContacts = {
  advertise: ["advertise", "vibesail.com"],
};

document.addEventListener("click", function (e) {
  var a = e.target.closest("a.email-link");
  if (!a) return;
  e.preventDefault();
  var parts = emailContacts[a.getAttribute("data-email-key")];
  var addr = parts && parts.join("@");
  if (!addr) return;
  a.textContent = addr;
  a.href = "mailto:" + addr;
  window.location.href = a.href;
});
