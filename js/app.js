/* ============================================
   Подножный корм — app.js v4
   Викторина (50 вопросов) + игра «Собери яблоки»
   Форма заказа с расчётом стоимости и доставкой
   Карусель афиши, lightbox со стрелками
   Всё на клиенте, без бэкенда
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initHeader();
  initMobileNav();
  initMenu();
  initQuiz();
  initApplesGame();
  initCakeForm();
  initPopupDiscount();
  initCakeGallery();
  initLightbox();
  initAfishaCarousel();
});

/* ---------- Preloader ---------- */
function initPreloader() {
  const pre = document.getElementById('preloader');
  if (!pre) return;
  window.addEventListener('load', () => setTimeout(() => pre.classList.add('hidden'), 300));
  setTimeout(() => pre.classList.add('hidden'), 3000);
}

/* ---------- Header ---------- */
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ---------- Mobile nav ---------- */
function initMobileNav() {
  const btn = document.getElementById('burgerBtn');
  const nav = document.getElementById('mobileNav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('active');
    btn.setAttribute('aria-expanded', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  nav.querySelectorAll('.mobile-nav__link').forEach(l => l.addEventListener('click', () => {
    nav.classList.remove('active');
    document.body.style.overflow = '';
  }));
}

/* ============================================
   Меню
   ============================================ */
const MENU_DATA = [
  { id: 'breakfast', name: 'Завтраки', icon: '🌅',
    description: 'Каши, сырники, смузи, омлеты, вафли, боулы — всё без добавленного сахара',
    items: [
      { name: 'Омлет или глазунья из двух яиц', desc: 'С зеленью и помидорами черри', price: 310, tags: ['без сахара'] },
      { name: '«Кокосовые колобки»', desc: 'Сырники без глютена с мёдом и урбечом', price: 330, tags: ['без глютена'] },
      { name: '«Зелёные колобки»', desc: 'Сырники без глютена с зеленью и чесноком', price: 380, tags: ['без глютена'] },
      { name: 'Боул «С красной рыбой»', desc: 'Сложные углеводы, овощи, нут, кешью-соус', price: 619, tags: ['высокобелковое'] },
      { name: 'Боул «С копчёным тофу»', desc: 'Сложные углеводы, овощи, нут, кешью-соус', price: 599, tags: ['веган'] },
      { name: 'Вафли с красной рыбой', desc: 'Без глютена, слабосолёная рыба, огурец, кешью-соус', price: 540, tags: ['без глютена'] },
      { name: 'Вафли с бананом и мёдом', desc: 'Без глютена, свежий банан, натуральный мёд', price: 330, tags: ['без глютена'] },
      { name: 'Гранола с молоком', desc: 'Хрустящая гранола, свежее молоко', price: 330, tags: ['без сахара'] },
      { name: 'Зелёная гречка со шпинатом', desc: 'С сыром и варёным яйцом', price: 530, tags: ['высокобелковое'] },
      { name: 'Панкейки с кокосовым йогуртом', desc: 'Без глютена, орехи', price: 330, tags: ['веган', 'без глютена'] }
    ]},
  { id: 'coffee', name: 'Кофе', icon: '☕',
    description: 'Эспрессо, авторские напитки, кофе в джезве на песке',
    items: [
      { name: 'Эспрессо', desc: '30 мл', price: 139, tags: [] },
      { name: 'Американо', desc: '0.2–0.4 л', price: 189, tags: [] },
      { name: 'Флэт уайт', desc: '', price: 249, tags: [] },
      { name: 'Капучино', desc: '0.2–0.4 л', price: 199, tags: [] },
      { name: 'Латте', desc: '0.2–0.3 л', price: 269, tags: [] },
      { name: 'Раф', desc: '', price: 309, tags: [] },
      { name: 'Кофе по-восточному', desc: 'В джезве на песке, 100 мл', price: 179, tags: ['авторский'] },
      { name: 'Дагестанский капучино', desc: 'С урбечем', price: 269, tags: ['авторский'] },
      { name: 'Ночь в Сириусе', desc: 'Со специями, в турке', price: 209, tags: ['авторский'] },
      { name: 'Хюгге капучино', desc: 'Тыквенный урбеч, мёд, специи', price: 329, tags: ['авторский'] }
    ]},
  { id: 'cacao', name: 'Какао', icon: '🍫',
    description: 'Церемониальное какао — как пили ацтеки',
    items: [
      { name: 'Церемониальное какао', desc: 'Горькое, с пенкой, по-настоящему', price: 289, tags: ['авторский'] },
      { name: 'Какао с куркумой', desc: 'Золотое, согревающее', price: 319, tags: ['авторский'] },
      { name: 'Какао с перцем и мёдом', desc: 'Пряное, бодрящее', price: 309, tags: ['авторский'] }
    ]},
  { id: 'drinks', name: 'Напитки', icon: '🌿',
    description: 'Чай, лимонады, растительные напитки',
    items: [
      { name: 'Чай (ассорти)', desc: 'Зелёный, чёрный, травяной, улун', price: 189, tags: [] },
      { name: 'Лимонад домашний', desc: 'Без сахара, сезонный состав', price: 249, tags: ['без сахара'] },
      { name: 'Куркума-латте', desc: 'Растительное молоко, куркума, имбирь', price: 299, tags: ['веган'] },
      { name: 'Мятный морс', desc: 'Свежая мята, клюква', price: 229, tags: ['без сахара'] }
    ]},
  { id: 'desserts', name: 'Десерты', icon: '🍰',
    description: 'Без сахара, глютена и лактозы — но со вкусом',
    items: [
      { name: 'RAW-торт с кешью кремом', desc: 'Веганский, с ягодами', price: 2700, tags: ['веган', 'без глютена'] },
      { name: 'RAW-конфеты', desc: 'Веганские, 1 шт ~50 г', price: 150, tags: ['веган', 'без глютена'] },
      { name: 'RAW-десерт', desc: 'Веганский, 150 г', price: 350, tags: ['веган', 'без глютена'] },
      { name: 'Птичье молоко', desc: 'Веганское, 100 г', price: 350, tags: ['веган', 'без глютена'] },
      { name: 'Тарт', desc: 'Веганский, от 100 г', price: 400, tags: ['веган', 'без глютена'] },
      { name: 'Финики с урбечем в шоколаде', desc: 'Веганские, 1 шт ~60 г', price: 170, tags: ['веган', 'без глютена'] }
    ]}
];

function initMenu() {
  const container = document.getElementById('menuCategories');
  const filters = document.querySelectorAll('.filter-btn');
  if (!container) return;

  MENU_DATA.forEach(cat => {
    const div = document.createElement('div');
    div.className = 'menu-category visible';
    div.dataset.category = cat.id;
    div.innerHTML = `
      <div class="menu-category__header">
        <span class="menu-category__icon">${cat.icon}</span>
        <h3 class="menu-category__name">${cat.name}</h3>
      </div>
      <p class="menu-category__desc">${cat.description}</p>
      <div class="menu-items">
        ${cat.items.map(i => `
          <div class="menu-item">
            <div class="menu-item__header">
              <span class="menu-item__name">${i.name}</span>
              <span class="menu-item__price">${i.price} ₽</span>
            </div>
            ${i.desc ? `<p class="menu-item__desc">${i.desc}</p>` : ''}
            ${i.tags.length ? `<div class="menu-item__tags">${i.tags.map(t => `<span class="tag tag--${getTagClass(t)}">${t}</span>`).join('')}</div>` : ''}
          </div>`).join('')}
      </div>`;
    container.appendChild(div);
  });

  filters.forEach(btn => btn.addEventListener('click', () => {
    filters.forEach(b => b.classList.remove('filter-btn--active'));
    btn.classList.add('filter-btn--active');
    const cat = btn.dataset.category;
    container.querySelectorAll('.menu-category').forEach(el =>
      el.classList.toggle('visible', cat === 'all' || el.dataset.category === cat));
  }));
}

function getTagClass(tag) {
  return ({ 'веган': 'vegan', 'без глютена': 'gf', 'высокобелковое': 'protein',
            'острое': 'spicy', 'авторский': 'author' })[tag] || 'default';
}

/* ============================================
   Промокоды
   ============================================ */
const PROMO_PREFIXES = ['ZHIVY', 'ENERGY', 'VITAMIN', 'NATURE', 'FRESH', 'APPLE'];

function generatePromoCode() {
  const p = PROMO_PREFIXES[Math.floor(Math.random() * PROMO_PREFIXES.length)];
  return `${p}-10-${Math.floor(Math.random() * 900) + 100}`;
}

function savePromo(code) {
  try { localStorage.setItem('pk_promo_code', code); } catch(e) {}
  const input = document.getElementById('cakePromo');
  if (input) input.value = code;
}

/* ============================================
   Игра 1 — викторина (банк 50 вопросов)
   ============================================ */
const GAME_QUESTIONS = [
  { q: 'Почему после сладкой булки через час хочется спать?',
    options: ['Сахар даёт быстрый скачок глюкозы, а потом резкий спад — и появляется усталость', 'Это просто так: организм отдыхает после еды', 'Булка тяжёлая, желудку трудно её переварить'],
    correct: 0, explain: 'Сахар → резкий подъём глюкозы → выброс инсулина → резкое падение → сонливость. Фрукты и мёд дают более ровную энергию.' },
  { q: 'Что произойдёт, если съесть целую плитку шоколада за раз?',
    options: ['Станете очень бодрым на весь день', 'Сначала взрыв энергии, а через час — упадок сил и раздражительность', 'Ничего, шоколад же полезный'],
    correct: 1, explain: 'Больше порция — сильнее «качели» глюкозы. Поэтому мы кладём в десерты немного мёда и ягод, а не килограммы сахара.' },
  { q: 'Откуда берётся «вторая жизнь» после сладкого обеда?',
    options: ['Из хорошего настроения', 'Из отложенного эффекта сахара: сначала подъём, потом провал', 'Это нормально, так бывает у всех'],
    correct: 1, explain: 'Эффект сахара откладывается: чем больше съели, тем сильнее провал. Белок и сложные углеводы такого не дают.' },
  { q: 'Чем мёд отличается от обычного сахара?',
    options: ['Ничем, оба одинаково вредны', 'У мёда есть витамины и он слаще — его нужно меньше, плюс он усваивается мягче', 'Мёд вообще нельзя есть'],
    correct: 1, explain: 'Мёд содержит микроэлементы и ферменты, слаще сахара, поэтому используется в меньшем количестве.' },
  { q: 'Почему на этикетках часто пишут «без добавленного сахара»?',
    options: ['Так модно', 'Сахар может быть скрыт в продуктах: соусы, хлеб, колбаса. Эта надпись означает, что производитель не добавлял его отдельно', 'Это маркетинг без смысла'],
    correct: 1, explain: 'В «полезных» йогуртах, хлебе и соусах сахар прячется под другими названиями. Надпись «без добавленного» — сигнал честности производителя.' },
  { q: 'Что такое «гликемический индекс» простыми словами?',
    options: ['Скорость, с которой продукт повышает сахар в крови', 'Количество калорий в продукте', 'Возраст продукта'],
    correct: 0, explain: 'Высокий ГИ (белый хлеб, сладости) — быстрый подъём и провал. Низкий ГИ (гречка, овощи, бобовые) — ровная энергия.' },
  { q: 'Почему фрукты полезнее конфет, хотя в них тоже сахар?',
    options: ['Во фруктах нет никакого сахара', 'Во фруктах сахар идёт вместе с клетчаткой, витаминами и водой — усваивается постепенно', 'Конфеты полезнее, потому что их меньше едят'],
    correct: 1, explain: 'Клетчатка замедляет всасывание сахара из фруктов — «качели» почти не бывают. Плюс вы получаете витамины и воду.' },
  { q: 'Что лучше перекусить перед сном, чтобы не проснуться голодным?',
    options: ['Плитку шоколада', 'Горсть орехов или йогурт', 'Стакан сладкого чая с печеньем'],
    correct: 1, explain: 'Белок и полезные жиры насыщают надолго и не вызывают скачков сахара.' },
  { q: 'Правда ли, что «сахар вызывает зависимость»?',
    options: ['Нет, это городская легенда', 'Да, сахар воздействует на те же центры удовольствия, что и другие стимуляторы — от него тянет ещё и ещё', 'Только дети к нему зависимы'],
    correct: 1, explain: 'Исследования показывают: сахар активирует систему вознаграждения мозга. Отсюда привычка тянуться к сладкому снова и снова.' },
  { q: 'Что такое «скрытый сахар»?',
    options: ['Сахар, который добавляют в чай дома', 'Сахар в продуктах, где его не ждёшь: кетчуп, йогурты, батончики, готовые соусы', 'Сахар, растворённый в воде'],
    correct: 1, explain: 'В среднем человек съедает 20+ ложек сахара в день, даже не считая. Читайте состав: «декстроза», «мальтоза», «сок концентрированный» — тоже сахар.' },
  { q: 'Зачем организму белок?',
    options: ['Только для мышц спортсменов', 'Это «кирпичики» для мышц, кожи, волос, ногтей, гормонов и иммунитета', 'Для красоты только'],
    correct: 1, explain: 'Белок участвует во всём: восстановление клеток, транспорт кислорода, ферменты, гормоны. Норма — примерно 1 г на кг веса в день.' },
  { q: 'Правда ли, что белок нужен только спортсменам?',
    options: ['Да, обычным людям достаточно овощей', 'Нет, всем — просто разным количеством', 'Белок полезен, но только утром'],
    correct: 1, explain: 'Спортсменам нужно чуть больше, но базовая потребность есть у каждого. Яйца, творог, рыба, бобовые — простые источники.' },
  { q: 'Какой продукт даст вам больше всего белка?',
    options: ['Стакан молока', '100 г куриной грудки', 'Ложка мёда'],
    correct: 1, explain: 'В 100 г курицы около 25–30 г белка, в стакане молока — 8–10 г, в мёде белка почти нет.' },
  { q: 'Почему веганам сложнее получать белок?',
    options: ['Они совсем не едят белок', 'Растительный белок часто неполноценный — нужно комбинировать разные продукты (например, рис + бобовые)', 'Растения не содержат белка вообще'],
    correct: 1, explain: 'Ни один растительный продукт не содержит все 9 незаменимых аминокислот идеально. Но комбинация злаков и бобовых закрывает пробел.' },
  { q: 'Когда лучше всего есть белок?',
    options: ['Только на завтрак', 'Равномерно в течение дня — в каждый приём пищи', 'Только вечером перед тренировкой'],
    correct: 1, explain: 'Организму проще использовать белок, если он поступает регулярно, а не всей порцией в один присест.' },
  { q: 'Что общего у яиц, творога и рыбы?',
    options: ['Все они без калорий', 'Все — источники полноценного белка', 'Все можно есть без ограничения'],
    correct: 1, explain: 'Животный белок содержит полный набор аминокислот. Именно поэтому яйца и творог — классика здорового завтрака.' },
  { q: 'Почему сытные блюда с белком помогают не переедать?',
    options: ['Белок делает еду невкусной', 'Белок дольше переваривается и сильнее снижает аппетит, чем углеводы', 'Это иллюзия'],
    correct: 1, explain: 'Исследования показывают: белок — самый сытный макронутриент. Он дольше остаётся в желудке и подавляет голод.' },
  { q: 'Сколько белка нужно среднему взрослому человеку?',
    options: ['Около 1 грамма на кг веса в день', '10 граммов на кг', 'Белок вообще не важен'],
    correct: 0, explain: 'Для человека весом 70 кг — примерно 70 г белка в день. Это 2 яйца, порция творога и кусок курицы или рыбы.' },
  { q: 'Что будет, если есть мало белка?',
    options: ['Ничего, организм сам справится', 'Слабеют мышцы, кожа теряет упругость, медленнее восстанавливаетесь после болезней', 'Станете сильнее'],
    correct: 1, explain: 'Белок — строительный материал. Его дефицит бьёт по мышцам, иммунитету, волосам и ногтям.' },
  { q: 'Какой растительный источник белка самый известный?',
    options: ['Тофу и бобовые (чечевица, нут, фасоль)', 'Картофель', 'Кукурузные хлопья'],
    correct: 0, explain: 'Тофу — соевый «сыр» с высоким содержанием белка. Бобовые в сочетании с крупами дают полный аминокислотный профиль.' },
  { q: 'Что такое «полезные жиры» и зачем они нужны?',
    options: ['Это жир от мяса — его нужно избегать', 'Жиры из орехов, авокадо, рыбы — нужны для кожи, мозга и гормонов', 'Это маргарин, только дорогой'],
    correct: 1, explain: 'Полезные жиры (омега-3, мононенасыщенные) — строительный материал для клеток. Без них кожа сохнет, мозг работает медленнее.' },
  { q: 'Почему оливковое масло считается полезным?',
    options: ['Оно самое дешёвое', 'Богато олеиновой кислотой и антиоксидантами, поддерживает сердце', 'Оно не имеет вкуса'],
    correct: 1, explain: 'Средиземноморская диета — одна из самых изученных. Оливковое масло снижает «плохой» холестерин и воспаление.' },
  { q: 'Что такое трансжиры?',
    options: ['Любые жиры, которые твёрдые при комнатной температуре', 'Искусственно созданные жиры (частично гидрогенизированные масла) — повышают риск сердечных проблем', 'Жиры растительного происхождения'],
    correct: 1, explain: 'Трансжиры встречаются в дешёвой выпечке, фастфуде, некоторых спредах. Они повышают «плохой» холестерин.' },
  { q: 'Зачем организму жир?',
    options: ['Он только откладывается впрок', 'Защищает органы, помогает усваивать витамины A, D, E, K, строит клетки мозга', 'Жир бесполезен'],
    correct: 1, explain: 'Жир — не враг. Без него витамины не усваиваются, кожа сохнет, нарушается работа гормонов.' },
  { q: 'Какая рыба богата омега-3?',
    options: ['Лосось, скумбрия, сардины', 'Карась', 'Любая рыба одинакова'],
    correct: 0, explain: 'Жирная рыба (лосось, скумбрия, сельдь, сардины) — лучший источник омега-3. Достаточно 2 порций в неделю.' },
  { q: 'Почему орехи полезны, но их не стоит есть ведрами?',
    options: ['Орехи не содержат жиров', 'Очень калорийные: горсть (30 г) в день — оптимально, больше — лишние калории', 'Орехи вредны'],
    correct: 1, explain: 'В 100 г орехов ~600 ккал. Горсть в день — норма. Больше — легко набрать лишние кило незаметно.' },
  { q: 'Чем сливочное масло отличается от маргарина?',
    options: ['Ничем', 'Сливочное — натуральный продукт без трансжиров, маргарин часто их содержит', 'Маргарин полезнее'],
    correct: 1, explain: 'Современные маргарины стали лучше, но классическое сливочное масло — прозрачный выбор без искусственных компонентов.' },
  { q: 'Почему авокадо называют «суперфудом»?',
    options: ['Оно вкусное', 'Богато мононенасыщенными жирами, калием, клетчаткой — всё сразу', 'Оно растёт высоко в горах'],
    correct: 1, explain: 'Авокадо сочетает полезные жиры, клетчатку и калий. Идеально для бутербродов и салатов.' },
  { q: 'Что происходит, когда вы едите слишком много насыщенных жиров?',
    options: ['Организм становится сильнее', 'Может повышаться «плохой» холестерин, растут риски для сердца', 'Ничего страшного'],
    correct: 1, explain: 'Насыщенные жиры (жирное мясо, сливки) в умеренных дозах нормальны. Избыток — фактор риска сердечно-сосудистых проблем.' },
  { q: 'Почему льняное семя полезно?',
    options: ['Оно хрустит', 'Источник растительной омега-3 (альфа-линоленовой кислоты) и клетчатки', 'Оно содержит витамин C'],
    correct: 1, explain: 'Льняное семя — один из немногих растительных источников омега-3. Ложка молотого семени в кашу — простой способ добавить пользу.' },
  { q: 'Что такое «сложные углеводы»?',
    options: ['Углеводы, которые сложно приготовить', 'Долгие цепочки (крупы, овощи, бобовые) — медленно расщепляются, дают ровную энергию', 'Углеводы из сладостей'],
    correct: 1, explain: 'Сложные углеводы (гречка, овсянка, картофель, бобовые) расщепляются медленно — вы не «проседаете» через час после обеда.' },
  { q: 'Зачем организму углеводы?',
    options: ['Они не нужны', 'Главный источник быстрой энергии для мозга и мышц', 'Только для похудения'],
    correct: 1, explain: 'Мозг потребляет ~120 г глюкозы в день. Полностью отказываться от углеводов — плохая идея.' },
  { q: 'Что полезнее: белый или цельнозерновой хлеб?',
    options: ['Белый — он мягче', 'Цельнозерновой: в нём больше клетчатки, витаминов и минералов', 'Одинаково'],
    correct: 1, explain: 'При производстве белого хлеба удаляют оболочку зерна — вместе с ней уходит клетчатка и часть питательных веществ.' },
  { q: 'Почему каши — основа здорового завтрака?',
    options: ['Они дешёвые', 'Дают сложные углеводы + клетчатку = энергия на несколько часов', 'Они быстро готовятся'],
    correct: 1, explain: 'Овсянка, гречка, рис — медленные углеводы. С ними уровень глюкозы держится стабильно до обеда.' },
  { q: 'Что такое «клетчатка»?',
    options: ['Волокно в ткани', 'Нерастворимые волокна в растениях — улучшают пищеварение, питают полезные бактерии кишечника', 'Тип витамина'],
    correct: 1, explain: 'Клетчатка не усваивается, но критически важна: она «чистит» кишечник, снижает холестерин, помогает контролировать вес.' },
  { q: 'Сколько клетчатки нужно в день?',
    options: ['5–10 г', '25–30 г', '100 г'],
    correct: 1, explain: 'Рекомендуемая норма — 25–30 г. Это овощи, фрукты, крупы, бобовые. Большинство людей получает вдвое меньше.' },
  { q: 'Почему картофель в мундире полезнее фри?',
    options: ['Он дешевле', 'Сохраняет кожуру с клетчаткой и не впитывает масло при жарке', 'Фри не существует'],
    correct: 1, explain: 'При жарке картофель впитывает масло (до 30% веса!). В мундире — минимум обработок, максимум пользы.' },
  { q: 'Почему бобовые (нут, чечевица) считаются «суперфудом»?',
    options: ['Они красивые', 'Сочетают белок + сложные углеводы + клетчатку в одном продукте', 'Они не содержат калорий'],
    correct: 1, explain: 'Бобовые — редкое сочетание: растительный белок, медленные углеводы, клетчатка. Основа питания во многих культурах.' },
  { q: 'Что полезнее: яблоко или яблочный сок?',
    options: ['Сок — он быстрее усваивается', 'Яблоко: в нём клетчатка, которая замедляет всасывание сахара', 'Одинаково'],
    correct: 1, explain: 'В соке клетчатка удалена, сахар усваивается мгновенно. Стакан сока = сахар из 2–3 яблок без клетчатки.' },
  { q: 'Сколько воды нужно пить в день?',
    options: ['Стакан', 'Около 1,5–2 литров (больше при жаре и нагрузке)', '10 литров'],
    correct: 1, explain: 'Ориентир — 30–35 мл на кг веса. При тренировках и жаре — больше. Чай и супы тоже учитываются.' },
  { q: 'Что произойдёт, если мало пить воду?',
    options: ['Ничего', 'Головная боль, усталость, сухость кожи, замедляется обмен веществ', 'Станете бодрее'],
    correct: 1, explain: 'Даже лёгкое обезвоживание (1–2%) ухудшает концентрацию и настроение. Тело на 60% состоит из воды.' },
  { q: 'Почему зелёный чай полезнее сладкой газировки?',
    options: ['Газировка не содержит сахара', 'В чае антиоксиданты (катехины) и L-теанин — мягко бодрит без скачка кофеина', 'Чай дешевле'],
    correct: 1, explain: 'L-теанин в зелёном чае даёт спокойную сосредоточенность. Газировка — чистый сахар без питательных веществ.' },
  { q: 'Что такое «умеренность» в питании?',
    options: ['Есть только одну еду', 'Сбалансированный рацион без крайностей: не голодать, не переедать', 'Диета на 500 ккал'],
    correct: 1, explain: 'Здоровое питание — это не запрет, а баланс. 80% времени ешьте цельные продукты, 20% — любимые радости.' },
  { q: 'Почему важно есть медленно?',
    options: ['Быстрее съедите', 'Сигнал сытости доходит до мозга через 15–20 минут — если есть быстро, легко переесть', 'Медленно есть скучно'],
    correct: 1, explain: 'Мозгу нужно время, чтобы «понять», что вы наелись. Медленное питание помогает остановиться вовремя.' },
  { q: 'Что полезнее: запекать или жарить овощи?',
    options: ['Жарить — вкуснее', 'Запекать или на пару: сохраняются витамины, нет лишнего масла', 'Одинаково'],
    correct: 1, explain: 'При жарке на масле теряется часть витаминов, добавляются калории. На пару и в духовке — максимум пользы.' },
  { q: 'Почему завтрак называют «самым важным приёмом пищи»?',
    options: ['Так говорят в рекламе', 'После ночного поста организму нужна энергия, чтобы запустить метаболизм на день', 'Завтрак всегда вкусный'],
    correct: 1, explain: 'Пропуск завтрака связан с перееданием в течение дня и снижением концентрации. Но главное — регулярность, а не ритуал.' },
  { q: 'Что такое «суперфуд»?',
    options: ['Секретный рецепт шеф-повара', 'Продукт, богатый микроэлементами: ягоды, зелень, орехи, рыба', 'Любой дорогой продукт'],
    correct: 1, explain: 'Суперфуд — не магия, а концентрация полезных веществ. Черника, шпинат, лосось, льняное семя — примеры.' },
  { q: 'Почему свежие ягоды полезнее варенья?',
    options: ['Варенье красивее', 'При варке разрушаются витамины, а сахара добавляют много', 'Ягоды дороже'],
    correct: 1, explain: 'В варенье на 100 г может быть 50–60% сахара. Свежие ягоды — тот же вкус без избытка.' },
  { q: 'Что лучше для фигуры: диета или сбалансированное питание?',
    options: ['Жёсткая диета — результат быстрее', 'Сбалансированное питание: устойчивый результат без срывов и вреда здоровью', 'Не есть вообще'],
    correct: 1, explain: 'Жёсткие диеты дают временный эффект и «эффект йо-йо». Сбалансированный рацион — долгосрочная стратегия.' },
  { q: 'Что такое антиоксиданты?',
    options: ['Витамины группы B', 'Молекулы, которые защищают клетки от старения и повреждений', 'Тип белка'],
    correct: 1, explain: 'Антиоксиданты нейтрализуют свободные радикалы. Источники: ягоды, зелень, какао, чай.' },
  { q: 'Какой овощ самый богатый витамином A?',
    options: ['Морковь', 'Огурец', 'Капуста'],
    correct: 0, explain: 'Морковь — рекордсмен по бета-каротину (предшественник витамина A). Важен для зрения и кожи.' },
  { q: 'Зачем организму витамин C?',
    options: ['Для роста волос', 'Поддерживает иммунитет, синтез коллагена, защищает от простуд', 'Только для усвоения железа'],
    correct: 1, explain: 'Витамин C — мощный антиоксидант. Цитрусовые, болгарский перец, киви, смородина — лучшие источники.' },
  { q: 'Почему шпинат называют «суперзеленью»?',
    options: ['Он зелёный', 'Богат железом, фолиевой кислотой, магнием, витаминами A, C, K', 'Он растёт быстро'],
    correct: 1, explain: 'Шпинат — чемпион по плотности питательных веществ. Листья салата беднее, но тоже полезны.' },
  { q: 'Почему полезно есть разнообразные овощи?',
    options: ['Так красиво на тарелке', 'Разные цвета = разные витамины и антиоксиданты', 'Овощи всегда дешёвые'],
    correct: 1, explain: '«Ешьте радугу» — правило: красный (ликопин), оранжевый (бета-каротин), зелёный (фолат), фиолетовый (антоцианы).' },
  { q: 'Что такое «микробиом кишечника»?',
    options: ['Вирус', 'Миллиарды полезных бактерий, которые помогают переваривать пищу и укрепляют иммунитет', 'Тип инфекции'],
    correct: 1, explain: 'Клетчатка и ферментированные продукты (кефир, квашеная капуста) питают полезные бактерии кишечника.' },
  { q: 'Почему ферментированные продукты полезны?',
    options: ['Они кислые', 'Содержат пробиотики — живые культуры, которые улучшают микрофлору', 'Они хранятся долго'],
    correct: 1, explain: 'Квашеная капуста, кефир, йогурт, мисо — источники пробиотиков. Поддержка микрофлоры = здоровье кишечника и иммунитета.' },
  { q: 'Что полезнее: свежий салат или тушёные овощи?',
    options: ['Свежий — больше витаминов', 'Тушёные — лучше усваиваются некоторые вещества (ликопин, бета-каротин)', 'Одинаково'],
    correct: 1, explain: 'Лёгкая термическая обработка выделяет ликопин из томатов и бета-каротин из моркови. Комбинируйте оба варианта.' },
  { q: 'Почему важно читать состав продуктов?',
    options: ['Так интересно', 'Можно обнаружить скрытый сахар, соль, трансжиры и добавки', 'Состав всегда короткий'],
    correct: 1, explain: '«Полезный» батончик может содержать 5 видов сахара. Состав — единственный способ узнать правду о продукте.' }
];

let quizState = { current: 0, score: 0, answered: false, round: [] };

function initQuiz() {
  const startBtn = document.getElementById('gameStartBtn');
  const restartBtn = document.getElementById('gameRestartBtn');
  if (!startBtn) return;
  startBtn.addEventListener('click', startQuiz);
  restartBtn.addEventListener('click', startQuiz);
}

function pickRoundQuestions() {
  let used = [];
  try { used = JSON.parse(localStorage.getItem('pk_game_used') || '[]'); } catch(e) {}
  const all = [...Array(GAME_QUESTIONS.length).keys()];
  const unused = all.filter(i => !used.includes(i));
  const pool = unused.length >= 5 ? unused : all;
  const picked = pool.sort(() => Math.random() - 0.5).slice(0, 5);
  picked.forEach(i => { if (!used.includes(i)) used.push(i); });
  if (used.length >= GAME_QUESTIONS.length * 0.8) used = [];
  try { localStorage.setItem('pk_game_used', JSON.stringify(used)); } catch(e) {}
  return picked.map(i => GAME_QUESTIONS[i]);
}

function startQuiz() {
  quizState = { current: 0, score: 0, answered: false, round: pickRoundQuestions() };
  showScreen('gameQuestion');
  renderQuestion();
}

function showScreen(id) {
  ['gameStart', 'gameQuestion', 'gameResult'].forEach(s => {
    const el = document.getElementById(s);
    if (el) el.classList.add('game-screen--hidden');
  });
  const target = document.getElementById(id);
  if (target) target.classList.remove('game-screen--hidden');
}

function renderQuestion() {
  const q = quizState.round[quizState.current];
  quizState.answered = false;
  document.getElementById('gameCounter').textContent = `Вопрос ${quizState.current + 1} из 5`;
  document.getElementById('gameProgressBar').style.width = `${(quizState.current / 5) * 100}%`;
  document.getElementById('gameQuestionText').textContent = q.q;
  document.getElementById('gameFeedback').textContent = '';

  const box = document.getElementById('gameOptions');
  box.innerHTML = q.options.map((o, i) => `<button class="game-option" data-index="${i}">${o}</button>`).join('');
  box.querySelectorAll('.game-option').forEach(b =>
    b.addEventListener('click', () => handleAnswer(parseInt(b.dataset.index))));
}

function handleAnswer(index) {
  if (quizState.answered) return;
  quizState.answered = true;
  const q = quizState.round[quizState.current];
  const opts = document.querySelectorAll('.game-option');
  const ok = index === q.correct;
  opts[q.correct].classList.add('game-option--correct');
  if (!ok) opts[index].classList.add('game-option--wrong');
  else quizState.score++;
  document.getElementById('gameFeedback').textContent = q.explain;
  opts.forEach(o => o.style.pointerEvents = 'none');

  setTimeout(() => {
    quizState.current++;
    if (quizState.current < 5) renderQuestion();
    else finishQuiz();
  }, 2500);
}

function finishQuiz() {
  showScreen('gameResult');
  document.getElementById('gameProgressBar').style.width = '100%';
  const s = quizState.score;
  const emoji = document.getElementById('gameResultEmoji');
  const title = document.getElementById('gameResultTitle');
  const text = document.getElementById('gameResultText');

  if (s >= 4) { emoji.textContent = '🏆'; title.textContent = `Отлично! ${s} из 5`; text.textContent = 'Вы настоящий знаток здорового питания. Скидка ваша!'; }
  else if (s >= 3) { emoji.textContent = '👏'; title.textContent = `Хорошо! ${s} из 5`; text.textContent = 'Неплохо! А теперь попробуйте у нас — узнаете ещё больше на вкус.'; }
  else { emoji.textContent = '🌱'; title.textContent = `${s} из 5 — начало пути!`; text.textContent = 'Ничего страшного — именно для этого мы и здесь. Приходите, расскажем и покажем на практике!'; }

  const code = generatePromoCode();
  document.getElementById('discountCode').textContent = code;
  document.getElementById('gameDiscount').style.display = 'block';
  savePromo(code);
}

/* ============================================
   Игра 2 — собери яблоки за 30 секунд
   Canvas, без внешних библиотек
   ============================================ */
const APPLES_TARGET = 15;
const APPLES_TIME = 30;

const applesGame = {
  canvas: null, ctx: null,
  basketX: 320, basketW: 90, basketH: 46,
  apples: [], score: 0, timeLeft: APPLES_TIME,
  running: false, rafId: null, timerId: null,
  lastSpawn: 0, W: 640, H: 420
};

function initApplesGame() {
  const startBtn = document.getElementById('applesStartBtn');
  const restartBtn = document.getElementById('applesRestartBtn');
  if (!startBtn) return;
  startBtn.addEventListener('click', startApplesGame);
  restartBtn.addEventListener('click', startApplesGame);

  // Переключатель игр
  document.querySelectorAll('.game-switch__btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.game-switch__btn').forEach(b => b.classList.remove('game-switch__btn--active'));
      btn.classList.add('game-switch__btn--active');
      const g = btn.dataset.game;
      document.getElementById('gameBoxQuiz').classList.toggle('game-box--hidden', g !== 'quiz');
      document.getElementById('gameBoxApples').classList.toggle('game-box--hidden', g !== 'apples');
      stopApplesGame();
    });
  });
}

