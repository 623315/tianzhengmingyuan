(function () {
  "use strict";

  const docEl = document.documentElement;
  const body = document.body;
  const nav = document.getElementById("siteNav");
  const menuBtn = document.getElementById("menuBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const toast = document.getElementById("toast");
  let toastTimer = 0;

  /* ---------- Nav ---------- */

  const onScroll = function () {
    if (!nav) return;
    nav.classList.toggle("scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function setMenu(open) {
    if (!menuBtn || !mobileMenu) return;
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.setAttribute("aria-label", open ? "关闭菜单" : "打开菜单");
    mobileMenu.classList.toggle("open", open);
    mobileMenu.setAttribute("aria-hidden", open ? "false" : "true");
    body.classList.toggle("menu-open", open);
  }

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });
  }

  /* ---------- Toast ---------- */

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(function () {
      toast.classList.remove("show");
    }, 2200);
  }

  /* ---------- Copy WeChat ---------- */

  function fallbackCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch (err) {
      ok = false;
    }
    document.body.removeChild(area);
    return ok;
  }

  document.querySelectorAll(".copy-wechat").forEach(function (button) {
    button.addEventListener("click", function () {
      const text = button.getAttribute("data-wechat") || "tianzhengmingyuan010";
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(text)
          .then(function () {
            showToast("微信号已复制");
          })
          .catch(function () {
            showToast(fallbackCopy(text) ? "微信号已复制" : "复制失败，请手动记录：" + text);
          });
      } else {
        showToast(fallbackCopy(text) ? "微信号已复制" : "复制失败，请手动记录：" + text);
      }
    });
  });

  /* ---------- Reveal ---------- */

  const revealSelectors = [
    ".section-head",
    ".course-card",
    ".stat",
    ".persona-card",
    ".bento-card",
    ".stage",
    ".day-schedule",
    ".deliverable",
    ".price-card",
    ".flow-step",
    ".promise",
    ".gallery-item",
    ".proof-copy",
    ".proof-stats",
    ".clients",
    ".film-card",
    ".campus-content",
    ".location-card",
    ".process-step",
    ".form-card",
    ".contact-card",
    ".split-copy",
    ".split-media",
    ".faq",
  ];

  const revealEls = Array.from(document.querySelectorAll(revealSelectors.join(",")));

  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    revealEls.forEach(function (el) {
      el.classList.add("reveal");
      const index = Array.prototype.indexOf.call(el.parentElement.children, el);
      el.style.setProperty("--delay", Math.min(index, 4) * 0.055 + "s");
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );

    revealEls.forEach(function (el) {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.92) {
        el.classList.add("in");
      } else {
        observer.observe(el);
      }
    });
  }

  /* ---------- Film modal ---------- */

  const filmModal = document.getElementById("filmModal");
  const filmVideo = filmModal ? filmModal.querySelector("video") : null;

  function openFilm() {
    if (!filmModal) return;
    if (typeof filmModal.showModal === "function") {
      filmModal.showModal();
    } else {
      filmModal.setAttribute("open", "");
    }
    body.classList.add("menu-open");
  }

  function closeFilm() {
    if (!filmModal) return;
    if (typeof filmModal.close === "function" && filmModal.open) {
      filmModal.close();
    } else {
      filmModal.removeAttribute("open");
    }
    body.classList.remove("menu-open");
    if (filmVideo) filmVideo.pause();
  }

  document.querySelectorAll("[data-open-film]").forEach(function (button) {
    button.addEventListener("click", openFilm);
  });

  if (filmModal) {
    filmModal.addEventListener("close", function () {
      body.classList.remove("menu-open");
      if (filmVideo) filmVideo.pause();
    });
    filmModal.addEventListener("click", function (event) {
      if (event.target === filmModal) closeFilm();
    });
    const closeBtn = filmModal.querySelector(".modal-close");
    if (closeBtn) closeBtn.addEventListener("click", closeFilm);
  }

  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (filmModal && filmModal.open) {
      closeFilm();
    } else {
      setMenu(false);
    }
  });

  /* ---------- Lead form ---------- */

  const form = document.getElementById("applyForm");
  if (form) {
    const status = document.getElementById("formStatus");
    const success = document.getElementById("formSuccess");
    const submit = form.querySelector("button[type='submit']");
    const nextField = form.querySelector("input[name='_next']");
    const hideOnSuccess = form.querySelectorAll(".form-grid, .form-submit, .form-note");

    if (nextField) {
      nextField.value = new URL("thanks.html", window.location.href).href;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      if (status) {
        status.textContent = "";
        status.classList.remove("show");
      }

      const originalLabel = submit ? submit.textContent : "";
      if (submit) {
        submit.disabled = true;
        submit.textContent = "正在提交…";
      }

      const data = {};
      new FormData(form).forEach(function (value, key) {
        data[key] = value;
      });

      fetch("https://formsubmit.co/ajax/623315@qq.com", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      })
        .then(function (response) {
          return response.json().then(function (json) {
            return { ok: response.ok, json: json };
          });
        })
        .then(function (result) {
          if (!result.ok || result.json.success === "false" || result.json.success === false) {
            throw new Error(result.json.message || "提交失败");
          }
          hideOnSuccess.forEach(function (el) {
            el.style.display = "none";
          });
          if (success) {
            success.classList.add("show");
            success.setAttribute("tabindex", "-1");
            success.focus({ preventScroll: true });
          }
          form.reset();
          showToast("预约信息已提交");
        })
        .catch(function () {
          if (status) {
            status.textContent =
              "提交没有成功。请直接加微信 tianzhengmingyuan010，或稍后再试。";
            status.classList.add("show");
          }
        })
        .finally(function () {
          if (submit) {
            submit.disabled = false;
            submit.textContent = originalLabel || "提交预约";
          }
        });
    });
  }

  /* ---------- Close menu on resize ---------- */

  window.addEventListener("resize", function () {
    if (window.innerWidth > 900) setMenu(false);
  });
})();
