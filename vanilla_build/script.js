document.addEventListener('DOMContentLoaded', () => {
  // --- Navigation & Routing ---
  const navLinks = document.querySelectorAll('.nav-link, .nav-mobile-link');
  const sections = document.querySelectorAll('.page-section');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const navBrandBtn = document.getElementById('navBrandBtn');
  
  function navigateTo(pageId) {
    // Hide all sections
    sections.forEach(sec => sec.classList.remove('active'));
    // Show target section
    const target = document.getElementById(pageId + '-page');
    if (target) target.classList.add('active');

    // Update nav links active state
    navLinks.forEach(link => {
      if (link.dataset.page === pageId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Close mobile menu if open
    mobileMenu.classList.remove('open');
    updateMenuIcon(false);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Setup click listeners for all nav links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.dataset.page);
    });
  });

  // Setup generic navigate buttons (like "Order Gas", "Learn About Us", etc.)
  document.querySelectorAll('[data-navigate]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(btn.dataset.navigate);
    });
  });

  // Nav brand logo click
  if (navBrandBtn) {
    navBrandBtn.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo('home');
    });
  }

  // --- Mobile Menu Toggle ---
  let isMenuOpen = false;
  
  function updateMenuIcon(isOpen) {
    isMenuOpen = isOpen;
    const menuIcon = mobileToggle.querySelector('.icon-menu');
    const xIcon = mobileToggle.querySelector('.icon-x');
    if (isOpen) {
      if(menuIcon) menuIcon.classList.add('hidden');
      if(xIcon) xIcon.classList.remove('hidden');
    } else {
      if(menuIcon) menuIcon.classList.remove('hidden');
      if(xIcon) xIcon.classList.add('hidden');
    }
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      mobileMenu.classList.toggle('open');
      updateMenuIcon(isMenuOpen);
    });
  }


  // --- Blog Filters ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const blogCards = document.querySelectorAll('.blog-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active btn
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      blogCards.forEach(card => {
        if (filter === 'All' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // --- Contact Form ---
  const contactForm = document.getElementById('contactForm');
  const successMessage = document.getElementById('successMessage');
  const btnResetForm = document.getElementById('btnResetForm');
  const formError = document.getElementById('formError');
  const INQUIRY_EMAIL = 'info@brotherlpg.com';

  function showFormError(message) {
    if (!formError) return;
    formError.textContent = message;
    formError.classList.add('show');
  }

  async function readJson(response) {
    try {
      return await response.json();
    } catch (err) {
      return {};
    }
  }

  async function sendViaPhp(form) {
    const response = await fetch('send-mail.php', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form)
    });
    const data = await readJson(response);
    return Boolean(response.ok && data.ok);
  }

  async function sendViaFormSubmit(form) {
    const payload = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim() || '(not provided)',
      service: form.service.value.trim() || '(not selected)',
      message: form.message.value.trim(),
      _subject: 'Brother LPG website inquiry',
      _template: 'table',
      _captcha: 'false',
      _honey: form.company ? form.company.value : ''
    };

    const response = await fetch('https://formsubmit.co/ajax/' + INQUIRY_EMAIL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const data = await readJson(response);
    const ok = data.success === true || data.success === 'true';
    if (!ok) {
      const raw = String(data.message || '');
      if (/activat/i.test(raw)) {
        throw new Error('Check info@brotherlpg.com Inbox and Spam. Open the FormSubmit email and click Activate Form, then send this inquiry again.');
      }
      throw new Error(raw || 'Could not send your message. Please try again.');
    }
  }

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (formError) {
        formError.textContent = '';
        formError.classList.remove('show');
      }

      const submitBtn = contactForm.querySelector('.btn-submit');
      const originalLabel = submitBtn ? submitBtn.textContent : 'Send Inquiry';

      if (window.location.protocol === 'file:') {
        showFormError('Do not open index.html from a folder. In Chrome open this address instead: http://127.0.0.1:8765/index.html  (or your live Hostinger website).');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      try {
        let sent = false;
        try {
          sent = await sendViaPhp(contactForm);
        } catch (phpErr) {
          sent = false;
        }

        if (!sent) {
          await sendViaFormSubmit(contactForm);
        }

        contactForm.reset();
        contactForm.classList.add('hidden');
        if (successMessage) successMessage.classList.add('show');
      } catch (err) {
        showFormError((err && err.message) || 'Could not send your message. Please call +92-311-1182822 or email info@brotherlpg.com.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        }
      }
    });
  }

  if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
      contactForm.reset();
      if (formError) {
        formError.textContent = '';
        formError.classList.remove('show');
      }
      successMessage.classList.remove('show');
      contactForm.classList.remove('hidden');
    });
  }

  // Set initial page
  navigateTo('home');
});

