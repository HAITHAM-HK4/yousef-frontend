// التحقق من تسجيل الدخول - فقط للأدمن
// المستخدم العادي لا يحتاج تسجيل دخول

// ===== متغيرات عامة =====
let currentMode = 'normal';
let allServices  = [];
let currentServiceId = null;

// ===== تحميل الخدمات من السيرفر =====
async function loadServicesFromServer() {
    try {
const res = await fetch('https://yousef-backend-production-fa63.up.railway.app/services');
        allServices = await res.json();
        loadTabs();
    } catch(err) {
        console.error('خطأ في تحميل الخدمات:', err);
    }
}

// ===== تحميل الأزرار ديناميكياً =====
function loadTabs() {
    const tabsDiv = document.querySelector('.tabs');
    if (!tabsDiv) return;

    tabsDiv.innerHTML = '';

    allServices.forEach(s => {
        if (!s.visible) return;
        const btn = document.createElement('button');
        btn.innerText = s.name;
        btn.onclick   = () => showForm(s.id);
        tabsDiv.appendChild(btn);
    });
}

// ===== عرض الفورم =====
function showForm(id) {
    const service = allServices.find(s => s.id === id);
    if (!service) return;

    currentServiceId = id;

    const nameEl = document.getElementById('Transactions-name');
    if (nameEl) nameEl.innerHTML = `<span style="color:blue;">${service.name}</span>`;

    localStorage.setItem('serviceType', service.name);
    updatePrice();

    const mainForm = document.getElementById('main-form');
    if (mainForm) mainForm.style.display = 'block';
}

// ===== وضع عادي / مستعجل =====
function setMode(mode) {
    currentMode = mode;
    localStorage.setItem('urgencyMode', mode === 'urgent' ? 'مستعجل ⚡' : 'عادي 🕐');

    document.querySelectorAll('.urgency-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.urgency-btn.' + mode).classList.add('active');

    if (currentServiceId) updatePrice();
}

function updatePrice() {
    if (!currentServiceId) return;
    const service = allServices.find(s => s.id === currentServiceId);
    if (!service) return;

    const price = currentMode === 'urgent' ? service.price_urgent : service.price_normal;

    const priceEl = document.getElementById('Transactions-price');
    if (priceEl) priceEl.innerText = ' - السعر: ' + Number(price).toLocaleString() + ' SYP';
    localStorage.setItem('servicePrice', Number(price).toLocaleString() + ' SYP');
}

// ===== حفظ البيانات والانتقال لصفحة الدفع =====
function saveData() {
    const name       = document.getElementById('name').value.trim();
    const mother     = document.getElementById('mother').value.trim();
    const nationalId = document.getElementById('national_id').value.trim();
    const regNo      = document.getElementById('registration_no').value.trim();
    const propNo     = document.getElementById('property_no').value.trim();
    const loc        = document.getElementById('location').value.trim();

// هذا التعبير يسمح فقط بالأرقام والشرطة المائلة
const regex = /^[0-9/]*$/;

if ((regNo !== '' && !regex.test(regNo)) || (propNo !== '' && !regex.test(propNo))) {
    Swal.fire({ 
        icon:'warning', 
        title:'تنسيق غير صحيح', 
        text:'يرجى إدخال أرقام أو رموز (/) فقط في رقم القيد ورقم العقار', 
        confirmButtonColor:'#ffcc00', 
        confirmButtonText:'فهمت', 
        background:'#fff' 
    });
    return;
}

    if (!name || !mother || !nationalId || !regNo || !propNo || !loc) {
        Swal.fire({ icon:'error', title:'هناك حقول فارغة', text:'يرجى ملء كافة البيانات المطلوبة', confirmButtonColor:'#3a7bd5', confirmButtonText:'حسناً', background:'#fff' });
        return;
    }

    if (!currentServiceId) {
        Swal.fire({ icon:'warning', title:'اختر نوع الخدمة', text:'يرجى اختيار نوع المعاملة أولاً', confirmButtonColor:'#3a7bd5', background:'#fff' });
        return;
    }

    // حفظ البيانات في localStorage لنقلها لصفحة الدفع
    localStorage.setItem('customerName',       name);
    localStorage.setItem('customerMother',     mother);
    localStorage.setItem('customerNationalId', nationalId);
    localStorage.setItem('customerRegNo',      regNo);
    localStorage.setItem('customerPropNo',     propNo);
    localStorage.setItem('customerLocation',   loc);

    const loader = document.getElementById('loader-wrapper');
    if (loader) loader.style.display = 'flex';
    setTimeout(() => {
        if (loader) loader.style.display = 'none';
        window.location.href = 'pay.html';
    }, 2000);
}

// ===== عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    loadServicesFromServer();

    setTimeout(() => {
        const wrapper = document.querySelector('.eagles-isolation-layer');
        if (wrapper) wrapper.classList.add('attack-mode');
    }, 3000);
});

// ===== زر الأدمن المخفي =====
function goAdmin() { window.location.href = 'login.html'; }

// ===== الوضع الليلي/النهاري =====
function toggleTheme() {
    const body = document.body;
    const btn  = document.getElementById('themeBtn');
    body.classList.toggle('light-mode');
    if (body.classList.contains('light-mode')) {
        btn.innerText = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        btn.innerText = '🌙';
        localStorage.setItem('theme', 'dark');
    }
}
(function() {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') {
        document.body.classList.add('light-mode');
        const btn = document.getElementById('themeBtn');
        if (btn) btn.innerText = '☀️';
    }
})();

// ===== نافذة الترحيب =====
function closeWelcome() {
    const modal = document.getElementById('welcomeModal');
    modal.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => modal.style.display = 'none', 300);
}
const roadmapSteps = [
    "تسجيل ديوان المالية", "ورادات المالية", "دخل مقطوع", "ارباح حقيقة",
    "قصر تصرف", "البصمة ماليا", "موافقة امنية", "دراسة المراقب",
    "ضريبة البيوع", "تدقيق رئيس الشعبة", "جباية الذمة", "طباعة العقد",
    "دراسة توثيق رئيس الشعبة", "تصحيح المعاملة", "ضريبة البيوع عقاريا", "البصمة عقاريا"
];

function showTrackingMap() {
    document.getElementById('trackingModal').style.display = 'block';
    const container = document.getElementById('roadmap');
    container.innerHTML = '';

    // هنا سنفترض أن الزبون وصل للمرحلة رقم 7 (كمثال)
    let currentProgress = 7; 

    roadmapSteps.forEach((name, index) => {
        const stepDiv = document.createElement('div');
        stepDiv.className = `step ${index <= currentProgress ? 'active' : ''} ${index < currentProgress ? 'completed' : ''}`;
        
        stepDiv.innerHTML = `
            <div class="step-icon">${index < currentProgress ? '✅' : index === currentProgress ? '📍' : '⏳'}</div>
            <div class="step-label">${name}</div>
        `;
        container.appendChild(stepDiv);
    });
}

function closeTracking() {
    document.getElementById('trackingModal').style.display = 'none';
}