(() => {
  'use strict';

  // Methods Database
  const METHODS = {
    v60: {
      id: 'v60',
      name: 'V60 / Cono Filtrado',
      icon: '☕',
      defaultRatio: 16,
      minRatio: 13,
      maxRatio: 18,
      defaultCoffee: 18,
      grind: 'Media-Fina (tipo arena de playa)',
      temp: '92°C - 96°C',
      targetTime: 180,
      steps: [
        { time: 0, title: 'Bloom / Pre-infusión', desc: 'Vierte 50ml de agua en círculos suaves. Deja desgasificar 45 segundos.' },
        { time: 45, title: 'Primer Vertido (60%)', desc: 'Vierte en espiral desde el centro hacia afuera hasta alcanzar el 60% del agua.' },
        { time: 90, title: 'Segundo Vertido (100%)', desc: 'Vierte el resto del agua con flujo suave y continuo.' },
        { time: 135, title: 'Drenaje Final', desc: 'Deja filtrar completamente por gravedad hasta los 3:00 minutos.' }
      ]
    },
    aeropress: {
      id: 'aeropress',
      name: 'AeroPress',
      icon: '⚗️',
      defaultRatio: 13,
      minRatio: 10,
      maxRatio: 16,
      defaultCoffee: 15,
      grind: 'Media (tipo sal de mesa)',
      temp: '85°C - 90°C',
      targetTime: 120,
      steps: [
        { time: 0, title: 'Vertido Rápido', desc: 'Vierte toda el agua en 15 segundos y remueve 3 veces con la espátula.' },
        { time: 30, title: 'Infusión en Reposo', desc: 'Coloca el émbolo para crear vacío y espera hasta el minuto 1:15.' },
        { time: 75, title: 'Prensado Suave', desc: 'Presiona el émbolo hacia abajo despacio y constante durante 30 a 40 segundos.' }
      ]
    },
    frenchpress: {
      id: 'frenchpress',
      name: 'Prensa Francesa',
      icon: '🏺',
      defaultRatio: 12,
      minRatio: 10,
      maxRatio: 15,
      defaultCoffee: 25,
      grind: 'Gruesa (tipo sal marina)',
      temp: '92°C - 95°C',
      targetTime: 240,
      steps: [
        { time: 0, title: 'Vertido Total', desc: 'Vierte toda el agua mojando todo el café de forma pareja.' },
        { time: 60, title: 'Romper la Costra', desc: 'Con una cuchara, rompe suavemente la costra superficial de café molido.' },
        { time: 210, title: 'Bajar Émbolo', desc: 'Baja el émbolo lentamente sin aplastar los posos del fondo. Servir de inmediato.' }
      ]
    },
    chemex: {
      id: 'chemex',
      name: 'Chemex',
      icon: '⏳',
      defaultRatio: 15,
      minRatio: 13,
      maxRatio: 17,
      defaultCoffee: 30,
      grind: 'Media-Gruesa',
      temp: '94°C - 96°C',
      targetTime: 240,
      steps: [
        { time: 0, title: 'Bloom / Pre-infusión', desc: 'Vierte 70ml de agua en círculos sin tocar los bordes del filtro de papel.' },
        { time: 45, title: 'Vertido en Espiral', desc: 'Vierte agua suavemente manteniendo el nivel a 2 cm del borde.' },
        { time: 140, title: 'Segundo Vertido y Caída', desc: 'Completa el agua total y deja gotear hasta el tiempo final.' }
      ]
    },
    coldbrew: {
      id: 'coldbrew',
      name: 'Cold Brew',
      icon: '❄️',
      defaultRatio: 8,
      minRatio: 6,
      maxRatio: 10,
      defaultCoffee: 60,
      grind: 'Extra Gruesa',
      temp: 'Agua fría / Ambiente',
      targetTime: 0,
      steps: [
        { time: 0, title: 'Maceración en Frío', desc: 'Mezcla café con agua fría y deja macerar en heladera entre 16 y 24 horas.' }
      ]
    },
    moka: {
      id: 'moka',
      name: 'Moka Italiana',
      icon: '🇮🇹',
      defaultRatio: 10,
      minRatio: 8,
      maxRatio: 12,
      defaultCoffee: 18,
      grind: 'Fina',
      temp: 'Agua caliente en caldera',
      targetTime: 180,
      steps: [
        { time: 0, title: 'Fuego Bajo / Medio', desc: 'Coloca agua caliente en la base. Calienta con la tapa abierta a fuego bajo.' }
      ]
    },
    espresso: {
      id: 'espresso',
      name: 'Espresso',
      icon: '☕',
      defaultRatio: 2,
      minRatio: 1.5,
      maxRatio: 3,
      defaultCoffee: 18,
      grind: 'Extra Fina',
      temp: '90°C - 93°C (9 bar)',
      targetTime: 30,
      steps: [
        { time: 0, title: 'Extracción a Presión', desc: 'Extracción continua a 9 bares de presión durante 25 a 30 segundos.' }
      ]
    }
  };

  // State
  const state = {
    currentMethod: 'v60',
    coffeeGrams: 18.0,
    waterMl: 288,
    ratio: 16,
    timerRunning: false,
    timerSeconds: 0,
    timerInterval: null
  };

  // DOM Elements
  const methodsNav = document.getElementById('methodsNav');
  const inputCoffee = document.getElementById('inputCoffee');
  const inputWater = document.getElementById('inputWater');
  const ratioSlider = document.getElementById('ratioSlider');
  const ratioValueBadge = document.getElementById('ratioValueBadge');
  const ratioTasteIndicator = document.getElementById('ratioTasteIndicator');
  const specGrind = document.getElementById('specGrind');
  const specTemp = document.getElementById('specTemp');
  const themeToggle = document.getElementById('themeToggle');
  const toast = document.getElementById('toast');

  // Timer Elements
  const timerClock = document.getElementById('timerClock');
  const timerStageBadge = document.getElementById('timerStageBadge');
  const timerInstruction = document.getElementById('timerInstruction');
  const timerProgressBar = document.getElementById('timerProgressBar');
  const btnTimerToggle = document.getElementById('btnTimerToggle');
  const btnTimerReset = document.getElementById('btnTimerReset');

  // Sticky Mobile Bar
  const stickyCoffee = document.getElementById('stickyCoffee');
  const stickyWater = document.getElementById('stickyWater');
  const stickyRatio = document.getElementById('stickyRatio');
  const stickyBtnShare = document.getElementById('stickyBtnShare');

  // Audio Context for Beeps
  let audioCtx = null;
  function playBeep(freq = 600, duration = 0.15) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function init() {
    loadTheme();
    renderMethodsNav();
    attachEvents();
    selectMethod('v60');
  }

  function renderMethodsNav() {
    methodsNav.innerHTML = Object.values(METHODS).map(m => `
      <button class="method-btn ${m.id === state.currentMethod ? 'active' : ''}" data-id="${m.id}">
        <span>${m.icon}</span> ${m.name}
      </button>
    `).join('');
  }

  function selectMethod(methodId) {
    const m = METHODS[methodId];
    if (!m) return;

    state.currentMethod = methodId;
    state.ratio = m.defaultRatio;
    state.coffeeGrams = m.defaultCoffee;
    state.waterMl = Math.round(m.defaultCoffee * m.defaultRatio);

    // Update Slider limits
    ratioSlider.min = m.minRatio;
    ratioSlider.max = m.maxRatio;
    ratioSlider.step = m.id === 'espresso' ? 0.1 : 0.5;
    ratioSlider.value = m.defaultRatio;

    // Update Specs Box
    specGrind.textContent = m.grind;
    specTemp.textContent = m.temp;

    // Update Active Nav Button
    document.querySelectorAll('.method-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.id === methodId);
    });

    // Reset Timer
    resetTimer();

    updateUI();
  }

  function attachEvents() {
    // Method selector
    methodsNav.addEventListener('click', (e) => {
      const btn = e.target.closest('.method-btn');
      if (btn) selectMethod(btn.dataset.id);
    });

    // Coffee Input
    inputCoffee.addEventListener('input', (e) => {
      state.coffeeGrams = Math.max(1, parseFloat(e.target.value) || 1);
      state.waterMl = Math.round(state.coffeeGrams * state.ratio);
      updateUI(false);
    });

    // Water Input (Bidirectional)
    inputWater.addEventListener('input', (e) => {
      state.waterMl = Math.max(10, parseFloat(e.target.value) || 10);
      state.coffeeGrams = parseFloat((state.waterMl / state.ratio).toFixed(1));
      updateUI(false);
    });

    // Steppers (+ / -)
    document.querySelectorAll('.step-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const step = parseFloat(btn.dataset.step);
        if (targetId === 'inputCoffee') {
          state.coffeeGrams = Math.max(1, parseFloat((state.coffeeGrams + step).toFixed(1)));
          state.waterMl = Math.round(state.coffeeGrams * state.ratio);
        } else if (targetId === 'inputWater') {
          state.waterMl = Math.max(10, state.waterMl + step);
          state.coffeeGrams = parseFloat((state.waterMl / state.ratio).toFixed(1));
        }
        updateUI();
      });
    });

    // Ratio Slider
    ratioSlider.addEventListener('input', (e) => {
      state.ratio = parseFloat(e.target.value);
      state.waterMl = Math.round(state.coffeeGrams * state.ratio);
      updateUI();
    });

    // Servings Chips
    document.querySelectorAll('.serving-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const ml = parseFloat(chip.dataset.ml);
        state.waterMl = ml;
        state.coffeeGrams = parseFloat((ml / state.ratio).toFixed(1));
        updateUI();
        showToast(`☕ Preparación para ${chip.textContent.trim()}`);
      });
    });

    // Timer Controls
    btnTimerToggle.addEventListener('click', toggleTimer);
    btnTimerReset.addEventListener('click', resetTimer);

    // Share & Print
    document.getElementById('btnShareRecipe').addEventListener('click', shareRecipe);
    stickyBtnShare.addEventListener('click', shareRecipe);

    // Theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.faq-item').classList.toggle('active');
      });
    });
  }

  function updateUI(updateInputs = true) {
    if (updateInputs) {
      inputCoffee.value = state.coffeeGrams;
      inputWater.value = state.waterMl;
    }

    ratioValueBadge.textContent = `1 : ${state.ratio}`;

    // Taste indicator
    const m = METHODS[state.currentMethod];
    const mid = m.defaultRatio;
    if (state.ratio < mid - 0.5) {
      ratioTasteIndicator.textContent = 'Cuerpo Alto · Intenso';
      ratioTasteIndicator.style.color = '#f59e0b';
    } else if (state.ratio > mid + 0.5) {
      ratioTasteIndicator.textContent = 'Ligero · Notas Florales';
      ratioTasteIndicator.style.color = '#38bdf8';
    } else {
      ratioTasteIndicator.textContent = 'Equilibrado · Óptimo';
      ratioTasteIndicator.style.color = '#10b981';
    }

    // Update Sticky Bar
    stickyCoffee.textContent = `${state.coffeeGrams} g`;
    stickyWater.textContent = `${state.waterMl} ml`;
    stickyRatio.textContent = `1:${state.ratio}`;

    updateTimerDisplay();
  }

  // Timer Engine
  function toggleTimer() {
    if (state.timerRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  }

  function startTimer() {
    state.timerRunning = true;
    btnTimerToggle.innerHTML = '<span>⏸️</span> Pausar';
    timerClock.classList.add('active');

    // Beep start
    playBeep(800, 0.2);

    state.timerInterval = setInterval(() => {
      state.timerSeconds++;
      updateTimerDisplay();

      // Check step changes and chime
      const m = METHODS[state.currentMethod];
      if (m && m.steps) {
        const currentStep = m.steps.find(s => s.time === state.timerSeconds);
        if (currentStep) {
          playBeep(900, 0.25);
        }
      }
    }, 1000);
  }

  function pauseTimer() {
    state.timerRunning = false;
    btnTimerToggle.innerHTML = '<span>▶️</span> Continuar';
    timerClock.classList.remove('active');
    clearInterval(state.timerInterval);
  }

  function resetTimer() {
    pauseTimer();
    state.timerSeconds = 0;
    btnTimerToggle.innerHTML = '<span>▶️</span> Iniciar Vertido';
    timerProgressBar.style.width = '0%';
    updateTimerDisplay();
  }

  function updateTimerDisplay() {
    const mins = Math.floor(state.timerSeconds / 60);
    const secs = state.timerSeconds % 60;
    timerClock.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    const m = METHODS[state.currentMethod];
    if (!m || !m.steps || m.steps.length === 0) {
      timerStageBadge.textContent = 'Preparación';
      timerInstruction.textContent = 'Sigue las instrucciones del método.';
      return;
    }

    // Find current active step
    let activeStep = m.steps[0];
    for (let i = 0; i < m.steps.length; i++) {
      if (state.timerSeconds >= m.steps[i].time) {
        activeStep = m.steps[i];
      }
    }

    timerStageBadge.textContent = activeStep.title;
    timerInstruction.textContent = activeStep.desc;

    // Progress bar calculation
    const totalTarget = m.targetTime || 180;
    const pct = Math.min(100, (state.timerSeconds / totalTarget) * 100);
    timerProgressBar.style.width = `${pct}%`;
  }

  // Share Recipe
  function shareRecipe() {
    const m = METHODS[state.currentMethod];
    const text = `☕ *RECETA DE CAFÉ DE ESPECIALIDAD*
📍 *Método:* ${m.name}
⚖️ *Ratio:* 1:${state.ratio}

• Café molido: *${state.coffeeGrams} g* (${m.grind})
• Agua caliente: *${state.waterMl} ml* (${m.temp})
• Tiempo objetivo: *${Math.floor((m.targetTime||180)/60)}:${((m.targetTime||180)%60).toString().padStart(2, '0')} min*

Calculado con: https://sebiglesias.com.ar/cafe-ratio/`;

    if (navigator.share) {
      navigator.share({
        title: 'Receta Café Ratio Barista',
        text: text,
        url: 'https://sebiglesias.com.ar/cafe-ratio/'
      }).catch(() => copyToClipboard(text));
    } else {
      copyToClipboard(text);
    }
  }

  function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      showToast('✅ ¡Receta copiada al portapapeles!');
    }).catch(() => {
      showToast('❌ Error al copiar');
    });
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cafe_theme', next);
    themeToggle.textContent = next === 'dark' ? '☀️' : '🌙';
  }

  function loadTheme() {
    const saved = localStorage.getItem('cafe_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', saved);
    themeToggle.textContent = saved === 'dark' ? '☀️' : '🌙';
  }

  // Register PWA Service Worker
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
