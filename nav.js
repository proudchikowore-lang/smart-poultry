// nav.js — instant profile from cache, confirmed by Firebase Auth + RTDB fallback
(function () {
  const currentPage = window.location.pathname.split('/').pop() || 'Smart Poultry Management.html';

  const links = [
    { href: 'Smart Poultry Management.html', icon: '📊', label: 'Dashboard' },
    { href: 'history.html',                  icon: '📈', label: 'History'   },
    { href: 'alerts.html',                   icon: '🔔', label: 'Alerts'    },
    { href: 'settings.html',                 icon: '⚙️',  label: 'Settings' },
    { href: 'about.html',                    icon: 'ℹ️',  label: 'About'    },
    { href: 'contact.html', icon: '📞', label: 'Contact' }
  ];

  
  // ── Styles ──
  const style = document.createElement('style');
  style.textContent = `
    .nav-menu-wrap { position: relative; display: inline-block; }

    .nav-avatar-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      background: transparent;
      border: 1.5px solid rgba(255,255,255,0.2);
      border-radius: 30px;
      padding: 4px 12px 4px 4px;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
      color: inherit;
    }
    .nav-avatar-btn:hover {
      background: rgba(255,255,255,0.08);
      border-color: rgba(255,255,255,0.4);
    }
    .nav-avatar-circle {
      width: 32px; height: 32px;
      border-radius: 50%;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(135deg, #1b5e20, #0d47a1);
      color: #e8f5e9;
      overflow: hidden;
    }
    .nav-avatar-circle img {
      width: 100%; height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    .nav-avatar-name {
      font-size: 13px;
      font-weight: 500;
      color: var(--text, #eee);
      max-width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .nav-chevron {
      font-size: 9px;
      color: var(--text-muted, #aaa);
      transition: transform 0.2s;
      margin-left: 2px;
    }
    .nav-avatar-btn.open .nav-chevron { transform: rotate(180deg); }

    .nav-dropdown {
      display: none;
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      min-width: 260px;
      background: var(--card-bg, #1e1e2e);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 14px;
      padding: 8px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.45);
      z-index: 9999;
      animation: dropIn 0.15s ease;
    }
    @keyframes dropIn {
      from { opacity: 0; transform: translateY(-5px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .nav-dropdown.visible { display: block; }

    .nav-profile-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      border-radius: 10px;
      background: rgba(255,255,255,0.04);
      margin-bottom: 6px;
    }
    .nav-profile-card .nav-avatar-circle {
      width: 46px; height: 46px;
      font-size: 17px;
      flex-shrink: 0;
    }
    .nav-profile-info { overflow: hidden; min-width: 0; }
    .nav-profile-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--text, #eee);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .nav-profile-email {
      font-size: 11px;
      color: var(--text-muted, #888);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 2px;
    }
    .nav-profile-role {
      display: inline-block;
      font-size: 10px;
      background: rgba(0,200,100,0.12);
      color: #00c864;
      padding: 1px 8px;
      border-radius: 20px;
      margin-top: 5px;
    }

    .nav-divider {
      height: 1px;
      background: rgba(255,255,255,0.08);
      margin: 5px 4px;
    }

    .nav-dropdown a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 8px;
      color: var(--text, #eee);
      text-decoration: none;
      font-size: 13px;
      font-family: 'Poppins', sans-serif;
      transition: background 0.12s;
    }
    .nav-dropdown a:hover  { background: rgba(255,255,255,0.07); }
    .nav-dropdown a.active {
      background: rgba(124,124,255,0.18);
      color: #a0a0ff;
      font-weight: 600;
    }
    .nav-icon { font-size: 15px; width: 22px; text-align: center; flex-shrink: 0; }

    .nav-logout {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 8px;
      color: #ff6b6b;
      font-size: 13px;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      background: transparent;
      border: none;
      width: 100%;
      text-align: left;
      transition: background 0.12s;
    }
    .nav-logout:hover { background: rgba(255,80,80,0.1); }

    /* Light mode */
    body.light .nav-dropdown         { background:#fff; border-color:rgba(0,0,0,0.1); box-shadow:0 8px 32px rgba(0,0,0,0.12); }
    body.light .nav-dropdown a       { color:#222; }
    body.light .nav-dropdown a:hover { background:rgba(0,0,0,0.05); }
    body.light .nav-dropdown a.active { background:rgba(80,80,220,0.1); color:#5050dc; }
    body.light .nav-profile-card     { background:rgba(0,0,0,0.04); }
    body.light .nav-profile-name     { color:#222; }
    body.light .nav-avatar-btn       { border-color:rgba(0,0,0,0.2); }
    body.light .nav-avatar-btn:hover { background:rgba(0,0,0,0.06); }
    body.light .nav-avatar-name      { color:#222; }
  `;
  document.head.appendChild(style);

  // ── Helpers ──
  function getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function nameFromEmail(email) {
    if (!email) return 'Farm Owner';
    const prefix = email.split('@')[0];
    return prefix
      .replace(/[._-]+/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  function getRoleFallback() {
    if (typeof window !== 'undefined' && window.t) {
      return window.t('nav_role');
    }
    if (typeof window !== 'undefined' && window.i18n && typeof window.i18n.t === 'function') {
      return window.i18n.t('nav_role');
    }
    // Keep previous default
    return 'Farm Owner';
  }

  function applyProfile(name, email, photoURL, role) {

    const displayName = name || nameFromEmail(email);
    const initials    = getInitials(displayName);

    const ba = document.getElementById('navBtnAvatar');
    if (ba) {
      ba.innerHTML = '';
      if (photoURL) {
        const img = document.createElement('img');
        img.src = photoURL; img.alt = displayName;
        img.onerror = () => { ba.innerHTML = ''; ba.textContent = initials; };
        ba.appendChild(img);
      } else { ba.textContent = initials; }
    }

    const bn = document.getElementById('navBtnName');
    if (bn) bn.textContent = displayName;

    const pa = document.getElementById('navProfileAvatar');
    if (pa) {
      pa.innerHTML = '';
      if (photoURL) {
        const img = document.createElement('img');
        img.src = photoURL; img.alt = displayName;
        img.onerror = () => { pa.innerHTML = ''; pa.textContent = initials; };
        pa.appendChild(img);
      } else { pa.textContent = initials; }
    }

    const pn = document.getElementById('navProfileName');
    const pe = document.getElementById('navProfileEmail');
    const pr = document.getElementById('navProfileRole');

    if (pn) pn.textContent = displayName;
    if (pe) pe.textContent = email || '';
    if (pr) pr.textContent = role || getRoleFallback();
  }


  // ── Build DOM ──
  const wrap = document.createElement('div');
  wrap.className = 'nav-menu-wrap';

  const btn = document.createElement('button');
  btn.className = 'nav-avatar-btn';
  btn.setAttribute('aria-label', 'Menu');

  const btnAvatar = document.createElement('div');
  btnAvatar.className   = 'nav-avatar-circle';
  btnAvatar.id          = 'navBtnAvatar';
  btnAvatar.textContent = '…';

  const btnName = document.createElement('span');
  btnName.className   = 'nav-avatar-name';
  btnName.id          = 'navBtnName';
  btnName.textContent = '…';

  const chevron = document.createElement('span');
  chevron.className   = 'nav-chevron';
  chevron.textContent = '▼';

  btn.append(btnAvatar, btnName, chevron);

  const dropdown = document.createElement('div');
  dropdown.className = 'nav-dropdown';

  const profileCard = document.createElement('div');
  profileCard.className = 'nav-profile-card';


  const profAvatar = document.createElement('div');
  profAvatar.className      = 'nav-avatar-circle';
  profAvatar.id             = 'navProfileAvatar';
  profAvatar.textContent    = '…';
  profAvatar.style.width    = '46px';
  profAvatar.style.height   = '46px';
  profAvatar.style.fontSize = '17px';

  const profInfo = document.createElement('div');
  profInfo.className = 'nav-profile-info';
  profInfo.innerHTML = `
    <div class="nav-profile-name"  id="navProfileName">Loading…</div>
    <div class="nav-profile-email" id="navProfileEmail"></div>
    <span class="nav-profile-role" id="navProfileRole">Loading…</span>

  `;

  profileCard.append(profAvatar, profInfo);
  dropdown.appendChild(profileCard);
  dropdown.appendChild(Object.assign(document.createElement('div'), { className: 'nav-divider' }));

  links.forEach(l => {
    const a = document.createElement('a');
    a.href      = l.href;
    a.className = currentPage === l.href ? 'active' : '';
    a.innerHTML = `<span class="nav-icon">${l.icon}</span>${l.label}`;
    dropdown.appendChild(a);
  });

  dropdown.appendChild(Object.assign(document.createElement('div'), { className: 'nav-divider' }));

  const logoutBtn = document.createElement('button');
  logoutBtn.className = 'nav-logout';
  logoutBtn.innerHTML = '<span class="nav-icon">🚪</span>Sign out';
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('navUserCache');
    if (typeof firebase !== 'undefined' && firebase.auth) {
      firebase.auth().signOut().then(() => { window.location.href = 'index.html'; });
    } else {
      window.location.href = 'index.html';
    }
  });
  dropdown.appendChild(logoutBtn);

  wrap.append(btn, dropdown);

  btn.addEventListener('click', e => {
    e.stopPropagation();
    const isOpen = dropdown.classList.toggle('visible');
    btn.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', isOpen);
  });
  document.addEventListener('click', () => {
    dropdown.classList.remove('visible');
    btn.classList.remove('open');
  });
  dropdown.addEventListener('click', e => e.stopPropagation());

  // Inject — remove old logout button, add profile menu
  const header = document.querySelector('.site-header .header-container');
  if (header) {
    const old = document.getElementById('logoutBtn');
    if (old) old.remove();
    header.appendChild(wrap);
  }

  // ── STEP 1: Instant render from localStorage cache ──
  const cached = localStorage.getItem('navUserCache');
  if (cached) {
    try {
      const c = JSON.parse(cached);
      applyProfile(c.name, c.email, c.photoURL, c.role);
    } catch (e) { /* bad cache */ }
  }


  // ── STEP 2: Firebase Auth confirms session ──
  function resolveDisplayName(user) {
    return new Promise(resolve => {
      if (user.displayName) { resolve(user.displayName); return; }
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
        firebase.database()
          .ref('/users/' + user.uid + '/name')
          .once('value')
          .then(snap => resolve(snap.val() || nameFromEmail(user.email)))

          .catch(() => resolve(nameFromEmail(user.email)));
      } else {
        resolve(nameFromEmail(user.email));
      }
    });
  }

  function initAuth() {
    if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) {
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          resolveDisplayName(user).then(name => {
            const email    = user.email    || '';
            const photoURL = user.photoURL || '';

            // Resolve role from Admins collection (requested)
            function resolveRole() {
              return new Promise(resolve => {
                const fallback = null;
                firebase.database()
                  .ref('/admins/' + user.uid + '/role')
                  .once('value')
                  .then(snap => {
                    const r = snap.val();
                    if (r) resolve(String(r));
                    else resolve(fallback);
                  })
                  .catch(() => {
                    // fallback to non-admin path if your data model differs
                    firebase.database()
                      .ref('/users/' + user.uid + '/role')
                      .once('value')
                      .then(snap2 => {
                        const r2 = snap2.val();
                        resolve(r2 ? String(r2) : fallback);
                      })
                      .catch(() => resolve(fallback));
                  });
              });
            }

            resolveRole().then(role => {
              localStorage.setItem(
                'navUserCache',
                JSON.stringify({ name, email, photoURL, role })
              );
              applyProfile(name, email, photoURL, role);
            });
          });
        } else {


          localStorage.removeItem('navUserCache');
          if (!window.location.pathname.includes('login')) {
            window.location.href = 'index.html';
          }
        }
      });
    } else {
      setTimeout(initAuth, 150);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
})();
