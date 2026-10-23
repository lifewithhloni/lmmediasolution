// LM Media Solutions: mobile navigation and enquiry form (no dependencies).
(function () {
  var menu = document.querySelector(".menu");
  var links = document.getElementById("nav-links");
  if (menu && links) {
    var setOpen = function (open) {
      links.classList.toggle("open", open);
      menu.setAttribute("aria-expanded", String(open));
      menu.textContent = open ? "Close" : "Menu";
    };
    menu.addEventListener("click", function () { setOpen(!links.classList.contains("open")); });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) { setOpen(false); menu.focus(); }
    });
  }

  var form = document.querySelector("form.enquiry");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var submit = form.querySelector('button[type="submit"]');
  var fields = [["Name", "name"], ["Business", "business"], ["Email", "email"], ["Phone", "phone"], ["Service", "service"], ["Budget", "budget"], ["Project", "message"]];

  // Preselect a service passed from a package or service CTA (?service=...).
  var wanted = new URLSearchParams(location.search).get("service");
  if (wanted) {
    var select = form.elements.service;
    for (var i = 0; i < select.options.length; i++) if (select.options[i].text === wanted) select.selectedIndex = i;
  }

  function show(message, type) {
    status.textContent = message;
    status.className = "form-status " + (type || "");
  }

  function validate() {
    var first = null;
    form.querySelectorAll("input, select, textarea").forEach(function (el) {
      if (el.name === "website") return;
      if (typeof el.value === "string" && el.tagName !== "SELECT") el.value = el.value.trim();
      if (el.type === "tel") {
        var digits = el.value.replace(/\D/g, "");
        el.setCustomValidity(el.value && (!/^[0-9 +()-]+$/.test(el.value) || digits.length < 9 || digits.length > 15) ? "Please enter a valid contact number." : "");
      }
      var ok = el.checkValidity();
      el.setAttribute("aria-invalid", String(!ok));
      var err = document.getElementById(el.id + "-error");
      if (!ok) {
        if (!err) {
          err = document.createElement("p");
          err.id = el.id + "-error";
          err.className = "field-error";
          el.insertAdjacentElement("afterend", err);
          el.setAttribute("aria-describedby", ((el.getAttribute("aria-describedby") || "") + " " + err.id).trim());
        }
        err.textContent = message(el);
        if (!first) first = el;
      } else if (err) {
        err.textContent = "";
      }
    });
    if (first) { first.focus(); show("Please correct the highlighted fields.", "error"); }
    return !first;
  }

  function message(el) {
    if (el.validity.valueMissing) return "This field is required.";
    if (el.validity.typeMismatch) return "Please enter a valid email address.";
    if (el.validity.customError) return el.validationMessage;
    if (el.validity.tooShort) return "Please add a little more detail (at least " + el.minLength + " characters).";
    return "Please check this field.";
  }

  function summary() {
    var data = new FormData(form);
    return fields.map(function (f) { return f[0] + ": " + (data.get(f[1]) || "-"); }).join("\n");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.elements.website.value) return; // spam honeypot
    if (!validate()) return;
    var endpoint = form.dataset.endpoint;
    if (!endpoint) {
      // No form service configured: open the visitor's email app with the enquiry prepared.
      location.href = "mailto:" + form.dataset.email + "?subject=" + encodeURIComponent("Project enquiry from " + form.elements.name.value) + "&body=" + encodeURIComponent(summary());
      show("Your email app should open with your enquiry ready to send. If it does not, email " + form.dataset.email + " or use Send via WhatsApp.", "success");
      return;
    }
    submit.disabled = true;
    show("Sending your enquiry…");
    fetch(endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
      .then(function (r) {
        if (!r.ok) throw new Error("Request failed");
        form.reset();
        show("Thank you. Your enquiry has been sent and we will be in touch soon.", "success");
      })
      .catch(function () {
        show("Sorry, your enquiry could not be sent. Please try again, email " + form.dataset.email + " or use Send via WhatsApp.", "error");
      })
      .then(function () { submit.disabled = false; });
  });

  form.querySelector("[data-whatsapp-send]").addEventListener("click", function () {
    if (form.elements.website.value || !validate()) return;
    var text = "Hi LM Media Solutions, I would like to start a project.\n\n" + summary();
    window.open("https://wa.me/" + form.dataset.whatsapp + "?text=" + encodeURIComponent(text), "_blank", "noopener");
    show("WhatsApp should open in a new tab with your enquiry ready to send.", "success");
  });
})();
