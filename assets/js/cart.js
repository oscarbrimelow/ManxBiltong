// Cart logic for Manx Biltong
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
        cartItemsDiv.innerHTML = '<p style="font-size: 16px; color: #666;">Ordering is currently disabled. Please check back later.</p>';
        return;
    }

    if (!cart.length) {
        cartItemsDiv.innerHTML = '<p style="font-size: 16px; color: #666; margin: 40px 0;">Your cart is empty. <a href="/products/" style="color: #8c2f2f; font-weight: 600;">Continue shopping</a></p>';
        return;
    }

    let total = 0;
    let cartHTML = '<div style="display: flex; flex-direction: column; gap: 20px;">';
    
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        if (!product) return;
        const itemTotal = product.price * item.qty;
        total += itemTotal;
        cartHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #e8dcc8; background: #faf8f5;">
                <div>
                    <div style="font-weight: 600; font-size: 16px; color: #2b2b2b;">${product.name}</div>
                    <div style="color: #999; font-size: 14px; margin-top: 5px;">£${product.price.toFixed(2)} each</div>
                </div>
                <div style="display: flex; align-items: center; gap: 15px;">
                    <input type="number" min="1" max="${maxQty}" value="${item.qty}" data-id="${item.id}" class="cart-qty" style="width: 60px; padding: 8px; border: 1px solid #d0c0b0; border-radius: 4px; font-size: 14px;">
                    <div style="width: 100px; text-align: right;">
                        <div style="font-weight: 600; color: #8c2f2f; font-size: 16px;">£${itemTotal.toFixed(2)}</div>
                    </div>
                    <button data-id="${item.id}" class="remove-item" style="background: #e8dcc8; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; color: #8c2f2f; font-size: 14px; font-weight: 500;">Remove</button>
                </div>
            </div>
        `;
    });
    cartHTML += '</div>';
    cartItemsDiv.innerHTML = cartHTML;
    
    summaryDiv.innerHTML = `<div style="text-align: right; padding: 30px 0; border-top: 2px solid #8c2f2f; margin-top: 20px;"><div style="font-size: 24px; font-weight: 700; color: #8c2f2f;">Total: £${total.toFixed(2)}</div></div>`;
    actionsDiv.innerHTML = `<div style="display: flex; gap: 10px; margin-top: 20px;"><button id="checkout-btn" style="flex: 1; background: #8c2f2f; color: white; padding: 14px; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer; transition: background 0.3s;">Proceed to Checkout</button><a href="/products/" style="flex: 1; background: #e8dcc8; color: #8c2f2f; padding: 14px; border: none; border-radius: 4px; font-size: 16px; font-weight: 600; cursor: pointer; text-align: center; text-decoration: none; display: flex; align-items: center; justify-content: center;">Continue Shopping</a></div>`;

    // Quantity change
    document.querySelectorAll('.cart-qty').forEach(input => {
        input.addEventListener('change', e => {
            let qty = parseInt(e.target.value, 10);
            if (qty > maxQty) {
                alert('Maximum order quantity is ' + maxQty + '. For larger orders, please contact us.');
                e.target.value = item.qty;
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
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.onclick = checkout;
    }
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
    const cart = getCart();
    if (!cart.length) {
        alert('Your cart is empty.');
        return;
    }
    
    // Prepare cart for API
    const products = window.MANX_CONFIG.products;
    const cartForApi = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return {
            name: product ? product.name : item.id,
            price: product ? product.price : 0,
            qty: item.qty
        };
    });
    
    const region = 'IM';
    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.disabled = true;
    checkoutBtn.textContent = 'Processing...';
    
    fetch('https://manx-biltong-vercel.vercel.app/api/create-checkout-session', {
        method: 'POST',
        mode: 'cors',
        headers: { 
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cart: cartForApi, region })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(data => { throw new Error(data.error || `HTTP error! status: ${res.status}`); });
        }
        return res.json();
    })
    .then(data => {
        if (data.id) {
            window.location.href = `https://checkout.stripe.com/pay/${data.id}`;
        } else {
            throw new Error(data.error || 'No session ID returned');
        }
    })
    .catch(err => {
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = 'Proceed to Checkout';
        alert('Checkout error: ' + err.message + '. Please try again or contact us.');
    });
}

document.addEventListener('DOMContentLoaded', renderCart);
