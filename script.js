// Show Category Function
function showCategory(categoryId) {
    // Hide all categories
    const allCategories = document.querySelectorAll('.product-category');
    allCategories.forEach(cat => {
        cat.style.display = 'none';
    });

    // Show the selected category
    const selectedCategory = document.getElementById(categoryId);
    if (selectedCategory) {
        selectedCategory.style.display = 'block';
    }

    // Update page title
    const categoryNames = {
        'pod-devices': 'Pod Devices',
        'liquids': 'Liquids',
        'tanks': 'Tanks',
        'full-kit': 'Full Kit'
    };

    document.getElementById('page-title').textContent = categoryNames[categoryId] || 'منتجاتنا';

    // Close dropdown on mobile
    const dropdown = document.getElementById('productsDropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }

    // Clear all search inputs
    clearAllSearches();
}

// Search Products Function
function searchProducts(searchInputId, categoryId) {
    const searchInput = document.getElementById(searchInputId);
    const grid = document.getElementById('grid-' + categoryId);
    const products = grid.querySelectorAll('.product-card');
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    let visibleCount = 0;
    
    products.forEach(product => {
        const productName = product.getAttribute('data-name');
        const productTitle = product.querySelector('h3').textContent.toLowerCase();
        const productBrand = product.querySelector('.product-brand').textContent.toLowerCase();
        
        if (productName.includes(searchTerm) || productTitle.includes(searchTerm) || productBrand.includes(searchTerm)) {
            product.style.display = 'block';
            visibleCount++;
        } else {
            product.style.display = 'none';
        }
    });
    
    // Remove existing no-results message
    const existingNoResults = grid.querySelector('.no-results');
    if (existingNoResults) {
        existingNoResults.remove();
    }
    
    // Show no-results message if no products found
    if (visibleCount === 0 && searchTerm !== '') {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = ' مفيش منتجات مطابقة للبحث';
        grid.appendChild(noResults);
    }
}

// Clear All Searches
function clearAllSearches() {
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.value = '';
    });
    
    // Show all products
    const allProducts = document.querySelectorAll('.product-card');
    allProducts.forEach(product => {
        product.style.display = 'block';
    });
    
    // Remove no-results messages
    const noResultsMessages = document.querySelectorAll('.no-results');
    noResultsMessages.forEach(msg => msg.remove());
}

// Mobile dropdown toggle
function initMobileDropdown() {
    const dropdown = document.getElementById('productsDropdown');
    const dropbtn = dropdown ? dropdown.querySelector('.dropbtn') : null;
    
    if (dropdown && dropbtn && window.innerWidth <= 768) {
        dropbtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            dropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
}

// Initialize on page load
window.addEventListener('load', () => {
    initMobileDropdown();
    
    // Check URL hash on page load
    const hash = window.location.hash.substring(1);
    if (hash) {
        showCategory(hash);
    }
});

// Branches Modal Functions (for index.html)
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

// Close modal when clicking outside
if (typeof window !== 'undefined') {
    window.onclick = function(event) {
        const modal = document.getElementById('branchesModal');
        if (event.target == modal) {
            closeBranchesModal();
        }
    }
}
