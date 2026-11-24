/* ==========================================================================
   NAMRATA SHEKHAWAT — HIGH-AESTHETIC PORTFOLIO SCRIPT
   - Interactive Custom Cursor with Magnetic Smoothing
   - Dynamic Number Counter Animation
   - Lightbox Modal (Images & Videos)
   - Tab switching & Gallery filtering
   - Theme toggling & Form dispatch
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Custom Luxury Cursor ---
  const cursorDot = document.getElementById('cursor-dot');
  const cursorOutline = document.getElementById('cursor-outline');

  if (cursorDot && cursorOutline && window.innerWidth > 992) {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      cursorOutline.animate({
        left: `${posX}px`,
        top: `${posY}px`
      }, { duration: 400, fill: "forwards" });
    });

    // Expand cursor on clickable elements
    const clickables = document.querySelectorAll('a, button, .gallery-card, .insta-cell, input, select, textarea');
    clickables.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.6)';
        cursorOutline.style.borderColor = 'var(--gold-primary)';
      });
      el.addEventListener('mouseleave', () => {
        cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorOutline.style.borderColor = 'var(--gold-primary)';
      });
    });
  }

  // --- 2. Theme Toggle (Dark / Light) ---
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

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

  // --- 3. Mobile Navigation ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }

  // --- 4. Stat Numbers Counter Animation ---
  const stats = document.querySelectorAll('.stat-num');
  let animated = false;

  const animateStats = () => {
    stats.forEach(stat => {
      const target = +stat.getAttribute('data-target');
      let current = 0;
      const increment = target / 40;

      const updateCount = () => {
        current += increment;
        if (current < target) {
          stat.innerText = Math.ceil(current);
          requestAnimationFrame(updateCount);
        } else {
          stat.innerText = target;
        }
      };
      updateCount();
    });
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animateStats();
        animated = true;
      }
    });
  }, { threshold: 0.5 });

  const statSection = document.querySelector('.hero-stats');
  if (statSection) statObserver.observe(statSection);

  // --- 5. About Me Tabs ---
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      button.classList.add('active');
      const targetTab = button.getAttribute('data-tab');
      const activePane = document.getElementById(`pane-${targetTab}`);
      if (activePane) activePane.classList.add('active');
    });
  });

  // --- 6. Visual Portfolio Gallery Filters ---
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

  // --- 7. Lightbox & Video Modal ---
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
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    modalMediaContainer.innerHTML = '';
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

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // --- 8. Contact Form Dispatch ---
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const type = document.getElementById('collab-type').value;
      const message = document.getElementById('message').value.trim();

      const subject = encodeURIComponent(`[Portfolio Collaboration - ${type.toUpperCase()}] from ${name}`);
      const bodyText = encodeURIComponent(`Hi Namrata,\n\nName: ${name}\nEmail: ${email}\nInquiry Type: ${type}\n\nProject Vision:\n${message}\n\nSent from your Portfolio.`);

      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.innerHTML = `<strong>Thank you, ${name}!</strong> Opening your email client to send directly to namratashekhawat73@gmail.com...`;
      }

      setTimeout(() => {
        window.location.href = `mailto:namratashekhawat73@gmail.com?subject=${subject}&body=${bodyText}`;
      }, 700);
    });
  }

});
