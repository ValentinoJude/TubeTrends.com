// Initialize an empty cart array
let cart = [];

// Function to add items to the cart
function addToCart(button) {
  // Get the product details
  let productElement = button.parentElement;
  let productName = productElement.querySelector('h3').innerText;
  let productPrice = parseFloat(productElement.querySelector('.price').innerText.replace('Price: $', ''));
  let productSize = productElement.querySelector('#size').value;
  let productQuantity = parseInt(productElement.querySelector('#quantity').value);

  // Create an object representing the item
  let cartItem = {
    name: productName,
    price: productPrice,
    size: productSize,
    quantity: productQuantity
  };

  // Add the item to the cart
  cart.push(cartItem);
  updateCartDisplay();
  updateCartBadge();
}

// Function to update the cart display in the modal
function updateCartDisplay() {
  let cartItemsElement = document.getElementById('cart-items-modal');
  
  if (cart.length === 0) {
    cartItemsElement.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cartItemsElement.innerHTML = '';
    let total = 0;

    // Loop through the cart and display each item
    cart.forEach(item => {
      let itemTotal = item.price * item.quantity;
      total += itemTotal;

      cartItemsElement.innerHTML += `
        <div class="cart-item">
          <p>${item.name} (Size: ${item.size}) - ${item.quantity} x $${item.price} = $${itemTotal.toFixed(2)}</p>
        </div>
      `;
    });

    // Display the total amount
    cartItemsElement.innerHTML += <p>Total: $${total.toFixed(2)}</p>;
  }
}

// Function to update the cart badge with the number of items
function updateCartBadge() {
  document.getElementById('cart-count').innerText = cart.length;
}

// Function to toggle the cart modal
function toggleCartModal() {
  let modal = document.getElementById('cart-modal');
  let overlay = document.getElementById('modal-overlay');
  
  if (modal.style.display === 'block') {
    modal.style.display = 'none';
    overlay.style.display = 'none';
  } else {
    modal.style.display = 'block';
    overlay.style.display = 'block';
  }
}

// Function to handle checkout
function checkout() {
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  // Here you would normally handle the payment and order processing.
  alert('Proceeding to payment gateway...');
  
  // Clear the cart after checkout
  cart = [];
  updateCartDisplay();
  updateCartBadge();
  toggleCartModal();
}