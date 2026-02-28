
(function() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
        const btn = document.getElementById('themeBtn');
        if (btn) btn.innerText = '☀️';
    }
})();

// دالة تسجيل الدخول
async function login() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value.trim();

    if (!user || !pass) {
        Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'يرجى ملء جميع الحقول',
            confirmButtonColor: '#00d2ff',
            background: 'rgba(15,20,35,0.95)',
            color: 'white'
        });
        return;
    }

    try {const response = await fetch('https://yousef-backend-production-fa63.up.railway.app/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: user, password: pass })
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('userName', user);
            Swal.fire({
                icon: 'success',
                title: 'مرحباً بك! 👋',
                text: 'جاري تحويلك...',
                timer: 1500,
                showConfirmButton: false,
                background: 'rgba(15,20,35,0.95)',
                color: 'white'
            }).then(() => {
                window.location.href = '/admin.html';
            });
        } else {
            document.getElementById('loginBox').classList.add('shake');
            setTimeout(() => document.getElementById('loginBox').classList.remove('shake'), 500);
            Swal.fire({
                icon: 'error',
                title: 'خطأ في الدخول',
                text: result.message,
                confirmButtonColor: '#ff4444',
                background: 'rgba(15,20,35,0.95)',
                color: 'white'
            });
        }
    } catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ في الاتصال بالسيرفر',
            confirmButtonColor: '#ff4444',
            background: 'rgba(15,20,35,0.95)',
            color: 'white'
        });
    }
}

function togglePass() {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
}

function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById('themeBtn');
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        btn.innerText = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        btn.innerText = '🌙';
        localStorage.setItem('theme', 'dark');
    }
}

document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') login();
});