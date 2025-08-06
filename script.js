document.addEventListener('DOMContentLoaded', () => {
  // ===== 星空背景の設定 =====
  const canvas = document.getElementById('bgCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let starColor = 'white';
  let bgColor = 'black';

  const stars = Array.from({ length: 100 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2,
    d: Math.random() * 0.5
  }));

  let shootingStars = [];

  function draw() {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = starColor;
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    });

    shootingStars.forEach(s => {
      ctx.beginPath();
      const grad = ctx.createLinearGradient(s.x, s.y, s.x - s.len, s.y + s.len);
      grad.addColorStop(0, 'white');
      grad.addColorStop(1, 'transparent');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2;
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - s.len, s.y + s.len);
      ctx.stroke();
    });
  }

  function update() {
    stars.forEach(s => {
      s.y += s.d;
      if (s.y > canvas.height) s.y = 0;
    });

    shootingStars.forEach(s => {
      s.x -= s.speed;
      s.y += s.speed;
      if (s.x < -s.len || s.y > canvas.height + s.len) s.dead = true;
    });
    shootingStars = shootingStars.filter(s => !s.dead);

    if (Math.random() < 0.005) {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height / 2,
        len: 150,
        speed: 10,
        dead: false
      });
    }
  }

  function animate() {
    draw();
    update();
    requestAnimationFrame(animate);
  }
  animate();

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // ===== ダークモードを初期状態に設定 =====
  document.body.setAttribute('data-theme', 'dark');
  const toggleBtn = document.getElementById('theme-toggle');
  const navbar = document.querySelector('.navbar');
  toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.body.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      document.body.setAttribute('data-theme', 'light');
      navbar.setAttribute('data-theme', 'light');
      starColor = '#333';
      bgColor = '#ddd';
      toggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    } else {
      document.body.setAttribute('data-theme', 'dark');
      navbar.setAttribute('data-theme', 'dark');
      starColor = 'white';
      bgColor = 'black';
      toggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    }
  });

  // ===== SPA風セクション切り替え =====
  const links = document.querySelectorAll('.navbar a');
  const sections = document.querySelectorAll('.section');
  links.forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const target = link.getAttribute('data-section');

      // セクション切り替え
      sections.forEach(sec => sec.classList.remove('active'));
      const targetSection = document.getElementById(target);
      targetSection.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // projectsを開くたびにカードをリセットして再フェードイン
      if (target === 'projects') {
        document.querySelectorAll('.card').forEach(card => {
          card.classList.remove('show');
          setTimeout(() => {
            observer.observe(card);
          }, 100);
        });
      }
    });
  });


  // ===== スクロールアニメーション =====
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
      }
    });
  }, { threshold: 0.2 });
});
// Projectsデータ（サムネイル画像とGitHubリンクを追加）
const projects = [
  {
    title: "Todo App",
    desc: "簡易タスク管理アプリ",
    icon: "fa-list-check",
    img: "todo.png",
    github: "https://github.com/username/todo-app"
  },
  {
    title: "Weather App",
    desc: "APIを使って天気情報を表示",
    icon: "fa-cloud-sun",
    img: "weather.png",
    github: "https://github.com/username/weather-app"
  },
  {
    title: "Portfolio Site",
    desc: "自分の作品をまとめたサイト",
    icon: "fa-laptop-code",
    img: "portfolio.png",
    github: "https://github.com/username/portfolio-site"
  }
];

const container = document.querySelector('.projects');
container.innerHTML = ''; // 初期化

projects.forEach(p => {
  const card = document.createElement('div');
  card.className = 'card';
  card.innerHTML = `
    <img src="${p.img}" alt="${p.title} サムネイル" class="project-img" />
    <h3><i class="fas ${p.icon}"></i> ${p.title}</h3>
    <p>${p.desc}</p>
    <a href="${p.github}" class="github-link" target="_blank" rel="noopener noreferrer">
      <i class="fab fa-github"></i> GitHubを見る
    </a>
  `;
  container.appendChild(card);
});
