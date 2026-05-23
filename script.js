const meter = document.querySelector(".scroll-meter");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count);
      const duration = 900;
      const start = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.55 }
);

counters.forEach((counter) => countObserver.observe(counter));

const updateMeter = () => {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const progress = height > 0 ? window.scrollY / height : 0;
  meter.style.width = `${progress * 100}%`;
};

window.addEventListener("scroll", updateMeter, { passive: true });
window.addEventListener("resize", updateMeter);
updateMeter();
