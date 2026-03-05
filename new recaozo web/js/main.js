// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenu) {
    mobileMenu.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// Header Scroll Effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Simple Cart Toggle Warning (To be expanded in cart.js)
const cartIcon = document.getElementById('cart-icon');
const cartOverlay = document.getElementById('cart-overlay');

if (cartIcon && cartOverlay) {
    cartIcon.addEventListener('click', () => {
        cartOverlay.style.display = 'flex';
    });
}
