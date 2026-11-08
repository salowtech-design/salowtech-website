// Salowtech Unified Subpage Smooth Animations Engine
// Reuses homepage cubic-bezier curves for fluid 120fps reveals, card hovers, reading progress, and interactive counters.

export function initPageAnimations(): void {
  if (typeof window === "undefined") return;

  // Respect user preference for reduced motion
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    document.querySelectorAll(".subpage-reveal, .animate-on-scroll").forEach((el) => {
      el.classList.add("is-in");
    });
    return;
  }

  const isMobile = window.innerWidth < 768;

  // 1. Scroll Reveal for Subpages (Headings, Cards, Grids)
  const revealSelectors = [
    "main:not(#spa-container) h1",
    "main:not(#spa-container) h2",
    ".animate-on-scroll",
    ".service-card",
    ".soft-card",
    ".blog-card-item",
    "[data-purpose='feature-grid'] > div",
    "[data-purpose='solutions-grid'] > div",
    "[data-purpose='dual-cta-group']"
  ];

  const elements = document.querySelectorAll<HTMLElement>(revealSelectors.join(", "));
  if (elements.length > 0) {
    elements.forEach((el) => {
      if (!el.classList.contains("subpage-reveal")) {
        el.classList.add("subpage-reveal");
      }
      if (el.parentElement && el.parentElement.children.length > 1) {
        const idx = Array.from(el.parentElement.children).indexOf(el);
        const delay = (idx % 4) * (isMobile ? 40 : 80);
        el.style.transitionDelay = `${delay}ms`;
      }
    });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              observer.unobserve(entry.target); // Reveal exactly once
            }
          });
        },
        {
          rootMargin: "0px 0px -30px 0px",
          threshold: 0.08
        }
      );

      elements.forEach((el) => observer.observe(el));
    } else {
      // Fallback: Show content immediately if IO is unavailable
      elements.forEach((el) => el.classList.add("is-in"));
    }
  }

  // 2. Smooth Numerical Counter Animation (e.g. About Us 40+, 2021)
  const metricCards = document.querySelectorAll<HTMLElement>(".soft-card p.text-4xl, .soft-card p.text-5xl");
  metricCards.forEach((numEl) => {
    const rawText = numEl.textContent?.trim() || "";
    const match = rawText.match(/^(\d+)(\+?)$/);
    if (!match) return;

    const targetVal = parseInt(match[1], 10);
    const suffix = match[2] || "";
    if (isNaN(targetVal) || targetVal > 5000) return;

    let hasRun = false;
    const startCount = () => {
      if (hasRun) return;
      hasRun = true;
      const startTime = performance.now();
      const duration = 1200; // 1.2s smooth count-up

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic curve matching the design system
        const ease = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(ease * targetVal);
        numEl.textContent = `${current}${suffix}`;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          numEl.textContent = `${targetVal}${suffix}`;
        }
      };
      requestAnimationFrame(step);
    };

    if ("IntersectionObserver" in window) {
      const numObs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startCount();
            numObs.disconnect();
          }
        },
        { threshold: 0.5 }
      );
      numObs.observe(numEl);
    }
  });

  // 3. Blog Post Reading Progress Bar
  const blogArticle = document.querySelector<HTMLElement>("main article, main .max-w-4xl");
  const isBlogPost = window.location.pathname.startsWith("/blog/") && blogArticle;
  if (isBlogPost) {
    let progressBar = document.getElementById("reading-progress");
    if (!progressBar) {
      progressBar = document.createElement("div");
      progressBar.id = "reading-progress";
      progressBar.className =
        "fixed top-0 left-0 h-[3px] bg-[#7D3024] z-[999] transition-[width] duration-75 ease-out pointer-events-none";
      progressBar.style.width = "0%";
      document.body.appendChild(progressBar);
    }

    let progressTicking = false;
    const updateReadingProgress = () => {
      if (!blogArticle || !progressBar) return;
      const rect = blogArticle.getBoundingClientRect();
      const totalDist = blogArticle.offsetHeight - window.innerHeight;
      if (totalDist <= 0) {
        progressBar.style.width = "100%";
        progressTicking = false;
        return;
      }
      const scrolled = Math.max(0, -rect.top);
      const pct = Math.min(100, Math.max(0, (scrolled / totalDist) * 100));
      progressBar.style.width = `${pct.toFixed(1)}%`;
      progressTicking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!progressTicking) {
          requestAnimationFrame(updateReadingProgress);
          progressTicking = true;
        }
      },
      { passive: true }
    );
  }

  // 4. Blog Card Category Filter Fade
  const catPills = document.querySelectorAll<HTMLButtonElement>(".blog-cat-pill, .blog-filter-menu-item");
  const blogGrid = document.getElementById("blog-grid");
  if (blogGrid && catPills.length > 0) {
    catPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        blogGrid.style.transition = "opacity 0.2s cubic-bezier(0.22, 1, 0.36, 1)";
        blogGrid.style.opacity = "0.4";
        setTimeout(() => {
          blogGrid.style.opacity = "1";
        }, 220);
      });
    });
  }
}

// Auto-initialize on load
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPageAnimations);
  } else {
    initPageAnimations();
  }
}