function startApplesGame() {
  const c = document.getElementById('applesCanvas');
  if (!c) return;
  applesGame.canvas = c;
  applesGame.ctx = c.getContext('2d');
  applesGame.W = c.width;
  applesGame.H = c.height;
  applesGame.basketX = applesGame.W / 2;
  applesGame.apples = [];
  applesGame.score = 0;
  applesGame.timeLeft = APPLES_TIME;
  applesGame.running = true;
  applesGame.lastSpawn = 0;

  ['applesStart', 'applesPlay', 'applesResult'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('game-screen--hidden');
  });
  document.getElementById('applesPlay').classList.remove('game-screen--hidden');
  document.getElementById('applesScore').textContent = '0';
  document.getElementById('applesTimer').textContent = String(APPLES_TIME);

  bindApplesControls();

  applesGame.timerId = setInterval(() => {
    applesGame.timeLeft--;
    const t = document.getElementById('applesTimer');
    if (t) t.textContent = String(Math.max(0, applesGame.timeLeft));
    if (applesGame.timeLeft <= 0) endApplesGame();
  }, 1000);

  loopApples();
}

function bindApplesControls() {
  const c = applesGame.canvas;
  if (!c || c.dataset.bound) return;
  c.dataset.bound = '1';

  function moveTo(clientX) {
    const rect = c.getBoundingClientRect();
    const scale = c.width / rect.width;
    applesGame.basketX = (clientX - rect.left) * scale;
  }
  c.addEventListener('mousemove', e => moveTo(e.clientX));
  c.addEventListener('touchmove', e => { e.preventDefault(); moveTo(e.touches[0].clientX); }, { passive: false });
  c.addEventListener('touchstart', e => { e.preventDefault(); moveTo(e.touches[0].clientX); }, { passive: false });

  document.addEventListener('keydown', e => {
    if (!applesGame.running) return;
    if (e.key === 'ArrowLeft') applesGame.basketX -= 40;
    if (e.key === 'ArrowRight') applesGame.basketX += 40;
    applesGame.basketX = Math.max(applesGame.basketW / 2, Math.min(applesGame.W - applesGame.basketW / 2, applesGame.basketX));
  });
}

