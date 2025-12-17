// Site-wide config for ordering, regions, and products
window.MANX_CONFIG = {
    orderingEnabled: true,
    allowedRegions: ['IM'],
    adminEmail: 'orders@manxbiltong.com',
    products: [
        { id: 'biltong-sliced', name: 'Manx Biltong Sliced', price: 5.00, available: true },
        { id: 'biltong-chilli-sliced', name: 'Manx Biltong Chilli Sliced', price: 5.00, available: true },
        { id: 'stokkies', name: 'Manx Stokkies Biltong', price: 5.00, available: true },
        { id: 'chilli-stokkies', name: 'Manx Chilli Stokkies', price: 5.00, available: true }
    ],
    maxOrderQuantity: 15
};
