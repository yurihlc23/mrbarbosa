(function () {
  "use strict";

  /* ============================================================
     CONFIGURAÇÃO DE CONTATO
     Preencha os dois campos abaixo assim que tiver os dados oficiais
     da empresa. O restante do site (botões, formulário, rodapé e
     o botão flutuante de WhatsApp) se ativa sozinho.
     ============================================================ */
  const CONTACT_CONFIG = {
    email: "",     // ex: "contato@mrbarbosa.com.br"
    whatsapp: "5511950578187",  // (11) 95057-8187
    phoneDisplay: "(11) 95057-8187" // exibido no campo "Telefone" e no rodapé
  };

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------- aplica config de contato na página ---------- */
  function applyContactConfig() {
    const emailLink = document.querySelector('[data-role="email-link"]');
    const waLink = document.querySelector('[data-role="whatsapp-link"]');
    const phoneValue = document.querySelector('[data-role="phone-value"]');
    const waFloat = document.getElementById("waFloat");
    const emailFooter = document.querySelector('[data-role="email-footer"]');
    const waFooter = document.querySelector('[data-role="whatsapp-footer"]');

    if (CONTACT_CONFIG.email) {
      emailLink.href = "mailto:" + CONTACT_CONFIG.email;
      emailLink.textContent = CONTACT_CONFIG.email;
      emailLink.removeAttribute("aria-disabled");
      if (emailFooter) emailFooter.textContent = "E-mail: " + CONTACT_CONFIG.email;
    }

    if (CONTACT_CONFIG.whatsapp) {
      const waHref = "https://wa.me/" + CONTACT_CONFIG.whatsapp;
      waLink.href = waHref;
      waLink.textContent = "Conversar no WhatsApp";
      waLink.removeAttribute("aria-disabled");
      waFloat.href = waHref;
      waFloat.removeAttribute("aria-disabled");
      waFloat.classList.add("is-active");
      waFloat.title = "Falar no WhatsApp";
      if (waFooter) waFooter.textContent = "WhatsApp: " + (CONTACT_CONFIG.phoneDisplay || CONTACT_CONFIG.whatsapp);
    }

    if (CONTACT_CONFIG.phoneDisplay) {
      phoneValue.textContent = CONTACT_CONFIG.phoneDisplay;
    }
  }
  applyContactConfig();

  /* ---------- menu mobile ---------- */
  const navToggle = document.getElementById("navToggle");
  const mainNav = document.getElementById("mainNav");
  navToggle.addEventListener("click", function () {
    const open = mainNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", open);
  });
  mainNav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      mainNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---------- filtro de galeria ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const galleryItems = document.querySelectorAll(".g-item");
  const galleryGrid = document.getElementById("galleryGrid");
  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      filterBtns.forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      const filter = btn.dataset.filter;
      galleryItems.forEach(function (item) {
        const show = filter === "all" || item.dataset.cat === filter;
        item.classList.toggle("is-hidden", !show);
      });
      // mantém a grade uniforme (sem o bloco em destaque) quando um
      // filtro de categoria está ativo, para as colunas alinharem certinho
      galleryGrid.classList.toggle("is-filtered", filter !== "all");
    });
  });

  /* ---------- lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lbImage = document.getElementById("lbImage");
  const lbCaption = document.getElementById("lbCaption");
  const lbClose = document.getElementById("lbClose");
  const lbPrev = document.getElementById("lbPrev");
  const lbNext = document.getElementById("lbNext");

  let visibleItems = [];
  let currentIndex = 0;

  function getVisibleItems() {
    return Array.from(galleryItems).filter(function (item) {
      return !item.classList.contains("is-hidden");
    });
  }

  function openLightbox(item) {
    visibleItems = getVisibleItems();
    currentIndex = visibleItems.indexOf(item);
    showCurrent();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function showCurrent() {
    const item = visibleItems[currentIndex];
    if (!item) return;
    lbImage.src = item.dataset.full;
    lbImage.alt = item.dataset.caption || "";
    lbCaption.textContent = item.dataset.caption || "";
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  galleryItems.forEach(function (item) {
    item.addEventListener("click", function () { openLightbox(item); });
  });

  lbClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) closeLightbox();
  });
  lbPrev.addEventListener("click", function () {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    showCurrent();
  });
  lbNext.addEventListener("click", function () {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    showCurrent();
  });
  document.addEventListener("keydown", function (e) {
    if (!lightbox.classList.contains("is-open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lbPrev.click();
    if (e.key === "ArrowRight") lbNext.click();
  });

  /* ---------- máscara do campo CNPJ ---------- */
  const cnpjInput = document.getElementById("cnpj");
  if (cnpjInput) {
    cnpjInput.addEventListener("input", function () {
      let v = cnpjInput.value.replace(/\D/g, "").slice(0, 14);
      v = v.replace(/^(\d{2})(\d)/, "$1.$2");
      v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
      v = v.replace(/\.(\d{3})(\d)/, ".$1/$2");
      v = v.replace(/(\d{4})(\d)/, "$1-$2");
      cnpjInput.value = v;
    });
  }

  /* ---------- formulário de contato ---------- */
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  const formSubmit = document.getElementById("formSubmit");

  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const mensagemInput = document.getElementById("mensagem");

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setFieldError(input, errorEl, hasError) {
    input.classList.toggle("is-invalid", hasError);
    if (errorEl) errorEl.classList.toggle("is-visible", hasError);
  }

  function validateForm() {
    const nomeOk = nomeInput.value.trim().length > 0;
    const emailOk = EMAIL_RE.test(emailInput.value.trim());
    const mensagemOk = mensagemInput.value.trim().length > 0;

    setFieldError(nomeInput, document.getElementById("erroNome"), !nomeOk);
    setFieldError(emailInput, document.getElementById("erroEmail"), !emailOk);
    setFieldError(mensagemInput, document.getElementById("erroMensagem"), !mensagemOk);

    return nomeOk && emailOk && mensagemOk;
  }

  // remove o erro assim que o usuário corrige o campo
  [
    [nomeInput, "erroNome", function () { return nomeInput.value.trim().length > 0; }],
    [emailInput, "erroEmail", function () { return EMAIL_RE.test(emailInput.value.trim()); }],
    [mensagemInput, "erroMensagem", function () { return mensagemInput.value.trim().length > 0; }]
  ].forEach(function (entry) {
    const input = entry[0], errorId = entry[1], isValid = entry[2];
    input.addEventListener("input", function () {
      if (isValid()) setFieldError(input, document.getElementById(errorId), false);
    });
  });

  function buildMessageText(data) {
    return (
      "Nome: " + data.nome + "\n" +
      "Empresa: " + (data.empresa || "-") + "\n" +
      (data.cnpj ? "CNPJ: " + data.cnpj + "\n" : "") +
      "E-mail: " + data.email + "\n\n" +
      "Mensagem:\n" + data.mensagem
    );
  }

  function setNote(message, type) {
    formNote.textContent = message;
    formNote.classList.remove("is-success", "is-error");
    if (type) formNote.classList.add(type);
  }

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validateForm()) {
      setNote("Verifique os campos destacados antes de enviar.", "is-error");
      return;
    }

    const data = {
      nome: nomeInput.value.trim(),
      empresa: document.getElementById("empresa").value.trim(),
      cnpj: document.getElementById("cnpj").value.trim(),
      email: emailInput.value.trim(),
      mensagem: mensagemInput.value.trim()
    };

    formSubmit.disabled = true;

    // Canal de envio: usa e-mail se estiver configurado; senão,
    // usa o WhatsApp (que já está ativo) como canal funcional.
    if (CONTACT_CONFIG.email) {
      const subject = encodeURIComponent("Orçamento — " + (data.empresa || data.nome));
      const body = encodeURIComponent(buildMessageText(data));
      window.location.href = "mailto:" + CONTACT_CONFIG.email + "?subject=" + subject + "&body=" + body;
      setNote("Abrindo seu aplicativo de e-mail com a mensagem preenchida...", "is-success");
    } else if (CONTACT_CONFIG.whatsapp) {
      const text = encodeURIComponent(
        "Olá, MR Barbosa! Vim pelo site.\n\n" + buildMessageText(data)
      );
      window.open("https://wa.me/" + CONTACT_CONFIG.whatsapp + "?text=" + text, "_blank", "noopener");
      setNote("Abrindo o WhatsApp com sua mensagem preenchida — é só confirmar o envio por lá.", "is-success");
    } else {
      setNote("Recebemos os dados, mas nenhum canal de envio está configurado ainda. Anote as informações e tente novamente em breve.", "is-error");
      formSubmit.disabled = false;
      return;
    }

    contactForm.reset();
    window.setTimeout(function () { formSubmit.disabled = false; }, 1500);
  });

  /* ---------- header ao rolar ---------- */
  const header = document.querySelector(".site-header");
  window.addEventListener("scroll", function () {
    header.style.borderBottomColor = window.scrollY > 8 ? "var(--line-strong)" : "var(--line)";
  }, { passive: true });
})();
