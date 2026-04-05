import json
import os
from datetime import datetime
from functools import wraps

import bcrypt
import mysql.connector
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins="*")

# ══════════════════════════════════════════
# 🔌 اتصال قاعدة البيانات
# ══════════════════════════════════════════
def get_db():
    return mysql.connector.connect(
        host=os.environ.get("MYSQL_HOST", "haithamhk.mysql.pythonanywhere-services.com"),
        user=os.environ.get("MYSQL_USER", "haithamhk"),
        password=os.environ.get("MYSQL_PASSWORD", ""),
        database=os.environ.get("MYSQL_DATABASE", "haithamhk$yousef"),
        charset="utf8mb4",
    )


# ══════════════════════════════════════════
# 🏗️ إنشاء الجداول عند التشغيل
# ══════════════════════════════════════════
def init_db():
    db = get_db()
    cur = db.cursor()

    # جدول المستخدمين
    cur.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id       INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL
        )
    """)

    # أضف أدمن افتراضي إن لم يكن موجوداً
    cur.execute("SELECT id FROM users WHERE username = 'admin'")
    if not cur.fetchone():
        hashed = bcrypt.hashpw(b"admin123", bcrypt.gensalt()).decode()
        cur.execute("INSERT INTO users (username, password) VALUES ('admin', %s)", (hashed,))

    # جدول الخدمات
    cur.execute("""
        CREATE TABLE IF NOT EXISTS services (
            id           INT AUTO_INCREMENT PRIMARY KEY,
            name         VARCHAR(200) NOT NULL,
            price_normal DECIMAL(15,2) DEFAULT 0,
            price_urgent DECIMAL(15,2) DEFAULT 0,
            visible      TINYINT(1)   DEFAULT 1
        )
    """)

    # خدمات افتراضية
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
            "INSERT INTO services (name, price_normal, price_urgent) VALUES (%s, %s, %s)",
            default_services
        )

    # جدول الطلبات
    cur.execute("""
        CREATE TABLE IF NOT EXISTS orders (
            id           INT AUTO_INCREMENT PRIMARY KEY,
            name         VARCHAR(200),
            mother       VARCHAR(200),
            national_id  VARCHAR(50),
            registration_no VARCHAR(100),
            property_no  VARCHAR(100),
            location     VARCHAR(200),
            service_type VARCHAR(200),
            price        DECIMAL(15,2),
            urgent       TINYINT(1) DEFAULT 0,
            created_at   DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    """)

    # جدول التتبع
    cur.execute("""
        CREATE TABLE IF NOT EXISTS tracking (
            property_no  VARCHAR(100) PRIMARY KEY,
            steps        LONGTEXT,
            created_at   DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at   DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
    """)

    db.commit()
    cur.close()
    db.close()


# ══════════════════════════════════════════
# 🔐 تسجيل الدخول
# ══════════════════════════════════════════
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({"success": False, "message": "أدخل اسم المستخدم وكلمة السر"})

    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cur.fetchone()
    cur.close()
    db.close()

    if not user:
        return jsonify({"success": False, "message": "اسم المستخدم غير صحيح"})

    if bcrypt.checkpw(password.encode(), user["password"].encode()):
        return jsonify({"success": True, "message": "تم تسجيل الدخول"})

    return jsonify({"success": False, "message": "كلمة السر غير صحيحة"})


# ══════════════════════════════════════════
# 🔑 تغيير كلمة السر
# ══════════════════════════════════════════
@app.route("/change-password", methods=["POST"])
def change_password():
    data = request.get_json()
    username    = data.get("username", "").strip()
    old_pass    = data.get("oldPassword", "").strip()
    new_pass    = data.get("newPassword", "").strip()

    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM users WHERE username = %s", (username,))
    user = cur.fetchone()

    if not user or not bcrypt.checkpw(old_pass.encode(), user["password"].encode()):
        cur.close(); db.close()
        return jsonify({"success": False, "message": "كلمة السر القديمة غير صحيحة"})

    hashed = bcrypt.hashpw(new_pass.encode(), bcrypt.gensalt()).decode()
    cur.execute("UPDATE users SET password = %s WHERE username = %s", (hashed, username))
    db.commit()
    cur.close(); db.close()
    return jsonify({"success": True, "message": "تم تغيير كلمة السر"})


# ══════════════════════════════════════════
# 📋 الخدمات
# ══════════════════════════════════════════
@app.route("/services", methods=["GET"])
def get_services():
    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM services ORDER BY id")
    services = cur.fetchall()
    cur.close(); db.close()
    return jsonify(services)


@app.route("/services/<int:sid>", methods=["PUT"])
def update_service(sid):
    data = request.get_json()
    db = get_db()
    cur = db.cursor()
    cur.execute(
        "UPDATE services SET name=%s, price_normal=%s, price_urgent=%s, visible=%s WHERE id=%s",
        (data.get("name"), data.get("price_normal"), data.get("price_urgent"), data.get("visible", 1), sid)
    )
    db.commit()
    cur.close(); db.close()
    return jsonify({"success": True})


@app.route("/services/<int:sid>", methods=["DELETE"])
def delete_service(sid):
    db = get_db()
    cur = db.cursor()
    cur.execute("DELETE FROM services WHERE id = %s", (sid,))
    db.commit()
    cur.close(); db.close()
    return jsonify({"success": True})


@app.route("/services", methods=["POST"])
def add_service():
    data = request.get_json()
    db = get_db()
    cur = db.cursor()
    cur.execute(
        "INSERT INTO services (name, price_normal, price_urgent, visible) VALUES (%s,%s,%s,%s)",
        (data.get("name"), data.get("price_normal", 0), data.get("price_urgent", 0), data.get("visible", 1))
    )
    db.commit()
    cur.close(); db.close()
    return jsonify({"success": True})


# ══════════════════════════════════════════
# 📦 الطلبات
# ══════════════════════════════════════════
@app.route("/orders", methods=["GET"])
def get_orders():
    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM orders ORDER BY created_at DESC")
    orders = cur.fetchall()
    cur.close(); db.close()
    # تحويل datetime لـ string
    for o in orders:
        if o.get("created_at"):
            o["created_at"] = o["created_at"].strftime("%Y-%m-%d %H:%M:%S")
    return jsonify(orders)


@app.route("/orders", methods=["POST"])
def add_order():
    data = request.get_json()
    db = get_db()
    cur = db.cursor()
    cur.execute("""
        INSERT INTO orders
            (name, mother, national_id, registration_no, property_no, location, service_type, price, urgent)
        VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
    """, (
        data.get("name"), data.get("mother"), data.get("national_id"),
        data.get("registration_no"), data.get("property_no"), data.get("location"),
        data.get("service_type"), data.get("price"), data.get("urgent", 0)
    ))
    db.commit()
    cur.close(); db.close()
    return jsonify({"success": True, "message": "تم حفظ الطلب"})


@app.route("/orders/<int:oid>", methods=["DELETE"])
def delete_order(oid):
    db = get_db()
    cur = db.cursor()
    cur.execute("DELETE FROM orders WHERE id = %s", (oid,))
    db.commit()
    cur.close(); db.close()
    return jsonify({"success": True})


# ══════════════════════════════════════════
# 📊 الإحصائيات
# ══════════════════════════════════════════
@app.route("/stats", methods=["GET"])
def get_stats():
    db = get_db()
    cur = db.cursor(dictionary=True)

    cur.execute("SELECT COUNT(*) AS total FROM orders")
    total = cur.fetchone()["total"]

    today = datetime.now().strftime("%Y-%m-%d")
    cur.execute("SELECT COUNT(*) AS today FROM orders WHERE DATE(created_at) = %s", (today,))
    today_count = cur.fetchone()["today"]

    cur.execute("SELECT COUNT(*) AS urgent FROM orders WHERE urgent = 1")
    urgent = cur.fetchone()["urgent"]

    cur.execute("SELECT COALESCE(SUM(price), 0) AS revenue FROM orders")
    revenue = cur.fetchone()["revenue"]

    cur.close(); db.close()
    return jsonify({
        "totalOrders":  total,
        "todayOrders":  today_count,
        "urgentOrders": urgent,
        "totalRevenue": float(revenue)
    })


# ══════════════════════════════════════════
# 🗺️ التتبع
# ══════════════════════════════════════════
DEFAULT_STEPS = [
    {"id": i+1, "status": "pending", "date": None}
    for i in range(16)
]


@app.route("/tracking", methods=["GET"])
def get_all_tracking():
    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM tracking ORDER BY updated_at DESC")
    rows = cur.fetchall()
    cur.close(); db.close()
    for r in rows:
        if r.get("updated_at"):
            r["updated_at"] = r["updated_at"].strftime("%Y-%m-%d %H:%M:%S")
        if r.get("created_at"):
            r["created_at"] = r["created_at"].strftime("%Y-%m-%d %H:%M:%S")
        if isinstance(r.get("steps"), str):
            try:
                r["steps"] = json.loads(r["steps"])
            except Exception:
                r["steps"] = DEFAULT_STEPS
    return jsonify(rows)


@app.route("/tracking/<path:property_no>", methods=["GET"])
def get_tracking(property_no):
    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT * FROM tracking WHERE property_no = %s", (property_no,))
    row = cur.fetchone()
    cur.close(); db.close()

    if not row:
        return jsonify({"success": False, "message": "غير موجود"})

    steps = row.get("steps", "[]")
    if isinstance(steps, str):
        try:
            steps = json.loads(steps)
        except Exception:
            steps = DEFAULT_STEPS

    return jsonify({"success": True, "steps": steps, "property_no": property_no})


@app.route("/tracking", methods=["POST"])
def create_tracking():
    data = request.get_json()
    property_no = data.get("property_no", "").strip()
    steps = json.dumps(data.get("steps", DEFAULT_STEPS))

    db = get_db()
    cur = db.cursor()
    cur.execute("""
        INSERT INTO tracking (property_no, steps)
        VALUES (%s, %s)
        ON DUPLICATE KEY UPDATE steps = VALUES(steps)
    """, (property_no, steps))
    db.commit()
    cur.close(); db.close()
    return jsonify({"success": True})


@app.route("/tracking/<path:property_no>/step", methods=["PUT"])
def update_step(property_no):
    data = request.get_json()
    step_id    = data.get("stepId")
    new_status = data.get("status")
    step_date  = data.get("date", datetime.now().strftime("%Y-%m-%d"))

    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT steps FROM tracking WHERE property_no = %s", (property_no,))
    row = cur.fetchone()

    if not row:
        cur.close(); db.close()
        return jsonify({"success": False, "message": "المعاملة غير موجودة"})

    steps = json.loads(row["steps"]) if isinstance(row["steps"], str) else row["steps"]

    # تحديث الخطوة
    for s in steps:
        if s["id"] == step_id:
            s["status"] = new_status
            s["date"]   = step_date if new_status == "completed" else None

    # إذا اكتملت خطوة → التالية تصبح in-progress
    if new_status == "completed":
        for s in steps:
            if s["id"] == step_id + 1 and s["status"] == "pending":
                s["status"] = "in-progress"

    cur.execute(
        "UPDATE tracking SET steps = %s WHERE property_no = %s",
        (json.dumps(steps), property_no)
    )
    db.commit()
    cur.close(); db.close()
    return jsonify({"success": True, "steps": steps})


@app.route("/tracking/<path:property_no>", methods=["DELETE"])
def delete_tracking(property_no):
    db = get_db()
    cur = db.cursor()
    cur.execute("DELETE FROM tracking WHERE property_no = %s", (property_no,))
    db.commit()
    cur.close(); db.close()
    return jsonify({"success": True})


# ══════════════════════════════════════════
# 🚀 تشغيل
# ══════════════════════════════════════════
init_db()

if __name__ == "__main__":
    app.run(debug=True)
