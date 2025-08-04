const adminUser = "nacho_admin";
const adminPass = "soy_admin";

function login() {
    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("contrasena").value;
    const error = document.getElementById("login-error");

    if (user === adminUser && pass === adminPass) {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    } else {
    error.textContent = "Usuario o contraseña incorrectos.";
    }
}
function mostrarProductosAdmin() {
    const vista = document.getElementById("vista-previa");
    vista.innerHTML = "";

    const productos = JSON.parse(localStorage.getItem("productos")) || [];

    productos.forEach((producto, index) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio}</p>
        <button onclick="eliminarProducto(${index})">Eliminar</button>
    `;
    vista.appendChild(div);
    });
}

function eliminarProducto(index) {
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.splice(index, 1);
    localStorage.setItem("productos", JSON.stringify(productos));
    mostrarProductosAdmin();
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-producto");
    const vista = document.getElementById("vista-previa");

    form.addEventListener("submit", function (e) {
    e.preventDefault();
    const nombre = document.getElementById("nombre").value;
    const precio = document.getElementById("precio").value;
    const imagen = document.getElementById("imagen").value;

    const producto = { nombre, precio, imagen };
    const productos = JSON.parse(localStorage.getItem("productos")) || [];
    productos.push(producto);
    localStorage.setItem("productos", JSON.stringify(productos));

    const nuevoProducto = document.createElement("div");
    nuevoProducto.className = "producto";
    nuevoProducto.innerHTML = `
        <img src="${imagen}" alt="${nombre}">
        <h3>${nombre}</h3>
        <p>$${precio}</p>
        <button onclick="agregarAlCarrito('${nombre}')">Agregar al carrito</button>
    `;

    vista.appendChild(nuevoProducto);

    form.reset();
    mostrarProductosAdmin();
    });
});