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
document.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll(".fade-in");
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    });
  
    elements.forEach((el) => observer.observe(el));
  });
  window.addEventListener("scroll", () => {
    document.querySelector("nav").classList.toggle("scrolled", window.scrollY > 50);
  });
  document.querySelectorAll(".toggle-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.nextElementSibling.classList.toggle("active");
    });
  });

  document.addEventListener("DOMContentLoaded", function () {
    const fadeElements = document.querySelectorAll(".fade-in");

    function checkVisibility() {
      fadeElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("visible");
        } else {
          el.classList.remove("visible"); // Remove to re-trigger when scrolling
        }
      });
    }

    window.addEventListener("scroll", checkVisibility);
    checkVisibility(); // Run on load
  });

  // Toggle Menu Function
  function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('active');
    document.querySelector('.hamburger').classList.toggle('active');
  }
  
  // Theme Toggle (will need additional CSS and JS implementation)
  document.getElementById('theme-icon').addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    this.classList.toggle('fa-sun');
    this.classList.toggle('fa-moon');
  });
  
  // Back to top functionality
  const backToTopButton = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });
  
  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  // FAQ Toggle
  const questions = document.querySelectorAll('.question');
  questions.forEach(question => {
    const btn = question.querySelector('.toggle-btn');
    btn.addEventListener('click', () => {
      question.classList.toggle('active');
      
      // Update icon
      const icon = btn.querySelector('i');
      if (question.classList.contains('active')) {
        icon.classList.replace('fa-plus', 'fa-minus');
      } else {
        icon.classList.replace('fa-minus', 'fa-plus');
      }
    });
  });
  
  // Demo functionality (placeholder)
  const demoButtons = document.querySelectorAll('.demo-btn');
  const demoImage = document.getElementById('demo-image');
  const predictionDisplay = document.getElementById('prediction-display');
  
  
  demoButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      showLoader();
      
      // Simulate processing delay
      setTimeout(() => {
        if (samples[index]) {
          demoImage.src = samples[index].image;
          document.querySelector('.age-prediction').textContent = `Age: ${samples[index].age}`;
          document.querySelector('.gender-prediction').textContent = `Gender: ${samples[index].gender}`;
          predictionDisplay.style.opacity = 1;
        }
        hideLoader();
      }, 1500);
    });
  });
  
  // Loading animation functions
  function showLoader() {
    document.querySelector('.loader').classList.add('active');
  }
  
  function hideLoader() {
    document.querySelector('.loader').classList.remove('active');
  }
  
  // Smooth scrolling for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
        
        // Close mobile menu if open
        document.querySelector('.nav-links').classList.remove('active');
        document.querySelector('.hamburger').classList.remove('active');
      }
    });
  });
  
  // Comparison slider functionality
  const slider = document.querySelector('.comparison-slider');
  const sliderHandle = document.querySelector('.slider-handle');
  let isSliding = false;
  
  if (slider && sliderHandle) {
    slider.addEventListener('mousedown', startSliding);
    slider.addEventListener('touchstart', startSliding);
    
    function startSliding(e) {
      isSliding = true;
      slider.classList.add('active');
      updateSliderPosition(e);
    }
    
    window.addEventListener('mouseup', stopSliding);
    window.addEventListener('touchend', stopSliding);
    
    function stopSliding() {
      isSliding = false;
      slider.classList.remove('active');
    }
    
    window.addEventListener('mousemove', handleSliding);
    window.addEventListener('touchmove', handleSliding);
    
    function handleSliding(e) {
      if (!isSliding) return;
      updateSliderPosition(e);
      e.preventDefault();
    }
    
    function updateSliderPosition(e) {
      let position;
      
      if (e.type.includes('mouse')) {
        position = (e.clientX - slider.getBoundingClientRect().left) / slider.offsetWidth * 100;
      } else {
        position = (e.touches[0].clientX - slider.getBoundingClientRect().left) / slider.offsetWidth * 100;
      }
      
      if (position < 0) position = 0;
      if (position > 100) position = 100;
      
      document.querySelector('.after-image').style.width = `${position}%`;
      sliderHandle.style.left = `${position}%`;
    }
  }
  
  // Typewriter effect
  class TypeWriter {
    constructor(txtElement, words, wait = 3000) {
      this.txtElement = txtElement;
      this.words = words;
      this.txt = '';
      this.wordIndex = 0;
      this.wait = parseInt(wait, 10);
      this.type();
      this.isDeleting = false;
    }
    
    type() {
      // Current index of word
      const current = this.wordIndex % this.words.length;
      // Get full text of current word
      const fullTxt = this.words[current];
      
      // Check if deleting
      if (this.isDeleting) {
        // Remove char
        this.txt = fullTxt.substring(0, this.txt.length - 1);
      } else {
        // Add char
        this.txt = fullTxt.substring(0, this.txt.length + 1);
      }
      
      // Insert txt into element
      this.txtElement.innerHTML = `<span class="txt">${this.txt}</span>`;
      
      // Initial Type Speed
      let typeSpeed = 100;
      
      if (this.isDeleting) {
        typeSpeed /= 2;
      }
      
      // If word is complete
      if (!this.isDeleting && this.txt === fullTxt) {
        // Make pause at end
        typeSpeed = this.wait;
        // Set delete to true
        this.isDeleting = true;
      } else if (this.isDeleting && this.txt === '') {
        this.isDeleting = false;
        // Move to next word
        this.wordIndex++;
        // Pause before start typing
        typeSpeed = 500;
      }
      
      setTimeout(() => this.type(), typeSpeed);
    }
  }
  
  // Init on DOM Load
  document.addEventListener('DOMContentLoaded', init);
  
  // Init App
  function init() {
    const txtElement = document.querySelector('.typewrite .wrap');
    const words = JSON.parse(document.querySelector('.typewrite').getAttribute('data-type'));
    const wait = document.querySelector('.typewrite').getAttribute('data-period');
    // Init TypeWriter
    new TypeWriter(txtElement, words, wait);
  }
  document.addEventListener("DOMContentLoaded", function () {
    // Select elements
    const demoImage = document.getElementById("demo-image");
    const agePrediction = document.querySelector(".age-prediction");
    const genderPrediction = document.querySelector(".gender-prediction");

    // Sample data
    const samples = {
        "try-sample-1": {
            image: "static/test_img/image1.jpg",
            age: "Age: 0-5",
            gender: "Gender: Male"
        },
        "try-sample-2": {
            image: "static/test_img/image2.jpg",
            age: "Age: 15-20",
            gender: "Gender: Male"
        },
        "try-sample-3": {
            image: "static/test_img/image3.jpg",
            age: "Age: 20-25",
            gender: "Gender: Female"
        }
    };

    // Add event listeners to buttons
    document.querySelectorAll(".demo-btn").forEach(button => {
        button.addEventListener("click", function () {
            const sample = samples[this.id];
            if (sample) {
                demoImage.src = sample.image;
                agePrediction.textContent = sample.age;
                genderPrediction.textContent = sample.gender;
            }
        });
    });
});


  
  
  
  
// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });
}

// Close mobile menu when clicking a nav link
document.querySelectorAll('.nav-item').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});