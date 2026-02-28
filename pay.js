window.onload = function() {
    loadCustomerData();
    setupPayButton();
    buildPaymentPanel();
};

function loadCustomerData() {
    setText('displayUrgencyMode', localStorage.getItem('urgencyMode') || 'عادي 🕐');
    var data = {
        name: localStorage.getItem('customerName') || 'غير معروف',
        mother: localStorage.getItem('customerMother') || 'غير معروف',
        nationalId: localStorage.getItem('customerNationalId') || 'غير معروف',
        regNo: localStorage.getItem('customerRegNo') || 'غير معروف',
        propNo: localStorage.getItem('customerPropNo') || 'غير معروف',
        location: localStorage.getItem('customerLocation') || 'غير معروف',
        serviceType: localStorage.getItem('serviceType') || 'بيان قيد',
        servicePrice: localStorage.getItem('servicePrice') || '...'
    };
    setText('displayCustomerName', data.name);
    setText('displayCustomerMother', data.mother);
    setText('displayCustomerNationalId', data.nationalId);
    setText('displayCustomerRegNo', data.regNo);
    setText('displayCustomerPropNo', data.propNo);
    setText('displayCustomerLocation', data.location);
    setText('displayServiceType', data.serviceType);
    setText('displayTotalAmount', data.servicePrice);
}

function setText(id, text) {
    var el = document.getElementById(id);
    if (el) el.innerText = text;
}

function getText(id) {
    var el = document.getElementById(id);
    return el ? el.innerText : '-';
}

function setupPayButton() {
    var payBtn = document.getElementById('mainPayBtn');
    if (payBtn) payBtn.onclick = openPaymentModal;
}

function openPaymentModal() {
    var modal = document.getElementById('paymentModal');
    if (modal) modal.style.display = 'flex';
}

function closePaymentModal() {
    var modal = document.getElementById('paymentModal');
    if (modal) modal.style.display = 'none';
}

