// Planet Design System - Scripts

// ============================================================================
// THEME TOGGLE
// ============================================================================

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Load saved theme
const savedTheme = localStorage.getItem('planet-theme') || 'light';
htmlElement.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('planet-theme', newTheme);
    
    // Add pulse animation
    themeToggle.style.animation = 'none';
    setTimeout(() => {
        themeToggle.style.animation = '';
    }, 10);
});

// ============================================================================
// SMOOTH SCROLL
// ============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

document.querySelectorAll('[data-animate]').forEach(el => {
    observer.observe(el);
});

// ============================================================================
// ACTIVE NAV ON SCROLL
// ============================================================================

window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// ============================================================================
// COPY TO CLIPBOARD
// ============================================================================

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showTooltip('Скопировано: ' + text);
    }).catch(err => {
        console.error('Failed to copy:', err);
        showTooltip('Ошибка копирования');
    });
}

function showTooltip(text) {
    const tooltip = document.getElementById('tooltip');
    tooltip.textContent = text;
    tooltip.style.left = event.pageX + 'px';
    tooltip.style.top = (event.pageY - 40) + 'px';
    tooltip.classList.add('show');
    
    setTimeout(() => {
        tooltip.classList.remove('show');
    }, 2000);
}

// Make function globally available
window.copyToClipboard = copyToClipboard;

// ============================================================================
// BUTTON RIPPLE EFFECT
// ============================================================================

document.querySelectorAll('.button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// ============================================================================
// CONSOLE GREETING
// ============================================================================

console.log('%c🪐 Planet Design System', 'font-size: 24px; font-weight: bold; color: #6788EC;');
console.log('%cВерсия 1.0.0 | Flutter 3.x', 'font-size: 14px; color: #616F9E;');
console.log('%cСделано с ❤️ для разработчиков', 'font-size: 12px; color: #909ABB;');
