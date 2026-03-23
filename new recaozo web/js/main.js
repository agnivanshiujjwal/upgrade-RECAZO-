// ================================
// Enhanced Main JavaScript
// ================================

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initHeaderScroll();
    initFAQ();
    initChatWidget();
    initScrollToTop();
    initImageLazyLoading();
    initFormValidation();
    initQuickView();
    initWishlist();
    initSearch();
    initProductFilters();
    initNewsletterForm();
    initSmoothScroll();
    initSizeGuide();
});

// ================================
// Mobile Menu with Overlay
// ================================
function initMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    const body = document.body;

    if (mobileMenu && navLinks) {
        // Create overlay if it doesn't exist
        let overlay = document.querySelector('.menu-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'menu-overlay';
            document.body.appendChild(overlay);
        }

        const toggleMenu = (show) => {
            mobileMenu.classList.toggle('active', show);
            navLinks.classList.toggle('active', show);
            
            if (show) {
                body.style.overflow = 'hidden';
                overlay.style.display = 'block';
                setTimeout(() => overlay.style.opacity = '1', 10);
            } else {
                body.style.overflow = '';
                overlay.style.opacity = '0';
                setTimeout(() => overlay.style.display = 'none', 300);
            }
        };

        mobileMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu(!navLinks.classList.contains('active'));
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', () => {
            toggleMenu(false);
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggleMenu(false);
            });
        });

        // Close menu on window resize if open
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navLinks.classList.contains('active')) {
                toggleMenu(false);
            }
        });
    }
}

// ================================
// Header Scroll with Progress Bar
// ================================
function initHeaderScroll() {
    const header = document.getElementById('header');
    
    if (header) {
        // Create progress bar if it doesn't exist
        let progressBar = document.querySelector('.scroll-progress');
        if (!progressBar) {
            progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress';
            document.body.appendChild(progressBar);
        }

        window.addEventListener('scroll', () => {
            // Header background
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Progress bar
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }
}

// ================================
// Smooth Scroll for Anchor Links
// ================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ================================
// Scroll to Top Button
// ================================
function initScrollToTop() {
    // Create button if it doesn't exist
    let scrollBtn = document.querySelector('.scroll-top');
    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.className = 'scroll-top';
        scrollBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        document.body.appendChild(scrollBtn);
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ================================
// Image Lazy Loading
// ================================
function initImageLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    if (images.length > 0) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// ================================
// Form Validation
// ================================
function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                validateInput(input);
            });
            
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateInput(input);
                }
            });
        });
        
        form.addEventListener('submit', (e) => {
            let isValid = true;
            let firstError = null;
            
            inputs.forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                    if (!firstError) firstError = input;
                }
            });
            
            if (!isValid) {
                e.preventDefault();
                showFormError(form, 'Please fill all required fields correctly.');
                firstError?.focus();
            }
        });
    });
}

function validateInput(input) {
    const value = input.value.trim();
    let isValid = true;
    
    // Remove existing error
    removeError(input);
    
    if (value === '') {
        isValid = false;
        showError(input, 'This field is required');
    } else if (input.type === 'email' && !isValidEmail(value)) {
        isValid = false;
        showError(input, 'Please enter a valid email address');
    } else if (input.type === 'tel' && !isValidPhone(value)) {
        isValid = false;
        showError(input, 'Please enter a valid phone number');
    } else if (input.tagName === 'SELECT' && !value) {
        isValid = false;
        showError(input, 'Please select an option');
    }
    
    if (isValid) {
        input.classList.add('valid');
    }
    
    return isValid;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone);
}

function showError(input, message) {
    input.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    input.parentNode.appendChild(errorDiv);
}

function removeError(input) {
    input.classList.remove('error');
    input.classList.remove('valid');
    
    const errorDiv = input.parentNode.querySelector('.error-message');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showFormError(form, message) {
    const existingError = form.querySelector('.form-error');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'form-error';
    errorDiv.textContent = message;
    
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// ================================
// FAQ Accordion
// ================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        if (question) {
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.faq-answer');
                        if (otherAnswer) {
                            otherAnswer.style.maxHeight = null;
                        }
                    }
                });
                
                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) {
                        answer.style.maxHeight = answer.scrollHeight + 'px';
                    }
                } else {
                    item.classList.remove('active');
                    const answer = item.querySelector('.faq-answer');
                    if (answer) {
                        answer.style.maxHeight = null;
                    }
                }
            });
        }
    });
}

