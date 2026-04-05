// ========================================
// 🗺️ نظام تتبع المعاملات - tracking.js
// ✨ Premium Edition - مُدمج مع الميزات الاحترافية (محدث ومُتوافق مع الباك إند)
// ========================================

// المراحل الـ 16 للمعاملة
// تم جعل الحالة الافتراضية pending لتجنب تداخل البيانات قبل التحميل من السيرفر
const trackingSteps = [
    {
        id: 1,
        title: 'تسجيل ديوان المالية',
        description: 'تسجيل المعاملة في السجلات الرسمية لديوان المالية',
        tooltip: 'أول خطوة رسمية — يتم تسجيل ملف المعاملة في الديوان',
        icon: '📝',
        status: 'pending',
        date: null
    },
    {
        id: 2,
        title: 'إيرادات المالية',
        description: 'مراجعة وتدقيق الإيرادات المالية المتعلقة بالمعاملة',
        tooltip: 'مراجعة الأرقام المالية والتحقق من صحتها',
        icon: '💰',
        status: 'pending',
        date: null
    },
    {
        id: 3,
        title: 'دخل مقطوع',
        description: 'احتساب وتحديد الدخل المقطوع للمعاملة',
        tooltip: 'تحديد الضريبة المقطوعة على الدخل الناتج',
        icon: '📊',
        status: 'pending',
        date: null
    },
    {
        id: 4,
        title: 'أرباح حقيقية',
        description: 'تقييم ومراجعة الأرباح الحقيقية من المعاملة',
        tooltip: 'تقييم صافي الأرباح بعد خصم التكاليف',
        icon: '💹',
        status: 'pending',
        date: null
    },
    {
        id: 5,
        title: 'قصر تصرف',
        description: 'التحقق من عدم وجود قيود على التصرف بالعقار',
        tooltip: 'جارٍ التحقق من خلو العقار من أي حجز أو قيد قانوني',
        icon: '🔒',
        status: 'pending',
        date: null
    },
    {
        id: 6,
        title: 'البصمة مالياً',
        description: 'التحقق من البصمة المالية والسجل الضريبي',
        tooltip: 'التحقق من السجل الضريبي للأطراف المعنية',
        icon: '👆',
        status: 'pending',
        date: null
    },
    {
        id: 7,
        title: 'موافقة أمنية',
        description: 'الحصول على الموافقة الأمنية اللازمة',
        tooltip: 'إجراء روتيني للتحقق من السلامة القانونية',
        icon: '🛡️',
        status: 'pending',
        date: null
    },
    {
        id: 8,
        title: 'دراسة المراقب',
        description: 'مراجعة ودراسة المعاملة من قبل المراقب المختص',
        tooltip: 'يقوم المراقب بمراجعة كافة الوثائق والتأكد من صحتها',
        icon: '🔍',
        status: 'pending',
        date: null
    },
    {
        id: 9,
        title: 'ضريبة البيوع',
        description: 'احتساب ودفع ضريبة البيوع المستحقة',
        tooltip: 'احتساب ضريبة نقل الملكية وإيصالات الدفع',
        icon: '💳',
        status: 'pending',
        date: null
    },
    {
        id: 10,
        title: 'تدقيق رئيس الشعبة',
        description: 'التدقيق النهائي من قبل رئيس الشعبة',
        tooltip: 'مراجعة ختامية من المسؤول المباشر قبل التوثيق',
        icon: '✅',
        status: 'pending',
        date: null
    },
    {
        id: 11,
        title: 'جباية الذمة',
        description: 'تحصيل المبالغ المستحقة وجباية الذمة',
        tooltip: 'سداد كافة المبالغ المالية المترتبة على المعاملة',
        icon: '💵',
        status: 'pending',
        date: null
    },
    {
        id: 12,
        title: 'طباعة العقد',
        description: 'طباعة العقد الرسمي للمعاملة',
        tooltip: 'طباعة النسخة الرسمية الموقعة من العقد',
        icon: '🖨️',
        status: 'pending',
        date: null
    },
    {
        id: 13,
        title: 'دراسة توثيق رئيس الشعبة',
        description: 'دراسة ومراجعة التوثيق من قبل رئيس الشعبة',
        tooltip: 'مراجعة العقد المطبوع للتأكد من صحة البيانات',
        icon: '📋',
        status: 'pending',
        date: null
    },
    {
        id: 14,
        title: 'تصحيح المعاملة',
        description: 'مراجعة وتصحيح أي أخطاء في المعاملة',
        tooltip: 'تصحيح أي أخطاء إملائية أو بيانات خاطئة إن وجدت',
        icon: '✏️',
        status: 'pending',
        date: null
    },
    {
        id: 15,
        title: 'ضريبة البيوع عقارياً',
        description: 'دفع ضريبة البيوع الخاصة بالعقار',
        tooltip: 'الدفعة الأخيرة من ضريبة نقل الملكية العقارية',
        icon: '🏠',
        status: 'pending',
        date: null
    },
    {
        id: 16,
        title: 'البصمة عقارياً',
        description: 'التسجيل النهائي والبصمة في السجل العقاري',
        tooltip: 'الخطوة الأخيرة — تسجيل الملكية رسمياً في السجل العقاري',
        icon: '🎯',
        status: 'pending',
        date: null
    }
];

