/* ==========================================================================
   NAMRATA SHEKHAWAT — INTERACTIVE SCRIPT
   - Theme toggling (Dark / Light)
   - Sticky navbar & active scroll tracking
   - Pillar switcher tabs (Tech / Model / SMM)
   - Gallery category filter
   - High-res Lightbox modal (Images & Video player)
   - Contact form handler
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Theme Toggle (Dark / Light) ---
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

  // Retrieve saved theme or default to dark
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  if (savedTheme === 'light') {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        localStorage.setItem('portfolio-theme', 'light');
        if (themeIcon) {
          themeIcon.classList.remove('fa-moon');
          themeIcon.classList.add('fa-sun');
        }
      } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        localStorage.setItem('portfolio-theme', 'dark');
        if (themeIcon) {
          themeIcon.classList.remove('fa-sun');
          themeIcon.classList.add('fa-moon');
        }
      }
    });
  }

  // --- 2. Mobile Navigation Toggle ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // --- 3. Active Nav Link on Scroll ---
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-list a[href*="${sectionId}"]`);

      if (matchingLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          matchingLink.classList.add('active');
        } else {
          matchingLink.classList.remove('active');
        }
      }
    });
  });

  // --- 4. About Me Pillar Tabs ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      button.classList.add('active');
      const targetTab = button.getAttribute('data-tab');
      const activePane = document.getElementById(`pane-${targetTab}`);
      if (activePane) {
        activePane.classList.add('active');
      }
    });
  });

  // --- 5. Visual Portfolio Filters ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      galleryItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // --- 6. Lightbox & Video Modal ---
  const modal = document.getElementById('media-modal');
  const modalMediaContainer = document.getElementById('modal-media-container');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  const openModal = (type, src, title, desc) => {
    modalMediaContainer.innerHTML = '';

    if (type === 'video') {
      const videoElement = document.createElement('video');
      videoElement.src = src;
      videoElement.controls = true;
      videoElement.autoplay = true;
      modalMediaContainer.appendChild(videoElement);
    } else {
      const imgElement = document.createElement('img');
      imgElement.src = src;
      imgElement.alt = title;
      modalMediaContainer.appendChild(imgElement);
    }

    modalTitle.textContent = title || '';
    modalDesc.textContent = desc || '';

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Stop background scroll
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modalMediaContainer.innerHTML = ''; // Stop video playback
    document.body.style.overflow = '';
  };

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const type = item.getAttribute('data-type');
      const src = item.getAttribute('data-src');
      const title = item.getAttribute('data-title');
      const desc = item.getAttribute('data-desc');
      openModal(type, src, title, desc);
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // --- 7. Contact Form Handler (Direct Mailto / Visual Confirmation) ---
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const type = document.getElementById('collab-type').value;
      const message = document.getElementById('message').value.trim();

      // Construct a clean mailto link
      const subject = encodeURIComponent(`[Portfolio Inquiry - ${type.toUpperCase()}] from ${name}`);
      const bodyText = encodeURIComponent(`Hi Namrata,\n\nName: ${name}\nEmail: ${email}\nInquiry Type: ${type}\n\nMessage:\n${message}\n\nSent from your Portfolio Website.`);

      // Provide feedback
      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `<strong>Thank you, ${name}!</strong> Opening your email client to send your message directly to namratashekhawat73@gmail.com...`;
      }

      // Open email client
      setTimeout(() => {
        window.location.href = `mailto:namratashekhawat73@gmail.com?subject=${subject}&body=${bodyText}`;
      }, 700);
    });
  }

});