function buildPaymentPanel() {
    var style = document.createElement('style');
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;900&display=swap');

      #cpp-overlay {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 99999;
        background: rgba(2, 6, 15, 0.92);
        backdrop-filter: blur(12px);
        overflow-y: auto;
        padding: 24px 16px;
        box-sizing: border-box;
        justify-content: center;
        align-items: flex-start;
      }
      #cpp-overlay.open {
        display: flex;
        animation: cppFadeIn .2s ease;
      }
      @keyframes cppFadeIn { from { opacity:0; } to { opacity:1; } }

      #cpp-card {
        position: relative;
        width: 100%;
        max-width: 440px;
        margin: auto;
        font-family: 'Tajawal', sans-serif;
        direction: rtl;
        border-radius: 28px;
        overflow: hidden;
        background: #0d1117;
        border: 1px solid rgba(255,255,255,0.06);
        box-shadow:
          0 0 0 1px rgba(255,255,255,0.03),
          0 40px 100px rgba(0,0,0,0.8),
          0 0 80px rgba(56,189,248,0.04);
        animation: cppSlideUp .35s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes cppSlideUp {
        from { transform: translateY(60px) scale(0.96); opacity:0; }
        to   { transform: translateY(0)    scale(1);    opacity:1; }
      }

      /* ── شريط علوي ── */
      #cpp-topbar {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
        padding: 28px 28px 24px;
        text-align: center;
        position: relative;
        border-bottom: 1px solid rgba(255,255,255,0.05);
      }
      #cpp-topbar::before {
        content: '';
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, #38bdf8, #818cf8, transparent);
      }
      #cpp-close-btn {
        position: absolute;
        top: 18px; left: 20px;
        width: 34px; height: 34px;
        background: rgba(255,255,255,0.06);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 50%;
        color: #64748b;
        font-size: 16px;
        cursor: pointer;
        display: flex; align-items: center; justify-content: center;
        transition: all .2s;
        line-height: 1;
      }
      #cpp-close-btn:hover { background: rgba(239,68,68,0.15); color: #f87171; border-color: rgba(239,68,68,0.3); }

      #cpp-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        background: rgba(56,189,248,0.1);
        border: 1px solid rgba(56,189,248,0.2);
        border-radius: 100px;
        padding: 5px 14px;
        font-size: 12px;
        color: #38bdf8;
        font-weight: 700;
        letter-spacing: 1px;
        margin-bottom: 16px;
      }
      #cpp-title {
        font-size: 26px;
        font-weight: 900;
        color: #f1f5f9;
        margin: 0 0 6px;
        line-height: 1.2;
      }
      #cpp-title span { color: #38bdf8; }
      #cpp-subtitle { font-size: 14px; color: #475569; margin: 0; }

      /* ── محتوى ── */
      #cpp-body { padding: 24px 24px 28px; }

      /* صندوق الرقم */
      #cpp-numbox {
        position: relative;
        background: linear-gradient(135deg, rgba(56,189,248,0.06), rgba(129,140,248,0.04));
        border: 1px solid rgba(56,189,248,0.18);
        border-radius: 18px;
        padding: 22px 20px;
        text-align: center;
        margin-bottom: 20px;
        overflow: hidden;
      }
      #cpp-numbox::after {
        content: '';
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at 50% 0%, rgba(56,189,248,0.08) 0%, transparent 70%);
        pointer-events: none;
      }
      #cpp-num-label {
        font-size: 11px;
        letter-spacing: 3px;
        color: #38bdf8;
        font-weight: 700;
        text-transform: uppercase;
        margin-bottom: 12px;
      }
      #cpp-number {
        font-size: 28px;
        font-weight: 900;
        color: #e2e8f0;
        letter-spacing: 4px;
        direction: ltr;
        margin-bottom: 18px;
        text-shadow: 0 0 30px rgba(56,189,248,0.3);
        word-break: break-all;
        line-height: 1.3;
      }
      #cpp-copy-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #0ea5e9, #2563eb);
        border: none;
        color: white;
        border-radius: 12px;
        padding: 11px 28px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        font-family: 'Tajawal', sans-serif;
        transition: all .25s;
        box-shadow: 0 4px 20px rgba(14,165,233,0.4);
        position: relative;
        z-index: 1;
      }
      #cpp-copy-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 30px rgba(14,165,233,0.55);
      }
      #cpp-copy-btn:active { transform: scale(0.97); }
      #cpp-copy-btn.done {
        background: linear-gradient(135deg, #10b981, #059669);
        box-shadow: 0 4px 20px rgba(16,185,129,0.45);
      }

      /* باركود */
      #cpp-qr-section {
        text-align: center;
        margin-bottom: 20px;
      }
      #cpp-qr-sep {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
        color: #334155;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 2px;
      }
      #cpp-qr-sep::before, #cpp-qr-sep::after {
        content: '';
        flex: 1;
        height: 1px;
        background: rgba(255,255,255,0.05);
      }
      #cpp-qr-frame {
        display: inline-block;
        background: white;
        border-radius: 16px;
        padding: 12px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.4);
      }
      #cpp-qr-img { display: block; width: 150px; height: 150px; border-radius: 6px; }

      /* حقل الإدخال */
      #cpp-input-wrap { margin-bottom: 20px; }
      #cpp-input-label {
        display: block;
        font-size: 13px;
        color: #64748b;
        font-weight: 700;
        margin-bottom: 10px;
        letter-spacing: 0.5px;
      }
      #cpp-tx-input {
        width: 100%;
        box-sizing: border-box;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 14px;
        padding: 14px 18px;
        color: #e2e8f0;
        font-size: 15px;
        font-family: 'Tajawal', sans-serif;
        direction: rtl;
        outline: none;
        transition: border-color .2s, box-shadow .2s;
        -webkit-appearance: none;
      }
      #cpp-tx-input:focus {
        border-color: rgba(56,189,248,0.4);
        box-shadow: 0 0 0 3px rgba(56,189,248,0.08);
      }
      #cpp-tx-input::placeholder { color: #334155; }
      #cpp-err {
        color: #f87171;
        font-size: 13px;
        margin-top: 8px;
        min-height: 18px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      /* أزرار */
      #cpp-btns { display: flex; gap: 12px; }
      #cpp-confirm {
        flex: 1;
        background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%);
        border: none;
        color: white;
        border-radius: 14px;
        padding: 15px;
        font-size: 16px;
        font-weight: 800;
        cursor: pointer;
        font-family: 'Tajawal', sans-serif;
        transition: all .25s;
        box-shadow: 0 6px 24px rgba(37,99,235,0.35);
        letter-spacing: 0.5px;
      }
      #cpp-confirm:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 35px rgba(37,99,235,0.5);
      }
      #cpp-cancel {
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.08);
        color: #475569;
        border-radius: 14px;
        padding: 15px 20px;
        font-size: 15px;
        font-weight: 700;
        cursor: pointer;
        font-family: 'Tajawal', sans-serif;
        transition: all .2s;
        white-space: nowrap;
      }
      #cpp-cancel:hover {
        background: rgba(239,68,68,0.08);
        color: #f87171;
        border-color: rgba(239,68,68,0.2);
      }
    `;
    document.head.appendChild(style);

    var div = document.createElement('div');
    div.innerHTML = `
      <div id="cpp-overlay">
        <div id="cpp-card">
          <div id="cpp-topbar">
            <button id="cpp-close-btn">✕</button>
            <div id="cpp-badge">🔒 دفع آمن</div>
            <h2 id="cpp-title">الدفع عبر <span id="cpp-mname"></span></h2>
            <p id="cpp-subtitle">حوّل المبلغ إلى الرقم أدناه ثم أدخل رقم العملية</p>
          </div>
          <div id="cpp-body">
            <div id="cpp-numbox">
              <div id="cpp-num-label">رقم الحساب</div>
              <div id="cpp-number"></div>
              <button id="cpp-copy-btn">⧉ &nbsp;نسخ الرقم</button>
            </div>
            <div id="cpp-qr-section">
              <div id="cpp-qr-sep">امسح الباركود</div>
              <div id="cpp-qr-frame">
                <img id="cpp-qr-img" src="" alt="QR">
              </div>
            </div>
            <div id="cpp-input-wrap">
              <label id="cpp-input-label">رقم العملية</label>
              <input id="cpp-tx-input" type="text" placeholder="أدخل رقم العملية بعد التحويل...">
              <div id="cpp-err"></div>
            </div>
            <div id="cpp-btns">
              <button id="cpp-confirm">✅ تأكيد وإرسال</button>
              <button id="cpp-cancel">إلغاء</button>
            </div>
          </div>
        </div>
      </div>`;
    document.body.appendChild(div);

    document.getElementById('cpp-close-btn').onclick = closePanel;
    document.getElementById('cpp-cancel').onclick    = closePanel;
    document.getElementById('cpp-overlay').onclick   = function(e) {
        if (e.target === this) closePanel();
    };

    document.getElementById('cpp-copy-btn').onclick = function() {
        var num = document.getElementById('cpp-number').innerText;
        var btn = this;
        var ta = document.createElement('textarea');
        ta.value = num;
        ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0;';
        document.body.appendChild(ta);
        ta.focus(); ta.select(); ta.setSelectionRange(0, 99999);
        var ok = false;
        try { ok = document.execCommand('copy'); } catch(e) {}
        document.body.removeChild(ta);

        if (ok) {
            btn.classList.add('done');
            btn.innerHTML = '✓ &nbsp;تم النسخ';
            setTimeout(function() {
                btn.classList.remove('done');
                btn.innerHTML = '⧉ &nbsp;نسخ الرقم';
            }, 2500);
        } else {
            window.prompt('انسخ الرقم:', num);
        }
    };

    document.getElementById('cpp-confirm').onclick = function() {
        var tx  = document.getElementById('cpp-tx-input').value.trim();
        var err = document.getElementById('cpp-err');
        if (!tx) {
            err.innerHTML = '⚠️ يرجى إدخال رقم العملية';
            document.getElementById('cpp-tx-input').style.borderColor = 'rgba(239,68,68,0.5)';
            return;
        }
        err.innerHTML = '';
        var method = document.getElementById('cpp-mname').innerText;
        closePanel();
        sendToServer(method, tx);
    };
}

function openPanel(method, accountNumber) {
    document.getElementById('cpp-mname').innerText  = method;
    document.getElementById('cpp-number').innerText = accountNumber;
    document.getElementById('cpp-qr-img').src = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=' + accountNumber;
    document.getElementById('cpp-tx-input').value = '';
    document.getElementById('cpp-err').innerHTML = '';
    document.getElementById('cpp-tx-input').style.borderColor = '';
    document.getElementById('cpp-copy-btn').classList.remove('done');
    document.getElementById('cpp-copy-btn').innerHTML = '⧉ &nbsp;نسخ الرقم';
    document.getElementById('cpp-overlay').classList.add('open');
    document.getElementById('cpp-overlay').scrollTop = 0;
}

function closePanel() {
    document.getElementById('cpp-overlay').classList.remove('open');
}

function startPayment(method) {
    var accountNumber = '';
    if (method === 'Sham Cash')          accountNumber = '3761991574521921';
    else if (method === 'Syriatel Cash') accountNumber = '0935997430';
    else if (method === 'STC Pay')       accountNumber = '0000000000';
    closePaymentModal();
    openPanel(method, accountNumber);
}

async function sendToServer(method, transactionId) {
    var name        = getText('displayCustomerName');
    var mother      = getText('displayCustomerMother');
    var nationalId  = getText('displayCustomerNationalId');
    var regNo       = getText('displayCustomerRegNo');
    var propNo      = getText('displayCustomerPropNo');
    var location    = getText('displayCustomerLocation');
    var serviceType = getText('displayServiceType');
    var price       = getText('displayTotalAmount');
    var urgency     = localStorage.getItem('urgencyMode') || 'عادي 🕐';

    try {
       await fetch('https://yousef-backend-production-fa63.up.railway.app/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name, mother_name: mother, national_id: nationalId,
                property_no: propNo, reg_no: regNo, region: location,
                service_type: serviceType, urgency: urgency,
                price: parseInt(price.replace(/[^0-9]/g, '')) || 0,
                payment_method: method
            })
        });
    } catch(err) { console.error(err); }

    sendToWhatsApp(method, transactionId, { name, mother, nationalId, regNo, propNo, location, serviceType, price, urgency });
}

function sendToWhatsApp(method, transactionId, data) {
    var whatsappNumber = '963967728034';
    var message =
        '*━━━ طلب معاملة جديد ━━━*%0A%0A' +
        '👤 *العميل:* '       + data.name        + '%0A' +
        '👩 *اسم الأم:* '     + data.mother      + '%0A' +
        '🆔 *رقم الهوية:* '   + data.nationalId  + '%0A' +
        '📋 *رقم القيد:* '    + data.regNo       + '%0A' +
        '🏠 *رقم العقار:* '   + data.propNo      + '%0A' +
        '📍 *المنطقة:* '      + data.location    + '%0A' +
        '📄 *نوع الخدمة:* '   + data.serviceType + '%0A' +
        '⚡ *نوع الطلب:* '    + data.urgency     + '%0A' +
        '💰 *المبلغ:* '        + data.price       + '%0A' +
        '💳 *وسيلة الدفع:* '  + method           + '%0A' +
        '🆔 *رقم العملية:* '  + transactionId    + '%0A%0A' +
        '━━━━━━━━━━━━━━';

showTruckAnimation();
setTimeout(function() {
    // فتح الواتساب في تبويب جديد
    window.open('https://wa.me/' + whatsappNumber + '?text=' + message, '_blank');
    
    // إخفاء شاشة التحميل بعد ثانيتين
    setTimeout(function() {
        var overlay = document.getElementById('truckOverlay');
        if (overlay) overlay.style.display = 'none';
        
        // رسالة نجاح
        alert('تم إرسال طلبك بنجاح! ✅\nتحقق من الواتساب لإكمال الطلب.');
        
        // العودة للصفحة الرئيسية (اختياري)
        // window.location.href = 'yousef.html';
    }, 2000);
}, 3000);}

function showTruckAnimation() {
    var overlay = document.getElementById('truckOverlay');
    if (!overlay) return;
    overlay.style.display = 'flex';
    var button = document.querySelector('.truck-button');
    var box    = button.querySelector('.box');
    var truck  = button.querySelector('.truck');
    button.classList.remove('animation', 'done');
    if (typeof gsap !== 'undefined') {
        gsap.set(truck, { x: 4 });
        gsap.set(button, { '--progress': 0, '--box-s': 0.5, '--box-o': 0 });
        button.classList.add('animation');
        gsap.to(button, { '--box-s': 1, '--box-o': 1, duration: 0.3, delay: 0.5 });
        gsap.to(box, { x: 0, duration: 0.4, delay: 0.7 });
        gsap.to(button, {
            '--truck-y': 1, duration: 0.2, delay: 1.25,
            onComplete: function() {
                gsap.timeline({ onComplete: function() { button.classList.add('done'); } })
                    .to(truck, { x: 100, duration: 2 });
            }
        });
    } else {
        button.classList.add('animation');
        setTimeout(function() { button.classList.add('done'); }, 2000);
    }
}