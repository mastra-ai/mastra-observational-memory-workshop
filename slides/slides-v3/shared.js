// ===== Scroll-based sidebar notes =====
// Notes with data-for="section-id" become visible when that section is in view

function initSidebarNotes() {
  const notes = document.querySelectorAll('.sidebar-note[data-for]');
  if (!notes.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        notes.forEach((note) => {
          if (note.dataset.for === id) {
            note.classList.toggle('visible', entry.isIntersecting);
          }
        });
      });
    },
    { rootMargin: '-20% 0px -60% 0px' }
  );

  document.querySelectorAll('.section[id]').forEach((section) => {
    observer.observe(section);
  });
}

// ===== Top nav active state =====
function initTopNav() {
  const sections = document.querySelectorAll('.section[id]');
  const navLinks = document.querySelectorAll('.topnav-sections a');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href && href.includes('#' + id)) {
              link.classList.add('active');
            } else if (href && href.startsWith('#')) {
              link.classList.remove('active');
            }
          });
        }
      });
    },
    { rootMargin: '-30% 0px -60% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

// ===== Keyboard navigation =====
function initKeyNav(prevUrl, nextUrl) {
  document.addEventListener('keydown', (e) => {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'ArrowLeft' && prevUrl) {
      window.location.href = prevUrl;
    }
    if (e.key === 'ArrowRight' && nextUrl) {
      window.location.href = nextUrl;
    }
  });
}

// ===== Scroll-triggered fade-in =====
function initScrollFade() {
  const els = document.querySelectorAll('.fade-on-scroll');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px' }
  );

  els.forEach((el) => observer.observe(el));
}

// ===== Init =====
document.addEventListener('DOMContentLoaded', () => {
  initSidebarNotes();
  initTopNav();
  initScrollFade();
});
