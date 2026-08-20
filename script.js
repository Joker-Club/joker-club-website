// ================================
// Firebase Initialization
// ================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBRlo0ox5gCNdLg-TczSeLPEZm640_uygA",
    authDomain: "joker-club-33625.firebaseapp.com",
    projectId: "joker-club-33625",
    storageBucket: "joker-club-33625.firebasestorage.app",
    messagingSenderId: "264864054518",
    appId: "1:264864054518:web:fe2371e4271bbb1bc3c0d7",
    measurementId: "G-0LEP8PYW0Q"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


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

    // Load products from Firebase if we are on the products page
    if (document.getElementById('grid-pod-devices')) {
        loadProductsFromFirebase();
    }
});


// ================================
// Load Products from Firebase
// ================================
async function loadProductsFromFirebase() {
    const grids = {
        'pod-devices': document.getElementById('grid-pod-devices'),
        'liquids': document.getElementById('grid-liquids'),
        'tanks': document.getElementById('grid-tanks'),
        'full-kit': document.getElementById('grid-full-kit')
    };

    // Clear loading messages
    Object.values(grids).forEach(grid => {
        if (grid) grid.innerHTML = '';
    });

    try {
        const querySnapshot = await getDocs(collection(db, "products"));
        
        if (querySnapshot.empty) {
            Object.values(grids).forEach(grid => {
                if (grid) grid.innerHTML = '<div class="no-results">لا توجد منتجات حالياً في هذا القسم.</div>';
            });
            return;
        }

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const grid = grids[data.category];
            
            if (grid) {
                const card = document.createElement('div');
                card.className = 'product-card liquid-card';
                
                // Use searchKeywords if available, otherwise fallback to name
                const searchStr = (data.searchKeywords || data.name || '').toLowerCase();
                card.setAttribute('data-name', searchStr);
                
                const nicBadge = data.nicotine ? `<p class="product-nic">${data.nicotine}</p>` : '';
                const whatsappText = encodeURIComponent(`مرحبا، عايز أستفسر عن ${data.name}`);
                
                card.innerHTML = `
                    <div class="product-img-container">
                        <img src="${data.image || 'default.png'}" alt="${data.name || 'منتج'}" class="product-image" loading="lazy">
                    </div>
                    <h3>${data.name || 'منتج'}</h3>
                    <p class="product-brand">${data.brand || ''}</p>
                    ${nicBadge}
                    <a href="https://wa.me/201226119761?text=${whatsappText}" class="order-btn whatsapp-order" target="_blank" rel="noopener noreferrer">💬 اطلب عبر واتساب</a>
                `;
                
                grid.appendChild(card);
            }
        });
    } catch (error) {
        console.error("Error loading products: ", error);
        Object.values(grids).forEach(grid => {
            if (grid) grid.innerHTML = '<div class="no-results">حدث خطأ أثناء تحميل المنتجات. تأكد من اتصال الإنترنت.</div>';
        });
    }
}


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
        const productName = normalizeText(product.getAttribute('data-name') || '');
        const matches = searchTerm === '' || productName.includes(searchTerm);

        if (matches) {
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
        product.style.display = '';
    });

    const noResultsMessages = document.querySelectorAll('.no-results');
    noResultsMessages.forEach(function (message) {
        message.remove();
    });
}


// ================================
// Animate Statistics
// ================================
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');

    if (!statNumbers.length) {
        return;
    }

    statNumbers.forEach(function (stat) {
        const targetValue = parseInt(stat.getAttribute('data-target'), 10);

        if (isNaN(targetValue)) {
            return;
        }

        let started = false;
        const duration = 2000;

        function updateStat(startTime) {
            const elapsed = performance.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(progress * targetValue);
            stat.textContent = current;

            if (progress < 1) {
                requestAnimationFrame(function () {
                    updateStat(startTime);
                });
            } else {
                stat.textContent = targetValue;
            }
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting && !started) {
                    started = true;
                    requestAnimationFrame(function () {
                        updateStat(performance.now());
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });

        observer.observe(stat);
    });
}


// ================================
// FAQ
// ================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
        const question = item.querySelector('.faq-question');

        if (!question) {
            return;
        }

        question.addEventListener('click', function () {
            const isActive = item.classList.contains('active');

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
    const dropdown = document.getElementById('productsDropdown');

    if (!dropdown) {
        return;
    }

    const dropbtn = dropdown.querySelector('.dropbtn');

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
    const anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function (anchor) {
        anchor.addEventListener('click', function (event) {
            const href = this.getAttribute('href');

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
    const modal = document.getElementById('branchesModal');
    if (!modal) {
        return;
    }
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeBranchesModal() {
    const modal = document.getElementById('branchesModal');
    if (!modal) {
        return;
    }
    modal.style.display = 'none';
    document.body.style.overflow = '';
}

function initBranchesModal() {
    const modal = document.getElementById('branchesModal');
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
        const modal = document.getElementById('branchesModal');
        if (modal && modal.style.display === 'flex') {
            closeBranchesModal();
        }
    }
});
