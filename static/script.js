let cart = JSON.parse(localStorage.getItem("carrito")) || [];
const API_URL = "http://127.0.0.1:5000/api";

function saveCart() {
    localStorage.setItem("carrito", JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.cantidad, 0);
    document.getElementById("cantidad-carrito").textContent = count;
}

async function loadProducts() {
    try {
        const res = await fetch(`${API_URL}/productos`);
        const products = await res.json();
        renderProducts(products);
    } catch (error) {
        console.error("Error cargando productos:", error);
    }
}

function renderProducts(products) {
    const productList = document.getElementById('product-list');
    productList.innerHTML = "";

    products.forEach(product => {
        const card = document.createElement('div');
        card.classList.add('product-card');

        card.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}">
            <h3>${product.nombre}</h3>
            <p class="price">$${product.precio.toLocaleString()}</p>
            <button class="add-to-cart">Agregar al carrito</button>
        `;

        card.querySelector('.add-to-cart').addEventListener('click', () => {
            addToCart(product);
        });

        productList.appendChild(card);
    });
}

function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
        existing.cantidad += 1;
    } else {
        cart.push({ ...product, cantidad: 1 });
    }
    saveCart();
    renderCart();
}

function decreaseFromCart(id) {
    const item = cart.find(p => p.id === id);
    if (!item) return;
    if (item.cantidad > 1) {
        item.cantidad -= 1;
    } else {
        cart = cart.filter(p => p.id !== id);
    }
    saveCart();
    renderCart();
}

function removeFromCart(id) {
    cart = cart.filter(p => p.id !== id);
    saveCart();
    renderCart();
}

document.getElementById('clear-cart').addEventListener('click', () => {
    if (confirm("¿Vaciar carrito?")) {
        cart = [];
        saveCart();
        renderCart();
    }
});

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        total += item.precio * item.cantidad;
        const li = document.createElement('li');

        li.innerHTML = `
            ${item.nombre} - $${item.precio.toLocaleString()} x ${item.cantidad}
            <div>
                <button onclick="decreaseFromCart(${item.id})">-</button>
                <button onclick="addToCart(${JSON.stringify(item)})">+</button>
                <button onclick="removeFromCart(${item.id})">Eliminar</button>
            </div>
        `;

        cartItems.appendChild(li);
    });

    cartTotal.textContent = `$${total.toLocaleString()}`;
    updateCartCount();
}

document.getElementById('checkout-btn').addEventListener('click', async () => {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    try {
        const res = await fetch(`${API_URL}/crear-preferencia`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productos: cart })
        });

        const data = await res.json();

        if (data.id) {
            window.location.href = `https://sandbox.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.id}`;
        } else {
            alert("Error al crear preferencia");
        }
    } catch (error) {
        console.error("Error en el checkout:", error);
    }
});

document.querySelector("#contacto form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = e.target.querySelector('input[type="text"]').value;
    const email = e.target.querySelector('input[type="email"]').value;
    const mensaje = e.target.querySelector('textarea').value;

    try {
        const res = await fetch(`${API_URL}/contacto`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email, mensaje })
        });

        const data = await res.json();
        if (res.ok) {
            alert("✅ Mensaje enviado correctamente");
            e.target.reset();
        } else {
            alert("❌ " + (data.error || "Error al enviar mensaje"));
        }
    } catch (error) {
        console.error("Error enviando mensaje:", error);
        alert("❌ Error en el servidor");
    }
});


loadProducts();
renderCart();
