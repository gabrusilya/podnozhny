/* ============================================
   Подножный корм — Админ-панель
   Демо-режим на localStorage (общий с основным сайтом)
   Функции: вход/создание аккаунта, список пользователей,
   статистика, поиск, карточка, корректировка бонусов,
   блокировка, удаление, экспорт CSV, журнал операций
   ============================================ */
(function () {
  'use strict';

  const LS_USERS = 'pk_users';      // общий ключ с index.html
  const LS_ADMINS = 'pk_admins';    // аккаунты сотрудников
  const LS_SESSION = 'pk_admin_session';
  const LS_LOG = 'pk_admin_log';

  let currentAdmin = null;
  let selectedPhone = null;

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }
  function writeJSON(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
  function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, m =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
  function fmtDate(iso) {
    if (!iso) return '—';
    const d = new Date(iso);
    return d.toLocaleDateString('ru-RU') + ' ' + d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  }
  function log(action) {
    const arr = readJSON(LS_LOG, []);
    arr.unshift({ time: new Date().toISOString(), admin: currentAdmin?.name || '?', action });
    writeJSON(LS_LOG, arr.slice(0, 200));
    renderLog();
  }

  // ==========================================
  // Вход / создание первого админ-аккаунта
  // ==========================================
  function initLogin() {
    const admins = readJSON(LS_ADMINS, {});
    const firstRun = Object.keys(admins).length === 0;

    if (firstRun) {
      $('#loginSub').textContent = 'Первый запуск: создайте аккаунт администратора';
      $('#loginSubmitBtn').textContent = 'Создать аккаунт и войти';
      // добавляем поле имени
      const nameWrap = document.createElement('div');
      nameWrap.innerHTML = '<label for="adminName">Имя</label><input type="text" id="adminName" placeholder="Например: Юлия">';
      $('#loginForm').insertBefore(nameWrap, $('#adminPass').closest('div'));
    }

    $('#loginForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const login = $('#adminLogin').value.trim();
      const pass = $('#adminPass').value;
      const errEl = $('#loginError');
      errEl.textContent = '';

      if (!login || !pass) { errEl.textContent = 'Заполните все поля'; return; }
      if (pass.length < 6) { errEl.textContent = 'Пароль минимум 6 символов'; return; }

      const admins = readJSON(LS_ADMINS, {});

      if (firstRun) {
        const name = ($('#adminName')?.value || '').trim() || 'Администратор';
        admins[login] = { name, password: btoa(pass), role: 'admin', createdAt: new Date().toISOString() };
        writeJSON(LS_ADMINS, admins);
        enterPanel({ name, login });
        log(`Создан админ-аккаунт: ${name} (${login})`);
        return;
      }

      const acc = admins[login];
      if (!acc || acc.password !== btoa(pass)) {
        errEl.textContent = 'Неверный логин или пароль';
        return;
      }
      enterPanel(acc);
      log(`Вход в админ-панель: ${acc.name}`);
    });
  }

  function enterPanel(acc) {
    currentAdmin = acc;
    sessionStorage.setItem(LS_SESSION, JSON.stringify({ login: acc.login || Object.keys(readJSON(LS_ADMINS, {})).find(k => readJSON(LS_ADMINS, {})[k].name === acc.name) || '', name: acc.name }));
    $('#loginScreen').classList.add('hidden');
    $('#adminPanel').classList.remove('hidden');
    renderAll();
  }

  function restoreSession() {
    const s = readJSON(LS_SESSION, null);
    if (s && s.name) {
      currentAdmin = { name: s.name, login: s.login };
      $('#loginScreen').classList.add('hidden');
      $('#adminPanel').classList.remove('hidden');
      renderAll();
    }
  }

  function logout() {
    sessionStorage.removeItem(LS_SESSION);
    location.reload();
  }

  // ==========================================
  // Данные пользователей
  // ==========================================
  function getUsers() {
    const obj = readJSON(LS_USERS, {});
    return Object.entries(obj).map(([phone, u]) => ({ ...u, phone }));
  }

  function saveUsers(users) {
    const obj = {};
    users.forEach(u => { obj[u.phone] = u; });
    writeJSON(LS_USERS, obj);
  }

  // ==========================================
  // Рендер
  // ==========================================
  function renderAll() {
    renderStats();
    renderUsers();
    renderLog();
  }

  function renderStats() {
    const users = getUsers();
    const active = users.filter(u => !u.is_blocked).length;
    const blocked = users.length - active;
    const totalBonus = users.reduce((s, u) => s + (u.bonuses || 0), 0);
    const totalOrders = users.reduce((s, u) => s + (u.orders?.length || 0), 0);

    $('#statsRow').innerHTML = `
      <div class="stat-card"><div class="label">Всего пользователей</div><div class="value">${users.length}</div></div>
      <div class="stat-card"><div class="label">Активных</div><div class="value green">${active}</div></div>
      <div class="stat-card"><div class="label">Заблокировано</div><div class="value">${blocked}</div></div>
      <div class="stat-card"><div class="label">Бонусов на счетах</div><div class="value">${totalBonus}</div></div>
      <div class="stat-card"><div class="label">Всего заказов</div><div class="value">${totalOrders}</div></div>
    `;
  }

  function renderUsers(filter = '') {
    const body = $('#usersBody');
    const users = getUsers().filter(u => {
      if (!filter) return true;
      const f = filter.toLowerCase();
      return (u.name || '').toLowerCase().includes(f) || (u.phone || '').includes(f) || (u.email || '').toLowerCase().includes(f);
    }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

    if (users.length === 0) {
      body.innerHTML = `<tr><td colspan="9" class="empty">Пользователей пока нет. Зарегистрируйте гостя на главном сайте (кнопка «Личный кабинет» → Регистрация).</td></tr>`;
      return;
    }

    body.innerHTML = users.map(u => `
      <tr class="${u.is_blocked ? 'blocked-row' : ''}" data-phone="${esc(u.phone)}">
        <td title="${esc(u.id)}">${esc((u.id || '').slice(0, 8))}</td>
        <td><strong>${esc(u.name)}</strong>${u.diet_preference ? `<br><small style="color:var(--muted)">${esc(u.diet_preference)}</small>` : ''}</td>
        <td>${esc(u.phone)}</td>
        <td>${esc(u.email || '—')}</td>
        <td><strong style="color:var(--green-dark)">${u.bonuses || 0}</strong>${u.pendingBonuses ? ` <small style="color:var(--muted)">(+${u.pendingBonuses})</small>` : ''}</td>
        <td>${u.orders?.length || 0}</td>
        <td>${fmtDate(u.createdAt)}</td>
        <td><span class="badge ${u.is_blocked ? 'badge--blocked' : 'badge--ok'}">${u.is_blocked ? 'Заблокирован' : 'Активен'}</span></td>
        <td class="actions">
          <button class="btn btn--outline btn--sm" data-act="view">Карточка</button>
          <button class="btn btn--outline btn--sm" data-act="toggle">${u.is_blocked ? 'Разблокировать' : 'Блок'}</button>
          <button class="btn btn--danger btn--sm" data-act="delete">Удалить</button>
        </td>
      </tr>
    `).join('');

    // события
    $$('#usersBody [data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const phone = btn.closest('tr').dataset.phone;
        const act = btn.dataset.act;
        if (act === 'view') openUserModal(phone);
        if (act === 'toggle') toggleBlock(phone);
        if (act === 'delete') deleteUser(phone);
      });
    });
  }

  function renderLog() {
    const arr = readJSON(LS_LOG, []);
    $('#logList').innerHTML = arr.length
      ? arr.map(l => `<div class="log-item"><span class="time">${fmtDate(l.time)}</span><strong>${esc(l.admin)}</strong> — ${esc(l.action)}</div>`).join('')
      : '<div class="log-item">Операций пока нет</div>';
  }

  // ==========================================
  // Действия
  // ==========================================
  function toggleBlock(phone) {
    const users = getUsers();
    const u = users.find(x => x.phone === phone);
    if (!u) return;
    u.is_blocked = !u.is_blocked;
    saveUsers(users);
    log(`${u.is_blocked ? 'Блокировка' : 'Разблокировка'} пользователя: ${u.name} (${phone})`);
    renderAll();
  }

  function deleteUser(phone) {
    const users = getUsers();
    const u = users.find(x => x.phone === phone);
    if (!u) return;
    if (!confirm(`Удалить пользователя «${u.name}» (${phone})?\nВсе данные и бонусы будут удалены безвозвратно.`)) return;
    if (!confirm('Последнее подтверждение: удалить?')) return;
    const rest = users.filter(x => x.phone !== phone);
    saveUsers(rest);
    log(`Удаление пользователя: ${u.name} (${phone})`);
    closeModal('#userModal');
    renderAll();
  }

  // ==========================================
  // Модалка карточки
  // ==========================================
  function openUserModal(phone) {
    selectedPhone = phone;
    const u = getUsers().find(x => x.phone === phone);
    if (!u) return;

    $('#userModalTitle').textContent = `Карточка: ${u.name}`;
    $('#userDetailInfo').innerHTML = `
      <div class="detail-row"><span>ID</span><span>${esc(u.id)}</span></div>
      <div class="detail-row"><span>Телефон</span><span>${esc(u.phone)}</span></div>
      <div class="detail-row"><span>Email</span><span>${esc(u.email || '—')}</span></div>
      <div class="detail-row"><span>Предпочтения</span><span>${esc(u.diet_preference || 'не указаны')}</span></div>
      <div class="detail-row"><span>Бонусы</span><span><strong style="color:var(--green-dark)">${u.bonuses || 0}</strong> (ожидает ${u.pendingBonuses || 0})</span></div>
      <div class="detail-row"><span>Заказов</span><span>${u.orders?.length || 0}</span></div>
      <div class="detail-row"><span>Регистрация</span><span>${fmtDate(u.createdAt)}</span></div>
      <div class="detail-row"><span>Статус</span><span>${u.is_blocked ? 'Заблокирован' : 'Активен'}</span></div>
    `;

    const hist = u.bonusHistory || [];
    $('#userHistoryBody').innerHTML = hist.length
      ? hist.map(h => `<tr><td>${esc(h.date)}</td><td>${esc(h.type)}: ${esc(h.description)}</td><td style="color:${h.amount >= 0 ? 'var(--green-dark)' : 'var(--red)'};font-weight:600">${h.amount >= 0 ? '+' : ''}${h.amount}</td></tr>`).join('')
      : '<tr><td colspan="3" class="empty">Нет операций</td></tr>';

    $('#adjustAmount').value = '';
    $('#adjustComment').value = '';
    $('#userModal').classList.add('active');
  }

  function closeModal(sel) { $(sel)?.classList.remove('active'); }

  // ==========================================
  // Экспорт CSV
  // ==========================================
  function exportCsv() {
    const users = getUsers();
    if (!users.length) { alert('Экспортировать нечего'); return; }
    const header = ['ID', 'Имя', 'Телефон', 'Email', 'Бонусы', 'Ожидаемые', 'Заказы', 'Регистрация', 'Статус'];
    const rows = users.map(u => [
      u.id, u.name, u.phone, u.email || '', u.bonuses || 0, u.pendingBonuses || 0,
      u.orders?.length || 0, fmtDate(u.createdAt), u.is_blocked ? 'Заблокирован' : 'Активен'
    ]);
    const csv = [header, ...rows]
      .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `podnozhny-korm-users-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    log('Экспорт списка пользователей в CSV');
  }

  // ==========================================
  // Инициализация
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initLogin();
    restoreSession();

    $('#logoutAdmin')?.addEventListener('click', logout);
    $('#exportCsv')?.addEventListener('click', exportCsv);
    $('#userSearch')?.addEventListener('input', (e) => renderUsers(e.target.value.trim()));
    $$('[data-close]').forEach(el => el.addEventListener('click', () => closeModal('#userModal')));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal('#userModal'); });

    // Корректировка бонусов
    $('#adjustForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!selectedPhone) return;
      const amount = parseInt($('#adjustAmount').value, 10);
      const comment = $('#adjustComment').value.trim();
      if (!amount) { alert('Введите сумму корректировки (не ноль)'); return; }
      if (!comment) { alert('Комментарий обязателен для корректировки'); return; }

      const users = getUsers();
      const u = users.find(x => x.phone === selectedPhone);
      if (!u) return;
      if ((u.bonuses || 0) + amount < 0) { alert('Баланс не может стать отрицательным'); return; }

      u.bonuses = (u.bonuses || 0) + amount;
      u.bonusHistory = u.bonusHistory || [];
      u.bonusHistory.push({
        date: new Date().toLocaleDateString('ru-RU'),
        type: 'Корректировка',
        description: `${amount > 0 ? 'Начислено' : 'Списано'} вручную (${currentAdmin.name}): ${comment}`,
        amount
      });
      saveUsers(users);
      log(`Корректировка бонусов ${u.name}: ${amount > 0 ? '+' : ''}${amount} — ${comment}`);
      renderAll();
      openUserModal(selectedPhone); // обновить модалку
      alert('Корректировка применена');
    });
  });

})();
