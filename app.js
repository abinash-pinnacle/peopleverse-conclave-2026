/**
 * PEOPLEVERSE 2026 - HR CONCLAVE
 * Main Application Logic & Interactivity
 * Organized by NM Institute of Engineering & Technology (NMIET) & PINNACLE
 */

document.addEventListener('DOMContentLoaded', () => {
  initCountdownTimer();
  initAgendaTabs();
  initFaqAccordion();
  initRegistrationModal();
  initSpeakerModal();
  initBrochureDownloads();
  initMobileNav();
  initBackToTop();
  initScrollSpy();
});

/* ==========================================================================
   1. COUNTDOWN TIMER
   ========================================================================== */
function initCountdownTimer() {
  // Target date from official brochure: October 3, 2026, 09:30:00 IST
  const targetDate = new Date('October 3, 2026 09:30:00 GMT+0530').getTime();

  const daysEl = document.getElementById('days');
  const hoursEl = document.getElementById('hours');
  const minsEl = document.getElementById('minutes');
  const secsEl = document.getElementById('seconds');

  if (!daysEl || !hoursEl || !minsEl || !secsEl) return;

  function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    daysEl.textContent = String(days).padStart(2, '0');
    hoursEl.textContent = String(hours).padStart(2, '0');
    minsEl.textContent = String(minutes).padStart(2, '0');
    secsEl.textContent = String(seconds).padStart(2, '0');
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/* ==========================================================================
   2. AGENDA TABS (Day 1 / Day 2)
   ========================================================================== */
function initAgendaTabs() {
  const tabs = document.querySelectorAll('.agenda-tab');
  const panes = document.querySelectorAll('.agenda-timeline-pane');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-target');

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panes.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetPane = document.getElementById(`pane-${target}`);
      if (targetPane) {
        targetPane.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   3. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const button = item.querySelector('.faq-question');
    button.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle clicked item
      if (isOpen) {
        item.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('active');
        button.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   4. REGISTRATION MODAL & PASS GENERATOR
   ========================================================================== */
function initRegistrationModal() {
  const modal = document.getElementById('registrationModal');
  const closeBtn = document.getElementById('modalCloseBtn');
  const form = document.getElementById('registrationForm');
  const confView = document.getElementById('modalConfirmation');
  const passTierSelect = document.getElementById('passTier');
  const summaryPassName = document.getElementById('summaryPassName');
  const summaryPrice = document.getElementById('summaryPrice');
  const summaryTotal = document.getElementById('summaryTotal');
  const btnCloseSuccess = document.getElementById('btnCloseSuccess');
  const btnPrintPass = document.getElementById('btnPrintPass');

  // Trigger buttons
  const openButtons = document.querySelectorAll('.register-open-modal-btn');

  function openModal(tierName) {
    if (form) form.style.display = 'block';
    if (confView) confView.style.display = 'none';

    if (tierName && passTierSelect) {
      for (let i = 0; i < passTierSelect.options.length; i++) {
        if (passTierSelect.options[i].value === tierName || passTierSelect.options[i].text.includes(tierName)) {
          passTierSelect.selectedIndex = i;
          break;
        }
      }
    }
    updatePriceSummary();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tier = btn.getAttribute('data-tier');
      openModal(tier);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (btnCloseSuccess) btnCloseSuccess.addEventListener('click', closeModal);

  // Close on backdrop click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal.classList.contains('active')) closeModal();
      const speakerModal = document.getElementById('speakerModal');
      if (speakerModal && speakerModal.classList.contains('active')) {
        speakerModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  });

  // Price update on tier change
  if (passTierSelect) {
    passTierSelect.addEventListener('change', updatePriceSummary);
  }

  function updatePriceSummary() {
    if (!passTierSelect) return;
    const selectedOption = passTierSelect.options[passTierSelect.selectedIndex];
    const price = selectedOption.getAttribute('data-price') || '499';
    const formatted = '₹' + Number(price).toLocaleString('en-IN');

    const summaryInclusions = document.getElementById('summaryInclusions');
    if (summaryPassName) summaryPassName.textContent = selectedOption.value;
    if (summaryPrice) summaryPrice.textContent = formatted;
    if (summaryTotal) summaryTotal.textContent = formatted;
    if (summaryInclusions) {
      if (selectedOption.value.includes('Corporate')) {
        summaryInclusions.textContent = 'Executive Kit, Lunch, Session Access & Certificate';
      } else {
        summaryInclusions.textContent = 'Delegate Kit, Lunch, Sessions & Certificate';
      }
    }
  }

  // Handle Form Submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const fullName = document.getElementById('fullName').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const org = document.getElementById('organization').value.trim();
      const designation = document.getElementById('designation').value.trim();
      const tier = passTierSelect.value;

      if (!fullName || !email || !org || !designation) {
        showToast('Please fill all required fields.', 'error');
        return;
      }

      // Generate random ticket pass ID
      const randomId = 'HRC-2026-' + Math.floor(1000 + Math.random() * 9000);

      // Populate Digital Pass Card
      const passUserName = document.getElementById('passUserName');
      const passUserRole = document.getElementById('passUserRole');
      const passUserOrg = document.getElementById('passUserOrg');
      const passTierTag = document.getElementById('passTierTag');
      const passCodeId = document.getElementById('passCodeId');

      if (passUserName) passUserName.textContent = fullName;
      if (passUserRole) passUserRole.textContent = designation;
      if (passUserOrg) passUserOrg.textContent = org;
      if (passTierTag) passTierTag.textContent = tier.includes('Corporate') ? 'Corporate Delegate' : 'Student & Scholar';
      if (passCodeId) passCodeId.textContent = randomId;

      // Switch views
      form.style.display = 'none';
      confView.style.display = 'block';

      showToast(`Registration Successful! Delegate ID: ${randomId}`, 'success');
    });
  }

  // Print Pass
  if (btnPrintPass) {
    btnPrintPass.addEventListener('click', () => {
      window.print();
    });
  }

  // Sponsor & Speaker application buttons
  const sponsorBtn = document.getElementById('btn-partner-sponsor');
  if (sponsorBtn) {
    sponsorBtn.addEventListener('click', () => {
      openModal('Corporate Delegation (5 Passes)');
      showToast('Sponsorship inquiry form loaded. Our partnership cell will reach out within 24 hours.', 'info');
    });
  }

  const callSpeakerBtn = document.getElementById('btn-call-speakers');
  if (callSpeakerBtn) {
    callSpeakerBtn.addEventListener('click', () => {
      showToast('Call for Speakers: Please email your profile & abstract to peopleverse@nmiet.ac.in', 'info');
    });
  }

  const caseSubmitBtn = document.getElementById('btn-submit-case');
  if (caseSubmitBtn) {
    caseSubmitBtn.addEventListener('click', () => {
      openModal('Student & Academic Delegate');
      showToast('HR Case Challenge: Register as Student Delegate to unlock case brief!', 'info');
    });
  }

  const hotelBtn = document.getElementById('btn-accommodation-guide');
  if (hotelBtn) {
    hotelBtn.addEventListener('click', () => {
      showToast('Partner Hotels: Mayfair Lagoon, Vivanta Bhubaneswar & Swosti Premium offer special delegate rates. Contact secretariat for promo codes.', 'info');
    });
  }
}

/* ==========================================================================
   5. SPEAKER BIO MODAL
   ========================================================================== */
function initSpeakerModal() {
  const modal = document.getElementById('speakerModal');
  const closeBtn = document.getElementById('speakerModalCloseBtn');
  const bioContent = document.getElementById('speakerBioContent');
  const viewBioButtons = document.querySelectorAll('.view-bio-btn');

  const speakerProfiles = {
    debabrata: {
      name: 'Dr. Debabrata Dash',
      role: 'Head - Human Resources (East)',
      company: 'Keynote Speaker — HR Conclave 2026',
      initials: 'DD',
      bio: 'Dr. Debabrata Dash is a distinguished HR leader heading Human Resources (East), bringing extensive strategic expertise in workforce transformation, human capability development, industrial relations, and sustainable organizational performance.',
      session: 'Keynote Address (11:30 AM – 12:00 PM): "Why HR 5.0, Why Now?"',
      takeaways: [
        'Integrating Artificial Intelligence, Human Capability & Workplace Ethics',
        'Transitioning from Industry 4.0 automation to human-centric HR 5.0',
        'Aligning cognitive well-being with sustainable corporate performance'
      ]
    },
    jayashree: {
      name: 'Ms. Jayashree Mishra',
      role: 'Head HR',
      company: 'Deloitte',
      initials: 'JM',
      bio: 'Ms. Jayashree Mishra serves as Head HR at Deloitte and moderates Panel Discussion 1 at HR Conclave 2026, steering the dialogue on AI-driven talent architectures, digital employee experience, and future-ready workforce leadership.',
      session: 'Panel 1 Moderator (12:00 – 12:45 PM): "People + Technology & AI: Redefining the Future of HR!"',
      takeaways: [
        'Panel Member 1: Mr. Subashish Das — Director, ADRENT Steel',
        'Panel Member 2: Ms. Rosy Das — AABSyS IT',
        'Key Focus: AI recruitment, ethical HR algorithms, and digital employee experience (dEX)'
      ]
    },
    adarsh: {
      name: 'Dr. Adarsh Rath',
      role: 'Entrepreneur & Thought Leader',
      company: 'Panel 2 Moderator — HR Conclave 2026',
      initials: 'AR',
      bio: 'Dr. Adarsh Rath is an accomplished entrepreneur and leadership advisor moderating Panel Discussion 2 on workplace dignity, governance frameworks beyond compliance, and inclusive organizational cultures.',
      session: 'Panel 2 Moderator (03:00 – 03:30 PM): Modern Workplace — "Beyond Compliance: Building Inclusive Workplaces"',
      takeaways: [
        'Panel Member 1: Dr. Isha Mishra — Associate Professor, KIIT',
        'Panel Member 2: Mr. R.K. Mohapatra — Former HR Head, IOCL',
        'Panel Member 3: Mr. Parthasarathi Mishra — Ex-CHRM, Tata Steel'
      ]
    }
  };

  function openSpeakerBio(key) {
    const data = speakerProfiles[key];
    if (!data || !bioContent) return;

    bioContent.innerHTML = `
      <div class="bio-speaker-header">
        <div class="guest-avatar-circle avatar-navy" style="margin-bottom:0; width:72px; height:72px; flex-shrink:0;">${data.initials}</div>
        <div class="bio-speaker-meta">
          <h3>${data.name}</h3>
          <p>${data.role}</p>
          <small style="color: #64748b;"><i class="fa-solid fa-building"></i> ${data.company}</small>
        </div>
      </div>
      <p class="bio-text">${data.bio}</p>
      <div class="bio-topics-list">
        <h5><i class="fa-solid fa-microphone"></i> Session Details</h5>
        <p style="color: var(--logo-navy); font-weight: 700; margin-bottom: 0.8rem;">${data.session}</p>
        <h5>Session Highlights & Panellists:</h5>
        <ul>
          ${data.takeaways.map(t => `<li><i class="fa-solid fa-check"></i> ${t}</li>`).join('')}
        </ul>
      </div>
      <div style="display: flex; justify-content: flex-end;">
        <button class="btn btn-primary btn-sm register-open-modal-btn" data-tier="Corporate & HR Delegates">
          Register to Attend Session
        </button>
      </div>
    `;

    // Re-bind register button inside bio modal
    const modalRegBtn = bioContent.querySelector('.register-open-modal-btn');
    if (modalRegBtn) {
      modalRegBtn.addEventListener('click', () => {
        closeBioModal();
        const regModal = document.getElementById('registrationModal');
        if (regModal) regModal.classList.add('active');
      });
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeBioModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  viewBioButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const speakerKey = btn.getAttribute('data-speaker');
      openSpeakerBio(speakerKey);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeBioModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeBioModal();
  });
}

/* ==========================================================================
   6. BROCHURE DOWNLOADS
   ========================================================================== */
function initBrochureDownloads() {
  const brochureButtons = document.querySelectorAll('.download-brochure-btn');

  brochureButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Preparing Peopleverse 2026 Executive Brochure (PDF)...', 'info');

      setTimeout(() => {
        // Trigger simulated PDF download
        downloadMockBrochure();
        showToast('Brochure downloaded successfully! Check your downloads.', 'success');
      }, 900);
    });
  });

  function downloadMockBrochure() {
    const brochureText = `
=============================================================
HR CONCLAVE 2026
HR 5.0 — Reimagining People, Performance & Possibilities
Integrating Artificial Intelligence, Human Capability & Workplace Ethics for Sustainable Performance
Presented by:
NMIET B-School (Department of Management), Bhubaneswar
In association with PINNACLE
=============================================================

DATE: October 3, 2026
TIME: 09:30 AM – 04:30 PM IST
VENUE: Main Auditorium, NMIET B-School, Sijua, Patrapada, Bhubaneswar, Odisha 751019

CONCLAVE VISION & CONTEXT:
The flagship HR Conclave 2026 organized by NMIET B-School serves as a national thought-leadership platform bringing together corporate CHROs, HR practitioners, industry experts, academic scholars, and management delegates. In an era marked by rapid AI integration, hybrid work ecosystems, and shifting employee expectations, the traditional mandate of Human Resource Management is undergoing a profound structural evolution.

Transitioning beyond conventional administrative functions and Industry 4.0 automation, the conclave explores HR 5.0—where cutting-edge technology and human capability converge with purpose, empathy, cognitive well-being, and organizational performance. The event connects classroom concepts with real workplace realities through keynote addresses, panel discussions, interactive Q&As, and experiential decision-making challenges.

KEY OBJECTIVES:
1. Deciphering HR 5.0 (AI + Empathy)
2. Industry-Academia Collaboration
3. Workplace Dignity & Inclusivity: Beyond Compliance
4. Behavioral Decision Making ("Risk It, But Think Smart")
5. Ethical Leadership & Well-being

THEMATIC PANELS:
- PANEL 1: "People + Technology & AI: Redefining the Future of HR!"
  Moderator: Ms. Jayashree Mishra (Head HR, Deloitte)
  Panel Members: 1. Subashish Das (Director, ADRENT Steel) | 2. Rosy Das (AABSyS IT)
- PANEL 2: Modern Workplace: "Beyond Compliance: Building Inclusive Workplaces"
  Moderator: Dr. Adarsh Rath (Entrepreneur)
  Panel Members: 1. Dr. Isha Mishra (Associate Professor, KIIT) | 2. R.K. Mohapatra (Former HR Head, IOCL) | 3. Mr. Parthasarathi Mishra (Ex-CHRM, Tata Steel)

OFFICIAL GUEST DETAILS:
Inaugural Guests:
1. Smt. Richa Parida — Chairperson, NMIET (Chief Patron)
2. Dr. Niranjan Mishra — Principal, NMIET (Patron)
3. Dr. Subhendhu Dash — NIPM
4. Shri Santosh Dash — Director, Pinnacle Human Resource Pvt Ltd
5. Dr. Sureshwari Prasad Das — Director Academics, NMIET B-School

Programme Anchors:
1. Dr. Chanchal Mukherjee — Faculty, NMIET
2. Ms. Mansi Nayak — Faculty, NMIET

Keynote Speaker:
- Dr. Debabrata Dash — Head - Human Resources (East)

Vote of Thanks:
- Dr. Sureshwari Prasad Das — Director Academics, NMIET B-School

FEATURED EXPERIENTIAL ACTIVITY:
"Risk It, But Think Smart: The Psychology of Business Decisions"
(Interactive business simulation for students and young delegates + Top 3 Student Competitive Presentations)

DETAILED CONCLAVE SCHEDULE (OCTOBER 3, 2026):
- 09:30 – 10:30 AM: Registration & Welcome Kit Distribution
- 10:30 – 10:45 AM: Welcome Address & Ceremonial Lamp Lighting
- 10:45 – 11:20 AM: Inaugural Address by Leadership & Guest Dignitaries
- 11:20 – 11:30 AM: Networking Tea Break
- 11:30 AM – 12:00 PM: Keynote Address: "Why HR 5.0, Why Now?"
- 12:00 – 12:45 PM: Panel Discussion 1: People + Technology & AI Integration
- 12:45 – 01:00 PM: Interactive Audience Q&A Session
- 01:00 – 02:00 PM: Networking Lunch Break
- 02:00 – 03:00 PM: Parallel Sessions (Track A: HR Delegates' Viewpoint / Track B: Student Activity "Risk It, But Think Smart")
- 03:00 – 03:30 PM: Panel Discussion 2: Modern Workplace Equity & Inclusivity
- 03:30 – 03:40 PM: Interactive Audience Q&A Session
- 03:45 – 04:15 PM: Top 3 Student Competitive Presentations
- 04:15 – 04:30 PM: Felicitation, Valedictory & Vote of Thanks

REGISTRATION CATEGORIES:
- Corporate & HR Delegates (₹499): Executive Kit, Lunch, Session Access & Certificate
- Students & Research Scholars (₹199): Delegate Kit, Lunch, Sessions & Certificate

SECRETARIAT & CONTACTS:
Email: hrconclave@nmiet.ac.in
Phone: +91 94370 12345 / 0674-2471888
Website: https://nmiet.ac.in
=============================================================
`;
    const blob = new Blob([brochureText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'HR_Conclave_2026_NMIET_BSchool_Brochure.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

/* ==========================================================================
   7. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    const icon = toggleBtn.querySelector('i');
    if (navMenu.classList.contains('active')) {
      icon.className = 'fa-solid fa-xmark';
    } else {
      icon.className = 'fa-solid fa-bars';
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
      const icon = toggleBtn.querySelector('i');
      if (icon) icon.className = 'fa-solid fa-bars';
    });
  });
}

/* ==========================================================================
   8. BACK TO TOP BUTTON
   ========================================================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   9. SCROLL SPY & NAVBAR BLUR
   ========================================================================== */
function initScrollSpy() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.6)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  });
}

/* ==========================================================================
   10. TOAST NOTIFICATIONS
   ========================================================================== */
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';

  let icon = 'fa-circle-info';
  if (type === 'success') icon = 'fa-circle-check';
  if (type === 'error') icon = 'fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="fa-solid ${icon}"></i>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('hide');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 4000);
}
