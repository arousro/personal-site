/* ============================================
   彭波个人网站 — main.js
   交互：打字机效果 / 滚动显现 / 导航高亮 / 回到顶部按钮
   ============================================ */

/* ---------- 1. 打字机效果 ---------- */
(function typingEffect() {
  const roles = [
    "Python 后端开发工程师",
    "AI 应用集成爱好者",
    "多智能体系统实践者",
    "AI 产品工程师（实习中）"
  ];
  const el = document.getElementById("typed");
  if (!el) return;

  let roleIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tick() {
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 1800); // 停留
        return;
      }
      setTimeout(tick, 90);
    } else {
      charIdx--;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 45);
    }
  }
  tick();
})();

/* ---------- 2. 滚动显现动画 ---------- */
(function revealOnScroll() {
  const items = document.querySelectorAll("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("revealed"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
})();

/* ---------- 3. 导航栏滚动高亮 ---------- */
(function navHighlight() {
  const links = document.querySelectorAll(".nav-link");
  const sections = [...links].map((link) =>
    document.querySelector(link.getAttribute("href"))
  );

  function update() {
    const pos = window.scrollY + 120;
    let currentId = "";
    sections.forEach((sec) => {
      if (sec && sec.offsetTop <= pos) currentId = "#" + sec.id;
    });
    links.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === currentId);
    });
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
})();

/* ---------- 4. 页脚年份 ---------- */
(function footerYear() {
  document.querySelectorAll(".footer-year").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
})();