// ── تحميل البيانات الأساسية عند فتح الصفحة ──
window.addEventListener('DOMContentLoaded', function () {
    // تم إزالة كود الـ localStorage لكي يتم الاعتماد كلياً على الباك إند عبر tracking.html
    loadCustomerInfo();
    renderTimeline();
    updateProgress();
});

// ── تحميل معلومات العميل (بيانات تجميلية للعميل) ──
function loadCustomerInfo() {
    const customerName = localStorage.getItem('customerName') || 'العميل';
    const serviceType  = localStorage.getItem('serviceType')  || 'معاملة عقارية';
    const txnId        = localStorage.getItem('txnId')        || '#TXN-' + new Date().getFullYear() + '-000';

    const nameEl = document.getElementById('customerName');
    const serviceEl = document.getElementById('serviceType');
    const txnEl = document.getElementById('txnId');

    if (nameEl) nameEl.textContent = customerName;
    if (serviceEl) serviceEl.textContent  = serviceType;
    if (txnEl) txnEl.textContent = txnId;
}

// ── رسم خط الزمن ──
function renderTimeline() {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;
    timeline.innerHTML = '';

    const statusText = {
        'completed':   'مكتمل ✓',
        'in-progress': 'قيد التنفيذ',
        'pending':     'قيد الانتظار'
    };

    trackingSteps.forEach((step, index) => {
        const el = document.createElement('div');
        el.className = `timeline-step ${step.status}`;
        el.style.animationDelay = `${index * 0.06}s`;

        el.innerHTML = `
            <div class="timeline-icon" ${step.tooltip ? `data-tooltip="${step.tooltip}"` : ''}>
                ${step.icon}
            </div>
            <div class="timeline-content">
                <div class="step-header">
                    <h3 class="step-title">${step.title}</h3>
                    <span class="step-badge ${step.status}">${statusText[step.status]}</span>
                </div>
                <p class="step-description">${step.description}</p>
                ${step.date ? `
                    <div class="step-date">
                        <i class="far fa-calendar-alt"></i>
                        <span>${formatDate(step.date)}</span>
                    </div>
                ` : ''}
            </div>
        `;

        timeline.appendChild(el);
    });
}

// ── تحديث شريط التقدم — يستدعي الميزات الاحترافية ──
function updateProgress() {
    const completed = trackingSteps.filter(s => s.status === 'completed').length;
    const total     = trackingSteps.length;

    // استدعاء الدالة الاحترافية (معرّفة في tracking.html)
    // تتولى: العدادات المتحركة، شريط التقدم، احتفال الاكتمال، ETA
    if (typeof window.updateProgressUI === 'function') {
        window.updateProgressUI(completed, total);
    } else {
        // fallback بسيط لو حدث خطأ في الـ HTML
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        const completedEl = document.getElementById('completedSteps');
        const totalEl = document.getElementById('totalSteps');
        const pctEl = document.getElementById('progressPercentage');
        const barEl = document.getElementById('progressBar');

        if (completedEl) completedEl.textContent = completed;
        if (totalEl) totalEl.textContent = total;
        if (pctEl) pctEl.textContent = pct + '%';
        if (barEl) {
            setTimeout(() => {
                barEl.style.width = pct + '%';
            }, 500);
        }
    }
}

// ── تنسيق التاريخ ──
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SY', {
        year: 'numeric', month: 'long', day: 'numeric'
    });
}

// ── ملاحظة إدارية (اختيارية) ──
function showAdminNote(message) {
    const noteEl   = document.getElementById('adminNote');
    const noteText = document.getElementById('noteText');
    if (!noteEl || !noteText) return;

    noteText.textContent    = message;
    noteEl.style.display    = 'flex';
    noteEl.style.animation  = 'fadeInUp 0.6s ease';
}

function hideAdminNote() {
    const noteEl = document.getElementById('adminNote');
    if (noteEl) noteEl.style.display = 'none';
}