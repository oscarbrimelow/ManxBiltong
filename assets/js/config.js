// Site-wide config for ordering, regions, and products
window.MANX_CONFIG = {
    orderingEnabled: true,
    allowedRegions: ['IM'], // 'IM' = Isle of Man, 'GB' = UK, add more as needed
    adminEmail: 'your@email.com',
    products: [
        // Example product structure
        { id: 'biltong-original', name: 'Original Biltong', price: 4.99, available: true },
        { id: 'biltong-chilli', name: 'Chilli Biltong', price: 5.49, available: true },
        { id: 'biltong-garlic', name: 'Garlic Biltong', price: 5.49, available: true }
    ],
    maxOrderQuantity: 15
};
