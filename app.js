/**
 * TECHNOCRACY // NIT RAIPUR // DOOMSDAY THEME
 * Single Page Application: 3D Tilt Physics, HUD Reticle Cursor, Multi-Page Tabs,
 * Interactive Fest Schedule Timeline, Cinematic Parallax Background & Clean CLI
 */

(function () {
  'use strict';

  // Application State
  const AppState = {
    isLoaded: false,
    loaderStage: 'splash',
    activeTab: 'home', // 'home' | 'events' | 'schedule' | 'sponsors' | 'council'
    activeScheduleDay: 'day1', // 'day1' | 'day2'
    activeScheduleTrack: 'all',
    commandHistory: [],
    historyIndex: -1,
  };

  // DOM Elements Cache
  const DOM = {
    appRoot: document.getElementById('app-root'),
    loaderScreen: document.getElementById('loader-screen'),
    loaderSplashView: document.getElementById('loader-splash-view'),
    loaderSequenceView: document.getElementById('loader-sequence-view'),
    btnEnterDomain: document.getElementById('btn-enter-domain'),
    sequenceCyclingText: document.getElementById('sequence-cycling-text'),
    sequenceProgressBar: document.getElementById('sequence-progress-bar'),
    sequencePctIndicator: document.getElementById('sequence-pct-indicator'),
    mainApp: document.getElementById('main-app'),
    toastNotification: document.getElementById('tech-toast'),
    transmissionModal: document.getElementById('transmission-modal'),
    btnCloseTransmission: document.getElementById('btn-close-transmission'),
    gauntletCard: document.getElementById('gauntlet-card'),
    gauntletPowerVal: document.getElementById('gauntlet-power-val'),
    heroInteractiveStage: document.getElementById('hero-interactive-stage'),
    
    // Parallax Background
    parallaxHeroImageWrapper: document.getElementById('parallax-hero-image-wrapper'),
    parallaxMotesCanvas: document.getElementById('parallax-motes-canvas'),

    // HUD Cursor Elements
    hudCursorRing: document.getElementById('hud-cursor-ring'),
    hudCursorDot: document.getElementById('hud-cursor-dot'),

    // Tab Views
    tabBtns: document.querySelectorAll('.nav-tab-btn'),
    tabViews: {
      home: document.getElementById('tab-view-home'),
      events: document.getElementById('tab-view-events'),
      schedule: document.getElementById('tab-view-schedule'),
      sponsors: document.getElementById('tab-view-sponsors'),
      council: document.getElementById('tab-view-council'),
    },

    // Schedule Elements
    dayTabs: document.querySelectorAll('.btn-day-tab'),
    trackFilters: document.querySelectorAll('.btn-track-filter'),
    scheduleStreams: {
      day1: document.getElementById('schedule-stream-day1'),
      day2: document.getElementById('schedule-stream-day2'),
    },

    // Event & Sponsor Modals
    eventRegModal: document.getElementById('event-reg-modal'),
    eventRegModalTitle: document.getElementById('event-reg-modal-title'),
    btnCloseEventModal: document.getElementById('btn-close-event-modal'),
    sponsorInquiryModal: document.getElementById('sponsor-inquiry-modal'),

    // Terminal Elements
    doomTerminalModal: document.getElementById('doom-terminal-modal'),
    btnCloseTerminal: document.getElementById('btn-close-terminal-modal'),
    terminalDotClose: document.getElementById('terminal-dot-close'),
    terminalDotMin: document.getElementById('terminal-dot-min'),
    terminalDotMax: document.getElementById('terminal-dot-max'),
    terminalOutputBody: document.getElementById('terminal-output-body'),
    terminalCliInput: document.getElementById('terminal-cli-input'),
    terminalInputForm: document.getElementById('terminal-input-form'),
  };

  // Web Audio Synthesizer
  const AudioEngine = {
    ctx: null,
    init() {
      if (!this.ctx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    },
    playLaserCharge() {
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(120, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.35);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.4);
      } catch (e) {}
    },
    playKeyBeep() {
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(620, this.ctx.currentTime);
        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.06);
      } catch (e) {}
    },
    playTabSwitchTone() {
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(520, this.ctx.currentTime);
        osc.frequency.setValueAtTime(780, this.ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.2);
      } catch (e) {}
    },
    playAccessGrantedChime() {
      try {
        this.init();
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.setValueAtTime(659.25, this.ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(880, this.ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.5);
      } catch (e) {}
    }
  };

  // =========================================================================
  // CINEMATIC FORTRESS IMAGE PARALLAX BACKGROUND
  // =========================================================================

  function initBackgroundParallax() {
    if (!DOM.parallaxHeroImageWrapper) return;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    let targetScrollY = window.scrollY;
    let currentScrollY = targetScrollY;

    window.addEventListener('mousemove', (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    }, { passive: true });

    window.addEventListener('scroll', () => {
      targetScrollY = window.scrollY;
    }, { passive: true });

    function updateParallaxLoop() {
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;
      currentScrollY += (targetScrollY - currentScrollY) * 0.06;

      // 3D Parallax offset for the cinematic artwork
      const offsetX = currentMouseX * 30;
      const offsetY = currentMouseY * 20 - currentScrollY * 0.12;

      DOM.parallaxHeroImageWrapper.style.transform = `translate3d(${offsetX}px, ${offsetY}px, 0) scale(1.06)`;

      requestAnimationFrame(updateParallaxLoop);
    }
    requestAnimationFrame(updateParallaxLoop);
  }

  // =========================================================================
  // ATMOSPHERIC MOTES & VOLUMETRIC EMBERS CANVAS ENGINE
  // =========================================================================

  function initAtmosphericMotesCanvas() {
    const canvas = DOM.parallaxMotesCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const motesCount = Math.min(Math.floor(width / 32), 42);
    const motes = [];

    for (let i = 0; i < motesCount; i++) {
      motes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.6,
        speedY: Math.random() * 0.4 + 0.12,
        speedX: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.35 ? '#00FF66' : '#bd7eff',
        waveOffset: Math.random() * Math.PI * 2,
        waveSpeed: Math.random() * 0.02 + 0.01,
      });
    }

    function renderMotes() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < motes.length; i++) {
        const p = motes[i];
        p.waveOffset += p.waveSpeed;
        p.y -= p.speedY;
        p.x += Math.sin(p.waveOffset) * 0.35 + p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      }

      requestAnimationFrame(renderMotes);
    }
    requestAnimationFrame(renderMotes);
  }

  // =========================================================================
  // 3D PERSPECTIVE TILT PHYSICS & GLOSSY LIGHT SHEEN
  // =========================================================================

  function init3DCardTiltPhysics() {
    const tiltCards = document.querySelectorAll('.tilt-event-card, .tilt-sponsor-card');

    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardWidth = rect.width;
        const cardHeight = rect.height;

        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const centerX = cardWidth / 2;
        const centerY = cardHeight / 2;

        const rotateX = -((mouseY - centerY) / centerY) * 12;
        const rotateY = ((mouseX - centerX) / centerX) * 12;

        const pctX = (mouseX / cardWidth) * 100;
        const pctY = (mouseY / cardHeight) * 100;

        card.style.setProperty('--mouse-x', `${pctX}%`);
        card.style.setProperty('--mouse-y', `${pctY}%`);
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      });
    });
  }

  // =========================================================================
  // CUSTOM HUD TARGETING RETICLE CURSOR
  // =========================================================================

  function initHudCursor() {
    if (!DOM.hudCursorRing || !DOM.hudCursorDot) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      DOM.hudCursorDot.style.left = `${mouseX}px`;
      DOM.hudCursorDot.style.top = `${mouseY}px`;
    }, { passive: true });

    function renderCursor() {
      ringX += (mouseX - ringX) * 0.28;
      ringY += (mouseY - ringY) * 0.28;

      DOM.hudCursorRing.style.left = `${ringX}px`;
      DOM.hudCursorRing.style.top = `${ringY}px`;

      requestAnimationFrame(renderCursor);
    }
    requestAnimationFrame(renderCursor);

    function bindCursorInteractivity() {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, select, .interactive-card, .directive-card, .tilt-event-card, .tilt-sponsor-card, .council-member-card, .cmd-chip-btn, .social-cyber-btn, .btn, .subevent-pill, .window-dot, .btn-day-tab, .btn-track-filter, .timeline-card'
      );

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          DOM.hudCursorRing.classList.add('cursor-active');
          DOM.hudCursorDot.classList.add('cursor-active');
        });
        el.addEventListener('mouseleave', () => {
          DOM.hudCursorRing.classList.remove('cursor-active');
          DOM.hudCursorDot.classList.remove('cursor-active');
        });
      });
    }

    bindCursorInteractivity();
    window.refreshCursorListeners = bindCursorInteractivity;
  }

  // =========================================================================
  // MULTI-PAGE TAB ARCHITECTURE ('home' | 'events' | 'schedule' | 'sponsors' | 'council')
  // =========================================================================

  window.switchPageTab = function (tabName) {
    if (!DOM.tabViews[tabName]) return;

    AppState.activeTab = tabName;
    AudioEngine.playTabSwitchTone();

    DOM.tabBtns.forEach((btn) => {
      if (btn.getAttribute('data-tab') === tabName) {
        btn.classList.add('tab-active');
      } else {
        btn.classList.remove('tab-active');
      }
    });

    Object.keys(DOM.tabViews).forEach((key) => {
      const view = DOM.tabViews[key];
      if (key === tabName) {
        view.classList.add('tab-visible');
      } else {
        view.classList.remove('tab-visible');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    history.replaceState(null, '', `#${tabName}`);

    if (window.refreshCursorListeners) {
      setTimeout(window.refreshCursorListeners, 100);
    }
    init3DCardTiltPhysics();
  };

  // =========================================================================
  // FESTIVAL SCHEDULE TIMELINE CONTROLLER
  // =========================================================================

  window.switchScheduleDay = function (dayId) {
    AppState.activeScheduleDay = dayId;
    AudioEngine.playKeyBeep();

    document.querySelectorAll('.btn-day-tab').forEach((btn) => {
      if (btn.getAttribute('data-day') === dayId) {
        btn.classList.add('day-active');
      } else {
        btn.classList.remove('day-active');
      }
    });

    if (dayId === 'day1') {
      DOM.scheduleStreams.day1.classList.remove('hidden');
      DOM.scheduleStreams.day2.classList.add('hidden');
    } else {
      DOM.scheduleStreams.day1.classList.add('hidden');
      DOM.scheduleStreams.day2.classList.remove('hidden');
    }

    // Reapply current category filter
    filterScheduleTrack(AppState.activeScheduleTrack);
  };

  window.filterScheduleTrack = function (trackId) {
    AppState.activeScheduleTrack = trackId;
    AudioEngine.playKeyBeep();

    document.querySelectorAll('.btn-track-filter').forEach((btn) => {
      if (btn.getAttribute('data-track') === trackId) {
        btn.classList.add('filter-active');
      } else {
        btn.classList.remove('filter-active');
      }
    });

    const activeStream = DOM.scheduleStreams[AppState.activeScheduleDay];
    if (!activeStream) return;

    const rows = activeStream.querySelectorAll('.timeline-event-row');
    rows.forEach((row) => {
      const rowTrack = row.getAttribute('data-track');
      if (trackId === 'all' || rowTrack === trackId) {
        row.classList.remove('hidden-by-filter');
      } else {
        row.classList.add('hidden-by-filter');
      }
    });
  };

  // Event Registration Modal
  window.openEventRegistrationModal = function (eventTitle) {
    if (!DOM.eventRegModal) return;
    if (DOM.eventRegModalTitle) {
      DOM.eventRegModalTitle.textContent = `REGISTER // ${eventTitle.toUpperCase()}`;
    }
    DOM.eventRegModal.classList.add('open');
    DOM.eventRegModal.setAttribute('aria-hidden', 'false');
    AudioEngine.playLaserCharge();
  };

  window.closeEventRegistrationModal = function () {
    if (!DOM.eventRegModal) return;
    DOM.eventRegModal.classList.remove('open');
    DOM.eventRegModal.setAttribute('aria-hidden', 'true');
  };

  // Corporate Sponsorship Modal
  window.openSponsorInquiryModal = function () {
    if (!DOM.sponsorInquiryModal) return;
    DOM.sponsorInquiryModal.classList.add('open');
    DOM.sponsorInquiryModal.setAttribute('aria-hidden', 'false');
    AudioEngine.playLaserCharge();
  };

  window.closeSponsorInquiryModal = function () {
    if (!DOM.sponsorInquiryModal) return;
    DOM.sponsorInquiryModal.classList.remove('open');
    DOM.sponsorInquiryModal.setAttribute('aria-hidden', 'true');
  };

  // Download Sponsorship Brochure (Simulated PDF download)
  window.downloadSponsorshipDeck = function () {
    AudioEngine.playAccessGrantedChime();
    window.showTechToast('Downloading Technocracy 2026 Sponsorship Brochure (PDF)...');
    
    const dummyBlob = new Blob([
      "TECHNOCRACY 2026 // NIT RAIPUR SPONSORSHIP BROCHURE & DELIVERABLES\n\nEnterprise Partners: Publicis Sapient, NTPC, SBI, CSIDC\nCoding: Unstop, GeeksforGeeks, Devfolio, GitHub\nContact: nitrr.technocracy@gmail.com\nLocation: Sector NIT Raipur, GE Road"
    ], { type: 'text/plain' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dummyBlob);
    link.download = 'Technocracy_NIT_Raipur_Sponsorship_Brochure_2026.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // =========================================================================
  // LOADER & STATE MACHINE
  // =========================================================================

  function renderState() {
    if (AppState.isLoaded) {
      DOM.loaderScreen.classList.add('hidden');
      DOM.loaderScreen.classList.remove('loader-fade-out');
      DOM.loaderScreen.setAttribute('aria-hidden', 'true');

      DOM.mainApp.classList.remove('hidden');
      DOM.mainApp.setAttribute('aria-hidden', 'false');
    } else {
      DOM.mainApp.classList.add('hidden');
      DOM.mainApp.setAttribute('aria-hidden', 'true');

      DOM.loaderScreen.classList.remove('hidden');
      DOM.loaderScreen.classList.remove('loader-fade-out');
      DOM.loaderScreen.setAttribute('aria-hidden', 'false');

      DOM.loaderSplashView.classList.remove('hidden', 'fade-away');
      DOM.loaderSequenceView.classList.add('hidden');
    }
  }

  function triggerCinematicSequence() {
    AudioEngine.playLaserCharge();
    AppState.loaderStage = 'sequence';

    DOM.loaderSplashView.classList.add('fade-away');

    setTimeout(() => {
      DOM.loaderSplashView.classList.add('hidden');
      DOM.loaderSequenceView.classList.remove('hidden');

      const totalDuration = 2500;
      const startTime = performance.now();

      const stages = [
        { time: 0, text: 'Initializing Protocol 001...', pct: 20 },
        { time: 650, text: 'Overriding Avengers Systems...', pct: 55 },
        { time: 1350, text: 'Establishing Technocracy Network...', pct: 85 },
        { time: 1950, text: 'Access Granted.', pct: 100, isGrant: true }
      ];

      let lastIndex = -1;

      const timer = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const progressRatio = Math.min(elapsed / totalDuration, 1);
        const currentPct = Math.floor(progressRatio * 100);

        if (DOM.sequenceProgressBar) {
          DOM.sequenceProgressBar.style.width = `${currentPct}%`;
        }
        if (DOM.sequencePctIndicator) {
          DOM.sequencePctIndicator.textContent = `${currentPct}%`;
        }

        let activeStageIndex = 0;
        for (let i = stages.length - 1; i >= 0; i--) {
          if (elapsed >= stages[i].time) {
            activeStageIndex = i;
            break;
          }
        }

        if (activeStageIndex !== lastIndex) {
          lastIndex = activeStageIndex;
          const stage = stages[activeStageIndex];
          
          if (DOM.sequenceCyclingText) {
            DOM.sequenceCyclingText.textContent = stage.text;
            if (stage.isGrant) {
              DOM.sequenceCyclingText.classList.add('grant-access');
              AudioEngine.playAccessGrantedChime();
            } else {
              DOM.sequenceCyclingText.classList.remove('grant-access');
            }
          }
        }

        if (elapsed >= totalDuration) {
          clearInterval(timer);
          DOM.loaderScreen.classList.add('loader-fade-out');

          setTimeout(() => {
            AppState.isLoaded = true;
            AppState.loaderStage = 'completed';
            renderState();
            window.showTechToast('Welcome to Technocracy // NIT Raipur');
          }, 450);
        }
      }, 30);

    }, 300);
  }

  function init3DHeroParallax() {
    if (!DOM.heroInteractiveStage || !DOM.gauntletCard) return;

    DOM.heroInteractiveStage.addEventListener('mousemove', (e) => {
      const rect = DOM.heroInteractiveStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateY = (x / (rect.width / 2)) * 14;
      const rotateX = -(y / (rect.height / 2)) * 14;

      DOM.gauntletCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });

    DOM.heroInteractiveStage.addEventListener('mouseleave', () => {
      DOM.gauntletCard.style.transform = '';
    });

    setInterval(() => {
      if (!AppState.isLoaded || !DOM.gauntletPowerVal) return;
      const base = 998.4;
      const variance = (Math.random() * 24 - 10).toFixed(1);
      const currentPower = (base + parseFloat(variance)).toFixed(1);
      DOM.gauntletPowerVal.textContent = `${currentPower} GW`;
    }, 2400);
  }

  window.openTransmissionModal = function () {
    if (!DOM.transmissionModal) return;
    DOM.transmissionModal.classList.add('open');
    DOM.transmissionModal.setAttribute('aria-hidden', 'false');
    AudioEngine.playLaserCharge();
  };

  window.closeTransmissionModal = function () {
    if (!DOM.transmissionModal) return;
    DOM.transmissionModal.classList.remove('open');
    DOM.transmissionModal.setAttribute('aria-hidden', 'true');
  };

  // =========================================================================
  // CLEAN & LOGICAL CLI TERMINAL ENGINE
  // =========================================================================

  window.openDoomTerminal = function () {
    if (!DOM.doomTerminalModal) return;
    DOM.doomTerminalModal.classList.add('open');
    DOM.doomTerminalModal.setAttribute('aria-hidden', 'false');
    AudioEngine.playLaserCharge();
    setTimeout(() => {
      if (DOM.terminalCliInput) {
        DOM.terminalCliInput.focus();
      }
    }, 150);
  };

  window.closeDoomTerminal = function () {
    if (!DOM.doomTerminalModal) return;
    DOM.doomTerminalModal.classList.remove('open');
    DOM.doomTerminalModal.setAttribute('aria-hidden', 'true');
  };

  function appendTerminalOutput(cmd, outputHTML, isRawHTML = false) {
    if (!DOM.terminalOutputBody) return;

    const entryDiv = document.createElement('div');
    entryDiv.className = 'terminal-line-entry';

    if (cmd) {
      const cmdEcho = document.createElement('div');
      cmdEcho.className = 'terminal-cmd-echo';
      cmdEcho.innerHTML = `<span class="prompt-symbol">NITRR@TECH:~$</span> <span>${escapeHTML(cmd)}</span>`;
      entryDiv.appendChild(cmdEcho);
    }

    const responseDiv = document.createElement('div');
    responseDiv.className = 'terminal-response-text';

    if (isRawHTML) {
      responseDiv.innerHTML = outputHTML;
    } else {
      responseDiv.textContent = outputHTML;
    }

    entryDiv.appendChild(responseDiv);
    DOM.terminalOutputBody.appendChild(entryDiv);
    DOM.terminalOutputBody.scrollTop = DOM.terminalOutputBody.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  window.executeTerminalCommand = function (rawInput) {
    const cmd = rawInput.trim().toLowerCase();
    if (!cmd) return;

    AudioEngine.playKeyBeep();

    AppState.commandHistory.push(rawInput);
    AppState.historyIndex = AppState.commandHistory.length;

    switch (cmd) {
      case 'help':
        appendTerminalOutput(rawInput, `
TECHNOCRACY COMMAND PROTOCOLS:
------------------------------------------------------------------
  help     : Display all valid system CLI commands
  info     : Official briefing on Technocracy & NIT Raipur
  events   : Inspect live statuses for Vigyaan, Ignite & Aavartan
  schedule : View 2-day festival schedule & venue itinerary
  sponsors : Inspect Strategic, Coding & Media partners
  clear    : Flush the terminal screen buffer
------------------------------------------------------------------
        `, true);
        break;

      case 'info':
        appendTerminalOutput(rawInput, `
[TECHNOCRACY // NIT RAIPUR BRIEFING]
==================================================================
Organization : Technocracy (Official Technical Committee of NIT Raipur)
Location     : Sector NIT Raipur, GE Road, Raipur, Chhattisgarh
Mission      : Cultivating technical mastery, robotics, and engineering
               innovation across Central India.
Email        : nitrr.technocracy@gmail.com
Motto        : HAIL TECHNOCRACY
==================================================================
        `, true);
        break;

      case 'events':
        window.switchPageTab('events');
        appendTerminalOutput(rawInput, `
[TECHNOCRACY FLAGSHIP PILLARS]
==================================================================
  1. Vigyaan  : National Science & Model Exhibition
  2. Ignite   : Intra-College Techfest for NIT Raipur
  3. Aavartan : Central India's Premier Techfest
==================================================================
>> Switched interface to 'Events' tab.
        `, true);
        break;

      case 'schedule':
        window.switchPageTab('schedule');
        appendTerminalOutput(rawInput, `
[TECHNOCRACY FESTIVAL SCHEDULE // NIT RAIPUR]
==================================================================
  * DAY 01 : Inaugural Keynote, Vigyaan Model Jury, Reverse Coding
  * DAY 02 : Heavyweight Robo Wars, Hackathon Jury, Grand Finals
==================================================================
>> Switched interface to 'Schedule' tab.
        `, true);
        break;

      case 'sponsors':
        window.switchPageTab('sponsors');
        appendTerminalOutput(rawInput, `
[TECHNOCRACY CORPORATE ALLIANCES & PARTNERS]
==================================================================
  * Strategic & Enterprise : Publicis Sapient, NTPC, SBI, CSIDC
  * Platform & Coding      : Unstop, GeeksforGeeks, Devfolio, GitHub
  * Energy & Media         : Red Bull, Radio Mirchi 98.3, Press Bureau
==================================================================
>> Switched interface to 'Sponsors' tab.
        `, true);
        break;

      case 'clear':
        if (DOM.terminalOutputBody) {
          DOM.terminalOutputBody.innerHTML = `
            <div class="terminal-line-entry">
              <div class="terminal-response-text">Screen buffer cleared. Type 'help' for available commands.</div>
            </div>
          `;
        }
        break;

      default:
        appendTerminalOutput(rawInput, `
Command not recognized: "${cmd}". Type 'help' for the list of valid commands (help, info, events, schedule, sponsors, clear).
        `);
        break;
    }
  };

  window.handleTerminalFormSubmit = function () {
    if (!DOM.terminalCliInput) return;
    const value = DOM.terminalCliInput.value;
    if (value.trim()) {
      window.executeTerminalCommand(value);
      DOM.terminalCliInput.value = '';
    }
  };

  window.showTechToast = function (message) {
    if (!DOM.toastNotification) return;
    DOM.toastNotification.textContent = message;
    DOM.toastNotification.classList.add('visible');
    
    setTimeout(() => {
      DOM.toastNotification.classList.remove('visible');
    }, 3200);
  };

  function setupEventListeners() {
    if (DOM.btnEnterDomain) {
      DOM.btnEnterDomain.addEventListener('click', () => {
        triggerCinematicSequence();
      });
    }

    if (DOM.btnCloseTransmission) {
      DOM.btnCloseTransmission.addEventListener('click', () => {
        window.closeTransmissionModal();
      });
    }

    if (DOM.transmissionModal) {
      DOM.transmissionModal.addEventListener('click', (e) => {
        if (e.target === DOM.transmissionModal) {
          window.closeTransmissionModal();
        }
      });
    }

    if (DOM.btnCloseEventModal) {
      DOM.btnCloseEventModal.addEventListener('click', window.closeEventRegistrationModal);
    }
    if (DOM.eventRegModal) {
      DOM.eventRegModal.addEventListener('click', (e) => {
        if (e.target === DOM.eventRegModal) {
          window.closeEventRegistrationModal();
        }
      });
    }

    if (DOM.sponsorInquiryModal) {
      DOM.sponsorInquiryModal.addEventListener('click', (e) => {
        if (e.target === DOM.sponsorInquiryModal) {
          window.closeSponsorInquiryModal();
        }
      });
    }

    if (DOM.btnCloseTerminal) {
      DOM.btnCloseTerminal.addEventListener('click', window.closeDoomTerminal);
    }
    if (DOM.terminalDotClose) {
      DOM.terminalDotClose.addEventListener('click', window.closeDoomTerminal);
    }
    if (DOM.terminalDotMin) {
      DOM.terminalDotMin.addEventListener('click', window.closeDoomTerminal);
    }
    if (DOM.terminalDotMax) {
      DOM.terminalDotMax.addEventListener('click', () => {
        const win = document.getElementById('doom-terminal-window');
        if (win) {
          win.style.maxWidth = win.style.maxWidth === '98vw' ? '860px' : '98vw';
          win.style.height = win.style.height === '94vh' ? '560px' : '94vh';
        }
      });
    }

    if (DOM.doomTerminalModal) {
      DOM.doomTerminalModal.addEventListener('click', (e) => {
        if (e.target === DOM.doomTerminalModal) {
          window.closeDoomTerminal();
        }
      });
    }

    if (DOM.terminalCliInput) {
      DOM.terminalCliInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
          e.preventDefault();
          if (AppState.commandHistory.length > 0 && AppState.historyIndex > 0) {
            AppState.historyIndex--;
            DOM.terminalCliInput.value = AppState.commandHistory[AppState.historyIndex];
          }
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          if (AppState.historyIndex < AppState.commandHistory.length - 1) {
            AppState.historyIndex++;
            DOM.terminalCliInput.value = AppState.commandHistory[AppState.historyIndex];
          } else {
            AppState.historyIndex = AppState.commandHistory.length;
            DOM.terminalCliInput.value = '';
          }
        } else if (e.key === 'Escape') {
          window.closeDoomTerminal();
        }
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        window.closeDoomTerminal();
        window.closeTransmissionModal();
        window.closeEventRegistrationModal();
        window.closeSponsorInquiryModal();
      }
    });

    const hash = window.location.hash.replace('#', '');
    if (hash && DOM.tabViews[hash]) {
      window.switchPageTab(hash);
    }
  }

  // Initialization
  document.addEventListener('DOMContentLoaded', () => {
    renderState();
    setupEventListeners();
    initBackgroundParallax();
    initAtmosphericMotesCanvas();
    init3DHeroParallax();
    init3DCardTiltPhysics();
    initHudCursor();
  });
})();
