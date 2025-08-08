from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS
import mercadopago

app = Flask(__name__)
CORS(app)

sdk = mercadopago.SDK(
    "TEST-3203011341687694-080615-c85782acdf7dbb3fa1ef300022fed20c-1111842971"
)


def init_db():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        """
        CREATE TABLE IF NOT EXISTS productos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            precio REAL NOT NULL,
            imagen TEXT NOT NULL
        )
    """
    )
    conn.commit()
    conn.close()


init_db()


@app.route("/api/productos", methods=["GET"])
def get_productos():
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("SELECT * FROM productos")
    productos = [
        {"id": row[0], "nombre": row[1], "precio": row[2], "imagen": row[3]}
        for row in c.fetchall()
    ]
    conn.close()
    return jsonify(productos)


@app.route("/api/productos", methods=["POST"])
def add_producto():
    data = request.json
    nombre = data.get("nombre")
    precio = data.get("precio")
    imagen = data.get("imagen")

    if not nombre or not precio or not imagen:
        return jsonify({"error": "Datos incompletos"}), 400

    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute(
        "INSERT INTO productos (nombre, precio, imagen) VALUES (?, ?, ?)",
        (nombre, precio, imagen),
    )
    conn.commit()
    conn.close()
    return jsonify({"mensaje": "Producto agregado correctamente"}), 201


@app.route("/api/productos/<int:id>", methods=["DELETE"])
def delete_producto(id):
    conn = sqlite3.connect("database.db")
    c = conn.cursor()
    c.execute("DELETE FROM productos WHERE id = ?", (id,))
    conn.commit()
    conn.close()
    return jsonify({"mensaje": "Producto eliminado"}), 200


@app.route("/api/crear-preferencia", methods=["POST"])
def crear_preferencia():
    ngrok_url = "https://4b17d96633da.ngrok-free.app"

    datos = request.json

    items = []
    for producto in datos["productos"]:
        items.append(
            {
                "title": producto["nombre"],
                "quantity": 1,
                "unit_price": float(producto["precio"]),
                "currency_id": "ARS",
            }
        )
    # for producto in datos["productos"]:
    #    print("DEBUG producto recibido:", producto)
    #    items.append(
    #        {
    #            "title": producto["title"],
    #            "quantity": int(producto["quantity"]),
    #            "unit_price": float(producto["unit_price"]),
    #            "currency_id": "ARS",
    #        }
    #    )

    preferencia_data = {
        "items": [
            {
                "title": producto["nombre"],
                "quantity": 1,
                "unit_price": float(producto["precio"]),
                "currency_id": "ARS",
            }
        ],
        "back_urls": {
            "success": f"{ngrok_url}/compra-exitosa.html",
            "failure": f"{ngrok_url}/compra-fallida.html",
            "pending": f"{ngrok_url}/compra-pendiente.html",
        },
        "auto_return": "approved",
    }

    try:
        print("Datos enviados a Mercado Pago:", preferencia_data)
        preferencia = sdk.preference().create(preferencia_data)
        print("Respuesta de Mercado Pago:", preferencia)
        return jsonify({"id": preferencia["response"]["id"]})
    except Exception as e:
        print("Error al crear preferencia:", e)
        return jsonify({"error": "No se pudo crear la preferencia"}), 500


if __name__ == "__main__":
    app.run(debug=True)