// ================================
// Chat Widget
// ================================
function initChatWidget() {
    const chatBubble = document.getElementById('chat-bubble');
    const chatBox = document.getElementById('chat-box');
    const closeChat = document.getElementById('close-chat');
    const chatInput = document.querySelector('.chat-input input');
    const chatSendBtn = document.querySelector('.chat-input button');
    const chatBody = document.querySelector('.chat-body');
    
    if (chatBubble && chatBox && closeChat) {
        // Auto-open chat after 30 seconds (only once)
        let chatOpened = false;
        setTimeout(() => {
            if (!chatOpened && !chatBox.classList.contains('active') && !localStorage.getItem('chat-auto-opened')) {
                chatBox.classList.add('active');
                chatOpened = true;
                localStorage.setItem('chat-auto-opened', 'true');
            }
        }, 30000);
        
        chatBubble.addEventListener('click', () => {
            chatBox.classList.toggle('active');
            chatOpened = true;
        });
        
        closeChat.addEventListener('click', () => {
            chatBox.classList.remove('active');
        });
        
        // Click outside to close
        document.addEventListener('click', (e) => {
            if (!chatBox.contains(e.target) && !chatBubble.contains(e.target) && chatBox.classList.contains('active')) {
                chatBox.classList.remove('active');
            }
        });
        
        // Chat messaging
        if (chatInput && chatSendBtn && chatBody) {
            // Create typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'message incoming typing';
            typingIndicator.innerHTML = '<i class="fa-solid fa-ellipsis"></i>';
            
            const handleSendMessage = () => {
                const text = chatInput.value.trim();
                if (!text) return;
                
                // User message
                const userMsg = document.createElement('div');
                userMsg.className = 'message outgoing';
                userMsg.textContent = text;
                chatBody.appendChild(userMsg);
                chatInput.value = '';
                scrollChat();
                
                // Show typing indicator
                chatBody.appendChild(typingIndicator);
                scrollChat();
                
                // Smart responses
                setTimeout(() => {
                    typingIndicator.remove();
                    
                    let reply = getSmartResponse(text);
                    
                    const botMsg = document.createElement('div');
                    botMsg.className = 'message incoming';
                    botMsg.textContent = reply;
                    chatBody.appendChild(botMsg);
                    scrollChat();
                }, 1500);
            };
            
            chatSendBtn.addEventListener('click', handleSendMessage);
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSendMessage();
                }
            });
            
            function scrollChat() {
                chatBody.scrollTo({
                    top: chatBody.scrollHeight,
                    behavior: 'smooth'
                });
            }
            
            function getSmartResponse(text) {
                text = text.toLowerCase();
                
                const responses = {
                    'hello|hi|hey|hola': 'Hello! 👋 Welcome to Recazo. How can we help you today?',
                    'price|cost|rate': 'Our products range from ₹299 to ₹3499. You can check specific prices on product pages!',
                    'delivery|shipping|ship': 'Delivery takes 3-5 business days. Free shipping on orders above ₹999!',
                    'return|refund|exchange': 'We offer 7-day returns on unused items. Custom products are non-returnable.',
                    'size|fit|measurement': 'Check our size guide for perfect fit! Use the size chart on product pages.',
                    'custom|design|studio': 'Yes! Visit our Custom Studio to create your own unique designs.',
                    'order|track|where': 'You can track your order from your account dashboard or via the tracking link in email.',
                    'payment|pay|card|cod': 'We accept all major cards, UPI, and Cash on Delivery (COD).',
                    'contact|support|help': 'You can reach us at support@recazo.com or call +91 98765 43210',
                    'discount|offer|coupon': 'Subscribe to our newsletter for 10% off your first order!',
                    'thank|thanks': 'You\'re welcome! 😊 Is there anything else I can help with?',
                    'bye|goodbye|see you': 'Thanks for chatting! Feel free to reach out anytime. 👋'
                };
                
                for (let key in responses) {
                    const patterns = key.split('|');
                    if (patterns.some(pattern => text.includes(pattern))) {
                        return responses[key];
                    }
                }
                
                return "Thanks for reaching out! Our team will get back to you within 24 hours. For urgent support, please call +91 98765 43210";
            }
        }
    }
}

