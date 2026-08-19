// Age Verification
function verifyAge(isAdult) {
    if (isAdult) {
        document.getElementById('ageModal').style.display = 'none';
        localStorage.setItem('ageVerified', 'true');
    } else {
        window.location.href = 'https://www.google.com';
    }
}

// Check if already verified
window.addEventListener('load', () => {
    if (localStorage.getItem('ageVerified') === 'true') {
        document.getElementById('ageModal').style.display = 'none';
    }
    
    // Animate statistics
    animateStats();
    
    // Initialize FAQ
    initFAQ();
    
    // Initialize mobile dropdown
    initMobileDropdown();
});

// Animate Statistics
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateStat = () => {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateStat);
            } else {
                stat.textContent = target;
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateStat();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(stat);
    });
}

// FAQ Toggle
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(faq => {
                faq.classList.remove('active');
            });
            
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}

// Mobile Dropdown Toggle
function initMobileDropdown() {
    const dropdown = document.getElementById('productsDropdown');
    const dropbtn = dropdown ? dropdown.querySelector('.dropbtn') : null;
    
    if (dropdown && dropbtn) {
        dropbtn.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Branches Modal Functions
function openBranchesModal() {
    document.getElementById('branchesModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeBranchesModal() {
    document.getElementById('branchesModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('branchesModal');
    if (event.target == modal) {
        closeBranchesModal();
    }
}
