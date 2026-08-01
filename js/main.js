/* ============================================
   彭波个人网站 — main.js (v2)
   交互：打字机 / 滚动显现 / 导航高亮 / 可交互终端 /
   代码雨背景 / 3D 倾斜卡片 / 滚动进度条 / 快捷键 / 回到顶部
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

  let roleIdx = 0, charIdx = 0, deleting = false;

  function tick() {
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      el.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 1800);
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

/* ---------- 5. 代码雨背景 ---------- */
(function matrixRain() {
  const canvas = document.getElementById("matrix");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const chars = "01アイウエオカキクケコサシスセソタチツテト01<>*$#".split("");
  const fontSize = 16;
  let w, h, cols, drops;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
    cols = Math.floor(w / fontSize);
    drops = Array.from({ length: cols }, () => Math.random() * -60);
  }
  resize();
  window.addEventListener("resize", resize);

  setInterval(() => {
    ctx.fillStyle = "rgba(5, 6, 15, 0.08)";
    ctx.fillRect(0, 0, w, h);
    ctx.font = fontSize + "px monospace";
    for (let i = 0; i < cols; i++) {
      const ch = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillStyle = Math.random() > 0.975 ? "#00f0ff" : "rgba(0, 240, 255, 0.55)";
      ctx.fillText(ch, i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > h && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }, 50);
})();

/* ---------- 6. 滚动进度条 ---------- */
(function scrollProgress() {
  const bar = document.getElementById("progress-bar");
  if (!bar) return;
  window.addEventListener(
    "scroll",
    () => {
      const doc = document.documentElement;
      const p = doc.scrollTop / (doc.scrollHeight - doc.clientHeight);
      bar.style.width = (p * 100).toFixed(2) + "%";
    },
    { passive: true }
  );
})();

/* ---------- 7. 可交互终端 ---------- */
(function terminal() {
  const output = document.getElementById("term-output");
  const input = document.getElementById("term-input");
  const body = document.getElementById("term-body");
  if (!output || !input || !body) return;

  const CMDS = {
    help: [
      "可用命令：",
      "  about    —— 关于我",
      "  skills   —— 技术能力",
      "  projects —— 项目经历",
      "  contact  —— 联系方式",
      "  clear    —— 清屏",
      "试试：skills 或 projects"
    ],
    about: [
      "彭波 · 浙江工业大学之江学院 软件工程 2026 届",
      "Python 后端开发 + AI 应用集成，正在寻找 AI 产品工程师实习机会。",
      "输入 skills 查看技术栈"
    ],
    skills: ["Python / FastAPI / SQL / Redis / Docker", "DeepSeek API / MCP / HelloAgents / 多智能体", "Git / Linux / Vercel / CI/CD / AI 编程工具"],
    projects: [
      "1. CVE 漏洞智能查询系统 (DeepSeek API + PyQt5 + 爬虫)",
      "   🏆 服务外包大赛三等奖 · 自然语言查漏洞 · NVD 日更 2 万+ 条",
      "2. 智能旅行助手 (FastAPI + HelloAgents + MCP + Vue3)",
      "   https://github.com/arousro/trip-planner",
      "3. 博客系统 (Flask + SQLAlchemy)",
      "   https://github.com/arousro/blog-system"
    ],
    contact: ["GitHub: https://github.com/arousro", "Email: 2868548883@qq.com"],
    whoami: ["彭波 · Software Engineer · AI Integration"]
  };

  function print(text, cls) {
    const line = document.createElement("p");
    line.className = cls || "t-out";
    line.textContent = text;
    output.appendChild(line);
    body.scrollTop = body.scrollHeight;
  }

  function run(raw) {
    const cmd = raw.trim().toLowerCase();
    print("$ " + raw, "t-in");
    if (!cmd) return;
    if (cmd === "clear") {
      output.innerHTML = "";
      return;
    }
    const result = CMDS[cmd];
    if (result) result.forEach((t) => print(t, "t-out ok"));
    else print("command not found: " + cmd + "（输入 help 查看可用命令）", "t-out err");
  }

  print("PB-OS v2.0 — 交互终端", "t-banner");
  print("输入 help 查看可用命令", "t-out");

  body.addEventListener("click", () => input.focus());
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      run(input.value);
      input.value = "";
    }
  });
})();

/* ---------- 8. 3D 倾斜卡片 ---------- */
(function tiltCards() {
  const cards = document.querySelectorAll("[data-tilt]");
  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform =
        "perspective(800px) rotateY(" + (x * 8).toFixed(2) + "deg) rotateX(" +
        (-y * 8).toFixed(2) + "deg)";
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
})();

/* ---------- 9. 键盘快捷键 1-5 跳转 ---------- */
(function hotkeys() {
  const map = {
    "1": "#about", "2": "#skills", "3": "#projects",
    "4": "#education", "5": "#contact"
  };
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    const target = map[e.key];
    if (target) document.querySelector(target).scrollIntoView({ behavior: "smooth" });
  });
})();

/* ---------- 10. 回到顶部 ---------- */
(function backToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;
  window.addEventListener(
    "scroll",
    () => btn.classList.toggle("show", window.scrollY > 400),
    { passive: true }
  );
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
})();
