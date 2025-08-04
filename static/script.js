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

document.addEventListener("DOMContentLoaded", () => {
    const productosDinamicos = document.getElementById("productos-dinamicos");
    const productosGuardados = JSON.parse(localStorage.getItem("productos")) || [];

    productosGuardados.forEach(producto => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio}</p>
        <button onclick="agregarAlCarrito('${producto.nombre}')">Agregar al carrito</button>
    `;
    productosDinamicos.appendChild(div);
    });
});