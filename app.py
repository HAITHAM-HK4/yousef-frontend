import json
import os
import sqlite3
from datetime import datetime

import bcrypt
from flask import Flask, g, jsonify, request

try:
    from flask_cors import CORS
except ImportError:
    class CORS:
        def __init__(self, app, **kwargs): pass

app = Flask(__name__)
CORS(app, origins="*")

DB_PATH = os.path.join(os.path.dirname(__file__), 'yousef.db')


def get_db():
    db = sqlite3.connect(DB_PATH)
    db.row_factory = sqlite3.Row
    return db


def init_db():
    db = get_db()
    cur = db.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id       INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        )
    """)

    cur.execute("SELECT id FROM users WHERE username = 'admin'")
    if not cur.fetchone():
        hashed = bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode()
        cur.execute("INSERT INTO users (username, password) VALUES ('admin', ?)", (hashed,))

    cur.execute("""
        CREATE TABLE IF NOT EXISTS services (
            id           INTEGER PRIMARY KEY AUTOINCREMENT,
            name         TEXT NOT NULL,
            price_normal REAL DEFAULT 0,
            price_urgent REAL DEFAULT 0,
            visible      INTEGER DEFAULT 1
        )
    """)

    cur.execute("SELECT COUNT(*) FROM services")
    if cur.fetchone()[0] == 0:
        default_services = [
            ("بيان قيد",        50000,  75000),
            ("نقل ملكية",       200000, 300000),
            ("رفع حجز",         150000, 225000),
            ("تسجيل عقد",       100000, 150000),
            ("استعلام عقاري",   30000,  45000),
            ("توكيل عقاري",     80000,  120000),
        ]
        cur.executemany(
            "INSERT INTO services (name, price_normal, price_urgent) VALUES (?, ?, ?)",
            default_services
        )

    cur.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            name            TEXT,
            mother          TEXT,
            national_id     TEXT,
            registration_no TEXT,
            property_no     TEXT,
            location        TEXT,
            service_type    TEXT,
            price           REAL,
            urgent          INTEGER DEFAULT 0,
            created_at      TEXT DEFAULT (datetime('now'))
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS tracking (
            property_no TEXT PRIMARY KEY,
            steps       TEXT,
            created_at  TEXT DEFAULT (datetime('now')),
            updated_at  TEXT DEFAULT (datetime('now'))
        )
    """)

    db.commit()
    db.close()


# ══ تسجيل الدخول ══
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"success": False, "message": "أدخل اسم المستخدم وكلمة السر"})

    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    db.close()

    if not user:
        return jsonify({"success": False, "message": "اسم المستخدم غير صحيح"})

    if bcrypt.checkpw(password.encode(), user["password"].encode()):
        return jsonify({"success": True, "message": "تم تسجيل الدخول"})

    return jsonify({"success": False, "message": "كلمة السر غير صحيحة"})


# ══ تغيير كلمة السر ══
@app.route("/change-password", methods=["POST"])
def change_password():
    data = request.get_json()
    username = data.get("username", "").strip()
    old_pass = data.get("oldPassword", "").strip()
    new_pass = data.get("newPassword", "").strip()

    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()

    if not user or not bcrypt.checkpw(old_pass.encode(), user["password"].encode()):
        db.close()
        return jsonify({"success": False, "message": "كلمة السر القديمة غير صحيحة"})

    hashed = bcrypt.hashpw(new_pass.encode(), bcrypt.gensalt()).decode()
    db.execute("UPDATE users SET password = ? WHERE username = ?", (hashed, username))
    db.commit()
    db.close()
    return jsonify({"success": True, "message": "تم تغيير كلمة السر"})


# ══ الخدمات ══
@app.route("/services", methods=["GET"])
def get_services():
    db = get_db()
    rows = db.execute("SELECT * FROM services ORDER BY id").fetchall()
    db.close()
    return jsonify([dict(r) for r in rows])


@app.route("/services/<int:sid>", methods=["PUT"])
def update_service(sid):
    data = request.get_json()
    db = get_db()
    db.execute(
        "UPDATE services SET name=?, price_normal=?, price_urgent=?, visible=? WHERE id=?",
        (data.get("name"), data.get("price_normal"), data.get("price_urgent"), data.get("visible", 1), sid)
    )
    db.commit()
    db.close()
    return jsonify({"success": True})


@app.route("/services/<int:sid>", methods=["DELETE"])
def delete_service(sid):
    db = get_db()
    db.execute("DELETE FROM services WHERE id = ?", (sid,))
    db.commit()
    db.close()
    return jsonify({"success": True})


@app.route("/services", methods=["POST"])
def add_service():
    data = request.get_json()
    db = get_db()
    db.execute(
        "INSERT INTO services (name, price_normal, price_urgent, visible) VALUES (?,?,?,?)",
        (data.get("name"), data.get("price_normal", 0), data.get("price_urgent", 0), data.get("visible", 1))
    )
    db.commit()
    db.close()
    return jsonify({"success": True})


