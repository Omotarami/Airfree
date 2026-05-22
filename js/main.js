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
  {href: "about.html", label: "About"},
  {
    href: "services.html",
    label: "Services",
    children: [
      {href: "services/gis-spatial.html",          label: "GIS & Spatial Infrastructure"},
      {href: "services/digital-mapping.html",       label: "Digital Mapping & Web GIS"},
      {href: "services/drone-photogrammetry.html",  label: "Drone & Photogrammetry"},
      {href: "services/remote-sensing.html",        label: "Remote Sensing & AI"},
      {href: "services/infrastructure-utility.html",label: "Infrastructure & Utilities"},
      {href: "services/survey-data.html",           label: "Survey Data & QA/QC"},
      {href: "services/environmental.html",         label: "Environmental Intelligence"},
    ],
  },
  {href: "products.html", label: "Products"},
  {href: "industries.html", label: "Industries"},
  {href: "projects.html",  label: "Projects"},
  {href: "contact.html",   label: "Contact"},
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
      const childLinks = l.children
        .map((c) => `<a href="${BASE}${c.href}" class="dropdown-link">${c.label}</a>`)
        .join("");
      return `
      <div class="nav-dropdown">
        <a href="${BASE}${l.href}" class="nav-link ${isActive(l.href) ? "active" : ""}">
          ${l.label}<svg class="drop-chevron" width="9" height="5" viewBox="0 0 9 5" fill="none" aria-hidden="true"><path d="M1 1l3.5 3L8 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </a>
        <div class="dropdown-menu">
          ${childLinks}
          <div class="dropdown-divider"></div>
          <a href="${BASE}${l.href}" class="dropdown-link dropdown-view-all">View All ${l.label} &rarr;</a>
        </div>
      </div>`;
    }

    return `<a href="${BASE}${l.href}" class="nav-link ${isActive(l.href) ? "active" : ""}">${l.label}</a>`;
  }).join("");

  const mobileHtml = NAV.map((l) => {
    if (l.children && l.children.length) {
      const subId = `msub-${l.href.replace(".html", "")}`;
      const subLinks = l.children
        .map((c) => `<a href="${BASE}${c.href}" class="mobile-sub-link">${c.label}</a>`)
        .join("");
      return `
        <div style="display:flex;flex-direction:column;align-items:flex-start;width:100%;gap:0;">
          <button class="mobile-has-children" data-target="${subId}">
            ${l.label}
            <svg class="mobile-chevron" width="12" height="7" viewBox="0 0 12 7" fill="none" aria-hidden="true">
              <path d="M1 1l5 5 5-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <div class="mobile-submenu" id="${subId}">
            <a href="${BASE}${l.href}" class="mobile-sub-link" style="color:var(--accent-bl);">All ${l.label} &rarr;</a>
            ${subLinks}
          </div>
        </div>`;
    }
    return `<a href="${BASE}${l.href}" class="mobile-nav-link">${l.label}</a>`;
  }).join("");

  const navHtml = `
    <nav class="site-nav" id="site-nav">
      <div class="nav-inner">
        <a href="${BASE}index.html" class="nav-logo">
        <img src="${BASE}images/Airfree-1.png" alt="airfree_logo" class="nav-img">
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
      
    </div>`;

  document.body.insertAdjacentHTML("afterbegin", navHtml);
  document
    .getElementById("site-nav")
    .insertAdjacentHTML("afterend", overlayHtml);

  const toggle = document.getElementById("nav-toggle");
  const menu = document.getElementById("mobile-menu");
  const close = document.getElementById("mobile-close");
  toggle?.addEventListener("click", () => {
    const opening = !menu.classList.contains("open");
    menu.classList.toggle("open");
    toggle.classList.toggle("active", opening);
  });
  close?.addEventListener("click", () => {
    menu.classList.remove("open");
    toggle?.classList.remove("active");
  });

  // mobile accordion
  document.querySelectorAll(".mobile-has-children").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = document.getElementById(btn.dataset.target);
      if (!target) return;
      const isOpen = target.classList.contains("open");
      document.querySelectorAll(".mobile-submenu.open").forEach((s) => s.classList.remove("open"));
      document.querySelectorAll(".mobile-has-children.open").forEach((b) => b.classList.remove("open"));
      if (!isOpen) {
        target.classList.add("open");
        btn.classList.add("open");
      }
    });
  });

  // inject scroll progress bar
  document.getElementById("site-nav").insertAdjacentHTML(
    "afterend",
    `<div id="scroll-progress"></div>`,
  );

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
            <img src="${BASE}images/Airfree-removebg-preview.png" alt="airfree_logo" class="nav-img_footer">
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
  <div style="font-family:'IBM Plex Mono',monospace;font-size:0.6rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--text-3);margin-bottom:0.85rem;">
    Locations
  </div>

  <div style="display:flex;flex-direction:column;gap:1rem;">

    <div>
      <div style="font-family:'IBM Plex Mono',monospace;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent-b);margin-bottom:0.2rem;">Adelaide &mdash; Head Office</div>
      <span style="font-size:0.8rem;color:var(--text-2);">35 Cassia Street, Munno Para West, SA 5115</span>
    </div>

    <div>
      <div style="font-family:'IBM Plex Mono',monospace;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-3);margin-bottom:0.2rem;">Perth &mdash; Branch Office</div>
      <span style="font-size:0.8rem;color:var(--text-2);">8 Seddon Way, Canning Vale, WA 6155</span>
    </div>

    <div>
      <div style="font-family:'IBM Plex Mono',monospace;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-3);margin-bottom:0.2rem;">Melbourne &mdash; Branch Office</div>
      <span style="font-size:0.8rem;color:var(--text-2);">324 Settlement Road, Thomastown, VIC 3072</span>
    </div>

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
  const els = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
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

