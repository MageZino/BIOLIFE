// =======================
// THEME MANAGER
// =======================
class ThemeManager {
    constructor() {
        this.toggleButton = document.getElementById("themeToggle");
        this.themeIcon = this.toggleButton?.querySelector(".theme-icon");

        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        this.currentTheme = localStorage.getItem("theme") || (prefersDark ? "dark" : "light");

        this.applyTheme(this.currentTheme);

        this.toggleButton?.addEventListener("click", () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === "light" ? "dark" : "light";
        localStorage.setItem("theme", this.currentTheme);
        this.applyTheme(this.currentTheme);
    }

    applyTheme(theme) {
        document.documentElement.setAttribute("data-theme", theme);
        if (this.themeIcon) {
            this.themeIcon.textContent = theme === "light" ? "🌙" : "☀️";
        }
    }
}

// =======================
// CAROUSEL
// =======================
class CarouselManager {
    constructor() {
        this.track = document.querySelector('.carousel-track');
        if (!this.track) return;

        this.slides = Array.from(this.track.children);
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.indicators = document.querySelectorAll('.indicator');
        this.currentIndex = 0;

        this.updateCarousel();

        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        this.prevBtn?.addEventListener('click', () => this.prevSlide());

        this.indicators.forEach((dot, index) =>
            dot.addEventListener('click', () => this.goToSlide(index))
        );

        setInterval(() => this.nextSlide(), 6000);
    }

    updateCarousel() {
        this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;

        this.indicators.forEach((dot, index) =>
            dot.classList.toggle('active', index === this.currentIndex)
        );
    }

    nextSlide() {
        this.currentIndex = (this.currentIndex + 1) % this.slides.length;
        this.updateCarousel();
    }

    prevSlide() {
        this.currentIndex =
            (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.updateCarousel();
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
    }
}

// =======================
// NAVIGATION (SCROLL)
// =======================
class NavigationManager {
    constructor() {
        this.hamburger = document.getElementById('hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');

        this.init();
    }

    init() {
        this.hamburger?.addEventListener('click', () => this.toggleMenu());

        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                this.handleNavClick(e);
                this.closeMenu();
            });
        });
    }

    toggleMenu() {
        this.hamburger?.classList.toggle('active');
        this.navMenu?.classList.toggle('active');
    }

    closeMenu() {
        this.hamburger?.classList.remove('active');
        this.navMenu?.classList.remove('active');
    }

    handleNavClick(e) {
        const link = e.target.closest("a");
        if (!link) return;

        const href = link.getAttribute("href");

        if (!href || !href.startsWith("#")) return;

        e.preventDefault();

        const target = document.querySelector(href);
        if (!target) return;

        const headerHeight = document.querySelector('.header')?.offsetHeight || 0;

        const targetPosition =
            target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: "smooth"
        });
    }
}

// =======================
// MATRIX EFFECT
// =======================
const canvas = document.getElementById("matrix");

if (canvas) {
    const ctx = canvas.getContext("2d");

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    const letters = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function drawMatrix() {
        ctx.fillStyle = "rgba(0,0,0,0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "#023f23";
        ctx.font = fontSize + "px monospace";

        for (let i = 0; i < drops.length; i++) {
            const text = letters[Math.floor(Math.random() * letters.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }

            drops[i]++;
        }
    }

    setInterval(drawMatrix, 35);
}

// =======================
// LOADER
// =======================
const loader = document.getElementById("loader");
const progress = document.querySelector(".loader-progress");
const percentText = document.getElementById("loader-percent");
const sound = document.getElementById("loader-sound");
const slide = document.querySelector(".page-slide");

let percent = 0;
let interval;

function startLoader() {
    percent = 0;

    if (loader) {
        loader.classList.remove("hidden");
        loader.style.pointerEvents = "auto";
    }

    progress && (progress.style.width = "0%");
    percentText && (percentText.textContent = "0%");

    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    interval = setInterval(() => {
        percent += Math.floor(Math.random() * 5) + 2;
        if (percent >= 100) percent = 100;

        progress && (progress.style.width = percent + "%");
        percentText && (percentText.textContent = percent + "%");

        if (percent === 100) {
            clearInterval(interval);

            setTimeout(() => {
                if (loader) {
                    loader.classList.add("hidden");
                    loader.style.pointerEvents = "none";
                }

                if (slide) {
                    slide.classList.remove("active");
                    slide.style.pointerEvents = "none";
                }
            }, 600);
        }
    }, 90);
}

window.addEventListener("load", startLoader);

// =======================
// TRANSIÇÃO ENTRE PÁGINAS
// =======================
function navigateWithSlide(href) {
    if (slide) {
        slide.classList.add("active");
        slide.style.pointerEvents = "auto";
    }

    if (loader) {
        loader.classList.remove("hidden");
        loader.style.pointerEvents = "auto";
    }

    startLoader();

    setTimeout(() => {
        window.location.href = href;
    }, 700);
}

// =======================
// EVENTO GLOBAL
// =======================
document.addEventListener("click", function(e) {
    const link = e.target.closest("a");
    if (!link) return;

    const href = link.getAttribute("href");
    if (!href) return;

    if (href.startsWith("#")) return;

    if (
        !href.startsWith("javascript:") &&
        !link.classList.contains("disabled") &&
        !link.hasAttribute("target")
    ) {
        e.preventDefault();
        navigateWithSlide(href);
    }
});

// =======================
// INIT
// =======================
document.addEventListener("DOMContentLoaded", () => {
    new ThemeManager();
    new CarouselManager();
    new NavigationManager();
});

// =======================
// GARANTIA FINAL (ANTI BUG)
// =======================
window.addEventListener("load", () => {
    document.body.style.pointerEvents = "auto";

    if (loader) loader.style.pointerEvents = "none";
    if (slide) slide.style.pointerEvents = "none";
});