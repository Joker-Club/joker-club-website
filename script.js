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
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Mobile dropdown toggle
const dropdown = document.querySelector('.dropdown');
if (dropdown) {
    dropdown.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            this.classList.toggle('active');
        }
    });
}
