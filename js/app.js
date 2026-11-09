/* ============================================
   Подножный корм — Основной JavaScript
   Функциональность:
   - Загрузка и рендер меню из JSON
   - Фильтрация по категориям и dietary-тегам
   - Мобильная навигация
   - Модалки (личный кабинет, QR-код)
   - Авторизация (localStorage для демо)
   - Генерация QR-кода с таймером обновления
   - Бонусный баланс
   - Анимации появления секций
   ============================================ */

(function() {
  'use strict';

  // ==========================================
  // Состояние приложения
  // ==========================================
  const state = {
    menuData: null,
    bonusConfig: null,
    currentUser: null,
    activeCategory: 'all',
    activeDietaryTags: new Set(),
    qrToken: null,
    qrTimerInterval: null,
    qrExpiry: null
  };

  // ==========================================
  // Утилиты
  // ==========================================
  function $(selector, context = document) {
    return context.querySelector(selector);
  }
  function $$(selector, context = document) {
    return [...context.querySelectorAll(selector)];
  }

  function formatPrice(price) {
    if (price === null || price === undefined) return '[ЗАПОЛНИТЬ]';
    return price.toLocaleString('ru-RU') + ' ₽';
  }

  function getTagClass(tag) {
    const map = {
      'веган': 'tag--vegan',
      'без глютена': 'tag--gf',
      'высокобелковое': 'tag--protein',
      'острое': 'tag--spicy',
      'авторский': 'tag--author'
    };
    return map[tag] || 'tag--default';
  }

  // ==========================================
  // Загрузка данных
  // ==========================================
  async function loadData() {
    try {
      const [menuRes, bonusRes] = await Promise.all([
        fetch('data/menu.json'),
        fetch('data/bonus_program.json')
      ]);
      state.menuData = await menuRes.json();
      state.bonusConfig = await bonusRes.json();
      renderMenu();
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      showMenuError();
    }
  }

  function showMenuError() {
    const container = $('#menuCategories');
    if (container) {
      container.innerHTML = '<p style="text-align:center;color:#E53935;padding:40px;">Не удалось загрузить меню. Обновите страницу.</p>';
    }
  }

  // ==========================================
  // Рендер меню
  // ==========================================
  function renderMenu() {
    if (!state.menuData) return;
    const container = $('#menuCategories');
    if (!container) return;

    container.innerHTML = '';

    state.menuData.categories.forEach(cat => {
      const section = document.createElement('div');
      section.className = 'menu-category visible';
      section.dataset.category = cat.id;
      section.id = `cat-${cat.id}`;

      let itemsHtml = '';
      cat.items.forEach(item => {
        const tags = (item.tags || []).map(t =>
          `<span class="tag ${getTagClass(t)}">${t}</span>`
        ).join('');

        const sizes = item.sizes && item.sizes.length > 1
          ? item.sizes.map(s => `${s.label} — ${formatPrice(s.price)}`).join(' / ')
          : '';

        itemsHtml += `
          <article class="menu-item" data-tags="${(item.tags || []).join(',')}" tabindex="0" role="button" aria-label="${item.name}, ${formatPrice(item.price)}">
            <div class="menu-item__header">
              <h3 class="menu-item__name">${item.name}</h3>
              <span class="menu-item__price">${formatPrice(item.price)}</span>
            </div>
            ${item.description ? `<p class="menu-item__desc">${item.description}</p>` : ''}
            ${sizes ? `<p class="menu-item__desc" style="font-size:0.8rem;">${sizes}</p>` : ''}
            ${tags ? `<div class="menu-item__tags">${tags}</div>` : ''}
          </article>
        `;
      });

      section.innerHTML = `
        <div class="menu-category__header">
          <span class="menu-category__icon" aria-hidden="true">${cat.icon}</span>
          <h3 class="menu-category__name">${cat.name}</h3>
        </div>
        ${cat.description ? `<p class="menu-category__desc">${cat.description}</p>` : ''}
        <div class="menu-items">${itemsHtml}</div>
        ${cat.note ? `<p style="margin-top:12px;font-size:0.85rem;color:var(--color-text-muted);">${cat.note}</p>` : ''}
      `;

      container.appendChild(section);
    });

    applyFilters();
  }

  function applyFilters() {
    const categories = $$('.menu-category');
    const hasDietaryFilter = state.activeDietaryTags.size > 0;

    categories.forEach(cat => {
      const catId = cat.dataset.category;
      const matchesCategory = state.activeCategory === 'all' || catId === state.activeCategory;

      if (!matchesCategory) {
        cat.classList.remove('visible');
        return;
      }

      if (hasDietaryFilter) {
        const items = $$('.menu-item', cat);
        let visibleCount = 0;
        items.forEach(item => {
          const tags = (item.dataset.tags || '').split(',').filter(Boolean);
          const matches = [...state.activeDietaryTags].some(tag => tags.includes(tag));
          item.style.display = matches ? '' : 'none';
          if (matches) visibleCount++;
        });
        cat.classList.toggle('visible', visibleCount > 0);
      } else {
        $$('.menu-item', cat).forEach(item => item.style.display = '');
        cat.classList.add('visible');
      }
    });
  }

  // ==========================================
  // Фильтры
  // ==========================================
  function initFilters() {
    // Категории
    $$('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.filter-btn').forEach(b => {
          b.classList.remove('filter-btn--active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('filter-btn--active');
        btn.setAttribute('aria-selected', 'true');
        state.activeCategory = btn.dataset.category;
        applyFilters();
      });
    });

    // Dietary теги
    $$('.dietary-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.tag;
        if (state.activeDietaryTags.has(tag)) {
          state.activeDietaryTags.delete(tag);
          btn.classList.remove('active');
        } else {
          state.activeDietaryTags.add(tag);
          btn.classList.add('active');
        }
        applyFilters();
      });
    });
  }

  // ==========================================
  // Хедер: скролл + бургер
  // ==========================================
  function initHeader() {
    const header = $('#header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });

    const burger = $('#burgerBtn');
    const mobileNav = $('#mobileNav');

    burger.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('active');
      burger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    $$('.mobile-nav__link').forEach(link => {
      link.addEventListener('click', () => {
        mobileNav.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // ==========================================
  // Модалки
  // ==========================================
  function openModal(id) {
    const modal = $(id);
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Фокус на первый input или кнопку закрытия
    setTimeout(() => {
      const focusable = modal.querySelector('input, button:not(.modal__close)');
      if (focusable) focusable.focus();
    }, 100);
  }

  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    // Остановить QR таймер если модалка QR
    if (modal.id === 'qrModal' || modal.id === 'cabinetModal') {
      stopQrTimer();
    }
  }

  function initModals() {
    // Открытие личного кабинета
    const openCabinet = () => {
      if (state.currentUser) {
        renderCabinet();
        openModal('#cabinetModal');
      } else {
        openModal('#cabinetModal');
        // Показать форму входа
        $('#authForm').style.display = '';
        $('#cabinetContent').hidden = true;
      }
    };

    $('#openCabinetBtn')?.addEventListener('click', openCabinet);
    $('#openCabinetBtnMobile')?.addEventListener('click', () => {
      $('#mobileNav').classList.remove('active');
      document.body.style.overflow = '';
      openCabinet();
    });
    $('#joinBonusBtn')?.addEventListener('click', openCabinet);

    // Быстрый QR
    const showQr = () => {
      if (state.currentUser) {
        generateQR();
        openModal('#qrModal');
        startQrTimer();
      } else {
        openCabinet();
      }
    };
    $('#showQrBtn')?.addEventListener('click', showQr);
    $('#openQrFromBar')?.addEventListener('click', showQr);

    // Закрытие модалок
    $$('[data-close-modal]').forEach(el => {
      el.addEventListener('click', () => {
        const modal = el.closest('.modal');
        closeModal(modal);
      });
    });

    // Escape для закрытия
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        $$('.modal.active').forEach(m => closeModal(m));
      }
    });
  }

  // ==========================================
  // Авторизация (demo: localStorage)
  // ==========================================
  function initAuth() {
    // Табы вход/регистрация
    $$('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.auth-tab').forEach(t => t.classList.remove('auth-tab--active'));
        tab.classList.add('auth-tab--active');
        const mode = tab.dataset.authMode;
        $('#loginForm').classList.toggle('auth-panel--hidden', mode !== 'login');
        $('#registerForm').classList.toggle('auth-panel--hidden', mode !== 'register');
      });
    });

    // Форма входа
    $('#loginForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = $('#loginPhone').value.trim();
      const password = $('#loginPassword').value;

      if (!phone || !password) {
        alert('Заполните все обязательные поля');
        return;
      }

      const users = JSON.parse(localStorage.getItem('pk_users') || '{}');
      const user = users[phone];

      if (!user) {
        alert('Пользователь не найден. Зарегистрируйтесь.');
        return;
      }
      if (user.password !== btoa(password)) {
        alert('Неверный пароль');
        return;
      }

      loginUser(user, phone);
    });

    // Форма регистрации
    $('#registerForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = $('#regName').value.trim();
      const phone = $('#regPhone').value.trim();
      const email = $('#regEmail').value.trim();
      const password = $('#regPassword').value;
      const consent = $('#regConsent').checked;

      if (!name || !phone || !password) {
        alert('Заполните все обязательные поля');
        return;
      }
      if (password.length < 8) {
        alert('Пароль должен быть минимум 8 символов');
        return;
      }
      if (!consent) {
        alert('Необходимо согласие на обработку персональных данных');
        return;
      }

      const users = JSON.parse(localStorage.getItem('pk_users') || '{}');
      if (users[phone]) {
        alert('Пользователь с таким телефоном уже существует');
        return;
      }

      const welcomeBonus = state.bonusConfig?.welcome_bonus || 111;
      const newUser = {
        id: crypto.randomUUID(),
        name,
        phone,
        email,
        password: btoa(password),
        createdAt: new Date().toISOString(),
        bonuses: welcomeBonus,
        pendingBonuses: 0,
        orders: [],
        bonusHistory: [
          { date: new Date().toLocaleDateString('ru-RU'), type: 'Начисление', description: 'Приветственные бонусы', amount: welcomeBonus }
        ]
      };

      users[phone] = newUser;
      localStorage.setItem('pk_users', JSON.stringify(users));
      localStorage.setItem('pk_current_user', phone);

      loginUser(newUser, phone);
    });

    // Выход
    $('#logoutBtn')?.addEventListener('click', () => {
      localStorage.removeItem('pk_current_user');
      state.currentUser = null;
      $$('.modal.active').forEach(m => closeModal(m));
    });

    // Восстановление доступа
    $('#forgotPasswordLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Функция восстановления пароля будет доступна после подключения backend. Напишите нам в Telegram: @podnozhnyj_korm');
    });
  }

  function loginUser(user, phone) {
    state.currentUser = { ...user, phone };
    localStorage.setItem('pk_current_user', phone);
    $('#authForm').style.display = 'none';
    $('#cabinetContent').hidden = false;
    renderCabinet();
    generateQR();
  }

  function loadSession() {
    const phone = localStorage.getItem('pk_current_user');
    if (!phone) return;
    const users = JSON.parse(localStorage.getItem('pk_users') || '{}');
    const user = users[phone];
    if (user) {
      state.currentUser = { ...user, phone };
    }
  }

  // ==========================================
  // Личный кабинет
  // ==========================================
  function renderCabinet() {
    if (!state.currentUser) return;
    const user = state.currentUser;

    // Инициалы
    const initials = user.name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    $('#cabinetInitials').textContent = initials;
    $('#cabinetName').textContent = user.name;
    $('#cabinetPhone').textContent = user.phone;
    $('#qrUserName').textContent = user.name;
    $('#qrModalName').textContent = user.name;

    // Профиль
    $('#profName').value = user.name;
    $('#profPhone').value = user.phone;
    $('#profEmail').value = user.email || '';

    // Бонусы
    $('#bonusCurrent').textContent = user.bonuses || 0;
    $('#bonusPending').textContent = user.pendingBonuses || 0;

    // История бонусов
    const historyBody = $('#bonusHistoryBody');
    if (user.bonusHistory && user.bonusHistory.length > 0) {
      historyBody.innerHTML = user.bonusHistory.map(h => `
        <tr>
          <td>${h.date}</td>
          <td>${h.type}: ${h.description}</td>
          <td style="color:${h.amount >= 0 ? 'var(--color-green-dark)' : '#E53935'};font-weight:600;">
            ${h.amount >= 0 ? '+' : ''}${h.amount}
          </td>
        </tr>
      `).join('');
    } else {
      historyBody.innerHTML = '<tr><td colspan="3" class="empty-state">Нет операций</td></tr>';
    }

    // Заказы
    const ordersBody = $('#ordersBody');
    if (user.orders && user.orders.length > 0) {
      ordersBody.innerHTML = user.orders.map(o => `
        <tr>
          <td>${o.date}</td>
          <td>${o.items}</td>
          <td>${formatPrice(o.total)}</td>
          <td>${o.status}</td>
          <td>+${o.bonusesEarned}</td>
        </tr>
      `).join('');
    } else {
      ordersBody.innerHTML = '<tr><td colspan="5" class="empty-state">Заказов пока нет</td></tr>';
    }
  }

  function initCabinetTabs() {
    $$('.cabinet-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.cabinet-tab').forEach(t => t.classList.remove('cabinet-tab--active'));
        tab.classList.add('cabinet-tab--active');
        const panelName = tab.dataset.tab;
        $$('.cabinet-panel').forEach(p => p.classList.remove('cabinet-panel--active'));
        $(`.cabinet-panel[data-panel="${panelName}"]`)?.classList.add('cabinet-panel--active');

        // Если QR таб — сгенерировать и запустить таймер
        if (panelName === 'qr') {
          generateQR();
          startQrTimer();
        } else {
          stopQrTimer();
        }
      });
    });

    // Сохранение профиля
    $('.profile-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!state.currentUser) return;
      const users = JSON.parse(localStorage.getItem('pk_users') || '{}');
      const user = users[state.currentUser.phone];
      if (user) {
        user.name = $('#profName').value.trim();
        user.email = $('#profEmail').value.trim();
        localStorage.setItem('pk_users', JSON.stringify(users));
        state.currentUser = { ...user, phone: state.currentUser.phone };
        renderCabinet();
        alert('Профиль сохранён');
      }
    });

    // Смена пароля
    $('.security-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const curPass = $('#curPass').value;
      const newPass = $('#newPass').value;
      const confirmPass = $('#confirmPass').value;

      if (!state.currentUser) return;
      const users = JSON.parse(localStorage.getItem('pk_users') || '{}');
      const user = users[state.currentUser.phone];

      if (user.password !== btoa(curPass)) {
        alert('Текущий пароль неверен');
        return;
      }
      if (newPass.length < 8) {
        alert('Новый пароль должен быть минимум 8 символов');
        return;
      }
      if (newPass !== confirmPass) {
        alert('Пароли не совпадают');
        return;
      }

      user.password = btoa(newPass);
      localStorage.setItem('pk_users', JSON.stringify(users));
      alert('Пароль успешно изменён');
      e.target.reset();
    });

    // Удаление аккаунта
    $('#deleteAccountBtn')?.addEventListener('click', () => {
      if (!confirm('Вы уверены? Все данные и бонусы будут удалены безвозвратно.')) return;
      if (!confirm('Последнее подтверждение: удалить аккаунт?')) return;

      const users = JSON.parse(localStorage.getItem('pk_users') || '{}');
      delete users[state.currentUser.phone];
      localStorage.setItem('pk_users', JSON.stringify(users));
      localStorage.removeItem('pk_current_user');
      state.currentUser = null;
      $$('.modal.active').forEach(m => closeModal(m));
      alert('Аккаунт удалён');
    });
  }

  // ==========================================
  // QR-код
  // ==========================================
  function generateQR() {
    if (!state.currentUser) return;

    // Генерируем одноразовый токен
    const token = crypto.randomUUID();
    state.qrToken = token;
    state.qrExpiry = Date.now() + 5 * 60 * 1000; // 5 минут

    // Данные для QR: не персональные данные, а ссылка с токеном
    const qrData = `PK:${state.currentUser.id}:${token}:${Date.now()}`;

    // Рендер в оба canvas
    renderQRToCanvas('#qrCanvas', qrData, 200);
    renderQRToCanvas('#qrCanvasModal', qrData, 280);

    // Обновить имя
    $('#qrUserName').textContent = state.currentUser.name;
    $('#qrModalName').textContent = state.currentUser.name;
  }

  function renderQRToCanvas(canvasSelector, data, size) {
    const canvas = $(canvasSelector);
    if (!canvas || typeof QRCode === 'undefined') return;

    try {
      QRCode.toCanvas(canvas, data, {
        width: size,
        height: size,
        margin: 2,
        color: {
          dark: '#5D3A1A',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      });
    } catch (err) {
      console.error('QR генерация ошибка:', err);
    }
  }

  function startQrTimer() {
    stopQrTimer();
    updateQrTimerDisplay();

    state.qrTimerInterval = setInterval(() => {
      const remaining = state.qrExpiry - Date.now();
      if (remaining <= 0) {
        // Токен истёк — обновляем
        generateQR();
        updateQrTimerDisplay();
      } else {
        updateQrTimerDisplay(remaining);
      }
    }, 1000);
  }

  function stopQrTimer() {
    if (state.qrTimerInterval) {
      clearInterval(state.qrTimerInterval);
      state.qrTimerInterval = null;
    }
  }

  function updateQrTimerDisplay(remaining) {
    if (remaining === undefined) {
      remaining = state.qrExpiry - Date.now();
    }
    const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const text = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    const timerEl = $('#qrTimerText');
    const modalTimerEl = $('#qrModalTimerText');
    if (timerEl) timerEl.textContent = `Обновление через ${text}`;
    if (modalTimerEl) modalTimerEl.textContent = `Обновление через ${text}`;
  }

  function initQrRefresh() {
    $('#refreshQrBtn')?.addEventListener('click', () => {
      generateQR();
      startQrTimer();
    });
  }

  // ==========================================
  // Анимации появления
  // ==========================================
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Применяем к карточкам концепции, отзывам, десертам
    $$('.concept-card, .review-card, .dessert-card, .bonus-card, .gallery__item').forEach(el => {
      el.classList.add('fade-in');
      observer.observe(el);
    });
  }

  // ==========================================
  // Плавный скролл для якорных ссылок
  // ==========================================
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId === '#') return;
        const target = $(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ==========================================
  // Инициализация
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    loadSession();
    loadData();
    initHeader();
    initFilters();
    initModals();
    initAuth();
    initCabinetTabs();
    initQrRefresh();
    initScrollAnimations();
    initSmoothScroll();

    // Если пользователь уже авторизован — обновить QR при открытии кабинета
    if (state.currentUser) {
      // Автовход
      $('#authForm').style.display = 'none';
      $('#cabinetContent').hidden = false;
      renderCabinet();
    }
  });

})();
