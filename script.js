/* ===========================================
   PRELOADER
=========================================== */

window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");

    if (preloader) {
        preloader.style.opacity = "0";

        setTimeout(() => {
            preloader.style.display = "none";
        }, 500);
    }
});

/* ===========================================
   MOBILE MENU
=========================================== */

const menuBtn = document.getElementById("menu-btn");
const nav = document.getElementById("nav");

if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
        nav.classList.toggle("show");
    });

    document.querySelectorAll("#nav a").forEach(link => {
        link.addEventListener("click", () => {
            nav.classList.remove("show");
        });
    });
}

/* ===========================================
   DARK MODE
=========================================== */

const themeToggle = document.getElementById("theme-toggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark");

    if (themeToggle) {
        themeToggle.innerHTML =
            '<i class="fa-solid fa-sun"></i>';
    }
}

if (themeToggle) {

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem("theme", "dark");

            themeToggle.innerHTML =
                '<i class="fa-solid fa-sun"></i>';

        } else {

            localStorage.setItem("theme", "light");

            themeToggle.innerHTML =
                '<i class="fa-solid fa-moon"></i>';

        }

    });

}

/* ===========================================
   TYPING EFFECT
=========================================== */

const typingElement = document.getElementById("typing");

const words = [
    "Frontend Developer",
    "UI/UX Designer",
    "JavaScript Developer",
    "Python Programmer",
    "Freelancer"
];

let wordIndex = 0;
let letterIndex = 0;
let deleting = false;

function typeEffect() {

    if (!typingElement) return;

    const currentWord = words[wordIndex];

    if (!deleting) {

        typingElement.textContent =
            currentWord.substring(0, letterIndex + 1);

        letterIndex++;

        if (letterIndex === currentWord.length) {

            deleting = true;

            setTimeout(typeEffect, 1800);

            return;

        }

    } else {

        typingElement.textContent =
            currentWord.substring(0, letterIndex - 1);

        letterIndex--;

        if (letterIndex === 0) {

            deleting = false;

            wordIndex++;

            if (wordIndex >= words.length)
                wordIndex = 0;

        }

    }

    setTimeout(typeEffect, deleting ? 60 : 120);

}

typeEffect();

/* ===========================================
   ACTIVE NAV LINK
=========================================== */

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const top = section.offsetTop - 120;

        if (scrollY >= top) {
            current = section.getAttribute("id");
        }

    });

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {

            link.classList.add("active");

        }

    });

});

/* ===========================================
   HEADER SHADOW
=========================================== */

const header = document.querySelector("header");

window.addEventListener("scroll", () => {

    if (window.scrollY > 30) {

        header.style.boxShadow =
            "0 8px 25px rgba(0,0,0,.08)";

    } else {

        header.style.boxShadow = "none";

    }

});

/* ===========================================
   SCROLL TO TOP
=========================================== */

const scrollBtn = document.getElementById("scrollTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        scrollBtn.classList.add("show");

    } else {

        scrollBtn.classList.remove("show");

    }

});

scrollBtn.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

/* ===========================================
   CONTACT FORM
=========================================== */

const form = document.getElementById("contactForm");

if (form) {

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        alert("Thank you! Your message has been sent.");

        form.reset();

    });

}

/* ===========================================
   SCROLL ANIMATION
=========================================== */

const observer = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("visible");

        }

    });

}, {

    threshold: 0.2

});

document.querySelectorAll(
    ".hero-content,.hero-image,.about-grid,.skill,.project-card,#contact form"
).forEach(el => {

    el.classList.add("hidden");

    observer.observe(el);

});

/* ===========================================
   SKILL BAR ANIMATION
=========================================== */

const skillObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            const bar =
                entry.target.querySelector(".progress div");

            if (bar) {

                const width = bar.style.width;

                bar.style.width = "0";

                setTimeout(() => {

                    bar.style.width = width;

                }, 100);

            }

        }

    });

}, {

    threshold: 0.4

});

document.querySelectorAll(".skill").forEach(skill => {

    skillObserver.observe(skill);

});

/* ===========================================
   CURRENT YEAR
=========================================== */

const year = document.getElementById("year");

if (year) {

    year.textContent = new Date().getFullYear();

}