document.addEventListener('DOMContentLoaded', () => {
  /* =========================================
     1. Initialize AOS (Animate On Scroll)
     ========================================= */
  AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    mirror: true,
    offset: 50
  });

  /* =========================================
     2. Typed.js Initialization
     ========================================= */
  // Select the destination element
  const typedElement = document.querySelector('.typed-text');
  if (typedElement) {
    // Strings provided by the user
    const strings = [
      'Web Developer',
      'Cyber Security Student',
      'Machine Learning Enthusiast',
      'AI Tool Creator'
    ];

    let index = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay;

    function typeEffect() {
      const currentString = strings[index];

      if (isDeleting) {
        // Remove char
        typedElement.textContent = currentString.substring(0, charIndex - 1);
        charIndex--;
        delay = 50; // Faster deleting
      } else {
        // Add char
        typedElement.textContent = currentString.substring(0, charIndex + 1);
        charIndex++;
        delay = 100; // Typing speed
      }

      // Word completed
      if (!isDeleting && charIndex === currentString.length) {
        delay = 2000; // Pause at end of word
        isDeleting = true;
      }
      // Word deleted
      else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        index = (index + 1) % strings.length;
        delay = 500; // Pause before new word
      }

      setTimeout(typeEffect, delay);
    }

    // Add a slight delay before starting
    setTimeout(typeEffect, 1000);
  }

  /* =========================================
     3. Matrix Rain Background Effect
     ========================================= */
  const canvas = document.getElementById('matrix');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    // Initial setup
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Katakana characters, numbers, and some latin
    const chars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレゲゼデベペオォコソトノホモヨョロゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charArray = chars.split('');

    // Font size and columns
    const fontSize = 16;
    let columns = width / fontSize;

    // Array to hold the drops Y positions
    let drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = 1;
    }

    function drawMatrix() {
      // Translucent black to create trailing effect
      ctx.fillStyle = 'rgba(5, 5, 16, 0.05)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = '#00ff41'; // Matrix neon green
      ctx.font = fontSize + 'px "Share Tech Mono"';

      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = charArray[Math.floor(Math.random() * charArray.length)];

        // Draw character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Send drop back to top randomly to prevent unified reset
        if (drops[i] * fontSize > height && Math.random() > 0.975) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
      }
    }

    // Run the matrix effect
    setInterval(drawMatrix, 33);

    // Handle window resize
    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = width / fontSize;
      drops = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = 1;
      }
    });
  }

  /* =========================================
     4. Navbar Scroll Effect
     ========================================= */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(5, 5, 16, 0.95)';
      navbar.style.padding = '0.5rem 0';
      navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
    } else {
      navbar.style.background = 'rgba(5, 5, 16, 0.8)';
      navbar.style.padding = '1rem 0';
      navbar.style.boxShadow = 'none';
    }
  });

  /* =========================================
     5. Mobile Menu Toggle
     ========================================= */
  const mobileMenuBtn = document.getElementById('mobile-menu');
  const navLinks = document.querySelector('.nav-links');

  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    const links = navLinks.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove('active');
        }
      });
    });
  }

  /* =========================================
     6. Circular Progress Bar Animation (Intersection Observer)
     ========================================= */
  const progressCircles = document.querySelectorAll('.progress-circle');

  // Run animation when visible
  const circleObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const circleElement = entry.target;
        const percentage = parseInt(circleElement.getAttribute('data-percentage'));
        const progressCircle = circleElement.querySelector('.progress');
        const percentageText = circleElement.querySelector('.percentage');

        // SVG circle math: Circumference = 2 * PI * r
        // r is 45 in our SVG, roughly 283 circumference
        const radius = progressCircle.r.baseVal.value;
        const circumference = 2 * Math.PI * radius;

        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;

        // Calculate dashoffset
        const offset = circumference - (percentage / 100) * circumference;

        // Animate circle stroke
        progressCircle.style.strokeDashoffset = offset;

        // Animate count-up number
        let count = 0;
        const duration = 2000; // 2 seconds
        const increment = percentage / (duration / 30); // update roughly every 30ms

        const counterInterval = setInterval(() => {
          count += increment;
          if (count >= percentage) {
            count = percentage;
            clearInterval(counterInterval);
          }
          percentageText.innerText = Math.round(count) + '%';
        }, 30);

        // Add glowing effect once complete
        setTimeout(() => {
          progressCircle.style.filter = 'drop-shadow(0 0 8px var(--primary))';
        }, duration);

        // Stop observing after animating once
        observer.unobserve(circleElement);
      }
    });
  }, { threshold: 0.5 }); // Trigger when 50% visible

  progressCircles.forEach(circle => {
    // Initialize strokes to hidden
    const progressSvg = circle.querySelector('.progress');
    const radius = progressSvg.r.baseVal.value;
    const circumference = 2 * Math.PI * radius;
    progressSvg.style.strokeDasharray = `${circumference} ${circumference}`;
    progressSvg.style.strokeDashoffset = circumference;

    circleObserver.observe(circle);
  });

});
