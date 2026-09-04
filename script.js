(() => {
  const dateEl = document.getElementById("menubar-date");
  const timeEl = document.getElementById("menubar-time");

  function updateClock() {
    const now = new Date();
    if (dateEl) {
      dateEl.textContent = now.toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    }
    if (timeEl) {
      timeEl.textContent = now.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
    }
  }

  updateClock();
  setInterval(updateClock, 30 * 1000);
})();

(() => {
  const dock = document.querySelector(".dock");
  if (!dock) return;

  const icons = Array.from(dock.querySelectorAll(".dock-icon"));

  icons.forEach((icon) => {
    icon.addEventListener("click", () => {
      const item = icon.closest(".dock-item");

      icons.forEach((i) => i.closest(".dock-item").classList.remove("active"));
      item.classList.add("active");

      icon.classList.remove("bounce");
      void icon.offsetWidth; // restart the animation on repeat clicks
      icon.classList.add("bounce");
    });

    icon.addEventListener("animationend", () => icon.classList.remove("bounce"));
  });
})();
