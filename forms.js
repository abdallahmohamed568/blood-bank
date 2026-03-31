/* ============================
   قطرة حياة — forms.js
   Form Handling & Validation
   ============================ */

// ===== CAMERA HANDLER =====
const Camera = {
  stream: null,
  videoEl: null,

  async open(videoElementId) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      this.videoEl = document.getElementById(videoElementId);
      if (this.videoEl) this.videoEl.srcObject = this.stream;
    } catch (err) {
      App.showToast(App.lang === 'ar' ? 'لا يمكن الوصول للكاميرا' : 'Cannot access camera', 'error');
    }
  },

  capture(videoElementId, canvasId) {
    const video = document.getElementById(videoElementId);
    const canvas = document.getElementById(canvasId) || document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    return canvas.toDataURL('image/jpeg', 0.8);
  },

  close() {
    if (this.stream) {
      this.stream.getTracks().forEach(t => t.stop());
      this.stream = null;
    }
  }
};

// ===== UPLOAD AREA HANDLER =====
function initUploadArea(areaId, inputId, previewId) {
  const area = document.getElementById(areaId);
  const input = document.getElementById(inputId);
  const preview = document.getElementById(previewId);
  if (!area || !input) return;

  area.addEventListener('click', () => input.click());

  area.addEventListener('dragover', (e) => {
    e.preventDefault();
    area.classList.add('dragover');
  });

  area.addEventListener('dragleave', () => area.classList.remove('dragover'));

  area.addEventListener('drop', (e) => {
    e.preventDefault();
    area.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file, preview, area);
  });

  input.addEventListener('change', () => {
    const file = input.files[0];
    if (file) handleFileUpload(file, preview, area);
  });
}

function handleFileUpload(file, previewEl, areaEl) {
  if (!file.type.startsWith('image/')) {
    App.showToast(App.lang === 'ar' ? 'يرجى اختيار صورة فقط' : 'Please select an image only', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    if (previewEl) {
      previewEl.innerHTML = `
        <div class="upload-preview">
          <img src="${e.target.result}" alt="Preview">
          <button class="upload-remove" onclick="removeUpload('${previewEl.id}', '${areaEl.id}')">✕</button>
        </div>
      `;
      areaEl.style.display = 'none';
    }
  };
  reader.readAsDataURL(file);
}

function removeUpload(previewId, areaId) {
  const preview = document.getElementById(previewId);
  const area = document.getElementById(areaId);
  if (preview) preview.innerHTML = '';
  if (area) area.style.display = '';
}

// ===== BENEFICIARY FORM =====
const BeneficiaryForm = {
  init() {
    const form = document.getElementById('form-beneficiary');
    if (!form) return;

    initUploadArea('upload-area', 'proof-input', 'proof-preview');

    document.getElementById('btn-camera')?.addEventListener('click', () => {
      App.openModal('camera-modal');
      Camera.open('camera-video');
    });

    document.getElementById('btn-capture')?.addEventListener('click', () => {
      const dataUrl = Camera.capture('camera-video', 'capture-canvas');
      const previewEl = document.getElementById('proof-preview');
      if (previewEl && dataUrl) {
        previewEl.innerHTML = `
          <div class="upload-preview">
            <img src="${dataUrl}" alt="Preview">
            <button class="upload-remove" onclick="document.getElementById('proof-preview').innerHTML=''">✕</button>
          </div>
        `;
        document.getElementById('upload-area').style.display = 'none';
        document.getElementById('camera-dataurl').value = dataUrl;
      }
      Camera.close();
      App.closeModal('camera-modal');
    });

    document.getElementById('btn-close-camera')?.addEventListener('click', () => {
      Camera.close();
      App.closeModal('camera-modal');
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!Validate.form(form)) return;

      const proofEl = document.getElementById('proof-preview')?.querySelector('img');
      if (!proofEl) {
        App.showToast(App.lang === 'ar' ? 'يرجى إرفاق صورة الإثبات' : 'Please attach proof image', 'error');
        return;
      }

      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = `<span>${App.t('loading')}</span>`;

      const formData = {
        fullname: form.fullname.value,
        blood_type: form.blood_type.value,
        phone: form.phone.value,
        address: form.address.value,
        email: form.email.value,
        proof_url: proofEl.src
      };

      const result = await SheetsAPI.registerBeneficiary(formData);

      btn.disabled = false;
      btn.innerHTML = App.t('reg.submit');

      if (result.success) {
        App.showToast(App.lang === 'ar' ? 'تم إرسال طلبك بنجاح! سيتم مراجعته من الإدارة.' : 'Request submitted! It will be reviewed by admin.', 'success');
        form.reset();
        document.getElementById('proof-preview').innerHTML = '';
        document.getElementById('upload-area').style.display = '';

        // Save local pending state
        const userData = { ...formData, type: 'beneficiary', status: 'pending', id: generateId() };
        App.login(userData);
        setTimeout(() => { window.location.href = 'dashboard-user.html'; }, 2000);
      } else {
        // Still save locally even if sheets fails
        App.showToast(App.lang === 'ar' ? 'تم إرسال طلبك! (تأكد من إعداد Google Sheets)' : 'Request sent! (Verify Google Sheets setup)', 'info');
        const userData = { ...formData, type: 'beneficiary', status: 'pending', id: generateId() };
        App.login(userData);
        setTimeout(() => { window.location.href = 'dashboard-user.html'; }, 2000);
      }
    });
  }
};

