/* ============================
   قطرة حياة — app.js
   Main Application Logic
   ============================ */

// ===== TRANSLATIONS =====
const translations = {
  ar: {
    // Nav
    'nav.home': 'الرئيسية',
    'nav.goals': 'أهدافنا',
    'nav.about': 'من نحن',
    'nav.contact': 'تواصل معنا',
    'nav.login': 'تسجيل الدخول',
    'nav.dashboard': 'لوحة التحكم',
    'nav.logout': 'تسجيل الخروج',

    // Hero
    'hero.tag': '🩸 منصة التبرع بالدم',
    'hero.title': 'قطرة دم منك... حياة لإنسان',
    'hero.title.highlight': 'قطرة دم منك',
    'hero.desc': 'منصة مجانية لوجه الله تربط المتبرعين بالدم بالمحتاجين إليه. لا هدف من وراءها إلا إنقاذ الأرواح.',
    'hero.btn.register': 'سجل الآن',
    'hero.btn.learn': 'تعرف علينا',
    'hero.card1': '🩸 تبرع آمن ومعتمد',
    'hero.card2': '💚 100% مجاني',
    'hero.card3': '⚡ استجابة سريعة',

    // Stats
    'stat.donors': 'متبرع مسجل',
    'stat.requests': 'طلب مكتمل',
    'stat.hospitals': 'مستشفى شريك',

    // Goals
    'goals.tag': 'أهدافنا',
    'goals.title': 'ماذا نسعى لتحقيقه؟',
    'goals.desc': 'نؤمن بأن إنقاذ حياة إنسان لا يحتاج مقابلاً. كل هدف من أهدافنا يصب في خدمة الإنسانية.',
    'goal1.title': 'إنقاذ الأرواح',
    'goal1.desc': 'ربط المرضى المحتاجين لنقل الدم بالمتبرعين المؤهلين في أسرع وقت ممكن.',
    'goal2.title': 'مجاني تماماً',
    'goal2.desc': 'لا رسوم ولا اشتراكات. الخدمة مجانية لجميع المستخدمين لوجه الله تعالى.',
    'goal3.title': 'شفافية وأمان',
    'goal3.desc': 'نظام تحقق دقيق لكل طلب لضمان وصول الدعم للمحتاج الحقيقي فعلاً.',
    'goal4.title': 'تغطية شاملة',
    'goal4.desc': 'نسعى لتغطية جميع المحافظات المصرية بشبكة من المتبرعين والمستشفيات.',
    'goal5.title': 'توعية مجتمعية',
    'goal5.desc': 'نشر ثقافة التبرع بالدم وتصحيح المفاهيم الخاطئة عنه في المجتمع.',
    'goal6.title': 'استجابة طارئة',
    'goal6.desc': 'نظام تنبيهات فوري للحالات الطارئة التي تحتاج دم عاجل في أقل من ساعة.',

    // About
    'about.tag': 'من نحن',
    'about.title': 'قطرة حياة... قصة بدأت بحلم إنساني',
    'about.p1': 'قطرة حياة هي منصة إلكترونية مصرية تطوعية تأسست من أجل هدف واحد: أن لا يفقد أحد حياته بسبب نقص الدم.',
    'about.p2': 'نربط المرضى المحتاجين لنقل الدم بالمتبرعين المؤهلين، ونتعاون مع المستشفيات لتوفير بنك بيانات شامل ومحدث.',
    'about.p3': 'لا نهدف لأي ربح. كل ما نفعله هو لوجه الله وخدمة للإنسانية. نحن متطوعون نؤمن بأن حياة الإنسان أغلى من أي شيء.',
    'about.point1.title': 'فريق متطوع',
    'about.point1.desc': 'فريق من المتطوعين المتحمسين لخدمة المجتمع',
    'about.point2.title': 'تقنية حديثة',
    'about.point2.desc': 'منصة آمنة ومتطورة تضمن سرية بيانات المستخدمين',
    'about.point3.title': 'رقابة مستمرة',
    'about.point3.desc': 'إشراف دائم من فريق الإدارة لضمان جودة الخدمة',
    'about.point4.title': 'دعم على مدار الساعة',
    'about.point4.desc': 'متاحون دائماً للرد على استفساراتكم وطلباتكم',

    // Contact
    'contact.tag': 'تواصل معنا',
    'contact.title': 'نحن هنا لمساعدتك',
    'contact.desc': 'هل لديك سؤال أو اقتراح؟ لا تتردد في التواصل معنا',
    'contact.email.label': 'البريد الإلكتروني',
    'contact.phone.label': 'رقم الهاتف',
    'contact.form.name': 'الاسم الكامل',
    'contact.form.email': 'البريد الإلكتروني',
    'contact.form.subject': 'الموضوع',
    'contact.form.message': 'رسالتك',
    'contact.form.send': 'إرسال الرسالة',
    'contact.form.title': 'راسلنا الآن',

    // Login
    'login.title': 'اختر نوع الحساب',
    'login.desc': 'حدد نوع حسابك للمتابعة',
    'login.beneficiary.title': 'مستفيد',
    'login.beneficiary.desc': 'أحتاج لنقل دم أو دم لذوي',
    'login.donor.title': 'متبرع',
    'login.donor.desc': 'أريد التبرع بدمي لمن يحتاج',
    'login.hospital.title': 'مستشفى',
    'login.hospital.desc': 'مستشفى أو مركز طبي معتمد',
    'login.have.account': 'لديك حساب بالفعل؟',
    'login.signin': 'تسجيل الدخول',
    'login.email': 'البريد الإلكتروني',
    'login.password': 'كلمة المرور',
    'login.remember': 'تذكرني',
    'login.forgot': 'نسيت كلمة المرور؟',

    // Register
    'reg.beneficiary.title': 'تسجيل كمستفيد',
    'reg.donor.title': 'تسجيل كمتبرع',
    'reg.hospital.title': 'تسجيل كمستشفى',
    'reg.fullname': 'الاسم الكامل',
    'reg.blood': 'فصيلة الدم',
    'reg.phone': 'رقم الهاتف (11 رقم)',
    'reg.address': 'العنوان بالتفصيل',
    'reg.email': 'البريد الإلكتروني',
    'reg.password': 'كلمة المرور',
    'reg.confirm': 'تأكيد كلمة المرور',
    'reg.proof': 'صورة تثبت الحاجة للدم',
    'reg.proof.hint': 'تقرير طبي أو خطاب من المستشفى',
    'reg.submit': 'إرسال الطلب',
    'reg.pending': 'سيتم مراجعة طلبك من الإدارة',

    // Donor fields
    'reg.smoker': 'هل أنت مدخن؟',
    'reg.diseases': 'هل تعاني من أمراض مزمنة؟',
    'reg.diseases.details': 'اذكر الأمراض',
    'reg.last.donation': 'آخر مرة تبرعت فيها',
    'reg.terms': 'شروط التبرع',
    'reg.terms.accept': 'أوافق على شروط التبرع',

    // Hospital fields
    'reg.hospital.name': 'اسم المستشفى / المركز الطبي',
    'reg.hospital.address': 'العنوان الكامل',
    'reg.hospital.email': 'البريد الإلكتروني الرسمي',
    'reg.hospital.license': 'رقم الترخيص',
    'reg.hospital.phone': 'رقم التواصل',
    'reg.hospital.notes': 'تفاصيل إضافية',

    // Dashboard
    'dash.welcome': 'أهلاً',
    'dash.total.donors': 'إجمالي المتبرعين',
    'dash.total.beneficiaries': 'إجمالي المستفيدين',
    'dash.total.hospitals': 'المستشفيات',
    'dash.pending': 'طلبات معلقة',
    'dash.approve': 'موافقة',
    'dash.reject': 'رفض',
    'dash.view.proof': 'عرض الإثبات',

    // Chat
    'chat.title': 'الرسائل',
    'chat.placeholder': 'اكتب رسالتك...',
    'chat.send': 'إرسال',
    'chat.admin.note': '🛡️ تخضع جميع المحادثات لرقابة الإدارة',

    // Footer
    'footer.desc': 'منصة مجانية تربط المتبرعين بالدم بالمحتاجين إليه. لا نهدف لأي ربح، فقط لإنقاذ الأرواح.',
    'footer.links': 'روابط سريعة',
    'footer.contact': 'تواصل معنا',
    'footer.rights': 'جميع الحقوق محفوظة لقطرة حياة',
    'footer.made': 'صُنع بـ ❤️ لوجه الله',

    // Common
    'yes': 'نعم',
    'no': 'لا',
    'select': 'اختر...',
    'save': 'حفظ',
    'cancel': 'إلغاء',
    'close': 'إغلاق',
    'loading': 'جاري التحميل...',
    'success': 'تم بنجاح',
    'error': 'حدث خطأ',
    'required': 'هذا الحقل مطلوب',
    'invalid.phone': 'رقم الهاتف يجب أن يكون 11 رقم',
    'invalid.email': 'البريد الإلكتروني غير صحيح',
    'camera.capture': 'التصوير بالكاميرا',
    'upload.file': 'رفع ملف',
  },
  en: {
    // Nav
    'nav.home': 'Home',
    'nav.goals': 'Our Goals',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.login': 'Login',
    'nav.dashboard': 'Dashboard',
    'nav.logout': 'Logout',

    // Hero
    'hero.tag': '🩸 Blood Donation Platform',
    'hero.title': 'One Drop From You... A Life For Someone',
    'hero.title.highlight': 'One Drop From You',
    'hero.desc': 'A completely free platform connecting blood donors with those in need. Our only goal is to save lives, for the sake of God.',
    'hero.btn.register': 'Register Now',
    'hero.btn.learn': 'Learn About Us',
    'hero.card1': '🩸 Safe & Certified',
    'hero.card2': '💚 100% Free',
    'hero.card3': '⚡ Fast Response',

    // Stats
    'stat.donors': 'Registered Donors',
    'stat.requests': 'Completed Requests',
    'stat.hospitals': 'Partner Hospitals',

    // Goals
    'goals.tag': 'Our Goals',
    'goals.title': 'What Do We Aim To Achieve?',
    'goals.desc': 'We believe saving a human life needs no compensation. Every goal we have serves humanity.',
    'goal1.title': 'Save Lives',
    'goal1.desc': 'Connect patients needing blood transfusion with qualified donors as quickly as possible.',
    'goal2.title': 'Completely Free',
    'goal2.desc': 'No fees or subscriptions. The service is free for all users, for the sake of God.',
    'goal3.title': 'Transparency & Safety',
    'goal3.desc': 'Precise verification for each request to ensure support reaches those who truly need it.',
    'goal4.title': 'Wide Coverage',
    'goal4.desc': 'We aim to cover all Egyptian governorates with a network of donors and hospitals.',
    'goal5.title': 'Community Awareness',
    'goal5.desc': 'Spreading blood donation culture and correcting misconceptions in the community.',
    'goal6.title': 'Emergency Response',
    'goal6.desc': 'Instant alert system for emergencies needing urgent blood in less than an hour.',

    // About
    'about.tag': 'About Us',
    'about.title': 'Drop of Life... A Story That Started With a Human Dream',
    'about.p1': 'Drop of Life is an Egyptian voluntary digital platform founded for one purpose: that no one loses their life due to blood shortage.',
    'about.p2': 'We connect patients needing blood transfusion with qualified donors, and collaborate with hospitals to provide a comprehensive, up-to-date database.',
    'about.p3': 'We have no profit motive. Everything we do is for God\'s sake and in service of humanity. We are volunteers who believe human life is priceless.',
    'about.point1.title': 'Volunteer Team',
    'about.point1.desc': 'A team of passionate volunteers dedicated to serving the community',
    'about.point2.title': 'Modern Technology',
    'about.point2.desc': 'A secure and advanced platform ensuring user data confidentiality',
    'about.point3.title': 'Continuous Oversight',
    'about.point3.desc': 'Constant supervision by the admin team to ensure service quality',
    'about.point4.title': '24/7 Support',
    'about.point4.desc': 'Always available to answer your inquiries and requests',

    // Contact
    'contact.tag': 'Contact Us',
    'contact.title': 'We Are Here To Help You',
    'contact.desc': 'Do you have a question or suggestion? Don\'t hesitate to reach out',
    'contact.email.label': 'Email Address',
    'contact.phone.label': 'Phone Number',
    'contact.form.name': 'Full Name',
    'contact.form.email': 'Email Address',
    'contact.form.subject': 'Subject',
    'contact.form.message': 'Your Message',
    'contact.form.send': 'Send Message',
    'contact.form.title': 'Message Us Now',

    // Login
    'login.title': 'Choose Account Type',
    'login.desc': 'Select your account type to continue',
    'login.beneficiary.title': 'Beneficiary',
    'login.beneficiary.desc': 'I need blood transfusion for myself or a loved one',
    'login.donor.title': 'Donor',
    'login.donor.desc': 'I want to donate my blood to those in need',
    'login.hospital.title': 'Hospital',
    'login.hospital.desc': 'A certified hospital or medical center',
    'login.have.account': 'Already have an account?',
    'login.signin': 'Sign In',
    'login.email': 'Email Address',
    'login.password': 'Password',
    'login.remember': 'Remember me',
    'login.forgot': 'Forgot password?',

    // Register
    'reg.beneficiary.title': 'Register as Beneficiary',
    'reg.donor.title': 'Register as Donor',
    'reg.hospital.title': 'Register as Hospital',
    'reg.fullname': 'Full Name',
    'reg.blood': 'Blood Type',
    'reg.phone': 'Phone Number (11 digits)',
    'reg.address': 'Detailed Address',
    'reg.email': 'Email Address',
    'reg.password': 'Password',
    'reg.confirm': 'Confirm Password',
    'reg.proof': 'Proof of Need Photo',
    'reg.proof.hint': 'Medical report or hospital letter',
    'reg.submit': 'Submit Request',
    'reg.pending': 'Your request will be reviewed by the administration',

    // Donor fields
    'reg.smoker': 'Are you a smoker?',
    'reg.diseases': 'Do you suffer from chronic diseases?',
    'reg.diseases.details': 'Mention the diseases',
    'reg.last.donation': 'Last time you donated',
    'reg.terms': 'Donation Terms',
    'reg.terms.accept': 'I agree to the donation terms',

    // Hospital fields
    'reg.hospital.name': 'Hospital / Medical Center Name',
    'reg.hospital.address': 'Full Address',
    'reg.hospital.email': 'Official Email',
    'reg.hospital.license': 'License Number',
    'reg.hospital.phone': 'Contact Number',
    'reg.hospital.notes': 'Additional Details',

    // Dashboard
    'dash.welcome': 'Welcome',
    'dash.total.donors': 'Total Donors',
    'dash.total.beneficiaries': 'Total Beneficiaries',
    'dash.total.hospitals': 'Hospitals',
    'dash.pending': 'Pending Requests',
    'dash.approve': 'Approve',
    'dash.reject': 'Reject',
    'dash.view.proof': 'View Proof',

    // Chat
    'chat.title': 'Messages',
    'chat.placeholder': 'Type your message...',
    'chat.send': 'Send',
    'chat.admin.note': '🛡️ All conversations are monitored by administration',

    // Footer
    'footer.desc': 'A free platform connecting blood donors with those in need. We have no profit motive, only to save lives.',
    'footer.links': 'Quick Links',
    'footer.contact': 'Contact Us',
    'footer.rights': 'All rights reserved to Drop of Life',
    'footer.made': 'Made with ❤️ for God\'s sake',

    // Common
    'yes': 'Yes',
    'no': 'No',
    'select': 'Select...',
    'save': 'Save',
    'cancel': 'Cancel',
    'close': 'Close',
    'loading': 'Loading...',
    'success': 'Success',
    'error': 'An error occurred',
    'required': 'This field is required',
    'invalid.phone': 'Phone number must be 11 digits',
    'invalid.email': 'Invalid email address',
    'camera.capture': 'Take Photo',
    'upload.file': 'Upload File',
  }
};

