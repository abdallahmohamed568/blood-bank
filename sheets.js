/* ============================================================
   قطرة حياة — sheets.js  ✅ FIXED
   ============================================================ */

// ══ الإعدادات ══
const SHEET_ID   = '1by4_xeHlL4qKTPIJ7Lfz9U80F5JK1pFR1iJr87a_Bu8';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwJGvhAF7ILsvgRou-PX66mqM61UXpDgNqMurXw3znA4Vk6WAWt6F0W3n2fZdv5wkSNTg/exec';
//                   ↑ إصلاح 1: SCRIPT_URL بحرف كبير — كانت scriptURL بحرف صغير فكانت تعطي ReferenceError

const SHEETS = {
  BENEFICIARIES : 'المستفيدون',
  DONORS        : 'المتبرعون',
  HOSPITALS     : 'المستشفيات',
  CHAT          : 'الدردشة'
};

const SheetsAPI = {

  async write(sheetName, dataArray) {
    try {
      await fetch(SCRIPT_URL, {
        method : 'POST',
        mode   : 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        //          ↑ إصلاح 2: text/plain بدل application/json
        //            application/json ممنوع مع no-cors فكان يمنع إرسال البيانات
        body: JSON.stringify({
          sheet: sheetName,
          data : dataArray.map(function(v) {
            return (v === undefined || v === null) ? '' : String(v);
          })
        })
      });
      console.log('%c✅ Sheets write OK → ' + sheetName, 'color:green');
      return { success: true };
    } catch (err) {
      console.error('❌ Sheets write error:', err);
      return { success: false, error: err.message };
    }
  },

  async read(sheetName) {
    try {
      var url = SCRIPT_URL + '?sheet=' + encodeURIComponent(sheetName) + '&t=' + Date.now();
      var res = await fetch(url);
      var obj = await res.json();
      return { success: obj.status === 'ok', data: obj.data || [] };
    } catch (err) {
      return { success: false, data: [] };
    }
  },

  async registerBeneficiary(u) {
    return this.write(SHEETS.BENEFICIARIES, [
      _ts(), u.id, u.fullname, u.blood_type,
      u.phone, u.email, u.address,
      u.proof_url ? 'مرفقة' : 'لا يوجد',
      'قيد المراجعة'
    ]);
  },

  async registerDonor(u) {
    return this.write(SHEETS.DONORS, [
      _ts(), u.id, u.fullname, u.blood_type,
      u.phone, u.email, u.address,
      u.smoker       ? 'نعم' : 'لا',
      u.has_diseases ? 'نعم' : 'لا',
      u.diseases_details || '—',
      u.last_donation    || 'لم يتبرع من قبل',
      'نشط'
    ]);
  },

  async registerHospital(u) {
    return this.write(SHEETS.HOSPITALS, [
      _ts(), u.id, u.hospital_name,
      u.address, u.email, u.phone,
      u.license_num, u.facility_type || '—',
      u.notes || '—', 'قيد المراجعة'
    ]);
  },

  async updateStatus(sheetName, userId, userName, newStatus, reason) {
    return this.write(SHEETS.CHAT, [
      _ts(), 'ADMIN', 'الإدارة',
      userId, userName || '—',
      'تحديث الحالة إلى: ' + newStatus + (reason ? ' — ' + reason : ''),
      'تحديث حالة', 'مكتمل'
    ]);
  },

  async logChat(msg) {
    return this.write(SHEETS.CHAT, [
      _ts(),
      msg.senderId   || '', msg.senderName   || '',
      msg.receiverId || '', msg.receiverName || '',
      msg.text || '', 'رسالة', 'جديدة'
    ]);
  },

  // دالة للتوافق مع chat.js القديم
  async logChatMessage(msg) {
    return this.logChat(msg);
  },

  async submitContact(f) {
    return this.write(SHEETS.CHAT, [
      _ts(), 'CONTACT', f.name || '',
      '—', f.email || '',
      'الموضوع: ' + (f.subject||'') + ' | الرسالة: ' + (f.message||''),
      'تواصل', 'جديد'
    ]);
  },

  async logNotification(n) {
    return this.write(SHEETS.CHAT, [
      _ts(), 'SYSTEM', 'الإدارة',
      n.user_id || n.userId || 'ALL', '—',
      (n.title||n.message||'') + (n.desc ? ': ' + n.desc : ''),
      'إشعار', n.type || 'عام'
    ]);
  }

};
// ↑ إصلاح 3: حذف الكود المكرر (السطر 135-221) كان بيعمل Syntax Error ويكسر الملف كله

function _ts() {
  return new Date().toLocaleString('ar-EG', {
    year:'numeric', month:'2-digit', day:'2-digit',
    hour:'2-digit', minute:'2-digit'
  });
}

function generateId() {
  return 'QH' +
    Date.now().toString(36).toUpperCase() +
    Math.random().toString(36).substr(2, 4).toUpperCase();
}

console.log('%c✅ sheets.js جاهز — ' + SCRIPT_URL.substring(0,60) + '...', 'color:green;font-weight:bold');
