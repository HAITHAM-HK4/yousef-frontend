// ========================================
// 🗺️ نظام تتبع المعاملات - tracking.js
// ✨ Premium Edition - مُدمج مع الميزات الاحترافية
// ========================================

// المراحل الـ 16 للمعاملة
const trackingSteps = [
    {
        id: 1,
        title: 'تسجيل ديوان المالية',
        description: 'تسجيل المعاملة في السجلات الرسمية لديوان المالية',
        tooltip: 'أول خطوة رسمية — يتم تسجيل ملف المعاملة في الديوان',
        icon: '📝',
        status: 'completed',
        date: '2026-02-20'
    },
    {
        id: 2,
        title: 'إيرادات المالية',
        description: 'مراجعة وتدقيق الإيرادات المالية المتعلقة بالمعاملة',
        tooltip: 'مراجعة الأرقام المالية والتحقق من صحتها',
        icon: '💰',
        status: 'completed',
        date: '2026-02-21'
    },
    {
        id: 3,
        title: 'دخل مقطوع',
        description: 'احتساب وتحديد الدخل المقطوع للمعاملة',
        tooltip: 'تحديد الضريبة المقطوعة على الدخل الناتج',
        icon: '📊',
        status: 'completed',
        date: '2026-02-22'
    },
    {
        id: 4,
        title: 'أرباح حقيقية',
        description: 'تقييم ومراجعة الأرباح الحقيقية من المعاملة',
        tooltip: 'تقييم صافي الأرباح بعد خصم التكاليف',
        icon: '💹',
        status: 'completed',
        date: '2026-02-23'
    },
    {
        id: 5,
        title: 'قصر تصرف',
        description: 'التحقق من عدم وجود قيود على التصرف بالعقار',
        tooltip: 'جارٍ التحقق من خلو العقار من أي حجز أو قيد قانوني',
        icon: '🔒',
        status: 'in-progress',
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

// ── تحميل البيانات عند فتح الصفحة ──
window.addEventListener('DOMContentLoaded', function () {
    // استرجاع الخطوات المحفوظة إن وجدت
    const saved = localStorage.getItem('trackingSteps');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            parsed.forEach(s => {
                const found = trackingSteps.find(x => x.id === s.id);
                if (found) { found.status = s.status; found.date = s.date; }
            });
        } catch (e) { /* ignore */ }
    }

    loadCustomerInfo();
    renderTimeline();
    updateProgress();
});

// ── تحميل معلومات العميل ──
function loadCustomerInfo() {
    const customerName = localStorage.getItem('customerName') || 'العميل';
    const serviceType  = localStorage.getItem('serviceType')  || 'بيان قيد';
    const txnId        = localStorage.getItem('txnId')        || '#TXN-2026-0142';

    document.getElementById('customerName').textContent = customerName;
    document.getElementById('serviceType').textContent  = serviceType;

    const txnEl = document.getElementById('txnId');
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
        // fallback بسيط لو الـ HTML القديم
        const pct = Math.round((completed / total) * 100);
        document.getElementById('completedSteps').textContent = completed;
        document.getElementById('totalSteps').textContent     = total;
        document.getElementById('progressPercentage').textContent = pct + '%';
        setTimeout(() => {
            document.getElementById('progressBar').style.width = pct + '%';
        }, 500);
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

// ── للأدمن: تحديث حالة مرحلة ──
function updateStepStatus(stepId, newStatus, date = null) {
    const step = trackingSteps.find(s => s.id === stepId);
    if (!step) return;

    const prev = step.status;
    step.status = newStatus;
    if (date) step.date = date;

    renderTimeline();
    updateProgress();

    // حفظ في localStorage
    localStorage.setItem('trackingSteps', JSON.stringify(
        trackingSteps.map(({ id, status, date }) => ({ id, status, date }))
    ));

    // Toast إشعار عند تغيير الحالة
    if (typeof window.showToast === 'function') {
        const labels = {
            'completed':   '✅ تم إكمال المرحلة',
            'in-progress': '⚡ المرحلة قيد التنفيذ الآن',
            'pending':     '⏳ المرحلة في الانتظار'
        };
        window.showToast(labels[newStatus] || 'تم تحديث الحالة');
    }

    // تسجيل في console للمتابعة
    console.log(`[تتبع] المرحلة ${stepId} تغيرت: ${prev} → ${newStatus}`);
}

// ── ملاحظة إدارية ──
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

// ── مثال للاستخدام (احذف عند التشغيل الفعلي) ──
// updateStepStatus(5, 'completed', '2026-02-28');
// updateStepStatus(6, 'in-progress');
// showAdminNote('المعاملة تسير بشكل طبيعي. سيتم إشعارك عند اكتمال المرحلة التالية.');