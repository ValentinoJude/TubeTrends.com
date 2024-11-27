document.addEventListener('DOMContentLoaded', function() {
    // Sample product data
    const products = [
        {
            id: 1,
            name: "Creator Gaming Hoodie",
            price: 49.99,
            image: "images/merch/hoodie.jpg",
            creator: "pewdiepie",
            category: "clothing"
        },
        {
            id: 2,
            name: "Limited Edition Cap",
            price: 24.99,
            image: "images/merch/cap.jpg",
            creator: "markiplier",
            category: "accessories"
        },
        {
            id: 3,
            name: "Collector's Edition Figure",
            price: 79.99,
            image: "images/merch/figure.jpg",
            creator: "mrbeast",
            category: "collectibles"
        },
        {
            id: 4,
            name: "Premium T-Shirt",
            price: 29.99,
            image: "images/merch/tshirt.jpg",
            creator: "pewdiepie",
            category: "clothing"
        },
        {
            id: 5,
            name: "Phone Case",
            price: 19.99,
            image: "images/merch/phonecase.jpg",
            creator: "markiplier",
            category: "accessories"
        },
        {
            id: 6,
            name: "Signed Poster",
            price: 39.99,
            image: "images/merch/poster.jpg",
            creator: "mrbeast",
            category: "collectibles"
        }
    ];

    let cart = [];

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
                        <div class="d-flex justify-content-between align-items-center">
                            <button class="btn btn-danger add-to-cart" data-id="${product.id}">
                                Add to Cart
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
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }
            updateCart();
            showNotification('Added to cart!');
        }
    }

    // Update cart display
    function updateCart() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');
        const cartIcon = document.querySelector('.cart-icon');
        
        // Update cart items
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item mb-3">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-0">${item.name}</h6>
                        <small class="text-muted">$${item.price.toFixed(2)} × ${item.quantity}</small>
                    </div>
                    <div class="d-flex align-items-center">
                        <span class="me-3">$${(item.price * item.quantity).toFixed(2)}</span>
                        <button class="btn btn-sm btn-outline-danger remove-from-cart" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Update total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;

        // Update cart icon
        const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartIcon.setAttribute('data-count', itemCount);
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
            const productId = parseInt(e.target.closest('.remove-from-cart').dataset.id);
            cart = cart.filter(item => item.id !== productId);
            updateCart();
            showNotification('Removed from cart!');
        }
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Thank you for your purchase!');
        cart = [];
        updateCart();
    });
});