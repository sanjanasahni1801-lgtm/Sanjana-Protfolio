document.addEventListener("DOMContentLoaded", () => {
  // Mobile navigation
  const menu = document.getElementById("menu");
  const nav = document.querySelector("nav");
  if (menu && nav) {
    menu.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => nav.classList.remove("open"))
    );
  }

  // Portfolio filters
  const views = {
    all: document.querySelector(".view-all"),
    posters: document.querySelector(".view-posters"),
    videos: document.querySelector(".view-videos"),
    writing: document.querySelector(".view-writing"),
    social: document.querySelector(".view-social")
  };

  document.querySelectorAll(".filter").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      Object.values(views).forEach(view => {
        if (view) view.classList.add("hidden");
      });

      const target = views[btn.dataset.filter];
      if (target) target.classList.remove("hidden");
    });
  });

  // Poster lightbox
  const imageNames = [...document.querySelectorAll(".poster-card .image-open")]
    .map(b => b.dataset.image)
    .filter(Boolean);

  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCap = document.getElementById("lightbox-caption");
  let lightIndex = 0;

  function openLightbox(src, caption) {
    if (!lb || !lbImg) return;
    lightIndex = Math.max(0, imageNames.indexOf(src));
    lbImg.src = src;
    lbImg.alt = caption || "Sanjana Sahani creative";
    if (lbCap) lbCap.textContent = caption || "Sanjana Sahani creative";
    lb.classList.add("show");
  }

  document.querySelectorAll(".image-open").forEach(btn => {
    btn.addEventListener("click", () =>
      openLightbox(btn.dataset.image, btn.dataset.caption)
    );
  });

  function changeImage(dir) {
    if (!imageNames.length || !lbImg) return;
    lightIndex = (lightIndex + dir + imageNames.length) % imageNames.length;
    lbImg.src = imageNames[lightIndex];
    if (lbCap) lbCap.textContent = "Creative Visual " + String(lightIndex + 1).padStart(2, "0");
  }

  const lbPrev = document.querySelector(".lightbox-prev");
  const lbNext = document.querySelector(".lightbox-next");
  const lbClose = document.querySelector(".lightbox-close");

  if (lbPrev) lbPrev.addEventListener("click", () => changeImage(-1));
  if (lbNext) lbNext.addEventListener("click", () => changeImage(1));
  if (lbClose) lbClose.addEventListener("click", () => lb?.classList.remove("show"));
  if (lb) lb.addEventListener("click", e => {
    if (e.target === lb) lb.classList.remove("show");
  });

  // Article readers
  document.querySelectorAll(".reader-open").forEach(btn => {
    btn.addEventListener("click", () => {
      const reader = document.getElementById(btn.dataset.reader);
      if (reader) reader.classList.add("show");
    });
  });

  document.querySelectorAll(".reader-close").forEach(btn => {
    btn.addEventListener("click", () => btn.closest(".reader")?.classList.remove("show"));
  });

  document.querySelectorAll(".reader").forEach(reader => {
    reader.addEventListener("click", e => {
      if (e.target === reader) reader.classList.remove("show");
    });
  });

  // =====================================================
  // HOME SHOWCASE — logo + posters + videos + writing
  // Automatically changes every 2.5 seconds.
  // =====================================================
  const carousel = document.getElementById("homeCarousel");
  const dots = document.getElementById("homeDots");
  const prev = document.getElementById("homePrev");
  const next = document.getElementById("homeNext");

  if (carousel && dots && prev && next) {
    const slides = [...carousel.querySelectorAll(".home-slide")];

    if (slides.length) {
      let index = 0;
      let timer = null;

      // Create exactly one dot for every slide.
      dots.innerHTML = "";
      slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.setAttribute("aria-label", `Show portfolio slide ${i + 1}`);
        dot.addEventListener("click", () => show(i, true));
        dots.appendChild(dot);
      });

      const dotButtons = [...dots.children];

      function stopActiveVideo() {
        slides.forEach(slide => {
          const video = slide.querySelector("video");
          if (video) {
            video.pause();
            video.currentTime = 0;
          }
        });
      }

      function show(newIndex, manual = false) {
        index = (newIndex + slides.length) % slides.length;

        slides.forEach((slide, i) => {
          slide.classList.toggle("active", i === index);
          slide.setAttribute("aria-hidden", i === index ? "false" : "true");
        });

        dotButtons.forEach((dot, i) => {
          dot.classList.toggle("active", i === index);
        });

        stopActiveVideo();

        const activeVideo = slides[index].querySelector("video");
        if (activeVideo) {
          activeVideo.muted = true;
          activeVideo.play().catch(() => {});
        }

        clearTimeout(timer);
        timer = setTimeout(() => show(index + 1), 2500);

        if (manual) {
          carousel.classList.remove("user-pulse");
          void carousel.offsetWidth;
          carousel.classList.add("user-pulse");
        }
      }

      prev.addEventListener("click", () => show(index - 1, true));
      next.addEventListener("click", () => show(index + 1, true));

      // Pause automatic rotation while the pointer is over the showcase,
      // then resume with a fresh 2.5-second interval.
      carousel.addEventListener("mouseenter", () => clearTimeout(timer));
      carousel.addEventListener("mouseleave", () => {
        clearTimeout(timer);
        timer = setTimeout(() => show(index + 1), 2500);
      });

      // Keyboard accessibility when the showcase is focused.
      carousel.setAttribute("tabindex", "0");
      carousel.addEventListener("keydown", e => {
        if (e.key === "ArrowLeft") show(index - 1, true);
        if (e.key === "ArrowRight") show(index + 1, true);
      });

      // Touch/swipe support
      let touchStartX = 0;
      carousel.addEventListener("touchstart", e => {
        touchStartX = e.changedTouches[0].screenX;
      }, {passive:true});

      carousel.addEventListener("touchend", e => {
        const distance = e.changedTouches[0].screenX - touchStartX;
        if (Math.abs(distance) > 45) {
          show(index + (distance < 0 ? 1 : -1), true);
        }
      }, {passive:true});

      show(0);
    }
  }

  // Close overlays with Escape.
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      lb?.classList.remove("show");
      document.querySelectorAll(".reader").forEach(r => r.classList.remove("show"));
    }

    if (e.key === "ArrowLeft" && lb?.classList.contains("show")) changeImage(-1);
    if (e.key === "ArrowRight" && lb?.classList.contains("show")) changeImage(1);
  });
});
