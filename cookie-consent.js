/* =====================================================================
   WINNERS CHAPEL INT'L BONABERI — Consentement aux cookies
   - Google Analytics n'est chargé QU'APRÈS acceptation du visiteur.
   - Le visiteur peut changer d'avis à tout moment (lien « Gérer mes cookies »,
     c.-à-d. tout élément portant l'attribut data-cookie-settings).
   - Balise à placer sur chaque page, juste avant </body> :
       <script src="cookie-consent.js" defer></script>
     (sur la page d'accueil bilingue : ajouter data-lang="both")
   ===================================================================== */
(function () {
  "use strict";

  /* >>> À REMPLACER par votre identifiant de mesure Google Analytics 4 (ex. G-AB12CD34EF) <<< */
  var GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

  var STORAGE_KEY = "wci_cookie_consent";
  var VALIDITY_DAYS = 180; // le choix est redemandé au bout de 6 mois

  var script = document.currentScript;
  var forced = script && script.getAttribute("data-lang");
  var pageLang = (document.documentElement.lang || "fr").toLowerCase().slice(0, 2);
  var mode = forced === "both" ? "both" : (pageLang === "en" ? "en" : "fr");

  var T = {
    fr: {
      title: "Respect de votre vie privée",
      text: "Ce site utilise Google Analytics pour mesurer son audience (pages visitées, durée, type d’appareil). Ces cookies ne sont déposés qu’avec votre accord. Vous pouvez refuser sans conséquence et changer d’avis à tout moment.",
      accept: "Accepter", refuse: "Refuser",
      more: "Politique de confidentialité", href: "politique-confidentialite.html"
    },
    en: {
      title: "Your privacy matters",
      text: "This website uses Google Analytics to measure its audience (pages visited, time spent, device type). These cookies are only set with your consent. You may refuse without any consequence and change your mind at any time.",
      accept: "Accept", refuse: "Refuse",
      more: "Privacy policy", href: "privacy-policy.html"
    }
  };

  /* ---------- Stockage du choix ---------- */
  function readChoice() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var o = JSON.parse(raw);
      if (!o || (o.v !== "accepted" && o.v !== "refused")) return null;
      if (Date.now() - o.t > VALIDITY_DAYS * 86400000) return null;
      return o.v;
    } catch (e) { return null; }
  }
  function saveChoice(v) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  }

  /* ---------- Google Analytics ---------- */
  function gaConfigured() {
    return GA_MEASUREMENT_ID && GA_MEASUREMENT_ID.indexOf("XXXX") === -1;
  }
  function loadGA() {
    if (!gaConfigured()) return;
    window["ga-disable-" + GA_MEASUREMENT_ID] = false;
    if (window.__wciGaLoaded) return;
    window.__wciGaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_MEASUREMENT_ID);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      cookie_expires: 34128000, // ≈ 13 mois
      cookie_flags: "SameSite=Lax;Secure"
    });
  }
  function unloadGA() {
    if (gaConfigured()) window["ga-disable-" + GA_MEASUREMENT_ID] = true;
    var host = location.hostname, parts = host.split("."), domains = [host, "." + host];
    if (parts.length > 2) domains.push("." + parts.slice(-2).join("."));
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name === "_ga" || name.indexOf("_ga_") === 0 || name === "_gid" || name.indexOf("_gat") === 0) {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        domains.forEach(function (d) {
          document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=" + d;
        });
      }
    });
  }

  /* ---------- Bandeau ---------- */
  var banner;
  function injectStyles() {
    var css = ""
      + "#wci-cc{position:fixed;left:50%;bottom:16px;transform:translateX(-50%);width:calc(100% - 24px);max-width:760px;"
      + "z-index:3000;background:#fff;color:#171717;border-radius:12px;border-top:4px solid #c62828;"
      + "box-shadow:0 10px 40px rgba(0,0,0,.28);padding:18px 20px;font:14px/1.5 Arial,Helvetica,sans-serif}"
      + "#wci-cc strong{display:block;font-size:16px;margin-bottom:6px}"
      + "#wci-cc p{margin:0 0 6px;color:#333}"
      + "#wci-cc a{color:#c62828;text-decoration:underline}"
      + "#wci-cc .wci-cc-btns{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}"
      + "#wci-cc button{flex:1 1 140px;padding:12px 18px;border-radius:6px;font:bold 14px Arial,Helvetica,sans-serif;"
      + "cursor:pointer;border:2px solid #c62828}"
      + "#wci-cc .wci-yes{background:#c62828;color:#fff}"
      + "#wci-cc .wci-yes:hover{background:#a91f1f;border-color:#a91f1f}"
      + "#wci-cc .wci-no{background:#fff;color:#c62828}"
      + "#wci-cc .wci-no:hover{background:#fff1f1}"
      + "#wci-cc hr{border:0;border-top:1px solid #eee;margin:8px 0}";
    var st = document.createElement("style");
    st.textContent = css;
    document.head.appendChild(st);
  }
  function buildBanner() {
    var langs = mode === "both" ? ["fr", "en"] : [mode];
    var html = "";
    langs.forEach(function (l, i) {
      var t = T[l];
      if (i > 0) html += "<hr>";
      html += "<strong>" + t.title + "</strong><p>" + t.text + " <a href=\"" + t.href + "\">" + t.more + "</a></p>";
    });
    var yes = langs.map(function (l) { return T[l].accept; }).join(" / ");
    var no = langs.map(function (l) { return T[l].refuse; }).join(" / ");
    html += "<div class=\"wci-cc-btns\"><button type=\"button\" class=\"wci-no\" data-wci=\"refused\">" + no
      + "</button><button type=\"button\" class=\"wci-yes\" data-wci=\"accepted\">" + yes + "</button></div>";
    banner = document.createElement("div");
    banner.id = "wci-cc";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", T[langs[0]].title);
    banner.innerHTML = html;
    banner.addEventListener("click", function (e) {
      var v = e.target && e.target.getAttribute && e.target.getAttribute("data-wci");
      if (!v) return;
      saveChoice(v);
      hideBanner();
      if (v === "accepted") loadGA(); else unloadGA();
    });
    document.body.appendChild(banner);
  }
  function showBanner() { if (!banner) buildBanner(); banner.style.display = "block"; }
  function hideBanner() { if (banner) banner.style.display = "none"; }

  /* ---------- Démarrage ---------- */
  function init() {
    injectStyles();
    var choice = readChoice();
    if (choice === "accepted") loadGA();
    else if (choice === "refused") unloadGA();
    else showBanner();

    document.addEventListener("click", function (e) {
      var el = e.target.closest ? e.target.closest("[data-cookie-settings]") : null;
      if (el) { e.preventDefault(); showBanner(); }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
