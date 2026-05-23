// i18n.js — Translations for Smart Poultry Monitor
// Supports: English (en), French (fr), Portuguese (pt), Shona (sn), Ndebele (nd)

const translations = {

  en: {
    // Nav
    nav_dashboard:  "Dashboard",
    nav_history:    "History",
    nav_alerts:     "Alerts",
    nav_settings:   "Settings",
    nav_about:      "About",
    nav_signout:    "Sign out",
    nav_role:       "Farm Owner",

    // Header
    site_title: "Poultry House Smart Monitoring",

    // Dashboard cards
    card_temperature:  "Temperature",
    card_humidity:     "Humidity",
    card_light:        "Light Level",
    card_feed:         "Feed Level",
    card_door:         "Door Status",
    door_open:         "OPEN",
    door_closed:       "Closed",

    // Stats panel
    stat_temp:   "Temp °C (min/max/avg)",
    stat_hum:    "Humidity % (min/max/avg)",
    stat_light:  "Light % (min/max/avg)",
    stat_feed:   "Feed g (min/max/avg)",

    // Buttons
    btn_settings:  "⚙️ Settings",
    btn_export:    "📥 Export Data (CSV)",
    btn_logout:    "Logout",
    btn_load:      "🔍 Load",
    btn_save:      "Save",
    btn_reset:     "Reset defaults",

    // Settings modal
    modal_title:    "Threshold Settings",
    temp_min:       "Temp Min (°C):",
    temp_max:       "Temp Max (°C):",
    hum_min:        "Humidity Min (%):",
    hum_max:        "Humidity Max (%):",
    light_min:      "Light Min (%):",
    light_max:      "Light Max (%):",
    feed_max:       "Feed Max (g):",

    // Charts
    chart_temp:   "Temperature (°C)",
    chart_hum:    "Humidity (%)",
    chart_light:  "Light Level (%)",
    chart_feed:   "Feed Level (g)",

    // History page
    history_from:    "From",
    history_to:      "To",
    history_sensor:  "Sensor",
    history_all:     "All sensors",
    history_rawdata: "Raw Data",
    history_records: "records",
    col_number:      "#",
    col_datetime:    "Date & Time",
    col_sensor:      "Sensor",
    col_value:       "Value",
    col_status:      "Status",
    status_normal:   "Normal",
    status_warning:  "Warning",
    status_critical: "Critical",

    // Alerts page
    alerts_title:    "Alerts & Notifications",
    alerts_live:     "Live monitoring",
    alerts_export:   "📥 Export Log",
    alerts_clear:    "🗑 Clear All",
    alerts_critical: "Critical alerts",
    alerts_warnings: "Warnings",
    alerts_total:    "Total logged",
    alerts_last:     "Last alert time",
    filter_all:      "All",
    filter_critical: "🚨 Critical",
    filter_warning:  "⚠️ Warning",
    filter_info:     "ℹ️ Info",
    no_alerts:       "No alerts logged.",

    // Toast messages
    toast_door:       "Door opened unexpectedly!",
    toast_temp_high:  "Temperature too high",
    toast_temp_low:   "Temperature too low",
    toast_hum_high:   "Humidity too high",
    toast_hum_low:    "Humidity too low",
    toast_light_high: "Light level too high",
    toast_light_low:  "Light level too low",
    toast_feed:       "Feed weight critical",
    toast_exported:   "Data exported successfully!",
    toast_saved:      "Thresholds saved",

    // Login page
    login_title:    "Smart Poultry Monitor",
    login_subtitle: "Farm Management Dashboard",
    login_email:    "Email Address",
    login_password: "Password",
    login_btn:      "Login",
    login_signing:  "Signing in…",
    login_success:  "✅ Login successful — redirecting…",
    login_empty:    "Please enter your email and password.",
    login_footer:   "Access restricted to authorised personnel only",

    // About page
    about_version: "Version 1.0 · 2026",
    footer:        "© 2026 Smart Poultry Dashboard",
  },

  fr: {
    nav_dashboard:  "Tableau de bord",
    nav_history:    "Historique",
    nav_alerts:     "Alertes",
    nav_settings:   "Paramètres",
    nav_about:      "À propos",
    nav_signout:    "Se déconnecter",
    nav_role:       "Propriétaire",

    site_title: "Surveillance Intelligente du Poulailler",

    card_temperature: "Température",
    card_humidity:    "Humidité",
    card_light:       "Niveau de lumière",
    card_feed:        "Niveau de nourriture",
    card_door:        "État de la porte",
    door_open:        "OUVERTE",
    door_closed:      "Fermée",

    stat_temp:   "Temp °C (min/max/moy)",
    stat_hum:    "Humidité % (min/max/moy)",
    stat_light:  "Lumière % (min/max/moy)",
    stat_feed:   "Aliment g (min/max/moy)",

    btn_settings: "⚙️ Paramètres",
    btn_export:   "📥 Exporter (CSV)",
    btn_logout:   "Déconnexion",
    btn_load:     "🔍 Charger",
    btn_save:     "Enregistrer",
    btn_reset:    "Réinitialiser",

    modal_title:  "Paramètres de seuil",
    temp_min:     "Temp Min (°C) :",
    temp_max:     "Temp Max (°C) :",
    hum_min:      "Humidité Min (%) :",
    hum_max:      "Humidité Max (%) :",
    light_min:    "Lumière Min (%) :",
    light_max:    "Lumière Max (%) :",
    feed_max:     "Aliment Max (g) :",

    chart_temp:   "Température (°C)",
    chart_hum:    "Humidité (%)",
    chart_light:  "Niveau de lumière (%)",
    chart_feed:   "Niveau d'aliment (g)",

    history_from:    "De",
    history_to:      "À",
    history_sensor:  "Capteur",
    history_all:     "Tous les capteurs",
    history_rawdata: "Données brutes",
    history_records: "enregistrements",
    col_number:      "#",
    col_datetime:    "Date & Heure",
    col_sensor:      "Capteur",
    col_value:       "Valeur",
    col_status:      "Statut",
    status_normal:   "Normal",
    status_warning:  "Avertissement",
    status_critical: "Critique",

    alerts_title:    "Alertes & Notifications",
    alerts_live:     "Surveillance en direct",
    alerts_export:   "📥 Exporter le journal",
    alerts_clear:    "🗑 Tout effacer",
    alerts_critical: "Alertes critiques",
    alerts_warnings: "Avertissements",
    alerts_total:    "Total enregistré",
    alerts_last:     "Dernière alerte",
    filter_all:      "Tout",
    filter_critical: "🚨 Critique",
    filter_warning:  "⚠️ Avertissement",
    filter_info:     "ℹ️ Info",
    no_alerts:       "Aucune alerte enregistrée.",

    toast_door:       "Porte ouverte inopinément !",
    toast_temp_high:  "Température trop élevée",
    toast_temp_low:   "Température trop basse",
    toast_hum_high:   "Humidité trop élevée",
    toast_hum_low:    "Humidité trop basse",
    toast_light_high: "Niveau de lumière trop élevé",
    toast_light_low:  "Niveau de lumière trop bas",
    toast_feed:       "Poids de l'aliment critique",
    toast_exported:   "Données exportées avec succès !",
    toast_saved:      "Seuils enregistrés",

    login_title:    "Surveillance Intelligente",
    login_subtitle: "Tableau de bord de gestion",
    login_email:    "Adresse e-mail",
    login_password: "Mot de passe",
    login_btn:      "Connexion",
    login_signing:  "Connexion en cours…",
    login_success:  "✅ Connexion réussie — redirection…",
    login_empty:    "Veuillez saisir votre e-mail et mot de passe.",
    login_footer:   "Accès réservé au personnel autorisé",

    about_version: "Version 1.0 · 2026",
    footer:        "© 2026 Tableau de bord Avicole",
  },

  pt: {
    nav_dashboard:  "Painel",
    nav_history:    "Histórico",
    nav_alerts:     "Alertas",
    nav_settings:   "Configurações",
    nav_about:      "Sobre",
    nav_signout:    "Sair",
    nav_role:       "Proprietário",

    site_title: "Monitoramento Inteligente do Aviário",

    card_temperature: "Temperatura",
    card_humidity:    "Humidade",
    card_light:       "Nível de luz",
    card_feed:        "Nível de ração",
    card_door:        "Estado da porta",
    door_open:        "ABERTA",
    door_closed:      "Fechada",

    stat_temp:   "Temp °C (mín/máx/méd)",
    stat_hum:    "Humidade % (mín/máx/méd)",
    stat_light:  "Luz % (mín/máx/méd)",
    stat_feed:   "Ração g (mín/máx/méd)",

    btn_settings: "⚙️ Configurações",
    btn_export:   "📥 Exportar (CSV)",
    btn_logout:   "Sair",
    btn_load:     "🔍 Carregar",
    btn_save:     "Guardar",
    btn_reset:    "Repor padrões",

    modal_title:  "Configurações de limiar",
    temp_min:     "Temp Mín (°C):",
    temp_max:     "Temp Máx (°C):",
    hum_min:      "Humidade Mín (%):",
    hum_max:      "Humidade Máx (%):",
    light_min:    "Luz Mín (%):",
    light_max:    "Luz Máx (%):",
    feed_max:     "Ração Máx (g):",

    chart_temp:   "Temperatura (°C)",
    chart_hum:    "Humidade (%)",
    chart_light:  "Nível de luz (%)",
    chart_feed:   "Nível de ração (g)",

    history_from:    "De",
    history_to:      "Até",
    history_sensor:  "Sensor",
    history_all:     "Todos os sensores",
    history_rawdata: "Dados brutos",
    history_records: "registros",
    col_number:      "#",
    col_datetime:    "Data & Hora",
    col_sensor:      "Sensor",
    col_value:       "Valor",
    col_status:      "Estado",
    status_normal:   "Normal",
    status_warning:  "Aviso",
    status_critical: "Crítico",

    alerts_title:    "Alertas & Notificações",
    alerts_live:     "Monitoramento ao vivo",
    alerts_export:   "📥 Exportar registo",
    alerts_clear:    "🗑 Limpar tudo",
    alerts_critical: "Alertas críticos",
    alerts_warnings: "Avisos",
    alerts_total:    "Total registado",
    alerts_last:     "Último alerta",
    filter_all:      "Tudo",
    filter_critical: "🚨 Crítico",
    filter_warning:  "⚠️ Aviso",
    filter_info:     "ℹ️ Info",
    no_alerts:       "Nenhum alerta registado.",

    toast_door:       "Porta aberta inesperadamente!",
    toast_temp_high:  "Temperatura muito alta",
    toast_temp_low:   "Temperatura muito baixa",
    toast_hum_high:   "Humidade muito alta",
    toast_hum_low:    "Humidade muito baixa",
    toast_light_high: "Nível de luz muito alto",
    toast_light_low:  "Nível de luz muito baixo",
    toast_feed:       "Peso da ração crítico",
    toast_exported:   "Dados exportados com sucesso!",
    toast_saved:      "Limiares guardados",

    login_title:    "Monitor Inteligente de Aviário",
    login_subtitle: "Painel de Gestão da Fazenda",
    login_email:    "Endereço de e-mail",
    login_password: "Senha",
    login_btn:      "Entrar",
    login_signing:  "A entrar…",
    login_success:  "✅ Login bem-sucedido — a redirecionar…",
    login_empty:    "Por favor insira o seu e-mail e senha.",
    login_footer:   "Acesso restrito a pessoal autorizado",

    about_version: "Versão 1.0 · 2026",
    footer:        "© 2026 Painel Avícola Inteligente",
  },

  sn: {
    nav_dashboard:  "Deshbhodo",
    nav_history:    "Nhoroondo",
    nav_alerts:     "Yambiro",
    nav_settings:   "Marongero",
    nav_about:      "Nezve",
    nav_signout:    "Buda",
    nav_role:       "Muridzi wePurazi",

    site_title: "Kurinda Imba yeHuku Nengwarire",

    card_temperature: "Kupisa",
    card_humidity:    "Mvura Mumhepo",
    card_light:       "Mwenje",
    card_feed:        "Chikafu",
    card_door:        "Musuwo",
    door_open:        "WAKAVHURWA",
    door_closed:      "Wakavharwa",

    stat_temp:   "Kupisa °C (diki/huru/pakati)",
    stat_hum:    "Mvura % (diki/huru/pakati)",
    stat_light:  "Mwenje % (diki/huru/pakati)",
    stat_feed:   "Chikafu g (diki/huru/pakati)",

    btn_settings: "⚙️ Marongero",
    btn_export:   "📥 Tumira (CSV)",
    btn_logout:   "Buda",
    btn_load:     "🔍 Tora",
    btn_save:     "Chengetedza",
    btn_reset:    "Dzosera pakutanga",

    modal_title:  "Marongero eZviratidzo",
    temp_min:     "Kupisa Kudiki (°C):",
    temp_max:     "Kupisa Kukuru (°C):",
    hum_min:      "Mvura Diki (%):",
    hum_max:      "Mvura Huru (%):",
    light_min:    "Mwenje Diki (%):",
    light_max:    "Mwenje Huru (%):",
    feed_max:     "Chikafu Kukuru (g):",

    chart_temp:   "Kupisa (°C)",
    chart_hum:    "Mvura Mumhepo (%)",
    chart_light:  "Mwenje (%)",
    chart_feed:   "Chikafu (g)",

    history_from:    "Kubva",
    history_to:      "Kusvika",
    history_sensor:  "Sensa",
    history_all:     "Masensa ese",
    history_rawdata: "Ruzivo Rwakanyorwa",
    history_records: "zvinyorwa",
    col_number:      "#",
    col_datetime:    "Zuva & Nguva",
    col_sensor:      "Sensa",
    col_value:       "Mureza",
    col_status:      "Mamiriro",
    status_normal:   "Zvakanaka",
    status_warning:  "Yambiro",
    status_critical: "Njodzi",

    alerts_title:    "Yambiro & Ziviso",
    alerts_live:     "Kurinda kwari kuenderera",
    alerts_export:   "📥 Tumira Rekodhi",
    alerts_clear:    "🗑 Bvisa Zvose",
    alerts_critical: "Yambiro Huru",
    alerts_warnings: "Zviratidzo",
    alerts_total:    "Zvose zvakanyorwa",
    alerts_last:     "Yambiro yekupedzisira",
    filter_all:      "Zvose",
    filter_critical: "🚨 Njodzi",
    filter_warning:  "⚠️ Yambiro",
    filter_info:     "ℹ️ Ruzivo",
    no_alerts:       "Hapana yambiro yakanyorwa.",

    toast_door:       "Musuwo wavhurwa pasina tarisiro!",
    toast_temp_high:  "Kupisa kwakawanda",
    toast_temp_low:   "Kupisa kudiki",
    toast_hum_high:   "Mvura yakawanda",
    toast_hum_low:    "Mvura yadiki",
    toast_light_high: "Mwenje wakawanda",
    toast_light_low:  "Mwenje wadiki",
    toast_feed:       "Chikafu chakawanda",
    toast_exported:   "Ruzivo rwatumiwa zvakanaka!",
    toast_saved:      "Marongero achengetedzwa",

    login_title:    "Kurinda Imba yeHuku",
    login_subtitle: "Deshbhodo yePurazi",
    login_email:    "Kero yeEmail",
    login_password: "Password",
    login_btn:      "Pinda",
    login_signing:  "Ari kupinda…",
    login_success:  "✅ Wapinda — ari kutumirwa…",
    login_empty:    "Ndapota pinda email nepassword yako.",
    login_footer:   "Pinda chete vanhu vakabvumirwa",

    about_version: "Vhezheni 1.0 · 2026",
    footer:        "© 2026 Deshbhodo yeHuku",
  },

  nd: {
    nav_dashboard:  "Ibhodi",
    nav_history:    "Umlando",
    nav_alerts:     "Izexwayiso",
    nav_settings:   "Izilungiselelo",
    nav_about:      "Mayelana",
    nav_signout:    "Phuma",
    nav_role:       "Umnikazi Wepulazi",

    site_title: "Ukulinda Indlu Yezinkukhu Ngobuchili",

    card_temperature: "Ukushisa",
    card_humidity:    "Umswakama",
    card_light:       "Ukukhanya",
    card_feed:        "Ukudla",
    card_door:        "Isicelo Somnyango",
    door_open:        "UVULIWE",
    door_closed:      "Uvalwe",

    stat_temp:   "Ukushisa °C (enc/oku/phak)",
    stat_hum:    "Umswakama % (enc/oku/phak)",
    stat_light:  "Ukukhanya % (enc/oku/phak)",
    stat_feed:   "Ukudla g (enc/oku/phak)",

    btn_settings: "⚙️ Izilungiselelo",
    btn_export:   "📥 Thumela (CSV)",
    btn_logout:   "Phuma",
    btn_load:     "🔍 Layisha",
    btn_save:     "Gcina",
    btn_reset:    "Buyisela ekuqaleni",

    modal_title:  "Izilungiselelo Zemikhawulo",
    temp_min:     "Ukushisa Okuncane (°C):",
    temp_max:     "Ukushisa Okukhulu (°C):",
    hum_min:      "Umswakama Omncane (%):",
    hum_max:      "Umswakama Omkhulu (%):",
    light_min:    "Ukukhanya Okuncane (%):",
    light_max:    "Ukukhanya Okukhulu (%):",
    feed_max:     "Ukudla Okukhulu (g):",

    chart_temp:   "Ukushisa (°C)",
    chart_hum:    "Umswakama (%)",
    chart_light:  "Ukukhanya (%)",
    chart_feed:   "Ukudla (g)",

    history_from:    "Kusuka",
    history_to:      "Kuya",
    history_sensor:  "Isensor",
    history_all:     "Zonke izisensor",
    history_rawdata: "Idatha Ekhiwe",
    history_records: "amarekhodi",
    col_number:      "#",
    col_datetime:    "Usuku & Isikhathi",
    col_sensor:      "Isensor",
    col_value:       "Inani",
    col_status:      "Isimo",
    status_normal:   "Kuhle",
    status_warning:  "Isexwayiso",
    status_critical: "Ingozi",

    alerts_title:    "Izexwayiso & Izaziso",
    alerts_live:     "Ukulinda okuqhubekayo",
    alerts_export:   "📥 Thumela Irekhodi",
    alerts_clear:    "🗑 Sula Konke",
    alerts_critical: "Izexwayiso Ezingozi",
    alerts_warnings: "Izexwayiso",
    alerts_total:    "Konke okurekhodiwe",
    alerts_last:     "Isexwayiso sokugcina",
    filter_all:      "Konke",
    filter_critical: "🚨 Ingozi",
    filter_warning:  "⚠️ Isexwayiso",
    filter_info:     "ℹ️ Ulwazi",
    no_alerts:       "Awekho amarekhodi ezexwayiso.",

    toast_door:       "Umnyango uvuliwe ngaphandle kwemvumo!",
    toast_temp_high:  "Ukushisa kukhuphukile kakhulu",
    toast_temp_low:   "Ukushisa kwehlile kakhulu",
    toast_hum_high:   "Umswakama mkhulu kakhulu",
    toast_hum_low:    "Umswakama mncane kakhulu",
    toast_light_high: "Ukukhanya kukhuphukile kakhulu",
    toast_light_low:  "Ukukhanya kwehlile kakhulu",
    toast_feed:       "Ukudla kuselingozini",
    toast_exported:   "Idatha ithunyelwe ngempumelelo!",
    toast_saved:      "Imikhawulo igcinwe",

    login_title:    "Ukulinda Indlu Yezinkukhu",
    login_subtitle: "Ibhodi Yokuphatha Ipulazi",
    login_email:    "Ikheli le-imeyili",
    login_password: "Iphasiwedi",
    login_btn:      "Ngena",
    login_signing:  "Uyangena…",
    login_success:  "✅ Ungene — uyathunywa…",
    login_empty:    " Sicela ufake i-imeyili kanye nephasiwedi yakho.",
    login_footer:   "Ukungena kugunyaziwe kuphela",

    about_version: "Uhlelo 1.0 · 2026",
    footer:        "© 2026 Ibhodi Yezinkukhu",
  }
};

// ── Public API ──

// Get saved language or default to English
export function getLang() {
  return localStorage.getItem('lang') || 'en';
}

// Set language and save
export function setLang(code) {
  localStorage.setItem('lang', code);
}

// Get a single translation key
export function t(key) {
  const lang = getLang();
  return (translations[lang] && translations[lang][key])
    || translations['en'][key]
    || key;
}

// Apply all data-i18n attributes on the page
export function applyTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key);
    if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });
  // Update page title if defined
  const titleKey = document.body.getAttribute('data-title-i18n');
  if (titleKey) document.title = t(titleKey) + ' — Smart Poultry';
}

// Language metadata for UI display
export const languages = [
  { code: 'en', label: 'English',    flag: '🇬🇧' },
  { code: 'fr', label: 'Français',   flag: '🇫🇷' },
  { code: 'pt', label: 'Português',  flag: '🇵🇹' },
  { code: 'sn', label: 'Shona',      flag: '🇿🇼' },
  { code: 'nd', label: 'Ndebele',    flag: '🇿🇼' },
];