// ===== DONOR FORM =====
const DonorForm = {
  init() {
    const form = document.getElementById('form-donor');
    if (!form) return;

    // Show/hide disease details
    const diseasesYes = document.getElementById('diseases-yes');
    const diseasesNo = document.getElementById('diseases-no');
    const diseasesDetails = document.getElementById('diseases-details-wrap');

    diseasesYes?.addEventListener('change', () => {
      if (diseasesYes.checked) diseasesDetails.style.display = '';
    });

    diseasesNo?.addEventListener('change', () => {
      if (diseasesNo.checked) diseasesDetails.style.display = 'none';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!Validate.form(form)) return;

      const termsCheck = document.getElementById('terms-check');
      if (!termsCheck?.checked) {
        App.showToast(App.lang === 'ar' ? 'يجب الموافقة على الشروط أولاً' : 'You must agree to terms first', 'error');
        return;
      }

      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = App.t('loading');

      const formData = {
        fullname: form.fullname.value,
        blood_type: form.blood_type.value,
        phone: form.phone.value,
        address: form.address.value,
        email: form.email.value,
        smoker: form.smoker?.value === 'yes',
        has_diseases: document.getElementById('diseases-yes')?.checked,
        diseases_details: form.diseases_details?.value || '',
        last_donation: form.last_donation?.value || ''
      };

      const result = await SheetsAPI.registerDonor(formData);
      btn.disabled = false;
      btn.innerHTML = App.t('reg.submit');

      App.showToast(App.lang === 'ar' ? 'تم تسجيلك كمتبرع بنجاح! شكراً لك 🩸' : 'Registered as donor! Thank you 🩸', 'success');
      const userData = { ...formData, type: 'donor', status: 'active', id: generateId() };
      App.login(userData);
      setTimeout(() => { window.location.href = 'dashboard-user.html'; }, 2000);
    });
  }
};

// ===== HOSPITAL FORM =====
const HospitalForm = {
  init() {
    const form = document.getElementById('form-hospital');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!Validate.form(form)) return;

      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = App.t('loading');

      const formData = {
        hospital_name: form.hospital_name.value,
        address: form.address.value,
        email: form.email.value,
        license_num: form.license_num.value,
        phone: form.phone.value,
        notes: form.notes?.value || ''
      };

      const result = await SheetsAPI.registerHospital(formData);
      btn.disabled = false;
      btn.innerHTML = App.t('reg.submit');

      App.showToast(App.lang === 'ar' ? 'تم تسجيل المستشفى! سيتم التواصل معكم.' : 'Hospital registered! We will contact you.', 'success');
      const userData = { ...formData, type: 'hospital', status: 'pending', id: generateId() };
      App.login(userData);
      setTimeout(() => { window.location.href = 'dashboard-user.html'; }, 2000);
    });
  }
};

// ===== CONTACT FORM =====
const ContactForm = {
  init() {
    const form = document.getElementById('form-contact');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!Validate.form(form)) return;

      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      btn.innerHTML = App.t('loading');

      const formData = {
        name: form.contact_name.value,
        email: form.contact_email.value,
        subject: form.contact_subject.value,
        message: form.contact_message.value
      };

      await SheetsAPI.submitContact(formData);
      btn.disabled = false;
      btn.innerHTML = App.t('contact.form.send');

      App.showToast(App.lang === 'ar' ? 'تم إرسال رسالتك! سنتواصل معك قريباً.' : 'Message sent! We\'ll contact you soon.', 'success');
      form.reset();
    });
  }
};

// ===== LOGIN FORM =====
const LoginForm = {
  init() {
    const form = document.getElementById('form-login');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const email = form.login_email.value;
      const password = form.login_password.value;

      // Admin login
      if (email === 'dropoflife132@gmail.com' && password === 'admin2024') {
        App.login({ email, type: 'admin', name: 'Admin', id: 'ADMIN001' });
        App.showToast('مرحباً بك في لوحة التحكم 👋', 'success');
        setTimeout(() => { window.location.href = 'dashboard-admin.html'; }, 1000);
        return;
      }

      // Check local user
      const storedUser = App.user;
      if (storedUser && storedUser.email === email) {
        App.showToast(App.lang === 'ar' ? 'تم تسجيل الدخول بنجاح!' : 'Logged in successfully!', 'success');
        setTimeout(() => { window.location.href = 'dashboard-user.html'; }, 1000);
        return;
      }

      App.showToast(App.lang === 'ar' ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة' : 'Invalid email or password', 'error');
    });
  }
};

// ===== INIT ALL FORMS =====
document.addEventListener('DOMContentLoaded', () => {
  BeneficiaryForm.init();
  DonorForm.init();
  HospitalForm.init();
  ContactForm.init();
  LoginForm.init();

  // Real-time validation
  document.querySelectorAll('[data-validate]').forEach(input => {
    input.addEventListener('blur', () => {
      const rules = JSON.parse(input.getAttribute('data-validate'));
      Validate.field(input, rules);
    });

    input.addEventListener('input', () => {
      const group = input.closest('.form-group');
      if (group?.classList.contains('error')) {
        const rules = JSON.parse(input.getAttribute('data-validate'));
        Validate.field(input, rules);
      }
    });
  });
});
