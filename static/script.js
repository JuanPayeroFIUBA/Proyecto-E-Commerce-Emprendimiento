let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

function agregarAlCarrito(producto) {
    carrito.push(producto);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    localStorage.setItem("carrito", JSON.stringify(carrito));
    actualizarCarrito();
}

function realizarCompra() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    fetch("http://127.0.0.1:5000/api/crear-preferencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productos: carrito })
    })
    .then(res => res.json())
    .then(data => {
        window.location.href = `https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=${data.id}`;
    });
}

function actualizarCarrito() {
    const contenido = document.getElementById("contenido-carrito");
    const totalSpan = document.getElementById("total-carrito");
    const cantidadSpan = document.getElementById("cantidad-carrito");

    contenido.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
            ${producto.nombre} - $${producto.precio}
            <button onclick="eliminarDelCarrito(${index})">Eliminar</button>
        `;
        contenido.appendChild(div);
        total += producto.precio;
    });

    totalSpan.textContent = total.toFixed(2);
    cantidadSpan.textContent = carrito.length;
}

document.addEventListener("DOMContentLoaded", () => {
    actualizarCarrito();

    fetch("http://127.0.0.1:5000/api/productos")
        .then(res => res.json())
        .then(data => {
            const contenedor = document.getElementById("productos");
            contenedor.innerHTML = "";

            data.forEach(producto => {
                const div = document.createElement("div");
                div.innerHTML = `
                    <img src="${producto.imagen}" alt="${producto.nombre}" style="width: 100px;">
                    <h3>${producto.nombre}</h3>
                    <p>$${producto.precio}</p>
                    <button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Agregar al carrito</button>
                `;
                contenedor.appendChild(div);
            });
    });
});
