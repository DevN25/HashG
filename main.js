function initApp() {
  initCopyButtons();
  initSmoothScroll();
  initScrollObserver();
  initBannerSlot();
  initVideoPlayers();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}

/**
 * Handle Hero Image Slot interactive image replacement
 */
function initBannerSlot() {
  const slot = document.getElementById('heroBannerSlot');
  if (!slot) return;

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.style.display = 'none';
  document.body.appendChild(fileInput);

  slot.addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        slot.innerHTML = `
          <img src="${event.target.result}" alt="Hero Banner Preview" style="width:100%; height:100%; object-fit:cover; border-radius: var(--radius-lg);" />
        `;
        showToast('Hero image uploaded successfully! 🖼️');
      };
      reader.readAsDataURL(file);
    }
  });
}

/**
 * Handle copy to clipboard and toast feedback
 */
function initCopyButtons() {
  const copyLinkBtn = document.getElementById('copyLinkBtn');
  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', () => {
      const origin = window.location.origin;
      const path = window.location.pathname.replace(/qr\.html$/, '');
      const portfolioUrl = origin + (path.endsWith('/') ? path : path + '/') + 'index.html';

      navigator.clipboard.writeText(portfolioUrl).then(() => {
        showToast('ePortfolio link copied to clipboard! 📋');
      }).catch(() => {
        showToast('Portfolio URL copied!');
      });
    });
  }

  const emailBtn = document.getElementById('emailContactBtn');
  if (emailBtn) {
    emailBtn.addEventListener('click', (e) => {
      const email = 'get.tagged@hashtaggenius.in';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(email).catch(() => {});
      }
      showToast(`Opening Gmail... (Copied: ${email})`);
    });
  }

  const callBtn = document.getElementById('callContactBtn');
  if (callBtn) {
    callBtn.addEventListener('click', (e) => {
      const phone = '+91 97389 25606';
      if (navigator.clipboard) {
        navigator.clipboard.writeText(phone).catch(() => {});
      }
      showToast(`Phone copied: ${phone}`);
    });
  }
}

/**
 * Toast Notification Utility
 */
function showToast(message) {
  const toast = document.getElementById('toastNotification');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

/**
 * Smooth scrolling for anchor navigation
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/**
 * Intersection Observer for scroll animations
 */
function initScrollObserver() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.card, .service-card, .outcome-card').forEach(el => {
    observer.observe(el);
  });
}

/**
 * Auto-pause all other videos when any video is playing
 */
function initVideoPlayers() {
  let activeVideo = null;
  const getVideos = () => Array.from(document.querySelectorAll('video'));

  function pauseAllExcept(target) {
    getVideos().forEach(v => {
      if (v !== target && !v.paused) {
        try {
          v.pause();
        } catch (e) {}
      }
    });
  }

  // 1. Global event capture listener for play/playing/seeking
  ['play', 'playing', 'seeking'].forEach(evtName => {
    document.addEventListener(evtName, (e) => {
      const v = e.target && (e.target.tagName === 'VIDEO' ? e.target : (e.target.closest ? e.target.closest('video') : null));
      if (v) {
        activeVideo = v;
        pauseAllExcept(v);
      }
    }, true);
  });

  // 2. Direct event listeners on every video element
  getVideos().forEach(video => {
    const onPlay = () => {
      activeVideo = video;
      pauseAllExcept(video);
    };

    video.addEventListener('play', onPlay);
    video.addEventListener('playing', onPlay);
  });

  // 3. Heartbeat monitor: continuously guarantees maximum 1 active playing video
  setInterval(() => {
    const playingList = getVideos().filter(v => !v.paused);
    if (playingList.length > 1) {
      const keepVideo = activeVideo && !activeVideo.paused ? activeVideo : playingList[playingList.length - 1];
      playingList.forEach(v => {
        if (v !== keepVideo) {
          try {
            v.pause();
          } catch (err) {}
        }
      });
    }
  }, 200);
}