// ── Scroll Progress Bar ──────────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;
  window.addEventListener(
    "scroll",
    () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (docHeight > 0 ? (scrollTop / docHeight) * 100 : 0) + "%";
    },
    {passive: true},
  );
}

// ── Animated Counters ─────────────────────────────────────────
function animateCounters() {
  const counters = document.querySelectorAll(".count-up");
  if (!counters.length) return;
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.dataset.target || el.textContent.replace(/[^\d.]/g, ""));
        const suffix = el.dataset.suffix || "";
        const isDecimal = target % 1 !== 0;
        const duration = 1600;
        const start = performance.now();
        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 3);
          el.textContent = (isDecimal ? (target * ease).toFixed(1) : Math.round(target * ease)) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    },
    {threshold: 0.4},
  );
  counters.forEach((el) => {
    el.dataset.target = el.dataset.target || el.textContent.replace(/[^\d.]/g, "");
    obs.observe(el);
  });
}

// ── Dynamic Coordinates + Location ─────────────────────────
async function initCoordinates() {
  const coordElement = document.getElementById("coordinates");
  if (!coordElement) return;

  function render(lat, lon, location) {
    const latDir = lat >= 0 ? "N" : "S";
    const lonDir = lon >= 0 ? "E" : "W";
    coordElement.innerHTML =
      `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lon).toFixed(4)}° ${lonDir}<br>${location}`;
  }

  // Show IP-based location immediately — HTTPS, no permission required
  let ipLat = null, ipLon = null, ipLoc = "";
  try {
    const r = await fetch("https://ipapi.co/json/");
    const d = await r.json();
    if (d.latitude && d.longitude && !d.error) {
      ipLat = d.latitude;
      ipLon = d.longitude;
      ipLoc = `${d.country_name || ""}${d.region ? " / " + d.region : ""}`;
      render(ipLat, ipLon, ipLoc);
    }
  } catch (e) {
    // fallback: ipinfo.io
    try {
      const r2 = await fetch("https://ipinfo.io/json");
      const d2 = await r2.json();
      if (d2.loc) {
        const [lat, lon] = d2.loc.split(",").map(Number);
        ipLat = lat; ipLon = lon;
        ipLoc = `${d2.country || ""}${d2.region ? " / " + d2.region : ""}`;
        render(lat, lon, ipLoc);
      }
    } catch (e2) {}
  }

  // Then silently upgrade to GPS coordinates if user grants permission
  if (!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;
      let loc = ipLoc;
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`,
        );
        const d = await r.json();
        const country = d.address?.country || "";
        const state =
          d.address?.state || d.address?.region || d.address?.county || "";
        loc = `${country}${state ? " / " + state : ""}`;
      } catch (e) {}
      render(lat, lon, loc);
    },
    () => {},
    {timeout: 8000},
  );
}

function initContactMap() {
  if (!document.getElementById("contact-map") || typeof L === "undefined") return;

  const map = L.map("contact-map", {zoomControl: false}).setView([-25.2744, 133.7751], 4);

  L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 19,
    },
  ).addTo(map);

  L.control.zoom({position: "bottomright"}).addTo(map);

  const locations = [
    {
      name: "Adelaide",
      subtitle: "Head Office",
      address: "35 Cassia Street, Munno Para West, SA 5115",
      coords: [-34.6656, 138.7063],
      isMain: true,
    },
    {
      name: "Melbourne",
      subtitle: "Branch Office",
      address: "324 Settlement Road, Thomastown, VIC 3072",
      coords: [-37.6806, 145.0155],
      isMain: false,
    },
    {
      name: "Perth",
      subtitle: "Branch Office",
      address: "8 Seddon Way, Canning Vale, WA 6155",
      coords: [-32.0576, 115.9181],
      isMain: false,
    },
  ];

  locations.forEach((loc) => {
    const color = loc.isMain ? "#C4913A" : "#5A8FBE";
    const size = loc.isMain ? 16 : 12;
    const ring = loc.isMain
      ? "rgba(196,145,58,0.22)"
      : "rgba(90,143,190,0.18)";

    const icon = L.divIcon({
      className: "",
      html: `<div style="width:${size}px;height:${size}px;background:${color};border:2px solid rgba(255,255,255,0.88);border-radius:50%;box-shadow:0 0 0 6px ${ring},0 2px 10px rgba(0,0,0,0.55);"></div>`,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -(size / 2) - 6],
    });

    const marker = L.marker(loc.coords, {icon}).addTo(map);
    marker.bindPopup(
      `<div class="map-popup"><span class="map-popup-label" style="color:${color};">${loc.name} &mdash; ${loc.subtitle}</span><span class="map-popup-addr">${loc.address}</span></div>`,
      {maxWidth: 260},
    );
  });

  map.fitBounds(
    locations.map((l) => l.coords),
    {padding: [90, 90]},
  );
}

// ── Init ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  injectNav();
  injectFooter();
  initCarousel();
  initReveal();
  initScrollProgress();
  animateCounters();
  initCoordinates();
  initContactMap();
});
