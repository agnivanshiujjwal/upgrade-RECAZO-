// Advanced Cart State Management & UI

class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('recazo_cart')) || [];
        this.initDOM();
        this.updateCartCount();
        this.renderCartItems();
        this.bindEvents();
    }

    initDOM() {
        // Remove existing cart sidebar if any
        const existingSidebar = document.getElementById('cart-sidebar');
        if (existingSidebar) existingSidebar.remove();
        
        const existingOverlay = document.getElementById('cart-page-overlay');
        if (existingOverlay) existingOverlay.remove();

        // Create full cart sidebar dynamically
        const cartSidebar = document.createElement('div');
        cartSidebar.id = 'cart-sidebar';
        cartSidebar.innerHTML = `
            <div class="cart-header">
                <h2>YOUR CART</h2>
                <button id="close-cart" aria-label="Close cart"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="cart-items" id="cart-items-container">
                <!-- Items will be injected here -->
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Subtotal</span>
                    <span id="cart-total-price">₹0</span>
                </div>
                <p style="font-size: 0.8rem; color: var(--secondary-text); margin-bottom: 1rem; text-align: center;">Taxes and shipping calculated at checkout</p>
                <button class="btn btn-primary" style="width: 100%" id="checkout-btn">Proceed to Checkout</button>
            </div>
        `;
        document.body.appendChild(cartSidebar);

        // Overlay element
        const pageOverlay = document.createElement('div');
        pageOverlay.id = 'cart-page-overlay';
        document.body.appendChild(pageOverlay);

        this.sidebar = cartSidebar;
        this.pageOverlay = pageOverlay;
    }

    openCart() {
        this.sidebar.classList.add('open');
        this.pageOverlay.style.display = 'block';
        setTimeout(() => this.pageOverlay.style.opacity = '1', 10);
        document.body.style.overflow = 'hidden';
    }

    closeCart() {
        this.sidebar.classList.remove('open');
        this.pageOverlay.style.opacity = '0';
        setTimeout(() => {
            this.pageOverlay.style.display = 'none';
            document.body.style.overflow = '';
        }, 400);
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += parseInt(product.quantity || 1);
            this.showNotification(`Updated ${product.name} quantity`, 'success');
        } else {
            this.items.push({
                ...product,
                quantity: parseInt(product.quantity || 1)
            });
            this.showNotification(`${product.name} added to cart!`, 'success');
        }
        
        this.saveCart();
        this.openCart();
    }

    removeItem(productId) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            this.showNotification(`${item.name} removed from cart`, 'info');
            this.items = this.items.filter(item => item.id !== productId);
            this.saveCart();
        }
    }

    updateQuantity(productId, delta) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = newQuantity;
                this.saveCart();
            }
        }
    }

    clearCart() {
        this.items = [];
        this.saveCart();
        this.showNotification('Cart cleared', 'info');
    }

    saveCart() {
        localStorage.setItem('recazo_cart', JSON.stringify(this.items));
        this.updateCartCount();
        this.renderCartItems();
    }

    updateCartCount() {
        const countElements = document.querySelectorAll('.cart-count');
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        
        countElements.forEach(el => {
            el.textContent = count;
            el.style.transform = 'scale(1.2)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        });

        // Update cart icon color
        const cartIcons = document.querySelectorAll('.cart-icon-wrapper');
        cartIcons.forEach(icon => {
            if (count > 0) {
                icon.style.color = 'var(--accent-color)';
            } else {
                icon.style.color = 'var(--primary-text)';
            }
        });
    }

    getTotalPrice() {
        return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    getItemCount() {
        return this.items.reduce((total, item) => total + item.quantity, 0);
    }

    renderCartItems() {
        const container = document.getElementById('cart-items-container');
        const totalPriceEl = document.getElementById('cart-total-price');
        
        if (!container || !totalPriceEl) return;

        if (this.items.length === 0) {
            container.innerHTML = '<div class="empty-cart-msg">Your cart is empty.<br>Start shopping!</div>';
            totalPriceEl.textContent = '₹0';
            return;
        }

        container.innerHTML = '';
        
        this.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <div class="cart-item-img">
                    ${item.name.substring(0, 3).toUpperCase()}
                </div>
                <div class="cart-item-details">
                    <div>
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                    </div>
                    <div class="cart-item-actions">
                        <div class="qty-controls">
                            <button class="qty-btn qty-minus" data-id="${item.id}" aria-label="Decrease quantity">-</button>
                            <span class="qty-display">${item.quantity}</span>
                            <button class="qty-btn qty-plus" data-id="${item.id}" aria-label="Increase quantity">+</button>
                        </div>
                        <button class="remove-btn" data-id="${item.id}" aria-label="Remove item">Remove</button>
                    </div>
                </div>
            `;
            container.appendChild(itemElement);
        });

        totalPriceEl.textContent = '₹' + this.getTotalPrice().toLocaleString('en-IN');
    }

    showNotification(message, type = 'success') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

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
            notification.remove();
        }, 3000);
    }

    bindEvents() {
        // Remove old cart overlay if present
        const oldOverlay = document.getElementById('cart-overlay');
        if (oldOverlay) oldOverlay.remove();

        // Event delegation for all cart-related actions
        document.addEventListener('click', (e) => {
            // Add to cart buttons
            if (e.target.classList.contains('add-to-cart-btn') || e.target.closest('.add-to-cart-btn')) {
                const btn = e.target.closest('.add-to-cart-btn') || e.target;
                const product = {
                    id: btn.dataset.id || Date.now().toString(),
                    name: btn.dataset.name || 'Product',
                    price: parseFloat(btn.dataset.price) || 0,
                    image: btn.dataset.image || 'placeholder'
                };
                
                // Add visual feedback
                btn.style.transform = 'scale(0.95)';
                setTimeout(() => btn.style.transform = '', 200);
                
                this.addItem(product);
                e.preventDefault();
            }
            
            // Cart icon click
            if (e.target.closest('.cart-icon-wrapper')) {
                e.preventDefault();
                this.openCart();
            }

            // Close cart
            if (e.target.closest('#close-cart')) {
                this.closeCart();
            }

            // Close cart when clicking overlay
            if (e.target.id === 'cart-page-overlay') {
                this.closeCart();
            }

            // Quantity increase
            if (e.target.classList.contains('qty-plus')) {
                this.updateQuantity(e.target.dataset.id, 1);
            }
            
            // Quantity decrease
            if (e.target.classList.contains('qty-minus')) {
                this.updateQuantity(e.target.dataset.id, -1);
            }

            // Remove item
            if (e.target.classList.contains('remove-btn')) {
                this.removeItem(e.target.dataset.id);
            }

            // Checkout
            if (e.target.id === 'checkout-btn') {
                e.preventDefault();
                if (this.items.length === 0) {
                    this.showNotification('Your cart is empty!', 'warning');
                } else {
                    this.showNotification('Redirecting to checkout...', 'info');
                    // Simulate redirect
                    setTimeout(() => {
                        alert('Checkout functionality will be integrated with payment gateway');
                    }, 1000);
                }
            }
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.sidebar.classList.contains('open')) {
                this.closeCart();
            }
        });
    }
}

// Initialize Cart when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.appCart = new Cart();
    });
} else {
    window.appCart = new Cart();
}