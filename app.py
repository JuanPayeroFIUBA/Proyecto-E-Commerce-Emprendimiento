from flask import Flask, request, jsonify
import sqlite3
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


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


if __name__ == "__main__":
    app.run(debug=True)