// ===== APP STATE =====
const App = {
  lang: localStorage.getItem('qh_lang') || 'ar',
  theme: localStorage.getItem('qh_theme') || 'light',
  user: JSON.parse(localStorage.getItem('qh_user') || 'null'),

  init() {
    this.applyLang(this.lang);
    this.applyTheme(this.theme);
    this.initHeader();
    this.initScrollReveal();
    this.initHamburger();
    this.updateAuthUI();
    this.initStatCounters();
  },

  t(key) {
    return translations[this.lang][key] || translations['ar'][key] || key;
  },

  applyLang(lang) {
    this.lang = lang;
    localStorage.setItem('qh_lang', lang);
    document.body.classList.toggle('lang-en', lang === 'en');
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');

    // Update all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });

    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
    });

    // Update lang toggle buttons
    document.querySelectorAll('.lang-toggle').forEach(btn => {
      btn.textContent = lang === 'ar' ? 'EN' : 'عربي';
    });

    // Update page title
    document.title = lang === 'ar' ? 'قطرة حياة - بنك الدم الإلكتروني' : 'Drop of Life - Online Blood Bank';
  },

  applyTheme(theme) {
    this.theme = theme;
    localStorage.setItem('qh_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    // Update theme toggle icons
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.textContent = theme === 'dark' ? '☀️' : '🌙';
      btn.title = theme === 'dark' ? (this.lang === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (this.lang === 'ar' ? 'الوضع الداكن' : 'Dark Mode');
    });
  },

  toggleLang() {
    this.applyLang(this.lang === 'ar' ? 'en' : 'ar');
  },

  toggleTheme() {
    this.applyTheme(this.theme === 'light' ? 'dark' : 'light');
  },

  initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20);
    });

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href]');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
          });
        }
      });
    }, { threshold: 0.4 });

    sections.forEach(s => observer.observe(s));
  },

  initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const mobileNav = document.querySelector('.mobile-nav');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', () => {
      mobileNav.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        mobileNav.classList.remove('open');
      }
    });
  },

  initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (!reveals.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    reveals.forEach(el => observer.observe(el));
  },

  initStatCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
  },

  animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('ar-EG');
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  },

  updateAuthUI() {
    const user = this.user;
    const loginBtns = document.querySelectorAll('.btn-login-header');
    const dashLinks = document.querySelectorAll('.dash-link');
    const logoutBtns = document.querySelectorAll('.btn-logout');

    loginBtns.forEach(btn => btn.style.display = user ? 'none' : '');
    dashLinks.forEach(el => el.style.display = user ? '' : 'none');
    logoutBtns.forEach(btn => btn.style.display = user ? '' : 'none');
  },

  login(userData) {
    this.user = userData;
    localStorage.setItem('qh_user', JSON.stringify(userData));
    this.updateAuthUI();
  },

  logout() {
    this.user = null;
    localStorage.removeItem('qh_user');
    this.updateAuthUI();
    window.location.href = 'index.html';
  },

  showToast(message, type = 'success') {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || '✅'}</span>
      <span class="toast-text">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  },

  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }
};

