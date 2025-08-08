const adminUser = "nacho_admin";
const adminPass = "1234";
const apiUrl = "http://localhost:5000/api/productos";

function mostrarPanelAdmin() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("admin-panel").style.display = "block";
    cargarProductosAdmin();
}

function login() {
    const user = document.getElementById("usuario").value;
    const pass = document.getElementById("contrasena").value;
    const error = document.getElementById("login-error");

    if (user === "nacho_admin" && pass === "1234") {
        sessionStorage.setItem("adminLogueado", "true");
        mostrarPanelAdmin();
    } else {
        error.textContent = "Usuario o contraseña incorrectos.";
    }
}

async function cargarProductosAdmin() {
    const vista = document.getElementById("vista-previa");
    vista.innerHTML = "";

    const res = await fetch(apiUrl);
    const productos = await res.json();

    productos.forEach(producto => {
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <h3>${producto.nombre}</h3>
        <p>$${producto.precio}</p>
        <button onclick='agregarAlCarrito(${JSON.stringify(producto)})'>Agregar al carrito</button>
    `;
    vista.appendChild(div);
    });
}

async function eliminarProducto(id) {
    await fetch(`${apiUrl}/${id}`, {method: "DELETE"});
    cargarProductosAdmin();
}

//function mostrarProductosAdmin() {
//    const vista = document.getElementById("vista-previa");
//    vista.innerHTML = "";
//
//    const productos = JSON.parse(localStorage.getItem("productos")) || [];
//
//    productos.forEach((producto, index) => {
//    const div = document.createElement("div");
//    div.className = "producto";
//    div.innerHTML = `
//        <img src="${producto.imagen}" alt="${producto.nombre}">
//        <h3>${producto.nombre}</h3>
//        <p>$${producto.precio}</p>
//        <button onclick="eliminarProducto(${index})">Eliminar</button>
//    `;
//    vista.appendChild(div);
//    });
//}

//function eliminarProducto(index) {
//    const productos = JSON.parse(localStorage.getItem("productos")) || [];
//    productos.splice(index, 1);
//    localStorage.setItem("productos", JSON.stringify(productos));
//    mostrarProductosAdmin();
//}

document.addEventListener("DOMContentLoaded", () => {
    if (sessionStorage.getItem("adminLogueado") === "true") {
        mostrarPanelAdmin();
    }
    const form = document.getElementById("form-producto");
    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const precio = parseFloat(document.getElementById("precio").value);
        const imagen = document.getElementById("imagen").value;
        
        const nuevoProducto = { nombre, precio, imagen };
        
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(nuevoProducto)
        });
    
        form.reset();
        cargarProductosAdmin();
    });
});