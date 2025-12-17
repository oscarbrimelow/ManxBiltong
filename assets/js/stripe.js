// Stripe Checkout integration for Manx Biltong
// Using your provided publishable key (safe for frontend use)

const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SfLYA2LUsLs9WDkTuEWvZ4TEWnKWXqjexi93DzqD9jzBquaKxzXUKLlcyosbbmbuKildaAdKEVl27lPSOr7uvwV00xqBOobDV';

function stripeRedirect(cart, region) {
    // Prepare line items for Stripe
    const products = window.MANX_CONFIG.products;
    const lineItems = cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return {
            price_data: {
                currency: 'gbp',
                product_data: { name: product.name },
                unit_amount: Math.round(product.price * 100),
            },
            quantity: item.qty,
        };
    });
    // Use Stripe Checkout Session via serverless function or 3rd party (for static sites)
    // For demo: alert and show what would be sent
    alert('Stripe Checkout would be launched with: ' + JSON.stringify(lineItems));
    // In production, use fetch to your backend to create a session, then redirect:
    // fetch('/create-checkout-session', { method: 'POST', body: JSON.stringify({lineItems, region}) })
    //   .then(res => res.json())
    //   .then(data => Stripe(STRIPE_PUBLISHABLE_KEY).redirectToCheckout({ sessionId: data.id }));
}

window.stripeRedirect = stripeRedirect;
