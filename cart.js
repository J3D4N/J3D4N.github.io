const products = [
    { id: 1, name: 'Nasi Goreng', price: 15000 },
    { id: 2, name: 'Mie Goreng', price: 12000 },
    { id: 3, name: 'Ayam Goreng', price: 20000 },
    { id: 4, name: 'Sate Ayam', price: 25000 },
    { id: 5, name: 'Bakso', price: 18000 },
    { id: 6, name: 'Soto Ayam', price: 15000 },
    { id: 7, name: 'Soto Daging', price: 18000 },
    { id: 8, name: 'Rendang', price: 25000 },
    { id: 9, name: 'Nasi Campur', price: 12000 },
    { id: 10, name: 'Es Teh', price: 3000 },
    { id: 11, name: 'Es/Panas Jeruk', price: 4000 },
    { id: 12, name: 'Es/Panas Kopi', price: 5000 },
    { id: 13, name: 'Es/Panas Kopi Susu', price: 4000 },
    { id: 14, name: 'Es Degan', price: 8000 },
    { id: 15, name: 'Jus Alpukat', price: 10000 },
    { id: 16, name: 'Jus jambu', price: 10000 },
    { id: 17, name: 'Jus Apel', price: 10000 },
    { id: 18, name: 'Jus Buah Naga', price: 10000 },
    { id: 19, name: 'Kentang Goreng', price: 8000 },
    { id: 20, name: 'Makaroni', price: 6000 },
    { id: 21, name: 'Batagor', price: 15000 },
    { id: 22, name: 'Siomay', price: 15000 },
    { id: 23, name: 'Martabak Telur', price: 10000 },
    { id: 24, name: 'Martabak Manis', price: 8000 },
    { id: 25, name: 'Donat', price: 6000 },
    { id: 26, name: 'Pisang Goreng', price: 8000 },
    { id: 27, name: 'Roti Bakar', price: 10000 }
];

// Function to get cart items from localStorage
function getCartItems() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Function to save cart items to localStorage
function saveCartItems(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Function to add product to cart
function addToCart(productId) {
    const cart = getCartItems();
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCartItems(cart);
    alert('Produk telah ditambahkan ke keranjang!');
}

// Function to remove product from cart
function removeFromCart(productId) {
    let cart = getCartItems();
    cart = cart.filter(item => item.id !== productId);
    saveCartItems(cart);
    displayCartItems();
}

// Function to display cart items on the cart page
function displayCartItems() {
    const cart = getCartItems();
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalContainer = document.getElementById('cart-total');

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>Rp. ${item.price}</td>
            <td>${item.quantity}</td>
            <td>Rp. ${itemTotal}</td>
            <td><button onclick="removeFromCart(${item.id})">Hapus</button></td>
        `;
        cartItemsContainer.appendChild(row);
    });

    cartTotalContainer.textContent = `Rp. ${total}`;
}

// Function to handle order form submission
function handleOrderFormSubmit(event) {
    event.preventDefault();
    const customerName = document.getElementById('customer-name').value;
    const tableNumber = document.getElementById('table-number').value;
    const cart = getCartItems();

    if (cart.length === 0) {
        alert('Keranjang belanja kosong!');
        return;
    }

    // Kirim data ke server
    fetch('order.php', {  // Pastikan path ini sesuai dengan lokasi order.php
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            customerName,
            tableNumber,
            products: cart
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        if (data.message === 'Order placed successfully') {
            localStorage.removeItem('cart'); // Kosongkan keranjang setelah sukses
            displayCartItems(); // Refresh tampilan keranjang
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Event listener for the order form
document.getElementById('order-form').addEventListener('submit', handleOrderFormSubmit);

// Display cart items on page load
document.addEventListener('DOMContentLoaded', displayCartItems);
