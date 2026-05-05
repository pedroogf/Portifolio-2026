/* =================================
   Tabs (Sobre Mim)
   ================================= */
const tablinks = document.getElementsByClassName("tab-links");
const tabcontents = document.getElementsByClassName("tab-contents");

function opentab(evt, tabname) {
    for (const link of tablinks) link.classList.remove("active-link");
    for (const tab of tabcontents) tab.classList.remove("active-tab");
    if (evt && evt.currentTarget) evt.currentTarget.classList.add("active-link");
    const target = document.getElementById(tabname);
    if (target) target.classList.add("active-tab");
}

/* =================================
   Header scroll effect + active link
   ================================= */
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-link");
const sections = document.querySelectorAll("section[id]");

function onScroll() {
    if (window.scrollY > 30) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");

    const scrollPos = window.scrollY + 120;
    let currentId = "";
    sections.forEach(sec => {
        if (scrollPos >= sec.offsetTop) currentId = sec.id;
    });

    navLinks.forEach(link => {
        link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${currentId}`
        );
    });

    const progress = document.getElementById("scrollProgress");
    if (progress) {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
        progress.style.width = `${pct}%`;
    }

    const backTop = document.querySelector(".back-top");
    if (backTop) backTop.classList.toggle("is-visible", window.scrollY > 600);
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* =================================
   Mobile menu toggle
   ================================= */
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("is-open");
        const icon = menuToggle.querySelector("i");
        if (icon) {
            icon.classList.toggle("bx-menu");
            icon.classList.toggle("bx-x");
        }
    });

    navMenu.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("is-open");
            const icon = menuToggle.querySelector("i");
            if (icon) {
                icon.classList.add("bx-menu");
                icon.classList.remove("bx-x");
            }
        });
    });
}

/* =================================
   Reveal on scroll (IntersectionObserver)
   ================================= */
const revealEls = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
);

revealEls.forEach(el => revealObserver.observe(el));

/* =================================
   Animated counters (stats)
   ================================= */
const counters = document.querySelectorAll(".stat strong[data-count]");
const counterObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.count, 10) || 0;
            const duration = 1500;
            const start = performance.now();

            function update(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target) + (target >= 10 ? "+" : "");
                if (progress < 1) requestAnimationFrame(update);
                else el.textContent = target + (target >= 10 ? "+" : "");
            }

            requestAnimationFrame(update);
            counterObserver.unobserve(el);
        });
    },
    { threshold: 0.5 }
);

counters.forEach(c => counterObserver.observe(c));

/* =================================
   Contact form (client-side feedback)
   ================================= */
const form = document.getElementById("contatoForm");
const feedback = document.getElementById("formFeedback");

if (form) {
    form.addEventListener("submit", e => {
        e.preventDefault();
        const data = new FormData(form);
        const name = (data.get("name") || "").toString().trim();
        const email = (data.get("email") || "").toString().trim();
        const message = (data.get("message") || "").toString().trim();

        if (!name || !email || !message) {
            feedback.textContent = "Por favor, preencha todos os campos obrigatórios.";
            feedback.classList.add("error");
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            feedback.textContent = "E-mail inválido.";
            feedback.classList.add("error");
            return;
        }

        feedback.classList.remove("error");
        feedback.textContent = "Mensagem enviada! Em breve retornarei o contato.";
        form.reset();

        setTimeout(() => { feedback.textContent = ""; }, 5000);
    });
}

/* =================================
   Year in footer
   ================================= */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