function spawnApple() {
  const x = 30 + Math.random() * (applesGame.W - 60);
  applesGame.apples.push({ x, y: -30, vy: 2.2 + Math.random() * 1.6, r: 16, rot: Math.random() * 6 });
}

function drawApple(ctx, a) {
  ctx.save();
  ctx.translate(a.x, a.y);
  ctx.rotate(a.rot);
  // тело яблока
  ctx.beginPath();
  ctx.fillStyle = '#D64545';
  ctx.arc(-5, 0, a.r * 0.78, 0, Math.PI * 2);
  ctx.arc(5, 0, a.r * 0.78, 0, Math.PI * 2);
  ctx.fill();
  // блик
  ctx.beginPath();
  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.ellipse(-6, -5, 4, 6, -0.4, 0, Math.PI * 2);
  ctx.fill();
  // веточка
  ctx.strokeStyle = '#6B4423';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(0, -a.r * 0.7);
  ctx.lineTo(2, -a.r * 1.15);
  ctx.stroke();
  // листик
  ctx.fillStyle = '#4A7C59';
  ctx.beginPath();
  ctx.ellipse(7, -a.r * 0.95, 6, 3, -0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBasket(ctx, x, y, w, h) {
  ctx.save();
  ctx.translate(x, y);
  // ручка
  ctx.strokeStyle = '#8B5E34';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(0, 0, w * 0.32, Math.PI, 0);
  ctx.stroke();
  // корпус
  ctx.fillStyle = '#C08552';
  ctx.beginPath();
  ctx.moveTo(-w / 2, 0);
  ctx.lineTo(w / 2, 0);
  ctx.lineTo(w / 2 - 8, h);
  ctx.lineTo(-w / 2 + 8, h);
  ctx.closePath();
  ctx.fill();
  // плетение
  ctx.strokeStyle = 'rgba(107,68,35,0.45)';
  ctx.lineWidth = 2;
  for (let i = 1; i < 4; i++) {
    const yy = (h / 4) * i;
    ctx.beginPath();
    ctx.moveTo(-w / 2 + 4, yy);
    ctx.lineTo(w / 2 - 4, yy);
    ctx.stroke();
  }
  ctx.restore();
}

function loopApples() {
  if (!applesGame.running) return;
  const { ctx, W, H } = applesGame;

  ctx.clearRect(0, 0, W, H);

  // земля
  ctx.fillStyle = 'rgba(74,124,89,0.18)';
  ctx.fillRect(0, H - 40, W, 40);

  // спавн
  applesGame.lastSpawn++;
  if (applesGame.lastSpawn > 22) {
    applesGame.lastSpawn = 0;
    spawnApple();
  }

  // движение и отрисовка
  const basketTop = H - 56;
  for (let i = applesGame.apples.length - 1; i >= 0; i--) {
    const a = applesGame.apples[i];
    a.y += a.vy;
    a.rot += 0.02;

    // попадание в корзину
    if (a.y + a.r >= basketTop && a.y - a.r <= basketTop + 40 &&
        Math.abs(a.x - applesGame.basketX) < applesGame.basketW / 2) {
      applesGame.apples.splice(i, 1);
      applesGame.score++;
      document.getElementById('applesScore').textContent = String(applesGame.score);
      if (applesGame.score >= APPLES_TARGET) { endApplesGame(true); return; }
      continue;
    }
    // упало мимо
    if (a.y - a.r > H) { applesGame.apples.splice(i, 1); continue; }

    drawApple(ctx, a);
  }

  drawBasket(ctx, applesGame.basketX, basketTop, applesGame.basketW, applesGame.basketH);
  applesGame.rafId = requestAnimationFrame(loopApples);
}

function stopApplesGame() {
  applesGame.running = false;
  if (applesGame.rafId) cancelAnimationFrame(applesGame.rafId);
  if (applesGame.timerId) clearInterval(applesGame.timerId);
  applesGame.rafId = null;
  applesGame.timerId = null;
}

function endApplesGame(won) {
  const success = won === true || applesGame.score >= APPLES_TARGET;
  stopApplesGame();

  ['applesStart', 'applesPlay', 'applesResult'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add('game-screen--hidden');
  });
  document.getElementById('applesResult').classList.remove('game-screen--hidden');

  const emoji = document.getElementById('applesResultEmoji');
  const title = document.getElementById('applesResultTitle');
  const text = document.getElementById('applesResultText');
  const disc = document.getElementById('applesDiscount');

  if (success) {
    emoji.textContent = '🏆';
    title.textContent = `Собрано ${applesGame.score} яблок — победа!`;
    text.textContent = 'Отличная реакция! Скидка 10% ваша.';
    const code = generatePromoCode();
    document.getElementById('applesCode').textContent = code;
    disc.hidden = false;
    savePromo(code);
  } else {
    emoji.textContent = '🍏';
    title.textContent = `Собрано ${applesGame.score} из ${APPLES_TARGET}`;
    text.textContent = 'Чуть-чуть не хватило! Попробуйте ещё раз — или пройдите викторину, там скидка тоже 10%.';
    disc.hidden = true;
  }
}

/* ============================================
   Заказ десертов: данные, цены, форма
   ============================================ */
const CAKE_TYPES = {
  'raw-tort': {
    name: 'RAW-торт с кешью кремом (веганский)',
    img: 'img/cake-raw.jpg',
    desc: 'RAW-торт — торт, который не пекут: орехи, финики и кокосовый крем измельчают и застывают в холодильнике. Без сахара, глютена и лактозы.',
    variants: { label: 'Вкус', options: ['Шоколад', 'Черника', 'Чёрная смородина', 'Малина', 'Кокос', 'Вишня'] },
    weights: { label: 'Вес', options: [
      { value: '0.5', label: '0,5 кг (на 3 человека)', price: 1600 },
      { value: '1', label: '1 кг (на 6 человек)', price: 2700 },
      { value: '1.5', label: '1,5 кг (на 9 человек)', price: 4000 },
      { value: '2', label: '2 кг (на 12 человек)', price: 5300 }
    ]}
  },
  'bird-milk': {
    name: 'Птичье молоко (веганское)',
    img: 'img/cake-bird-milk.jpg',
    desc: '«Птичье молоко» (веганское) — воздушное суфле на растительной основе под шоколадной глазурью, без яиц и молочных продуктов.',
    weights: { label: 'Вес', options: [{ value: '0.1', label: '100 г', price: 350 }] }
  },
  'raw-dessert': {
    name: 'RAW-десерт (веганский)',
    img: 'img/cake-bento.jpg',
    desc: 'RAW-десерт (веганский) — десерт без выпечки и без продуктов животного происхождения: орехи, финики, кокос и какао, застывшие в холодильнике.',
    weights: { label: 'Вес', options: [{ value: '0.15', label: '150 г', price: 350 }] }
  },
  'tart': {
    name: 'Тарт (веганский)',
    img: 'img/cake-tart.jpg',
    desc: 'Тарт (веганский) — открытый песочный пирог на растительной основе с фруктовой или ореховой начинкой, без яиц и молочных продуктов.',
    variants: { label: 'Вкус', options: ['Лимонный', 'Черника', 'Чёрная смородина', 'Кокос', 'Вишня'] },
    weights: { label: 'Вес', options: [
      { value: '0.1', label: '100 г (на 1 человека)', price: 400 },
      { value: '0.3', label: '300 г (на 3 человека)', price: 1100 },
      { value: '0.5', label: '500 г (на 5 человек)', price: 1800 },
      { value: '0.85', label: '850 г (на 8 человек)', price: 3000 }
    ]}
  },
  'raw-candy': {
    name: 'RAW-конфеты (веганские)',
    img: 'img/cake-raw-candy.jpg',
    desc: 'RAW-конфеты (веганские) — конфеты без варки и без продуктов животного происхождения: орехи, финики, какао и кокос, охлаждённые до плотности.',
    variants: { label: 'Вид', options: ['Халва', 'Морковные', 'Трюфели', 'С апельсином', 'С клюквой', 'С арахисом', 'С миндалём'] },
    weights: { label: 'Количество', options: [
      { value: '5', label: '5 шт (~250 г)', price: 750 },
      { value: '10', label: '10 шт (~500 г)', price: 1500 },
      { value: '20', label: '20 шт (~1 кг)', price: 3000 }
    ], unitNote: '1 шт ≈ 50 г · 150 ₽/шт' }
  },
  'dates-urbech': {
    name: 'Финики с урбечем в шоколаде (веганские)',
    img: 'img/dates-chocolate.jpg',
    desc: 'Финики с урбечем в шоколаде (веганские) — финики с орехово-семечковой пастой внутри, в тёмном шоколаде без молока.',
    weights: { label: 'Количество', options: [
      { value: '5', label: '5 шт (~300 г)', price: 850 },
      { value: '10', label: '10 шт (~600 г)', price: 1700 },
      { value: '20', label: '20 шт (~1,2 кг)', price: 3400 }
    ], unitNote: '1 шт ≈ 60 г · 170 ₽/шт' }
  },
  'urbech': {
    name: 'Дагестанский урбеч',
    img: 'img/urbech.jpg',
    desc: 'Дагестанский урбеч — густая паста из перетёртых семян или орехов, без сахара и добавок, холодного помола.',
    variants: { label: 'Из чего', options: [
      'Кешью — 350 ₽', 'Миндаль — 320 ₽', 'Грецкий орех — 310 ₽', 'Фундук — 310 ₽',
      'Кокос — 270 ₽', 'Кунжут — 240 ₽', 'Мак — 240 ₽', 'Арахис — 230 ₽',
      'Белый лён — 170 ₽', 'Подсолнечник — 220 ₽', 'Семена тыквы — 250 ₽',
      'Семена конопли — 220 ₽', 'Семена расторопши — 200 ₽', 'Коричневый лён — 150 ₽',
      'Абрикосовая косточка — 290 ₽', 'Чёрный тмин — 300 ₽'
    ]},
    urbechPrices: {
      'Кешью': 350, 'Миндаль': 320, 'Грецкий орех': 310, 'Фундук': 310,
      'Кокос': 270, 'Кунжут': 240, 'Мак': 240, 'Арахис': 230,
      'Белый лён': 170, 'Подсолнечник': 220, 'Семена тыквы': 250,
      'Семена конопли': 220, 'Семена расторопши': 200, 'Коричневый лён': 150,
      'Абрикосовая косточка': 290, 'Чёрный тмин': 300
    },
    weights: { label: 'Количество', options: [{ value: '1', label: '1 шт (100 г)', price: null }], unitNote: '1 шт = 100 г' }
  }
};

function formatPrice(v) { return v.toLocaleString('ru-RU') + ' ₽'; }

function generateOrderNumber() {
  let seq = 1;
  try {
    seq = parseInt(localStorage.getItem('pk_order_seq') || '0', 10) + 1;
    localStorage.setItem('pk_order_seq', String(seq));
  } catch(e) {}
  return `PK-${new Date().getFullYear()}-${String(seq).padStart(4, '0')}`;
}

function initCakeForm() {
  const form = document.getElementById('cakeForm');
  if (!form) return;

  const dateInput = document.getElementById('cakeDate');
  if (dateInput) {
    const t = new Date();
    t.setDate(t.getDate() + 1);
    dateInput.min = t.toISOString().split('T')[0];
  }

  const promoInput = document.getElementById('cakePromo');
  if (promoInput) {
    try {
      const saved = localStorage.getItem('pk_promo_code');
      if (saved) promoInput.value = saved;
    } catch(e) {}
  }

  const typeSel = document.getElementById('cakeType');
  const variantGroup = document.getElementById('variantGroup');
  const variantLabel = document.getElementById('variantLabel');
  const variantSel = document.getElementById('cakeVariant');
  const weightGroup = document.getElementById('weightGroup');
  const weightLabel = document.getElementById('weightLabel');
  const weightSel = document.getElementById('cakeWeight');
  const info = document.getElementById('productInfo');
  const infoImg = document.getElementById('productImg');
  const infoName = document.getElementById('productName');
  const infoDesc = document.getElementById('productDesc');
  const estimate = document.getElementById('cakeEstimate');
  const estimateVal = document.getElementById('cakeEstimateValue');
  const estimateNote = document.getElementById('cakeEstimateNote');

  function currentPrice() {
    const cfg = CAKE_TYPES[typeSel.value];
    if (!cfg) return null;
    const opt = cfg.weights.options.find(o => o.value === weightSel.value);
    if (!opt) return null;
    if (cfg.urbechPrices) {
      const key = variantSel.value.split(' — ')[0];
      return cfg.urbechPrices[key] ?? null;
    }
    return opt.price;
  }

  function updateUI() {
    const cfg = CAKE_TYPES[typeSel.value];
    if (!cfg) {
      info.hidden = true; variantGroup.hidden = true; weightGroup.hidden = true; estimate.hidden = true;
      return;
    }

    // Инфо-блок с фото и пояснением
    infoImg.src = cfg.img;
    infoImg.alt = cfg.name;
    infoName.textContent = cfg.name;
    infoDesc.textContent = cfg.desc;
    info.hidden = false;

    // Подвариант
    if (cfg.variants) {
      variantLabel.textContent = cfg.variants.label;
      variantSel.innerHTML = cfg.variants.options
        .map(o => `<option value="${o}">${o}</option>`).join('');
      variantGroup.hidden = false;
    } else {
      variantGroup.hidden = true;
      variantSel.innerHTML = '';
    }

    // Вес / количество
    weightLabel.textContent = cfg.weights.label;
    weightSel.innerHTML = cfg.weights.options
      .map(o => `<option value="${o.value}">${o.label}</option>`).join('');
    weightGroup.hidden = false;

    // Карусель показывает фото выбранного изделия
    if (window.__setCakeImage && CAKE_TYPE_TO_SLIDE[typeSel.value] != null) {
      window.__setCakeImage(CAKE_TYPE_TO_SLIDE[typeSel.value]);
    }

    // Стоимость
    const price = currentPrice();
    if (price != null) {
      estimateVal.textContent = formatPrice(price);
      estimateNote.textContent = cfg.weights.unitNote
        ? cfg.weights.unitNote + ' · точную стоимость подтвердим по телефону'
        : 'Точную стоимость подтвердим по телефону';
      estimate.hidden = false;
    } else {
      estimate.hidden = true;
    }
  }

  typeSel.addEventListener('change', updateUI);
  weightSel.addEventListener('change', updateUI);
  variantSel.addEventListener('change', updateUI);

  // Клик по фото продукта — открыть в lightbox
  infoImg.addEventListener('click', () => {
    if (window.__openLightbox) window.__openLightbox([{ src: infoImg.src, caption: infoName.textContent }], 0);
  });

  // Самовывоз / доставка
  const addressBlock = document.getElementById('deliveryAddress');
  form.querySelectorAll('input[name="fulfillment"]').forEach(r => {
    r.addEventListener('change', () => {
      const isDelivery = form.querySelector('input[name="fulfillment"]:checked').value === 'delivery';
      addressBlock.hidden = !isDelivery;
      ['addrCity', 'addrStreet', 'addrHouse'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.required = isDelivery;
      });
    });
  });

  // ---------- Отправка ----------
  const successBox = document.getElementById('cakeSuccess');
  let lastSummary = '';

  function resetForm() {
    form.reset();
    successBox.hidden = true;
    form.hidden = false;
    info.hidden = true;
    variantGroup.hidden = true;
    weightGroup.hidden = true;
    estimate.hidden = true;
    addressBlock.hidden = true;
    ['addrCity','addrStreet','addrHouse'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.required = false;
    });
    try {
      const saved = localStorage.getItem('pk_promo_code');
      if (saved && promoInput) promoInput.value = saved;
    } catch(e) {}
    window.scrollTo({ top: document.getElementById('cake').offsetTop - 80, behavior: 'smooth' });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const type = form.type.value;
    const fulfillment = form.querySelector('input[name="fulfillment"]:checked').value;

    if (!name || !phone || !type) { showToast('Заполните обязательные поля: имя, телефон и вариант'); return; }
    if (phone.replace(/[\s\-\(\)]/g, '').length < 10) { showToast('Проверьте номер телефона'); return; }
    if (fulfillment === 'delivery' && (!form.city.value.trim() || !form.street.value.trim() || !form.house.value.trim())) {
      showToast('Для доставки заполните город, улицу и дом'); return;
    }

    const orderNumber = generateOrderNumber();
    const cfg = CAKE_TYPES[type];
    const price = currentPrice();
    const weightOpt = cfg.weights.options.find(o => o.value === weightSel.value);

    const lines = [
      `🎂 ЗАКАЗ №${orderNumber}`,
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Изделие: ${cfg.name}`,
      variantSel.value ? `${cfg.variants ? cfg.variants.label : 'Вид'}: ${variantSel.value}` : '',
      weightOpt ? `${cfg.weights.label}: ${weightOpt.label}` : '',
      price != null ? `Стоимость (без доставки): ${formatPrice(price)}` : '',
      form.date.value ? `Дата: ${formatDate(form.date.value)}` : '',
      form.time.value ? `Время: ${form.time.value}` : '',
      fulfillment === 'pickup'
        ? 'Получение: самовывоз, ул. Цимлянская, 12к13'
        : `Получение: Яндекс.Доставка\nАдрес: ${[form.city.value, form.street.value, 'д. ' + form.house.value].filter(Boolean).join(', ')}` +
          (form.entrance.value ? `\nПодъезд: ${form.entrance.value}` : '') +
          (form.floor.value ? `\nЭтаж: ${form.floor.value}` : '') +
          (form.flat.value ? `\nКвартира/офис: ${form.flat.value}` : '') +
          (form.intercom.value ? `\nДомофон: ${form.intercom.value}` : '') +
          (form.delivery_comment.value ? `\nКомментарий курьеру: ${form.delivery_comment.value}` : ''),
      form.wish.value ? `Пожелания: ${form.wish.value}` : '',
      form.promo.value ? `Промокод: ${form.promo.value}` : ''
    ].filter(Boolean);

    lastSummary = lines.join('\n');
    document.getElementById('orderNumberField').value = orderNumber;
    document.getElementById('estimateField').value = price != null ? String(price) : '';

    // Отправка в Tuqo (если задан endpoint)
    const endpoint = form.dataset.tuqoEndpoint;
    if (endpoint) {
      try {
        const fd = new FormData(form);
        fd.append('summary', lastSummary);
        await fetch(endpoint, { method: 'POST', body: fd, mode: 'no-cors' });
      } catch(err) { /* тихо */ }
    }

    showOrderSuccess(orderNumber, lastSummary);
  });

  function showOrderSuccess(orderNumber, summary) {
    document.getElementById('successOrderNumber').textContent = orderNumber;
    document.getElementById('orderSummaryText').value = summary;
    form.hidden = true;
    successBox.hidden = false;
    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  // Кнопка «Отправить детали в Telegram»
  const tgBtn = document.getElementById('sendTelegramBtn');
  if (tgBtn) {
    tgBtn.addEventListener('click', () => {
      const url = 'https://t.me/nutri_yulia?text=' + encodeURIComponent(lastSummary);
      window.open(url, '_blank', 'noopener');
      showToast('Открываем Telegram — нажмите «Отправить» в чате');
    });
  }

  // Кнопка «Скопировать детали заказа»
  const copyBtn = document.getElementById('copyOrderBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const ta = document.getElementById('orderSummaryText');
      try {
        await navigator.clipboard.writeText(lastSummary);
      } catch(err) {
        ta.select();
        document.execCommand('copy');
      }
      copyBtn.textContent = '✅ Скопировано!';
      setTimeout(() => { copyBtn.textContent = '📋 Скопировать детали заказа'; }, 2500);
    });
  }

  // Кнопка «Сформировать новый заказ»
  const newBtn = document.getElementById('newOrderBtn');
  if (newBtn) newBtn.addEventListener('click', resetForm);
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ---------- Toast ---------- */
function showToast(message) {
  let toast = document.getElementById('appToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'appToast';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%) translateY(20px);background:#1E1A16;color:#fff;padding:14px 24px;border-radius:9999px;font-size:.88rem;z-index:10001;opacity:0;transition:all .3s;box-shadow:0 16px 48px rgba(0,0,0,.2);max-width:90vw;text-align:center;';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3200);
}

/* ============================================
   Popup скидки
   ============================================ */
function initPopupDiscount() {
  const popup = document.getElementById('popupDiscount');
  if (!popup) return;

  let shown = false;
  let timerId = null;

  function showPopup() {
    if (shown) return;
    try { if (localStorage.getItem('pk_popup_seen')) return; } catch(e) {}
    shown = true;
    popup.classList.add('active');
    document.body.style.overflow = 'hidden';
    startTimer();
  }

  function closePopup() {
    popup.classList.remove('active');
    document.body.style.overflow = '';
    if (timerId) clearInterval(timerId);
    try { localStorage.setItem('pk_popup_seen', '1'); } catch(e) {}
  }

  setTimeout(showPopup, 8000);

  let scrollTriggered = false;
  window.addEventListener('scroll', () => {
    if (scrollTriggered) return;
    const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
    if (scrolled > 0.5) { scrollTriggered = true; showPopup(); }
  }, { passive: true });

  popup.querySelectorAll('[data-close-popup]').forEach(el => el.addEventListener('click', closePopup));

  // «Заказать со скидкой» — закрываем баннер и переносим промокод в форму
  const applyBtn = document.getElementById('popupApplyBtn');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      const code = document.getElementById('popupCode').textContent.trim();
      savePromo(code);
      closePopup();
      const cake = document.getElementById('cake');
      if (cake) cake.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        const inp = document.getElementById('cakePromo');
        if (inp) { inp.focus({ preventScroll: true }); inp.style.boxShadow = '0 0 0 3px rgba(196,93,58,.35)'; setTimeout(() => inp.style.boxShadow = '', 2000); }
      }, 700);
    });
  }

  // Ссылка на игру внутри попапа
  const gameLink = document.getElementById('popupGameLink');
  if (gameLink) gameLink.addEventListener('click', closePopup);

  function startTimer() {
    let seconds = 600;
    const el = document.getElementById('popupTimer');
    if (!el) return;
    timerId = setInterval(() => {
      seconds--;
      if (seconds <= 0) { clearInterval(timerId); el.textContent = 'время вышло'; return; }
      el.textContent = `${String(Math.floor(seconds / 60)).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`;
    }, 1000);
  }
}

/* ============================================
   Галерея десертов
   ============================================ */
const CAKE_IMAGES = [
  { src: 'img/cake-raw.jpg', caption: 'RAW-торт с кешью кремом (веганский)' },
  { src: 'img/cake-bird-milk.jpg', caption: 'Птичье молоко (веганское)' },
  { src: 'img/cake-bento.jpg', caption: 'RAW-десерт (веганский)' },
  { src: 'img/cake-tart.jpg', caption: 'Тарт (веганский)' },
  { src: 'img/cake-raw-candy.jpg', caption: 'RAW-конфеты (веганские)' },
  { src: 'img/dates-chocolate.jpg', caption: 'Финики с урбечем в шоколаде (веганские)' },
  { src: 'img/urbech.jpg', caption: 'Дагестанский урбеч' }
];

// Соответствие «вариант в форме» → «слайд в карусели»
const CAKE_TYPE_TO_SLIDE = {
  'raw-tort': 0, 'bird-milk': 1, 'raw-dessert': 2, 'tart': 3,
  'raw-candy': 4, 'dates-urbech': 5, 'urbech': 6
};

function initCakeGallery() {
  const thumbs = document.querySelectorAll('.cake-thumb');
  const mainImg = document.querySelector('.cake-gallery__main img');
  if (!thumbs.length || !mainImg) return;

  let idx = 0;
  let auto = setInterval(next, 4500);

  function next() { setImage((idx + 1) % CAKE_IMAGES.length); }

  function setImage(i) {
    idx = i;
    thumbs.forEach((t, k) => t.classList.toggle('cake-thumb--active', k === i));
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = CAKE_IMAGES[i].src;
      mainImg.alt = CAKE_IMAGES[i].caption;
      mainImg.style.opacity = '1';
    }, 180);
  }

  window.__setCakeImage = function(i) {
    if (i == null || i < 0 || i >= CAKE_IMAGES.length) return;
    setImage(i);
    clearInterval(auto);
    auto = setInterval(next, 4500);
  };

  thumbs.forEach(t => t.addEventListener('click', () => {
    window.__setCakeImage(parseInt(t.dataset.index));
  }));

  const gallery = document.querySelector('.cake-gallery');
  if (gallery) {
    gallery.addEventListener('mouseenter', () => clearInterval(auto));
    gallery.addEventListener('mouseleave', () => { auto = setInterval(next, 4500); });
  }
}

/* ============================================
   Lightbox со стрелками и подписью
   ============================================ */
let lbItems = [];
let lbIndex = 0;

function initLightbox() {
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  if (!lb || !img) return;

  const caption = document.getElementById('lbCaption');
  const counter = document.getElementById('lbCounter');

  function render() {
    const item = lbItems[lbIndex];
    if (!item) return;
    img.src = item.src;
    img.alt = item.caption || '';
    caption.textContent = item.caption || '';
    caption.style.display = item.caption ? '' : 'none';
    counter.textContent = lbItems.length > 1 ? `${lbIndex + 1} / ${lbItems.length}` : '';
    document.getElementById('lbPrev').style.display = lbItems.length > 1 ? '' : 'none';
    document.getElementById('lbNext').style.display = lbItems.length > 1 ? '' : 'none';
  }

  window.__openLightbox = function(items, startIndex) {
    lbItems = items;
    lbIndex = startIndex || 0;
    render();
    lb.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  function close() {
    lb.classList.remove('active');
    document.body.style.overflow = '';
    img.src = '';
  }

  function prev() { if (lbItems.length > 1) { lbIndex = (lbIndex - 1 + lbItems.length) % lbItems.length; render(); } }
  function next() { if (lbItems.length > 1) { lbIndex = (lbIndex + 1) % lbItems.length; render(); } }

  // Фото меню
  const menuPhotos = Array.from(document.querySelectorAll('.menu-photo')).map(f => ({
    src: f.dataset.full, caption: f.dataset.caption
  }));
  document.querySelectorAll('.menu-photo').forEach((f, i) => {
    f.addEventListener('click', () => window.__openLightbox(menuPhotos, i));
  });

  // Главное фото десерта
  const mainCake = document.querySelector('.cake-gallery__main img');
  if (mainCake) {
    mainCake.addEventListener('click', () => {
      const activeThumb = document.querySelector('.cake-thumb--active');
      const startIdx = activeThumb ? parseInt(activeThumb.dataset.index) : 0;
      window.__openLightbox(CAKE_IMAGES.map(c => ({ src: c.src, caption: c.caption })), startIdx);
    });
  }

  lb.querySelectorAll('[data-close-lightbox]').forEach(el => el.addEventListener('click', close));
  document.getElementById('lbPrev').addEventListener('click', e => { e.stopPropagation(); prev(); });
  document.getElementById('lbNext').addEventListener('click', e => { e.stopPropagation(); next(); });

  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('active')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });
}

/* ============================================
   Карусель афиши
   ============================================ */
function initAfishaCarousel() {
  const track = document.getElementById('afishaTrack');
  const prev = document.getElementById('afishaPrev');
  const next = document.getElementById('afishaNext');
  const dotsBox = document.getElementById('afishaDots');
  if (!track) return;

  const cards = track.querySelectorAll('.afisha-card');
  if (!cards.length) return;

  function step() {
    const card = cards[0];
    return card.getBoundingClientRect().width + 16;
  }

  if (prev) prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  if (next) next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));

  // Точки
  if (dotsBox) {
    const count = Math.max(1, cards.length - 2);
    for (let i = 0; i < count; i++) {
      const d = document.createElement('button');
      d.className = 'carousel__dot' + (i === 0 ? ' carousel__dot--active' : '');
      d.setAttribute('aria-label', `Слайд ${i + 1}`);
      d.addEventListener('click', () => track.scrollTo({ left: i * step(), behavior: 'smooth' }));
      dotsBox.appendChild(d);
    }
    track.addEventListener('scroll', () => {
      const i = Math.round(track.scrollLeft / step());
      dotsBox.querySelectorAll('.carousel__dot').forEach((d, k) =>
        d.classList.toggle('carousel__dot--active', k === Math.min(i, count - 1)));
    }, { passive: true });
  }
}
