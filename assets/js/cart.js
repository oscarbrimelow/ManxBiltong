// Cart logic for Manx Biltong
// Uses MANX_CONFIG for products, region, and ordering controls

const CART_KEY = 'manx_cart';

function getCart() {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
}

function setCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function renderCart() {
    const cart = getCart();
    const products = window.MANX_CONFIG.products;
    const maxQty = window.MANX_CONFIG.maxOrderQuantity;
    const cartItemsDiv = document.getElementById('cart-items');
    const summaryDiv = document.getElementById('cart-summary');
    const actionsDiv = document.getElementById('cart-actions');
    cartItemsDiv.innerHTML = '';
    summaryDiv.innerHTML = '';
    actionsDiv.innerHTML = '';

    if (!window.MANX_CONFIG.orderingEnabled) {
        cartItemsDiv.innerHTML = '<p>Ordering is currently disabled. Please check back later.</p>';
        return;
    }

    if (!cart.length) {
        cartItemsDiv.innerHTML = '<p>Your cart is empty.</p>';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        const itemTotal = product.price * item.qty;
        total += itemTotal;
        cartItemsDiv.innerHTML += `
            <div class="cart-item">
                <span>${product.name}</span>
                <span>£${product.price.toFixed(2)}</span>
                <input type="number" min="1" max="${maxQty}" value="${item.qty}" data-id="${item.id}" class="cart-qty">
                <button data-id="${item.id}" class="remove-item">Remove</button>
            </div>
        `;
    });
    summaryDiv.innerHTML = `<h2>Total: £${total.toFixed(2)}</h2>`;
    actionsDiv.innerHTML = `<button id="checkout-btn">Checkout</button>`;

    // Quantity change
    document.querySelectorAll('.cart-qty').forEach(input => {
        input.addEventListener('change', e => {
            let qty = parseInt(e.target.value, 10);
            if (qty > maxQty) {
                window.location.href = '../contact/index.html?reason=bulk';
                return;
            }
            updateCartQty(e.target.dataset.id, qty);
        });
    });
    // Remove item
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', e => {
            removeFromCart(e.target.dataset.id);
        });
    });
    // Checkout
    document.getElementById('checkout-btn').onclick = checkout;
}

function updateCartQty(id, qty) {
    let cart = getCart();
    cart = cart.map(item => item.id === id ? { ...item, qty } : item);
    setCart(cart);
    renderCart();
}

function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    setCart(cart);
    renderCart();
}

function checkout() {
    // Region check (client-side)
    const region = prompt('Enter your shipping country code (e.g., IM for Isle of Man):', 'IM');
    if (!window.MANX_CONFIG.allowedRegions.includes(region)) {
        alert('Sorry, we only deliver to: ' + window.MANX_CONFIG.allowedRegions.join(', '));
        return;
    }
    const cart = getCart();
    // Prepare cart for API (include name/price)
    const products = window.MANX_CONFIG.products;
    const cartForApi = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return {
            name: product ? product.name : item.id,
            price: product ? product.price : 0,
            qty: item.qty
        };
    });
    fetch('https://manx-biltong-vercel.vercel.app/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart: cartForApi, region })
    })
    .then(res => res.json())
    .then(data => {
        if (data.id) {
            // Redirect to Stripe Checkout
            window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
        } else {
            alert(data.error || 'Checkout failed.');
        }
    })
    .catch(err => {
        alert('Checkout error: ' + err.message);
    });
}

document.addEventListener('DOMContentLoaded', renderCart);
