// common.js - Common functionality for all pages

document.addEventListener('DOMContentLoaded', () => {
  setupMobileMenu();
  initPreciseSmoothScroll();
  setupSubmissionForm();
});

/**
 * Sets up the mobile menu toggle functionality
 */
function setupMobileMenu() {
  const header = document.querySelector('header');
  const mobileMenuToggleButton = document.querySelector('.mobile-menu-toggle');

  if (header && mobileMenuToggleButton) {
    // Toggle menu on button click
    mobileMenuToggleButton.addEventListener('click', () => {
      header.classList.toggle('menu-open');
    });

    // Close menu when a nav link is clicked
    const navLinks = header.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        // Don't close for the form popup trigger
        if (this.id !== 'open-form-btn' && header.classList.contains('menu-open')) {
          header.classList.remove('menu-open');
        }
      });
    });
  }

  // Setup burger button for channel list
  document.querySelectorAll('.burger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const channelList = document.querySelector('.channel-list');
      if (channelList) {
        channelList.style.display = channelList.style.display === 'flex' ? 'none' : 'flex';
      }
    });
  });
}

/**
 * Initializes custom smooth scrolling with precise control
 */
function initPreciseSmoothScroll() {
  // Configuration
  const WHEEL_SENSITIVITY = 0.5;
  const MAX_TARGET_INCREMENT_PER_EVENT = 250;
  const EASING_BASE = 0.15;
  const MIN_ANIMATION_STEP = 1;
  const MAX_ANIMATION_STEP = 80;

  let targetScrollY = window.scrollY;
  let currentScrollY = window.scrollY;
  let animationFrameId = null;

  function smoothScrollLoop() {
    const diff = targetScrollY - currentScrollY;

    // If very close to the target, snap to it and stop the animation
    if (Math.abs(diff) < 1) {
      currentScrollY = targetScrollY;
      window.scrollTo(0, currentScrollY);
      animationFrameId = null;
      return;
    }

    // Calculate step: a percentage of the remaining distance
    let step = diff * EASING_BASE;

    // Apply min/max step constraints
    if (Math.abs(step) < MIN_ANIMATION_STEP) {
      step = Math.sign(step) * MIN_ANIMATION_STEP;
    }
    if (Math.abs(step) > MAX_ANIMATION_STEP) {
      step = Math.sign(step) * MAX_ANIMATION_STEP;
    }
    
    // Prevent overshooting the target
    if (Math.abs(step) > Math.abs(diff)) {
      step = diff;
    }

    currentScrollY += step;
    window.scrollTo(0, currentScrollY);

    // Continue the animation
    animationFrameId = requestAnimationFrame(smoothScrollLoop);
  }

  // Handle wheel events
  window.addEventListener('wheel', function(e) {
    // Allow default scroll for specific elements that manage their own scrolling
    if (e.target.closest('.discord-client, .chat-messages, textarea, input[type="range"], select, [contenteditable="true"]')) {
      return;
    }

    e.preventDefault();

    // Calculate target adjustment based on wheel input
    let targetIncrement = e.deltaY * WHEEL_SENSITIVITY;
    targetIncrement = Math.sign(targetIncrement) * Math.min(Math.abs(targetIncrement), MAX_TARGET_INCREMENT_PER_EVENT);
    
    targetScrollY += targetIncrement;

    // Clamp targetScrollY to page boundaries
    const maxScroll = document.body.scrollHeight - window.innerHeight;
    targetScrollY = Math.max(0, Math.min(targetScrollY, maxScroll));

    // Start animation if not already running
    if (!animationFrameId) {
      currentScrollY = window.scrollY; 
      animationFrameId = requestAnimationFrame(smoothScrollLoop);
    }
  }, { passive: false });

  // Setup anchor link scrolling
  document.documentElement.style.scrollBehavior = 'auto';
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerHeight = document.querySelector('header')?.offsetHeight || 0;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerHeight - 20; 
        
        targetScrollY = offsetPosition;

        if (!animationFrameId) {
          currentScrollY = window.scrollY;
          animationFrameId = requestAnimationFrame(smoothScrollLoop);
        }
      }
    });
  });
}

/**
 * Sets up the submission form popup
 */
function setupSubmissionForm() {
  const submissionPopup = document.getElementById('submission-popup');
  const openFormBtn = document.getElementById('open-form-btn');
  const closePopupBtn = document.querySelector('.close-popup');
  
  if (openFormBtn && submissionPopup) {
    openFormBtn.addEventListener('click', (e) => {
      e.preventDefault();
      submissionPopup.classList.add('active');
    });
  }
  
  if (closePopupBtn && submissionPopup) {
    closePopupBtn.addEventListener('click', () => {
      submissionPopup.classList.remove('active');
    });
  }
}
