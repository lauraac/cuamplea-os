document.addEventListener("DOMContentLoaded", () => {
  const desktopWarning = document.getElementById("desktop-warning");

  if (window.innerWidth >= 768) {
    desktopWarning.style.display = "flex";
  }

  // Smooth scroll
  const scrollButtons = document.querySelectorAll("[data-scroll]");
  scrollButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const targetSelector = btn.getAttribute("data-scroll");
      const target = document.querySelector(targetSelector);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Navegación inferior
  const navDots = document.querySelectorAll(".nav-dot");
  const sections = [
    document.querySelector("#inicio"),
    document.querySelector("#detalle"),
    document.querySelector("#como-llegar"),
    document.querySelector("#rsvp"),
  ].filter(Boolean);

  navDots.forEach((dot, index) => {
    dot.addEventListener("click", (e) => {
      if (!sections[index]) return;
      e.preventDefault();
      sections[index].scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  // Observer para secciones
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.id;

        if (
          entry.target.classList.contains("section") ||
          entry.target.classList.contains("footer-firma")
        ) {
          entry.target.classList.add("visible");
        }

        const index = sections.findIndex((sec) => sec.id === id);
        if (index !== -1) {
          navDots.forEach((d) => d.classList.remove("active"));
          if (navDots[index]) {
            navDots[index].classList.add("active");
          }
        }
      });
    },
    {
      threshold: 0.4,
    }
  );

  sections.forEach((sec) => observer.observe(sec));
  const footerFirma = document.querySelector(".footer-firma");
  if (footerFirma) observer.observe(footerFirma);

  // ===== Música =====
  const musicToggle = document.getElementById("music-toggle");
  const bgMusic = document.getElementById("bg-music");
  let playMusic = null; // la definimos aquí para usarla después

  if (musicToggle && bgMusic) {
    let isPlaying = false;
    const musicIcon = musicToggle.querySelector("img");

    const NOTE_SRC = "./img/musica.png";
    const PAUSE_SRC = "./img/pausa.png";

    const setNoteIcon = () => {
      if (!musicIcon) return;
      musicIcon.src = NOTE_SRC;
      musicIcon.alt = "Reproducir música";
    };

    const setPauseIcon = () => {
      if (!musicIcon) return;
      musicIcon.src = PAUSE_SRC;
      musicIcon.alt = "Pausar música";
    };

    playMusic = () => {
      bgMusic
        .play()
        .then(() => {
          isPlaying = true;
          musicToggle.classList.add("playing");
          setPauseIcon();
        })
        .catch(() => {
          // Si el navegador bloquea el autoplay, no pasa nada.
        });
    };

    const pauseMusic = () => {
      bgMusic.pause();
      isPlaying = false;
      musicToggle.classList.remove("playing");
      setNoteIcon();
    };

    musicToggle.addEventListener("click", () => {
      if (!isPlaying) playMusic && playMusic();
      else pauseMusic();
    });
  }

  // ===== Dragón volando con pop =====
  const flyingDragon = document.querySelector(".flying-dragon");
  if (flyingDragon) {
    flyingDragon.style.animationPlayState = "paused";

    setTimeout(() => {
      flyingDragon.style.animationPlayState = "running";
    }, 1500);

    const handleExplosion = () => {
      if (flyingDragon.classList.contains("dragon-pop")) return;

      flyingDragon.classList.add("dragon-pop");

      flyingDragon.addEventListener(
        "animationend",
        () => {
          flyingDragon.classList.remove("dragon-pop");
          flyingDragon.style.animation = "none";
          void flyingDragon.offsetWidth;
          flyingDragon.style.animation = "";
        },
        { once: true }
      );
    };

    flyingDragon.addEventListener("click", handleExplosion);
    flyingDragon.addEventListener("touchstart", handleExplosion);
  }

  // ===== Intro con GIF =====
  const introOverlay = document.getElementById("intro-overlay");
  const phoneFrame = document.querySelector(".phone-frame");
  const bottomNav = document.querySelector(".bottom-nav");
  const fireParticles = document.getElementById("fire-particles");

  const elementosOcultos = [
    phoneFrame,
    musicToggle,
    bottomNav,
    flyingDragon,
    fireParticles,
  ];

  const mostrarInvitacion = () => {
    if (!introOverlay) return;

    introOverlay.style.display = "none";

    elementosOcultos.forEach((el) => {
      if (el) el.classList.remove("hidden-intro");
    });

    // Intentar arrancar la música cuando termina la intro
    if (playMusic) {
      playMusic();
    }
  };

  if (introOverlay) {
    // ⏱ Ajusta este tiempo a la duración de tu GIF (ms)
    const DURACION_GIF_MS = 4500;

    // Que se quite solo después del tiempo
    setTimeout(mostrarInvitacion, DURACION_GIF_MS);

    // Y si el usuario toca la pantalla, se salta la intro
    introOverlay.addEventListener("click", mostrarInvitacion);
    introOverlay.addEventListener("touchstart", mostrarInvitacion);
  } else {
    // Si no hay overlay por alguna razón, arrancamos normal
    elementosOcultos.forEach((el) => {
      if (el) el.classList.remove("hidden-intro");
    });
    if (playMusic) {
      playMusic();
    }
  }
});

// ==== Lluvia de fuego con imagen real ====
const containerFire = document.getElementById("fire-particles");

function createFireImage() {
  if (!containerFire) return;
  const spark = document.createElement("img");
  spark.src = "./img/fuego.png";
  spark.classList.add("fire-img");

  const startX = Math.random() * window.innerWidth;
  const duration = 6.5 + Math.random() * 3;
  const drift = (Math.random() - 0.5) * 60;

  spark.style.left = `${startX}px`;
  spark.style.animationDuration = `${duration}s`;
  spark.style.setProperty("--drift", `${drift}px`);

  containerFire.appendChild(spark);

  setTimeout(() => spark.remove(), duration * 1000);
}

setInterval(createFireImage, 300);

// ==== Cuenta regresiva ====
const daysEl = document.getElementById("cd-days");
const hoursEl = document.getElementById("cd-hours");
const minsEl = document.getElementById("cd-mins");
const secsEl = document.getElementById("cd-secs");
const messageEl = document.getElementById("countdown-message");
const countdownCard = document.querySelector(".countdown-card");

if (daysEl && hoursEl && minsEl && secsEl && messageEl && countdownCard) {
  const targetDate = new Date("2025-11-27T23:59:59");
  const expireDate = new Date("2025-11-28T00:00:00");

  function updateCountdown() {
    const now = new Date();

    if (now >= expireDate) {
      countdownCard.innerHTML = `
        <p class="card-text expired-float" style="text-align:center;">
          La fiesta ha terminado.<br>
          ¡Gracias por volar con nosotros! 🐉💜
        </p>
      `;
      return;
    }

    const diff = targetDate - now;

    if (diff <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minsEl.textContent = "00";
      secsEl.textContent = "00";

      messageEl.textContent = "¡Hoy es la fiesta! 🎉🐉✨";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const mins = Math.floor((totalSeconds % (60 * 60)) / 60);
    const secs = totalSeconds % 60;

    daysEl.textContent = String(days).padStart(2, "0");
    hoursEl.textContent = String(hours).padStart(2, "0");
    minsEl.textContent = String(mins).padStart(2, "0");
    secsEl.textContent = String(secs).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}