// ===== GLOBAL EVENTS =====
document.addEventListener('DOMContentLoaded', () => {
  App.init();

  // Theme toggle
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => App.toggleTheme());
  });

  // Lang toggle
  document.querySelectorAll('.lang-toggle').forEach(btn => {
    btn.addEventListener('click', () => App.toggleLang());
  });

  // Logout
  document.querySelectorAll('.btn-logout').forEach(btn => {
    btn.addEventListener('click', () => App.logout());
  });

  // Modal close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
});

// ===== VALIDATION =====
const Validate = {
  phone(val) {
    return /^01[0-2,5]{1}[0-9]{8}$/.test(val.replace(/\s/g, ''));
  },
  email(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  },
  required(val) {
    return val && val.trim().length > 0;
  },
  password(val) {
    return val && val.length >= 8;
  },
  match(val1, val2) {
    return val1 === val2;
  },

  field(input, rules) {
    const group = input.closest('.form-group');
    const errorEl = group?.querySelector('.form-error');
    let valid = true;
    let msg = '';

    for (const [rule, param] of Object.entries(rules)) {
      if (rule === 'required' && !this.required(input.value)) {
        valid = false;
        msg = App.t('required');
        break;
      }
      if (rule === 'phone' && !this.phone(input.value)) {
        valid = false;
        msg = App.t('invalid.phone');
        break;
      }
      if (rule === 'email' && !this.email(input.value)) {
        valid = false;
        msg = App.t('invalid.email');
        break;
      }
      if (rule === 'minlength' && input.value.length < param) {
        valid = false;
        msg = `الحد الأدنى ${param} أحرف`;
        break;
      }
    }

    if (group) group.classList.toggle('error', !valid);
    if (errorEl) errorEl.textContent = msg;
    return valid;
  },

  form(formEl) {
    const inputs = formEl.querySelectorAll('[data-validate]');
    let allValid = true;

    inputs.forEach(input => {
      const rules = JSON.parse(input.getAttribute('data-validate'));
      if (!this.field(input, rules)) allValid = false;
    });

    return allValid;
  }
};

// ===== SIDEBAR BODY LOCK =====
// Prevent body scroll when mobile sidebar is open
const sidebarObserver = new MutationObserver(() => {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    document.body.classList.toggle('sidebar-open', sidebar.classList.contains('open'));
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    sidebarObserver.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
  }

  // Close sidebar on nav link click (mobile)
  document.querySelectorAll('.sidebar-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        const backdrop = document.getElementById('sidebar-backdrop');
        if (sidebar) sidebar.classList.remove('open');
        if (backdrop) backdrop.classList.remove('open');
        document.body.classList.remove('sidebar-open');
      }
    });
  });
});
