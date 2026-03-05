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
        // Create full cart sidebar dynamically
        const cartSidebar = document.createElement('div');
        cartSidebar.id = 'cart-sidebar';
        cartSidebar.innerHTML = `
            <div class="cart-header">
                <h2>YOUR CART</h2>
                <button id="close-cart"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <div class="cart-items" id="cart-items-container">
                <!-- Items inject here -->
            </div>
            <div class="cart-footer">
                <div class="cart-total">
                    <span>Subtotal</span>
                    <span id="cart-total-price">₹0</span>
                </div>
                <p style="font-size: 0.8rem; color: var(--secondary-text); margin-bottom: 1rem; text-align: center;">Taxes and shipping calculated at checkout</p>
                <button class="btn btn-primary" style="width: 100%" id="checkout-btn">Checkout</button>
            </div>
        `;
        document.body.appendChild(cartSidebar);

        // Required Styles for Cart
        const style = document.createElement('style');
        style.innerHTML = `
            #cart-sidebar {
                position: fixed;
                top: 0;
                right: -100%;
                width: 400px;
                max-width: 100vw;
                height: 100vh;
                background: var(--secondary-bg);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                transition: right 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                border-left: 1px solid var(--border-color);
                box-shadow: -10px 0 30px rgba(0,0,0,0.5);
            }
            #cart-sidebar.open {
                right: 0;
            }
            .cart-header {
                padding: 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid var(--border-color);
            }
            #close-cart {
                background: transparent;
                border: none;
                color: var(--primary-text);
                font-size: 1.5rem;
                cursor: pointer;
            }
            .cart-items {
                flex-grow: 1;
                overflow-y: auto;
                padding: 2rem;
            }
            .cart-item {
                display: flex;
                gap: 1rem;
                margin-bottom: 1.5rem;
                padding-bottom: 1.5rem;
                border-bottom: 1px solid var(--border-color);
            }
            .cart-item-img {
                width: 80px;
                height: 100px;
                background: #222;
                object-fit: cover;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                color: #555;
            }
            .cart-item-details {
                flex-grow: 1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
            .cart-item-title {
                font-size: 1rem;
                font-weight: 600;
                margin-bottom: 0.2rem;
            }
            .cart-item-price {
                color: var(--accent-silver);
            }
            .cart-item-actions {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-top: 0.5rem;
            }
            .qty-controls {
                display: flex;
                align-items: center;
                border: 1px solid var(--border-color);
            }
            .qty-btn {
                background: transparent;
                color: var(--primary-text);
                border: none;
                padding: 0.2rem 0.6rem;
                cursor: pointer;
            }
            .qty-display {
                padding: 0 0.5rem;
                font-size: 0.9rem;
            }
            .remove-btn {
                color: var(--secondary-text);
                background: transparent;
                border: none;
                text-decoration: underline;
                font-size: 0.8rem;
                cursor: pointer;
            }
            .remove-btn:hover {
                color: var(--accent-color);
            }
            .cart-footer {
                padding: 2rem;
                border-top: 1px solid var(--border-color);
                background: var(--primary-bg);
            }
            .cart-total {
                display: flex;
                justify-content: space-between;
                font-size: 1.2rem;
                font-weight: 800;
                margin-bottom: 1.5rem;
            }
            .empty-cart-msg {
                text-align: center;
                color: var(--secondary-text);
                margin-top: 3rem;
            }
        `;
        document.head.appendChild(style);

        // Overlay element
        const pageOverlay = document.createElement('div');
        pageOverlay.id = 'cart-page-overlay';
        pageOverlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);z-index:9998;display:none;backdrop-filter:blur(3px);opacity:0;transition:opacity 0.4s ease;';
        document.body.appendChild(pageOverlay);

        this.sidebar = cartSidebar;
        this.pageOverlay = pageOverlay;
    }

    openCart() {
        this.sidebar.classList.add('open');
        this.pageOverlay.style.display = 'block';
        setTimeout(() => this.pageOverlay.style.opacity = '1', 10);
        document.body.style.overflow = 'hidden'; // prevent bg scroll
    }

    closeCart() {
        this.sidebar.classList.remove('open');
        this.pageOverlay.style.opacity = '0';
        setTimeout(() => this.pageOverlay.style.display = 'none', 400);
        document.body.style.overflow = '';
    }

    addItem(product) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += parseInt(product.quantity || 1);
        } else {
            this.items.push({
                ...product,
                quantity: parseInt(product.quantity || 1)
            });
        }
        
        this.saveCart();
        this.openCart(); // Auto open cart on add
    }

    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
    }

    updateQuantity(productId, delta) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
            }
        }
    }

    saveCart() {
        localStorage.setItem('recazo_cart', JSON.stringify(this.items));
        this.updateCartCount();
        this.renderCartItems();
    }

    updateCartCount() {
        const countsElements = document.querySelectorAll('.cart-count');
        const count = this.items.reduce((total, item) => total + item.quantity, 0);
        
        countsElements.forEach(el => {
            el.textContent = count;
            el.style.transform = 'scale(1.2)';
            setTimeout(() => {
                el.style.transform = 'scale(1)';
            }, 200);
        });

        // Add visual indicator if items exist
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

    renderCartItems() {
        const container = document.getElementById('cart-items-container');
        const totalPriceEl = document.getElementById('cart-total-price');
        
        if (this.items.length === 0) {
            container.innerHTML = '<div class="empty-cart-msg">Your cart is empty.</div>';
            totalPriceEl.textContent = '₹0';
            return;
        }

        container.innerHTML = '';
        
        this.items.forEach(item => {
            const itemHTML = `
                <div class="cart-item">
                    <div class="cart-item-img">
                        ${item.name.substring(0,3).toUpperCase()}...
                    </div>
                    <div class="cart-item-details">
                        <div>
                            <div class="cart-item-title">${item.name}</div>
                            <div class="cart-item-price">₹${item.price.toLocaleString('en-IN')}</div>
                        </div>
                        <div class="cart-item-actions">
                            <div class="qty-controls">
                                <button class="qty-btn qty-minus" data-id="${item.id}">-</button>
                                <span class="qty-display">${item.quantity}</span>
                                <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
                            </div>
                            <button class="remove-btn" data-id="${item.id}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
            container.insertAdjacentHTML('beforeend', itemHTML);
        });

        totalPriceEl.textContent = '₹' + this.getTotalPrice().toLocaleString('en-IN');
    }

    bindEvents() {
        // Remove simple overlay if present in HTML
        const oldOverlay = document.getElementById('cart-overlay');
        if (oldOverlay) oldOverlay.remove();

        // Bind all Add To Cart buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const btn = e.target;
                const product = {
                    id: btn.dataset.id,
                    name: btn.dataset.name,
                    price: parseFloat(btn.dataset.price),
                    image: btn.dataset.image || 'placeholder'
                };
                
                this.addItem(product);
            }
            
            // Cart Header Icon Clik
            const cartIconWrapper = e.target.closest('.cart-icon-wrapper');
            if (cartIconWrapper) {
                this.openCart();
            }

            // Close Cart Elements
            if (e.target.closest('#close-cart') || e.target.id === 'cart-page-overlay') {
                this.closeCart();
            }

            // Increase Qty
            if (e.target.classList.contains('qty-plus')) {
                this.updateQuantity(e.target.dataset.id, 1);
            }
            
            // Decrease Qty
            if (e.target.classList.contains('qty-minus')) {
                this.updateQuantity(e.target.dataset.id, -1);
            }

            // Remove Item
            if (e.target.classList.contains('remove-btn')) {
                this.removeItem(e.target.dataset.id);
            }

            // Checkout
            if (e.target.id === 'checkout-btn') {
                if(this.items.length === 0) {
                    alert("Your cart is empty!");
                } else {
                    alert('Redirecting to secure gateway... Total: ₹' + this.getTotalPrice().toLocaleString('en-IN'));
                }
            }
        });
    }
}

// Initialize Cart
document.addEventListener('DOMContentLoaded', () => {
    window.appCart = new Cart();
});