// ================================
// Quick View Modal
// ================================
function initQuickView() {
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    if (quickViewBtns.length > 0) {
        // Create modal if it doesn't exist
        let modal = document.querySelector('.quick-view-modal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.className = 'quick-view-modal';
            modal.innerHTML = `
                <div class="quick-view-content">
                    <button class="close-modal" aria-label="Close modal"><i class="fa-solid fa-xmark"></i></button>
                    <div class="quick-view-grid">
                        <div class="quick-view-image"></div>
                        <div class="quick-view-details"></div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Close modal functionality
            modal.querySelector('.close-modal').addEventListener('click', () => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
            
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        }
        
        // Add click handlers to quick view buttons
        quickViewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const productCard = btn.closest('.product-card');
                const productData = getProductData(productCard);
                
                updateQuickViewModal(modal, productData);
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });
    }
}

function getProductData(productCard) {
    return {
        name: productCard.querySelector('.product-title')?.textContent || 'Product',
        price: productCard.querySelector('.product-price')?.textContent || '₹0',
        category: productCard.querySelector('.product-category')?.textContent || 'Category',
        image: productCard.querySelector('.product-img')?.src || productCard.querySelector('.placeholder-img')?.textContent || 'placeholder',
        description: 'Premium quality streetwear crafted for those who dare to stand out. 100% combed cotton for ultimate comfort.'
    };
}

function updateQuickViewModal(modal, data) {
    const imageDiv = modal.querySelector('.quick-view-image');
    const detailsDiv = modal.querySelector('.quick-view-details');
    
    imageDiv.innerHTML = `<img src="${data.image}" alt="${data.name}" style="width:100%;height:auto;">`;
    detailsDiv.innerHTML = `
        <h2>${data.name}</h2>
        <p class="product-category">${data.category}</p>
        <p class="product-price">${data.price}</p>
        <p class="product-description">${data.description}</p>
        <div class="size-selector">
            <label>Select Size:</label>
            <div class="size-options">
                <button class="size-option">S</button>
                <button class="size-option">M</button>
                <button class="size-option">L</button>
                <button class="size-option">XL</button>
                <button class="size-option">XXL</button>
            </div>
        </div>
        <button class="btn btn-primary add-to-cart-btn" style="width:100%; margin-top:1rem;" 
                data-id="${Date.now()}" 
                data-name="${data.name}" 
                data-price="${data.price.replace(/[^0-9]/g, '')}">
            Add to Cart
        </button>
    `;
    
    // Add size selection functionality
    const sizeOptions = detailsDiv.querySelectorAll('.size-option');
    sizeOptions.forEach(option => {
        option.addEventListener('click', () => {
            sizeOptions.forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
        });
    });
}

// ================================
// Wishlist Functionality
// ================================
function initWishlist() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    
    wishlistBtns.forEach(btn => {
        // Check if product is in wishlist
        const productId = btn.dataset.id;
        const wishlist = JSON.parse(localStorage.getItem('recazo_wishlist') || '[]');
        if (wishlist.includes(productId)) {
            btn.classList.add('active');
        }
        
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            btn.classList.toggle('active');
            
            const productId = btn.dataset.id;
            const wishlist = JSON.parse(localStorage.getItem('recazo_wishlist') || '[]');
            
            if (btn.classList.contains('active')) {
                if (!wishlist.includes(productId)) {
                    wishlist.push(productId);
                    showNotification('Added to wishlist! ❤️', 'success');
                }
            } else {
                const index = wishlist.indexOf(productId);
                if (index > -1) {
                    wishlist.splice(index, 1);
                    showNotification('Removed from wishlist', 'info');
                }
            }
            
            localStorage.setItem('recazo_wishlist', JSON.stringify(wishlist));
        });
    });
}

// ================================
// Search Functionality
// ================================
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        const performSearch = () => {
            const query = searchInput.value.trim().toLowerCase();
            
            if (query.length < 2) {
                showNotification('Please enter at least 2 characters', 'warning');
                return;
            }
            
            // Show loading state
            searchBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            
            // Simulate search
            setTimeout(() => {
                searchBtn.innerHTML = '<i class="fa-solid fa-search"></i>';
                
                const products = document.querySelectorAll('.product-card');
                let resultsFound = false;
                
                products.forEach(product => {
                    const title = product.querySelector('.product-title')?.textContent.toLowerCase() || '';
                    const category = product.querySelector('.product-category')?.textContent.toLowerCase() || '';
                    
                    if (title.includes(query) || category.includes(query)) {
                        product.style.display = 'block';
                        resultsFound = true;
                    } else {
                        product.style.display = 'none';
                    }
                });
                
                if (!resultsFound) {
                    showNotification('No products found matching "' + query + '"', 'info');
                } else {
                    showNotification('Found ' + resultsFound + ' products', 'success');
                }
            }, 500);
        };
        
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// ================================
// Product Filters (Shop Page)
// ================================
function initProductFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');
    const sortSelect = document.querySelector('select');
    const products = document.querySelectorAll('.product-card');
    const productGrid = document.querySelector('.product-grid');
    
    if (filterCheckboxes.length > 0 && products.length > 0) {
        filterCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                applyFilters();
            });
        });
        
        // "All Categories" special handling
        const allCategoriesCheckbox = Array.from(filterCheckboxes).find(cb => 
            cb.parentElement.textContent.toLowerCase().includes('all categories')
        );
        
        if (allCategoriesCheckbox) {
            allCategoriesCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    filterCheckboxes.forEach(cb => {
                        if (cb !== this) {
                            cb.checked = false;
                        }
                    });
                }
                applyFilters();
            });
            
            // Uncheck "All Categories" if other filters are selected
            filterCheckboxes.forEach(cb => {
                if (cb !== allCategoriesCheckbox) {
                    cb.addEventListener('change', function() {
                        if (this.checked && allCategoriesCheckbox.checked) {
                            allCategoriesCheckbox.checked = false;
                        }
                        applyFilters();
                    });
                }
            });
        }
    }
    
    if (sortSelect && products.length > 0) {
        sortSelect.addEventListener('change', () => {
            applySort(sortSelect.value);
        });
    }
    
    function applyFilters() {
        const selectedCategories = Array.from(document.querySelectorAll('.filter-options input[type="checkbox"]:checked'))
            .map(cb => cb.parentElement.textContent.trim().toLowerCase());
        
        const hasAllCategories = selectedCategories.includes('all categories');
        
        let visibleCount = 0;
        
        products.forEach(product => {
            const category = product.querySelector('.product-category')?.textContent.toLowerCase() || '';
            
            if (hasAllCategories || selectedCategories.length === 0 || selectedCategories.includes(category)) {
                product.style.display = 'block';
                visibleCount++;
            } else {
                product.style.display = 'none';
            }
        });
        
        updateNoResultsMessage(visibleCount);
    }
    
    function applySort(sortBy) {
        const productsArray = Array.from(products);
        
        productsArray.sort((a, b) => {
            const priceA = parseInt(a.querySelector('.product-price')?.textContent.replace(/[^0-9]/g, '') || '0');
            const priceB = parseInt(b.querySelector('.product-price')?.textContent.replace(/[^0-9]/g, '') || '0');
            
            switch(sortBy) {
                case 'low-high':
                    return priceA - priceB;
                case 'high-low':
                    return priceB - priceA;
                case 'newest':
                    // Assuming there's a data attribute for date
                    const dateA = parseInt(a.dataset.date || '0');
                    const dateB = parseInt(b.dataset.date || '0');
                    return dateB - dateA;
                default:
                    return 0;
            }
        });
        
        // Reorder DOM
        if (productGrid) {
            productsArray.forEach(product => productGrid.appendChild(product));
        }
    }
    
    function updateNoResultsMessage(count) {
        let noResultsMsg = document.querySelector('.no-results-message');
        
        if (count === 0) {
            if (!noResultsMsg && productGrid) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.className = 'no-results-message';
                noResultsMsg.innerHTML = '<i class="fa-solid fa-search"></i><p>No products match your filters.</p>';
                productGrid.appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    }
}

// ================================
// Newsletter Form
// ================================
function initNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = form.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address', 'error');
                emailInput.focus();
                return;
            }
            
            // Show loading
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                form.reset();
                showNotification('Thanks for subscribing! Check your email for 10% off. 🎉', 'success');
                
                // Store in localStorage to prevent multiple signups
                localStorage.setItem('newsletter_subscribed', 'true');
            }, 1500);
        });
    });
}

// ================================
// Size Guide Modal
// ================================
function initSizeGuide() {
    const sizeGuideBtn = document.getElementById('size-guide-btn');
    const sizeChartModal = document.querySelector('.size-chart-modal');
    
    if (sizeGuideBtn && sizeChartModal) {
        sizeGuideBtn.addEventListener('click', () => {
            sizeChartModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        const closeBtn = sizeChartModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                sizeChartModal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
        
        sizeChartModal.addEventListener('click', (e) => {
            if (e.target === sizeChartModal) {
                sizeChartModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// ================================
// Notification System (Global)
// ================================
function showNotification(message, type = 'success') {
    // Use cart's notification if available
    if (window.appCart && window.appCart.showNotification) {
        window.appCart.showNotification(message, type);
        return;
    }
    
    // Fallback notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    if (type === 'warning') icon = 'fa-exclamation-triangle';
    if (type === 'info') icon = 'fa-info-circle';
    
    notification.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 2700);
}

// ================================
// Utility Functions
// ================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Format price in Indian Rupees
function formatPrice(price) {
    return '₹' + price.toLocaleString('en-IN');
}

// Get URL parameters
function getUrlParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    
    return params;
}

// ================================
// Initialize all on page load
// ================================
// This is already called at the top of the file