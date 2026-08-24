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
  const contactFormBox = document.getElementById('contactFormBox');
  const successMessage = document.getElementById('successMessage');
  const btnResetForm = document.getElementById('btnResetForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      setTimeout(() => { contactForm.classList.add('hidden'); successMessage.classList.add('show'); }, 500);
    });
  }

  if (btnResetForm) {
    btnResetForm.addEventListener('click', () => {
      contactForm.reset();
      successMessage.classList.remove('show');
      contactForm.classList.remove('hidden');
    });
  }

  // Set initial page
  navigateTo('home');
});

