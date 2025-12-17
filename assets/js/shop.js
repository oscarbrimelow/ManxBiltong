// Shop page logic for adding to cart
// Uses MANX_CONFIG for products

function addToCart(id, qty = 1) {
    const CART_KEY = 'manx_cart';
    let cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty += qty;
    } else {
        cart.push({ id, qty });
    }
    // Enforce max quantity
    const maxQty = window.MANX_CONFIG.maxOrderQuantity;
    cart = cart.map(item => {
        if (item.qty > maxQty) {
            item.qty = maxQty;
        }
        return item;
    });
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    alert('Added to cart!');
}

// Render shop products
function renderShop() {
    const products = window.MANX_CONFIG.products.filter(p => p.available);
    const shopDiv = document.getElementById('shop-products');
    if (!shopDiv) return;
    shopDiv.innerHTML = '';
    products.forEach(product => {
        shopDiv.innerHTML += `
            <div class="product-card">
                <h3>${product.name}</h3>
                <p>£${product.price.toFixed(2)}</p>
                <input type="number" min="1" max="${window.MANX_CONFIG.maxOrderQuantity}" value="1" id="qty-${product.id}">
                <button onclick="addToCart('${product.id}', parseInt(document.getElementById('qty-${product.id}').value, 10))">Add to Cart</button>
            </div>
        `;
    });
}

document.addEventListener('DOMContentLoaded', renderShop);
