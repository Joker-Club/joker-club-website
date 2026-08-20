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
window.addEventListener('load', function() {
    if (localStorage.getItem('ageVerified') === 'true') {
        const ageModal = document.getElementById('ageModal');
        if (ageModal) {
            ageModal.style.display = 'none';
        }
    }
    
    animateStats();
    initFAQ();
    initMobileDropdown();
    
    const hash = window.location.hash.substring(1);
    if (hash) {
        const category = document.getElementById(hash);
        if (category) {
            showCategory(hash);
        }
    }
});

// Show Category Function
function showCategory(categoryId) {
    const allCategories = document.querySelectorAll('.product-category');
    allCategories.forEach(function(cat) {
        cat.style.display = 'none';
    });

    const selectedCategory = document.getElementById(categoryId);
    if (selectedCategory) {
        selectedCategory.style.display = 'block';
    }

    const categoryNames = {
        'pod-devices': 'Pod Devices',
        'liquids': 'Liquids',
        'tanks': 'Tanks',
        'full-kit': 'Full Kit'
    };

    const pageTitle = document.getElementById('page-title');
    if (pageTitle) {
        pageTitle.textContent = categoryNames[categoryId] || 'منتجاتنا';
    }

    const dropdown = document.getElementById('productsDropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }

    clearAllSearches();
}

// Search Products Function
function searchProducts(searchInputId, categoryId) {
    const searchInput = document.getElementById(searchInputId);
    const grid = document.getElementById('grid-' + categoryId);
    
    if (!searchInput || !grid) return;
    
    const products = grid.querySelectorAll('.product-card');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    let visibleCount = 0;
    
    products.forEach(function(product) {
        const productName = product.getAttribute('data-name');
        const productTitle = product.querySelector('h3') ? product.querySelector('h3').textContent.toLowerCase() : '';
        const productBrand = product.querySelector('.product-brand') ? product.querySelector('.product-brand').textContent.toLowerCase() : '';
        
        if (productName.includes(searchTerm) || productTitle.includes(searchTerm) || productBrand.includes(searchTerm)) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    const existingNoResults = grid.querySelector('.no-results');
    if (existingNoResults) {
        existingNoResults.remove();
    }
    
    if (visibleCount === 0 && searchTerm !== '') {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = '🔍 مفيش منتجات مطابقة للبحث';
        grid.appendChild(noResults);
    }
}

// Clear All Searches
function clearAllSearches() {
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(function(input) {
        input.value = '';
    });
    
    const allProducts = document.querySelectorAll('.product-card');
    allProducts.forEach(function(product) {
        product.style.display = 'block';
    });
    
    const noResultsMessages = document.querySelectorAll('.no-results');
    noResultsMessages.forEach(function(msg) {
        msg.remove();
    });
}

// Animate Statistics
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(function(stat) {
        const target = parseInt(stat.getAttribute('data-target'));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const updateStat = function() {
            current += increment;
            if (current < target) {
                stat.textContent = Math.floor(current);
                requestAnimationFrame(updateStat);
            } else {
                stat.textContent = target;
            }
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
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
    
    faqItems.forEach(function(item) {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', function() {
                const isActive = item.classList.contains('active');
                
                faqItems.forEach(function(faq) {
                    faq.classList.remove('active');
                });
                
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
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
        
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '#') return;
        
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
    const modal = document.getElementById('branchesModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
}

function closeBranchesModal() {
    const modal = document.getElementById('branchesModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

window.onclick = function(event) {
    const modal = document.getElementById('branchesModal');
    if (event.target == modal) {
        closeBranchesModal();
    }
}
