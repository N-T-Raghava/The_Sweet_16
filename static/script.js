// Log message indicating the live video stream is running.
console.log("Live video stream running...");

// Add 'scrolled' class to the navigation bar when scrolling down
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Typewriter effect function
class TxtType {
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.isDeleting = false;
        this.tick();
    }

    tick() {
        let i = this.loopNum % this.toRotate.length;
        let fullTxt = this.toRotate[i];

        this.txt = this.isDeleting ? fullTxt.substring(0, this.txt.length - 1) : fullTxt.substring(0, this.txt.length + 1);
        this.el.innerHTML = `<span class="wrap">${this.txt}</span>`;

        let delta = 200 - Math.random() * 100;
        if (this.isDeleting) delta /= 2;

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(() => this.tick(), delta);
    }
}

// Initialize typewriter effect on elements with class 'typewrite'
window.onload = function() {
    let elements = document.getElementsByClassName('typewrite');
    for (let el of elements) {
        let toRotate = el.getAttribute('data-type');
        let period = el.getAttribute('data-period');
        if (toRotate) new TxtType(el, JSON.parse(toRotate), period);
    }
    
    // Inject CSS for typewriter effect
    let css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = ".typewrite > .wrap { border-right: 0.08em solid #fff}";
    document.body.appendChild(css);
};

// FAQ toggle functionality
document.querySelectorAll('.toggle-btn').forEach(button => {
    button.addEventListener('click', () => {
        const question = button.parentElement.parentElement;
        const answer = question.querySelector('.answer');

        if (answer.style.display === 'block') {
            answer.style.display = 'none';
            button.textContent = '+';
        } else {
            // Close other open answers
            document.querySelectorAll('.answer').forEach(item => item.style.display = 'none');
            document.querySelectorAll('.toggle-btn').forEach(btn => btn.textContent = '+');

            answer.style.display = 'block';
            button.textContent = '−';
        }
    });
});

// Hamburger menu toggle for mobile navigation
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", function () {
        navLinks.classList.toggle("active");
    });

    // Close menu when clicking outside
    document.addEventListener("click", function (event) {
        if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
            navLinks.classList.remove("active");
        }
    });
});