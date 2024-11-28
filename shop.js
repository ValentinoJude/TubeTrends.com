document.addEventListener('DOMContentLoaded', function() {
    // Sample product data
    const products = [
        {
            id: 1,
            name: "Creator Gaming Hoodie",
            price: 49.99,
            image: "Images/Gaming Hoodie.jpg",
            creator: "pewdiepie",
            category: "clothing",
            options: {
                sizes: ['S', 'M', 'L', 'XL', 'XXL'],
                colors: ['Black', 'Navy', 'Red'],
                maxQuantity: 10
            },
            inStock: true
        },
        {
            id: 2,
            name: "Limited Edition Cap",
            price: 24.99,
            image: "Images/cap.png",
            creator: "markiplier",
            category: "accessories",
            options: {
                sizes: ['One Size'],
                colors: ['Black', 'White', 'Red'],
                maxQuantity: 5
            },
            inStock: true
        },
        {
            id: 3,
            name: "Creator Sneakers",
            price: 79.99,
            image: "Images/Sneakers.webp",
            creator: "mrbeast",
            category: "footwear",
            options: {
                sizes: ['US 7', 'US 8', 'US 9', 'US 10', 'US 11', 'US 12'],
                colors: ['White/Red', 'Black/Gold'],
                maxQuantity: 3
            },
            inStock: true
        }
    ];

    let cart = new ShoppingCart();
    let wishlist = new Wishlist();

    // Initialize products
    function initializeProducts() {
        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = products.map(product => `
            <div class="col-md-4 mb-4">
                <div class="card h-100 product-card">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">
                            <span class="text-danger fw-bold">$${product.price.toFixed(2)}</span>
                        </p>
                        
                        <!-- Product Options -->
                        <div class="product-options mb-3">
                            ${product.options.sizes.length > 1 ? `
                                <div class="mb-2">
                                    <label class="form-label">Size:</label>
                                    <select class="form-select form-select-sm size-select" data-product-id="${product.id}">
                                        ${product.options.sizes.map(size => 
                                            `<option value="${size}">${size}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                            ` : ''}
                            
                            ${product.options.colors.length > 1 ? `
                                <div class="mb-2">
                                    <label class="form-label">Color:</label>
                                    <select class="form-select form-select-sm color-select" data-product-id="${product.id}">
                                        ${product.options.colors.map(color => 
                                            `<option value="${color}">${color}</option>`
                                        ).join('')}
                                    </select>
                                </div>
                            ` : ''}
                            
                            <div class="mb-2">
                                <label class="form-label">Quantity:</label>
                                <select class="form-select form-select-sm quantity-select" data-product-id="${product.id}">
                                    ${Array.from({length: product.options.maxQuantity}, (_, i) => 
                                        `<option value="${i + 1}">${i + 1}</option>`
                                    ).join('')}
                                </select>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-danger add-to-cart" data-id="${product.id}"
                                ${!product.inStock ? 'disabled' : ''}>
                                ${product.inStock ? 'Add to Cart' : 'Out of Stock'}
                            </button>
                            <button class="btn btn-outline-danger add-to-wishlist" data-id="${product.id}">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Add to cart
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            const productCard = document.querySelector(`[data-id="${productId}"]`).closest('.product-card');
            const selectedOptions = {
                size: productCard.querySelector('.size-select')?.value || product.options.sizes[0],
                color: productCard.querySelector('.color-select')?.value || product.options.colors[0],
                quantity: parseInt(productCard.querySelector('.quantity-select').value)
            };

            cart.addItem(product, selectedOptions);
            updateCart();
            showNotification('Added to cart!');
        }
    }

    // Update cart display
    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        // Display cart items
        cartItems.innerHTML = cart.items.map(item => `
            <div class="cart-item mb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">
                            Size: ${item.selectedSize} | 
                            Color: ${item.selectedColor} | 
                            $${item.price.toFixed(2)} × ${item.quantity}
                        </small>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="me-3">$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="btn btn-sm btn-outline-danger remove-from-cart" 
                            data-id="${item.cartItemId}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Add order summary with breakdown
        if (cart.items.length > 0) {
            cartItems.innerHTML += `
                <div class="order-summary mt-4">
                    <h6 class="mb-3">Order Summary</h6>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Subtotal:</span>
                        <span>$${cart.subtotal.toFixed(2)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Estimated Tax:</span>
                        <span>$${cart.tax.toFixed(2)}</span>
                    </div>
                    <div class="d-flex justify-content-between mb-2">
                        <span>Shipping:</span>
                        <span>${cart.shipping === 0 ? 'FREE' : '$' + cart.shipping.toFixed(2)}</span>
                    </div>
                    <hr class="my-2">
                    <div class="d-flex justify-content-between fw-bold">
                        <span>Total:</span>
                        <span>$${cart.total.toFixed(2)}</span>
                    </div>
                    <small class="text-muted d-block mt-2">
                        Free shipping on orders over $100
                    </small>
                </div>
            `;
        } else {
            cartItems.innerHTML += `
                <div class="text-center mt-4">
                    <p>Your cart is empty</p>
                </div>
            `;
        }

        // Update total display
        cartTotal.textContent = `$${cart.total.toFixed(2)}`;

        // Update cart count badge
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            cartCount.style.display = totalItems > 0 ? 'block' : 'none';
        }
    }

    // Show notification
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // Initialize products
    initializeProducts();

    // Event Listeners
    document.addEventListener('click', function(e) {
        // Add to cart
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }

        // Remove from cart
        if (e.target.closest('.remove-from-cart')) {
            const cartItemId = e.target.closest('.remove-from-cart').dataset.id;
            cart.removeItem(cartItemId);
            updateCart();
            showNotification('Removed from cart!');
        }
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.items.length === 0) {
            showNotification('Your cart is empty!');
            return;
        }
        
        // Initialize checkout modal
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
        
        // Start at shipping step
        renderCheckoutStep('shipping');
    });

    function renderCheckoutStep(step) {
        const container = document.getElementById('checkout-container');
        const cartSummary = document.getElementById('checkout-cart-summary');
        
        // Update progress indicators
        updateCheckoutProgress(step);
        
        // Render appropriate form based on step
        switch(step) {
            case 'shipping':
                container.innerHTML = `
                    <form id="shipping-form" class="needs-validation" novalidate>
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label">First Name</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Last Name</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Email</label>
                                <input type="email" class="form-control" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label">Address</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">City</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">State</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="col-md-3">
                                <label class="form-label">ZIP Code</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="col-12 mt-4">
                                <button type="submit" class="btn btn-primary">Continue to Payment</button>
                            </div>
                        </div>
                    </form>
                `;
                break;
                
            case 'payment':
                container.innerHTML = `
                    <form id="payment-form" class="needs-validation" novalidate>
                        <div class="row g-3">
                            <div class="col-12">
                                <label class="form-label">Card Number</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">Expiration Date</label>
                                <input type="text" class="form-control" placeholder="MM/YY" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label">CVV</label>
                                <input type="text" class="form-control" required>
                            </div>
                            <div class="col-12 mt-4">
                                <button type="submit" class="btn btn-primary">Place Order</button>
                            </div>
                        </div>
                    </form>
                `;
                break;
                
            case 'confirmation':
                container.innerHTML = `
                    <div class="text-center">
                        <i class="fas fa-check-circle text-success" style="font-size: 48px;"></i>
                        <h4 class="mt-3">Order Confirmed!</h4>
                        <p>Your order has been placed successfully.</p>
                        <p>Order #: ${generateOrderNumber()}</p>
                        <button class="btn btn-primary mt-3" onclick="window.location.reload()">
                            Continue Shopping
                        </button>
                    </div>
                `;
                break;
        }
        
        // Render cart summary
        renderCheckoutCartSummary();
    }

    function updateCheckoutProgress(currentStep) {
        const steps = document.querySelectorAll('.checkout-progress .step');
        const stepOrder = ['shipping', 'payment', 'confirmation'];
        
        steps.forEach((step, index) => {
            if (stepOrder.indexOf(currentStep) >= index) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }

    function renderCheckoutCartSummary() {
        const summary = document.getElementById('checkout-cart-summary');
        summary.innerHTML = `
            <div class="cart-items-summary">
                ${cart.items.map(item => `
                    <div class="d-flex justify-content-between mb-2">
                        <span>${item.name} (${item.quantity}x)</span>
                        <span>$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `).join('')}
            </div>
            <hr>
            <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>$${cart.subtotal.toFixed(2)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Tax:</span>
                <span>$${cart.tax.toFixed(2)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Shipping:</span>
                <span>${cart.shipping === 0 ? 'FREE' : '$' + cart.shipping.toFixed(2)}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between fw-bold">
                <span>Total:</span>
                <span>$${cart.total.toFixed(2)}</span>
            </div>
        `;
    }

    function generateOrderNumber() {
        return 'ORD-' + Date.now().toString().slice(-6);
    }

    // Add form submission handlers
    document.addEventListener('submit', function(e) {
        if (e.target.id === 'shipping-form') {
            e.preventDefault();
            if (e.target.checkValidity()) {
                renderCheckoutStep('payment');
            }
            e.target.classList.add('was-validated');
        }
        
        if (e.target.id === 'payment-form') {
            e.preventDefault();
            if (e.target.checkValidity()) {
                renderCheckoutStep('confirmation');
                // Clear cart after successful order
                cart = new ShoppingCart();
                updateCart();
            }
            e.target.classList.add('was-validated');
        }
    });

    // Add promo code functionality
    function applyPromoCode(code) {
        const promos = {
            'WELCOME10': 0.10,  // 10% off
            'CREATOR20': 0.20,  // 20% off
            'FREESHIP': 'free_shipping'
        };
        
        if (promos[code]) {
            if (promos[code] === 'free_shipping') {
                cart.shipping = 0;
            } else {
                cart.discount = cart.subtotal * promos[code];
            }
            cart.updateTotals();
            updateCart();
        }
    }

    // Save shipping info for returning customers
    function saveShippingInfo(info) {
        localStorage.setItem('savedShipping', JSON.stringify(info));
    }

    function notifyWhenAvailable(productId, email) {
        // Add to notification list
        const notifications = JSON.parse(localStorage.getItem('stockNotifications')) || {};
        if (!notifications[productId]) {
            notifications[productId] = [];
        }
        notifications[productId].push(email);
        localStorage.setItem('stockNotifications', JSON.stringify(notifications));
        
        showNotification("We'll notify you when this item is back in stock!");
    }

    function trackRecentlyViewed(product) {
        let recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
        // Remove if already exists
        recentlyViewed = recentlyViewed.filter(item => item.id !== product.id);
        // Add to front of array
        recentlyViewed.unshift(product);
        // Keep only last 5 items
        recentlyViewed = recentlyViewed.slice(0, 5);
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }

    function showSizeGuide(category) {
        const sizeGuides = {
            'clothing': {
                'S': ['36-38', '28-30', '34-36'],
                'M': ['38-40', '30-32', '36-38'],
                'L': ['40-42', '32-34', '38-40'],
                'XL': ['42-44', '34-36', '40-42']
            },
            'footwear': {
                'US': ['7', '8', '9', '10', '11', '12'],
                'UK': ['6', '7', '8', '9', '10', '11'],
                'EU': ['40', '41', '42', '43', '44', '45']
            }
        };
        
        // Show size guide modal with appropriate measurements
    }

    function checkForBundles(cart) {
        const bundles = {
            'streamer-pack': {
                items: ['Gaming Hoodie', 'Limited Edition Cap'],
                discount: 0.15  // 15% off when bought together
            }
        };
        
        // Check cart for bundle opportunities and apply discounts
    }

    function shareProduct(product, platform) {
        const shareUrls = {
            twitter: `https://twitter.com/intent/tweet?text=Check out ${product.name}&url=${window.location.href}`,
            facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
            pinterest: `https://pinterest.com/pin/create/button/?url=${window.location.href}&media=${product.image}&description=${product.name}`
        };
        
        window.open(shareUrls[platform], '_blank');
    }
});

class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.subtotal = 0;
        this.shipping = 0;
        this.tax = 0;
    }

    addItem(product, selectedOptions) {
        const cartItemId = `${product.id}-${selectedOptions.size}-${selectedOptions.color}`;
        const existingItem = this.items.find(item => item.cartItemId === cartItemId);
        
        if (existingItem) {
            const newQuantity = existingItem.quantity + selectedOptions.quantity;
            if (newQuantity <= product.options.maxQuantity) {
                existingItem.quantity = newQuantity;
            } else {
                showNotification(`Maximum quantity (${product.options.maxQuantity}) reached`);
                return;
            }
        } else {
            this.items.push({
                ...product,
                cartItemId,
                selectedSize: selectedOptions.size,
                selectedColor: selectedOptions.color,
                quantity: selectedOptions.quantity
            });
        }
        
        this.updateTotals();
        this.saveToLocalStorage();
    }

    removeItem(cartItemId) {
        this.items = this.items.filter(item => item.cartItemId !== cartItemId);
        this.updateTotals();
        this.saveToLocalStorage();
    }

    updateTotals() {
        this.subtotal = 0;
        this.tax = 0;
        this.shipping = 0;
        this.total = 0;
        
        if (this.items.length > 0) {
            this.subtotal = this.items.reduce((sum, item) => 
                sum + (item.price * item.quantity), 0);
            this.tax = this.subtotal * 0.1; // 10% tax
            this.shipping = this.subtotal > 100 ? 0 : 9.99;
            this.total = this.subtotal + this.tax + this.shipping;
        }
    }

    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
}

class ProductFilter {
    constructor(products) {
        this.products = products;
        this.filters = {
            creator: 'all',
            category: 'all',
            priceRange: 'all',
            sortBy: 'popular'
        };
    }

    applyFilters() {
        return this.products
            .filter(product => {
                if (this.filters.creator !== 'all' && 
                    product.creator !== this.filters.creator) return false;
                
                if (this.filters.category !== 'all' && 
                    product.category !== this.filters.category) return false;
                
                if (this.filters.priceRange !== 'all') {
                    const [min, max] = this.filters.priceRange.split('-');
                    if (min && product.price < parseFloat(min)) return false;
                    if (max && product.price > parseFloat(max)) return false;
                }
                
                return true;
            })
            .sort((a, b) => {
                switch(this.filters.sortBy) {
                    case 'price-low':
                        return a.price - b.price;
                    case 'price-high':
                        return b.price - a.price;
                    case 'newest':
                        return new Date(b.dateAdded) - new Date(a.dateAdded);
                    default:
                        return b.popularity - a.popularity;
                }
            });
    }
}

class CheckoutProcess {
    constructor(cart) {
        this.cart = cart;
        this.steps = ['cart', 'shipping', 'payment', 'confirmation'];
        this.currentStep = 0;
    }

    renderCheckoutStep() {
        const step = this.steps[this.currentStep];
        const checkoutContainer = document.getElementById('checkout-container');
        
        switch(step) {
            case 'cart':
                checkoutContainer.innerHTML = this.renderCartReview();
                break;
            case 'shipping':
                checkoutContainer.innerHTML = this.renderShippingForm();
                break;
            case 'payment':
                checkoutContainer.innerHTML = this.renderPaymentForm();
                break;
            case 'confirmation':
                checkoutContainer.innerHTML = this.renderOrderConfirmation();
                break;
        }
    }

    renderCartReview() {
        return `
            <div class="checkout-step">
                <h3>Order Review</h3>
                ${this.cart.items.map(item => `
                    <div class="cart-item">
                        <img src="${item.image}" alt="${item.name}">
                        <div class="item-details">
                            <h4>${item.name}</h4>
                            <p>Quantity: ${item.quantity}</p>
                            <p>Price: $${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    </div>
                `).join('')}
                <div class="order-summary">
                    <p>Subtotal: $${this.cart.subtotal.toFixed(2)}</p>
                    <p>Tax: $${this.cart.tax.toFixed(2)}</p>
                    <p>Shipping: $${this.cart.shipping.toFixed(2)}</p>
                    <h4>Total: $${this.cart.total.toFixed(2)}</h4>
                </div>
            </div>
        `;
    }
}

class ProductCategories {
    constructor() {
        this.categories = {
            clothing: {
                name: 'Clothing',
                subcategories: ['T-Shirts', 'Hoodies', 'Caps']
            },
            accessories: {
                name: 'Accessories',
                subcategories: ['Phone Cases', 'Bags', 'Stickers']
            },
            collectibles: {
                name: 'Collectibles',
                subcategories: ['Figures', 'Limited Editions', 'Signed Items']
            }
        };
    }

    renderCategoryFilters() {
        return `
            <div class="category-filters">
                <select class="form-select" id="category-main">
                    <option value="all">All Categories</option>
                    ${Object.entries(this.categories).map(([key, cat]) => `
                        <option value="${key}">${cat.name}</option>
                    `).join('')}
                </select>
                <select class="form-select mt-2" id="category-sub">
                    <option value="all">All Subcategories</option>
                </select>
            </div>
        `;
    }
}

class Wishlist {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('wishlist')) || [];
    }
    
    addItem(product) {
        if (!this.items.find(item => item.id === product.id)) {
            this.items.push(product);
            this.saveToStorage();
            showNotification('Added to wishlist!');
        }
    }
    
    removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.saveToStorage();
    }
    
    saveToStorage() {
        localStorage.setItem('wishlist', JSON.stringify(this.items));
    }
}