# ══ الطلبات ══
@app.route("/orders", methods=["GET"])
def get_orders():
    db = get_db()
    rows = db.execute("SELECT * FROM orders ORDER BY created_at DESC").fetchall()
    db.close()
    return jsonify([dict(r) for r in rows])


@app.route("/orders", methods=["POST"])
def add_order():
    data = request.get_json()
    db = get_db()
    db.execute("""
        INSERT INTO orders
            (name, mother, national_id, registration_no, property_no, location, service_type, price, urgent)
        VALUES (?,?,?,?,?,?,?,?,?)
    """, (
        data.get("name"), data.get("mother"), data.get("national_id"),
        data.get("registration_no"), data.get("property_no"), data.get("location"),
        data.get("service_type"), data.get("price"), data.get("urgent", 0)
    ))
    db.commit()
    db.close()
    return jsonify({"success": True, "message": "تم حفظ الطلب"})


@app.route("/orders/<int:oid>", methods=["DELETE"])
def delete_order(oid):
    db = get_db()
    db.execute("DELETE FROM orders WHERE id = ?", (oid,))
    db.commit()
    db.close()
    return jsonify({"success": True})


# ══ الإحصائيات ══
@app.route("/stats", methods=["GET"])
def get_stats():
    db = get_db()
    today = datetime.now().strftime("%Y-%m-%d")

    total       = db.execute("SELECT COUNT(*) FROM orders").fetchone()[0]
    today_count = db.execute("SELECT COUNT(*) FROM orders WHERE date(created_at) = ?", (today,)).fetchone()[0]
    urgent      = db.execute("SELECT COUNT(*) FROM orders WHERE urgent = 1").fetchone()[0]
    revenue     = db.execute("SELECT COALESCE(SUM(price), 0) FROM orders").fetchone()[0]

    db.close()
    return jsonify({
        "totalOrders":  total,
        "todayOrders":  today_count,
        "urgentOrders": urgent,
        "totalRevenue": float(revenue)
    })


# ══ التتبع ══
DEFAULT_STEPS = [{"id": i+1, "status": "pending", "date": None} for i in range(16)]


@app.route("/tracking", methods=["GET"])
def get_all_tracking():
    db = get_db()
    rows = db.execute("SELECT * FROM tracking ORDER BY updated_at DESC").fetchall()
    db.close()
    result = []
    for r in rows:
        row = dict(r)
        try:
            row["steps"] = json.loads(row["steps"])
        except Exception:
            row["steps"] = DEFAULT_STEPS
        result.append(row)
    return jsonify(result)


@app.route("/tracking/<path:property_no>", methods=["GET"])
def get_tracking(property_no):
    db = get_db()
    row = db.execute("SELECT * FROM tracking WHERE property_no = ?", (property_no,)).fetchone()
    db.close()

    if not row:
        return jsonify({"success": False, "message": "غير موجود"})

    try:
        steps = json.loads(row["steps"])
    except Exception:
        steps = DEFAULT_STEPS

    return jsonify({"success": True, "steps": steps, "property_no": property_no})


@app.route("/tracking", methods=["POST"])
def create_tracking():
    data = request.get_json()
    property_no = data.get("property_no", "").strip()
    steps = json.dumps(data.get("steps", DEFAULT_STEPS))
    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    db = get_db()
    db.execute("""
        INSERT INTO tracking (property_no, steps, created_at, updated_at)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(property_no) DO UPDATE SET steps=excluded.steps, updated_at=excluded.updated_at
    """, (property_no, steps, now, now))
    db.commit()
    db.close()
    return jsonify({"success": True})


@app.route("/tracking/<path:property_no>/step", methods=["PUT"])
def update_step(property_no):
    data = request.get_json()
    step_id    = data.get("stepId")
    new_status = data.get("status")
    step_date  = data.get("date", datetime.now().strftime("%Y-%m-%d"))

    db = get_db()
    row = db.execute("SELECT steps FROM tracking WHERE property_no = ?", (property_no,)).fetchone()

    if not row:
        db.close()
        return jsonify({"success": False, "message": "المعاملة غير موجودة"})

    try:
        steps = json.loads(row["steps"])
    except Exception:
        steps = DEFAULT_STEPS

    for s in steps:
        if s["id"] == step_id:
            s["status"] = new_status
            s["date"] = step_date if new_status == "completed" else None

    if new_status == "completed":
        for s in steps:
            if s["id"] == step_id + 1 and s["status"] == "pending":
                s["status"] = "in-progress"

    now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    db.execute(
        "UPDATE tracking SET steps = ?, updated_at = ? WHERE property_no = ?",
        (json.dumps(steps), now, property_no)
    )
    db.commit()
    db.close()
    return jsonify({"success": True, "steps": steps})


@app.route("/tracking/<path:property_no>", methods=["DELETE"])
def delete_tracking(property_no):
    db = get_db()
    db.execute("DELETE FROM tracking WHERE property_no = ?", (property_no,))
    db.commit()
    db.close()
    return jsonify({"success": True})


init_db()

if __name__ == "__main__":
    app.run(debug=True)
