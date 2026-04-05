import sys
import os

# ══════════════════════════════════════════
# مسار المشروع على PythonAnywhere
# غيّر "haithamhk" لاسم حسابك
# ══════════════════════════════════════════
project_home = '/home/haithamhk/yousef-backend'

if project_home not in sys.path:
    sys.path.insert(0, project_home)

# متغيرات البيئة - قاعدة البيانات
os.environ['MYSQL_HOST']     = 'haithamhk.mysql.pythonanywhere-services.com'
os.environ['MYSQL_USER']     = 'haithamhk'
os.environ['MYSQL_PASSWORD'] = 'YOUR_DB_PASSWORD'   # ← ضع كلمة سر قاعدة البيانات هنا
os.environ['MYSQL_DATABASE'] = 'haithamhk$yousef'

from app import app as application
