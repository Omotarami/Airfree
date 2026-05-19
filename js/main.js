/* ============================================================
   Airfree Geospatial — Main JS
   Nav/Footer injection, Carousel, Scroll animations
   ============================================================ */

const BASE = (() => {
  const p = window.location.pathname;
  return p.includes("/services/") ? "../" : "./";
})();

const CURRENT = window.location.pathname.split("/").pop() || "index.html";

// ── Navigation links ──────────────────────────────────────────
const NAV = [
  {href: "index.html", label: "Home"},
  {href: "about.html", label: "About"},

  {
    href: "services.html",
    label: "Services",
    children: [{href: "technology.html", label: "Technology"}],
  },

  {
    href: "industries.html",
    label: "Industries",
    children: [
      {href: "industries.html#gov", label: "Government"},
      {href: "industries.html#utilities", label: "Utilities"},
    ],
  },

  {href: "contact.html", label: "Contact"},
];

function isActive(href) {
  if (CURRENT === href) return true;
  if (CURRENT === "" && href === "index.html") return true;
  // service pages: mark "Services" active
  if (
    window.location.pathname.includes("/services/") &&
    href === "services.html"
  )
    return true;
  return false;
}

// ── Inject Navigation ─────────────────────────────────────────
function injectNav() {
  const linksHtml = NAV.map((l) => {
    if (l.children && l.children.length) {
      return `
      <div class="nav-dropdown">
        <a href="${BASE}${l.href}" class="nav-link ${isActive(l.href) ? "active" : ""}">
          ${l.label}
        </a>

        <div class="dropdown-menu">
          ${l.children
            .map(
              (c) =>
                `<a href="${BASE}${c.href}" class="dropdown-link">${c.label}</a>`,
            )
            .join("")}
        </div>
      </div>
    `;
    }

    return `
    <a href="${BASE}${l.href}" class="nav-link ${isActive(l.href) ? "active" : ""}">
      ${l.label}
    </a>
  `;
  }).join("");

  const mobileHtml = NAV.map(
    (l) => `<a href="${BASE}${l.href}" class="mobile-nav-link">${l.label}</a>`,
  ).join("");

  const navHtml = `
    <nav class="site-nav" id="site-nav">
      <div class="nav-inner">
        <a href="${BASE}index.html" class="nav-logo">
        <img src="${BASE}images/Airfree_logo.png" alt="airfree_logo" class="nav-img">
        </a>
        <div class="nav-links" id="nav-links">
          ${linksHtml}
          <a href="${BASE}contact.html#capability" class="nav-cta">Request Capability Statement</a>
        </div>
        <button class="nav-hamburger" id="nav-toggle" aria-label="Toggle menu">
          <span class="ham-line"></span>
          <span class="ham-line"></span>
          <span class="ham-line"></span>
        </button>
      </div>
    </nav>`;

  const overlayHtml = `
    <div class="mobile-overlay" id="mobile-menu">
      ${mobileHtml}
      <a href="${BASE}contact.html#capability" class="btn btn-primary" style="margin-top:1rem;">Request Capability Statement</a>
      <button id="mobile-close" style="position:absolute;top:1.5rem;right:2rem;background:none;border:none;cursor:pointer;color:var(--text-2);font-size:1.4rem;">&#10005;</button>
    </div>`;

  document.body.insertAdjacentHTML("afterbegin", navHtml);
  document
    .getElementById("site-nav")
    .insertAdjacentHTML("afterend", overlayHtml);

  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  const close = document.getElementById("mobile-close");
  toggle?.addEventListener("click", () => menu.classList.toggle("open"));
  close?.addEventListener("click", () => menu.classList.remove("open"));

  // scroll behaviour
  window.addEventListener(
    "scroll",
    () => {
      const nav = document.getElementById("site-nav");
      if (!nav) return;

      if (window.scrollY > 60) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    },
    {passive: true},
  );
}

