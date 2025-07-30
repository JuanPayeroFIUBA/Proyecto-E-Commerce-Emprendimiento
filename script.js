let carrito = [];

function agregarAlCarrito(producto) {
    carrito.push(producto);
    actualizarCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById("lista-carrito");
    const contador = document.getElementById("cart-count");
    lista.innerHTML = "";

    carrito.forEach((producto, index) => {
    const item = document.createElement("li");
    item.textContent = producto;
    const btn = document.createElement("button");
    btn.textContent = "Eliminar";
    btn.onclick = () => eliminarDelCarrito(index);
    item.appendChild(btn);
    lista.appendChild(item);
    });

    contador.textContent = carrito.length;
}