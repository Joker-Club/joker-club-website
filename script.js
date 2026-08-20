// ================================
// Age Verification
// ================================
function verifyAge(isAdult) {
    const ageModal = document.getElementById('ageModal');

    if (isAdult) {
        if (ageModal) {
            ageModal.style.display = 'none';
        }

        localStorage.setItem('ageVerified', 'true');
    } else {
        window.location.href = 'https://www.google.com';
    }
}


// ================================
// Page Initialization
// ================================
document.addEventListener('DOMContentLoaded', function () {

    // Age Verification
    const ageModal = document.getElementById('ageModal');

    if (ageModal && localStorage.getItem('ageVerified') === 'true') {
        ageModal.style.display = 'none';
    }

    // Initialize website features
    animateStats();
    initFAQ();
    initMobileDropdown();
    initSmoothScroll();
    initBranchesModal();

    // Open category from URL hash
    const hash = window.location.hash.substring(1);

    if (hash) {
        const category = document.getElementById(hash);

        if (category && category.classList.contains('product-category')) {
            showCategory(hash);
        }
    }
});


// ================================
// Show Product Category
// ================================
function showCategory(categoryId) {

    const allCategories = document.querySelectorAll('.product-category');

    allCategories.forEach(function (category) {
        category.style.display = 'none';
    });

    const selectedCategory = document.getElementById(categoryId);

    if (!selectedCategory) {
        return;
    }

    selectedCategory.style.display = 'block';

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

    // Reset all searches whenever category changes
    clearAllSearches();

    // Update URL without jumping the page
    if (window.history && window.history.replaceState) {
        window.history.replaceState(null, '', '#' + categoryId);
    }
}


// ================================
// Product Search
// ================================
function searchProducts(searchInputId, categoryId) {

    const searchInput = document.getElementById(searchInputId);
    const grid = document.getElementById('grid-' + categoryId);

    if (!searchInput || !grid) {
        return;
    }

    const products = grid.querySelectorAll('.product-card');

    const searchTerm = normalizeText(searchInput.value);

    let visibleCount = 0;

    products.forEach(function (product) {

        const productName =
            normalizeText(product.getAttribute('data-name') || '');

        const titleElement = product.querySelector('h3');
        const brandElement = product.querySelector('.product-brand');
        const nicElement = product.querySelector('.product-nic');

        const productTitle =
            titleElement ? normalizeText(titleElement.textContent) : '';

        const productBrand =
            brandElement ? normalizeText(brandElement.textContent) : '';

        const productNic =
            nicElement ? normalizeText(nicElement.textContent) : '';

        const matches =
            searchTerm === '' ||
            productName.includes(searchTerm) ||
            productTitle.includes(searchTerm) ||
            productBrand.includes(searchTerm) ||
            productNic.includes(searchTerm);

        if (matches) {
            // Let CSS Grid decide the display type
            product.style.display = '';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });

    // Remove old "no results" message
    const oldMessage = grid.querySelector('.no-results');

    if (oldMessage) {
        oldMessage.remove();
    }

    // Show no-results message
    if (visibleCount === 0 && searchTerm !== '') {

        const noResults = document.createElement('div');

        noResults.className = 'no-results';
        noResults.textContent = '🔍 مفيش منتجات مطابقة للبحث';

        grid.appendChild(noResults);
    }
}


// ================================
// Normalize Search Text
// ================================
function normalizeText(text) {

    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ');
}


// ================================
// Clear All Searches
// ================================
function clearAllSearches() {

    const searchInputs = document.querySelectorAll('.search-input');

    searchInputs.forEach(function (input) {
        input.value = '';
    });

    const allProducts = document.querySelectorAll('.product-card');

    allProducts.forEach(function (product) {
        // Return to normal CSS display
        product.style.display = '';
    });

    const noResultsMessages =
        document.querySelectorAll('.no-results');

    noResultsMessages.forEach(function (message) {
        message.remove();
    });
}


// ================================
// Animate Statistics
// ================================
function animateStats() {

    const statNumbers =
        document.querySelectorAll('.stat-number');

    if (!statNumbers.length) {
        return;
    }

    statNumbers.forEach(function (stat) {

        const targetValue =
            parseInt(stat.getAttribute('data-target'), 10);

        if (isNaN(targetValue)) {
            return;
        }

        let started = false;

        const duration = 2000;

        function updateStat(startTime) {

            const elapsed = performance.now() - startTime;

            const progress =
                Math.min(elapsed / duration, 1);

            const current =
                Math.floor(progress * targetValue);

            stat.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(function () {
                    updateStat(startTime);
                });
            } else {
                stat.textContent = targetValue;
            }
        }

        const observer =
            new IntersectionObserver(function (entries) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting && !started) {

                        started = true;

                        requestAnimationFrame(function () {
                            updateStat(performance.now());
                        });

                        observer.unobserve(entry.target);
                    }
                });

            }, {
                threshold: 0.3
            });

        observer.observe(stat);
    });
}


// ================================
// FAQ
// ================================
function initFAQ() {

    const faqItems =
        document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {

        const question =
            item.querySelector('.faq-question');

        if (!question) {
            return;
        }

        question.addEventListener('click', function () {

            const isActive =
                item.classList.contains('active');

            faqItems.forEach(function (faq) {
                faq.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });
}


// ================================
// Mobile Dropdown
// ================================
function initMobileDropdown() {

    const dropdown =
        document.getElementById('productsDropdown');

    if (!dropdown) {
        return;
    }

    const dropbtn =
        dropdown.querySelector('.dropbtn');

    if (!dropbtn) {
        return;
    }

    dropbtn.addEventListener('click', function (event) {

        if (window.innerWidth <= 768) {

            event.preventDefault();
            event.stopPropagation();

            dropdown.classList.toggle('active');
        }
    });

    document.addEventListener('click', function (event) {

        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });
}


// ================================
// Smooth Scroll
// ================================
function initSmoothScroll() {

    const anchors =
        document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function (anchor) {

        anchor.addEventListener('click', function (event) {

            const href =
                this.getAttribute('href');

            if (!href || href === '#') {
                return;
            }

            let target;

            try {
                target = document.querySelector(href);
            } catch (error) {
                return;
            }

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}


// ================================
// Branches Modal
// ================================
function openBranchesModal() {

    const modal =
        document.getElementById('branchesModal');

    if (!modal) {
        return;
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}


function closeBranchesModal() {

    const modal =
        document.getElementById('branchesModal');

    if (!modal) {
        return;
    }

    modal.style.display = 'none';
    document.body.style.overflow = '';
}


// Close modal when clicking outside
function initBranchesModal() {

    const modal =
        document.getElementById('branchesModal');

    if (!modal) {
        return;
    }

    modal.addEventListener('click', function (event) {

        if (event.target === modal) {
            closeBranchesModal();
        }
    });
}


// Close modal with ESC
document.addEventListener('keydown', function (event) {

    if (event.key === 'Escape') {

        const modal =
            document.getElementById('branchesModal');

        if (modal && modal.style.display === 'flex') {
            closeBranchesModal();
        }
    }
});
