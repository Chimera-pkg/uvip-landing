/* Pengaturan bersama untuk beranda dan halaman Kredit. */
(() => {
  "use strict";

  // Lokasi aset tetap benar pada /, /kredit/, dan bila di-host pada subfolder.
  const publicRoot = new URL("../../", document.currentScript.src);
  const config = window.URBANLENS_CONFIG;
  const assetURL = (path) => new URL(path, publicRoot).href;
  const imagePath = (key) => key.split(".").reduce((value, part) => value?.[part], config.images);

  function dashboardURL(slug = "dashboard") {
    const override = config.dashboardMenuUrls?.[slug];
    if (override) return new URL(override, publicRoot).href;
    const url = new URL(config.links.dashboard, publicRoot);
    url.hash = slug;
    return url.href;
  }

  window.UrbanLens = { config, assetURL, dashboardURL };

  document.querySelectorAll("[data-link]").forEach((link) => {
    const url = config.links[link.dataset.link];
    if (url) link.href = new URL(url, publicRoot).href;
  });
  document.querySelectorAll("[data-dashboard-menu]").forEach((link) => {
    link.href = dashboardURL(link.dataset.dashboardMenu);
  });
  document.querySelectorAll("[data-image]").forEach((element) => {
    const path = imagePath(element.dataset.image);
    if (!path) return;
    if (element.tagName === "LINK") element.href = assetURL(path);
    else element.src = assetURL(path);
  });

  const rootStyle = document.documentElement.style;
  const cssImage = (path) => `url(${JSON.stringify(assetURL(path))})`;
  rootStyle.setProperty("--brand-logo", cssImage(config.images.logo));
  for (const side of ["before", "after"]) {
    const photo = config.comparison[side];
    rootStyle.setProperty(`--comparison-${side}-image`, cssImage(photo.src));
    rootStyle.setProperty(`--comparison-${side}-size`, photo.size || "cover");
    rootStyle.setProperty(`--comparison-${side}-position`, photo.position || "center");
  }

  const gallery = document.getElementById("hero-gallery-slides");
  if (!gallery) return; // Halaman Kredit tidak memuat slider beranda.
  const dots = document.querySelector(".hero-slider-dots");
  const slides = config.hero.slides;
  const figures = document.createDocumentFragment();
  const controls = document.createDocumentFragment();

  slides.forEach((slide, index) => {
    const figure = document.createElement("figure");
    figure.className = "hero-slide" + (index === 0 ? " is-active" : "");
    figure.dataset.heroSlide = index;
    figure.dataset.title = slide.title;
    figure.dataset.values = slide.values.join(",");
    figure.setAttribute("role", "group");
    figure.setAttribute("aria-roledescription", "slide");
    figure.setAttribute("aria-label", `${index + 1} dari ${slides.length}: ${slide.title}`);
    figure.setAttribute("aria-hidden", String(index !== 0));

    const image = document.createElement("img");
    image.src = assetURL(slide.src);
    image.alt = slide.alt;
    image.decoding = "async";
    if (index === 0) image.fetchPriority = "high";

    if (slide.crop) {
      // Ukuran viewport foto pada screenshot referensi adalah 976 × 630 px.
      figure.style.setProperty("--photo-scale", `${slide.crop.sourceWidth / 976 * 100}%`);
      figure.style.setProperty("--photo-left", `${-slide.crop.left / 976 * 100}%`);
      figure.style.setProperty("--photo-top", `${-slide.crop.top / 630 * 100}%`);
    } else {
      // Foto biasa cukup menggunakan crop: null pada config.
      Object.assign(image.style, {
        width: "100%", height: "100%", left: "0", top: "0", objectFit: "cover",
      });
    }
    figure.append(image);
    figures.append(figure);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "hero-dot" + (index === 0 ? " is-active" : "");
    dot.dataset.heroDot = index;
    dot.setAttribute("aria-label", `Tampilkan gambar ${index + 1}: ${slide.title}`);
    if (index === 0) dot.setAttribute("aria-current", "true");
    dot.append(document.createElement("span"));
    controls.append(dot);
  });

  gallery.replaceChildren(figures);
  dots.replaceChildren(controls);
})();