// ── Inject Footer ─────────────────────────────────────────────
function injectFooter() {
  const year = new Date().getFullYear();
  const svcLinks = [
    ["GIS &amp; Spatial Infrastructure", "gis-spatial.html"],
    ["Digital Mapping &amp; Web GIS", "digital-mapping.html"],
    ["Drone &amp; Photogrammetry", "drone-photogrammetry.html"],
    ["Remote Sensing &amp; AI Analytics", "remote-sensing.html"],
    ["Infrastructure &amp; Utilities", "infrastructure-utility.html"],
    ["Survey Data &amp; QA/QC", "survey-data.html"],
    ["Environmental Intelligence", "environmental.html"],
  ]
    .map(
      ([label, file]) =>
        `<li><a href="${BASE}services/${file}" class="footer-link">${label}</a></li>`,
    )
    .join("");

  const html = `
    <footer class="site-footer" style="padding:4.5rem 0 2rem;">
      <div class="container">
        <div class="footer-inner-grid">

          <!-- Brand -->
          <div>
            <img src="${BASE}images/Airfree_footer.png" alt="airfree_logo" class="nav-img_footer">
            <div style="font-family:'IBM Plex Mono',monospace;font-size:0.54rem;letter-spacing:0.22em;color:var(--accent-b);text-transform:uppercase;margin-bottom:1.25rem;">Enterprise Spatial Intelligence</div>
            <p style="font-size:0.84rem;color:var(--text-2);max-width:300px;line-height:1.7;">A specialised geospatial intelligence and infrastructure analytics consultancy serving government, utilities, and large-scale engineering operations.</p>
          </div>

          <!-- Services -->
          <div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:0.6rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--text-3);margin-bottom:1.25rem;">Services</div>
            <ul style="list-style:none;display:flex;flex-direction:column;gap:0.7rem;">${svcLinks}</ul>
          </div>

          <!-- Company -->
          <div>
            <div style="font-family:'IBM Plex Mono',monospace;font-size:0.6rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--text-3);margin-bottom:1.25rem;">Company</div>
            <ul style="list-style:none;display:flex;flex-direction:column;gap:0.7rem;">
              ${["About", "Industries", "Projects", "Technology", "Contact"]
                .map(
                  (l, _, a, href = l.toLowerCase() + ".html") =>
                    `<li><a href="${BASE}${l === "About" ? "about" : l === "Industries" ? "industries" : l === "Projects" ? "projects" : l === "Technology" ? "technology" : "contact"}.html" class="footer-link">${l}</a></li>`,
                )
                .join("")}
            </ul>
          </div>

          <!-- Contact -->
          <div>
  <div style="font-family:'IBM Plex Mono',monospace;font-size:0.6rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--text-3);margin-bottom:0.25rem;">
    Locations
  </div>

  <div style="display:flex;flex-direction:column;gap:0.6rem;">

    <span style="font-size:0.83rem;color:var(--text-2);">
      35 Cassia street, Munno Para West, 5115, South Australia, Australia
    </span>

    <span style="font-size:0.83rem;color:var(--text-2);">
      324 Settlement Road, Thomastown, 3072, Victoria, Australia
    </span>

    <span style="font-size:0.83rem;color:var(--text-2);">
      8 Seddon Way, Canning Vale, 6155, Western Australia, Australia
    </span>

  </div>
</div>

        </div>
        <div class="footer-bottom" style="display:flex;justify-content:space-between;align-items:center;padding-top:1.5rem;flex-wrap:wrap;gap:1rem;">
          <div style="font-family:'IBM Plex Mono',monospace;font-size:0.62rem;color:var(--text-3);letter-spacing:0.08em;">
            &copy; ${year} Airfree Geospatial Pty Ltd. All rights reserved.
          </div>
          <div style="display:flex;gap:2rem;">
            <a href="#" class="footer-link" style="font-size:0.7rem;">Privacy Policy</a>
            <a href="#" class="footer-link" style="font-size:0.7rem;">Terms of Service</a>
            <span style="font-size:0.7rem;color:var(--text-3);">ABN - 698093239 &mdash; Australia</span>
          </div>
        </div>
      </div>
    </footer>`;

  document.body.insertAdjacentHTML("beforeend", html);
}

// ── Hero Carousel ─────────────────────────────────────────────
function initCarousel() {
  const slides = document.querySelectorAll(".hero-slide");
  if (!slides.length) return;
  let cur = 0;
  slides[0].classList.add("active");
  setInterval(() => {
    slides[cur].classList.remove("active");
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add("active");
  }, 6500);
}

// ── Scroll Reveal ─────────────────────────────────────────────
function initReveal() {
  const els = document.querySelectorAll(".reveal");
  if (!els.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      });
    },
    {threshold: 0.08, rootMargin: "0px 0px -40px 0px"},
  );
  els.forEach((el) => obs.observe(el));
}

// ── Dynamic Coordinates + Location ─────────────────────────
async function initCoordinates() {
  const coordElement = document.getElementById("coordinates");
  if (!coordElement) return;

  if (!navigator.geolocation) {
    coordElement.innerHTML = "Geolocation not supported";
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const latDir = lat >= 0 ? "N" : "S";
      const lonDir = lon >= 0 ? "E" : "W";

      const formattedLat = Math.abs(lat).toFixed(4);
      const formattedLon = Math.abs(lon).toFixed(4);

      let locationText = "Unknown location";

      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );

        const data = await res.json();

        const country = data.address?.country || "Unknown Country";
        const state =
          data.address?.state ||
          data.address?.region ||
          data.address?.county ||
          "";

        locationText = `${country}${state ? " / " + state : ""}`;

      } catch (e) {
        locationText = "Location unavailable";
      }

      coordElement.innerHTML = `
        ${formattedLat}° ${latDir}, ${formattedLon}° ${lonDir}<br>
        ${locationText}
      `;
    },
    () => {
      coordElement.innerHTML = "Location unavailable";
    }
  );
}
// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  injectNav();
  injectFooter();
  initCarousel();
  initReveal();
  initCoordinates();
});
