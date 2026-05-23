// ─── Firebase Init (compat SDK) ───────────────────────────────────────────────
const firebaseConfig = {
  databaseURL: "https://poutry-6dd09-default-rtdb.firebaseio.com/"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ─── DOM Elements ─────────────────────────────────────────────────────────────
const temperatureEl  = document.getElementById("temperature");
const humidityEl     = document.getElementById("humidity");
const lightEl        = document.getElementById("light");
const feedEl        = document.getElementById("feed");
const waterLevelEl  = document.getElementById("waterLevel");
const doorEl         = document.getElementById("door");
const toastContainer = document.getElementById("toastContainer");
const alarmSound     = document.getElementById("alarmSound");

// Device Control UI
const ledToggleEl = document.getElementById('ledToggle');
const securityToggleEl = document.getElementById('securityToggle');
const ledStatusEl = document.getElementById('ledStatus');
const securityStatusEl = document.getElementById('securityStatus');
const intrusionAlertEl = document.getElementById('intrusionAlert');


// ================================
// Alert Center (alerts.html) bridge
// ================================
function logAlertToAlertCenter({ type, icon, title, detail }) {
    try {
        const safeType = (type === 'danger' || type === 'warning' || type === 'info') ? type : 'info';
        const titleSafe = title || 'Alert';
        const detailSafe = detail || '';
        const iconSafe = icon || (safeType === 'danger' ? '🚨' : safeType === 'warning' ? '⚠' : 'ℹ');

        let alerts = [];
        try {
            alerts = JSON.parse(localStorage.getItem('alertLog') || '[]');
        } catch (e) {
            alerts = [];
        }

        const now = Date.now();
        const a = {
            id: now,
            type: safeType,
            icon: iconSafe,
            title: titleSafe,
            detail: detailSafe,
            time: new Date().toLocaleString()
        };

        alerts.unshift(a);
        if (alerts.length > 200) alerts = alerts.slice(0, 200);
        localStorage.setItem('alertLog', JSON.stringify(alerts));
    } catch (e) {
        // ignore localStorage errors
    }
}

// ================================
// Toast Notification
// ================================
function showToast(message, type = "success") {
    const toast = document.createElement("div");
    toast.classList.add("toast", `toast-${type}`);

    let icon = "ℹ";
    if (type === "danger")  icon = "🚨";
    if (type === "warning") icon = "⚠";
    if (type === "success") icon = "✅";

    toast.innerHTML = `
        <div class="message">
            <span>${icon}</span>
            <span>${message}</span>
        </div>
        <span class="close-btn">&times;</span>
    `;
    toastContainer.appendChild(toast);

    if (type === "danger") alarmSound.play();

    toast.querySelector(".close-btn").onclick = () => toast.remove();
    setTimeout(() => toast.remove(), 5000);
}

// ====== Data Export ======
function exportDataToCSV() {
    if (!tempChart || !humChart || !lightChart || !feedChart || !waterChart) {
        showToast("No data to export yet!", "warning");
        return;
    }

    const rows = [["Time", "Temperature (°C)", "Humidity (%)", "Light Level (%)", "Feed Weight (g)", "Water Level (%)"]];
    const maxLength = Math.max(
        tempChart.data.labels.length,
        humChart.data.labels.length,
        lightChart.data.labels.length,
        feedChart.data.labels.length,
        waterChart.data.labels.length
    );

    for (let i = 0; i < maxLength; i++) {
        rows.push([
            tempChart.data.labels[i]               || "",
            tempChart.data.datasets[0].data[i]     || "",
            humChart.data.datasets[0].data[i]      || "",
            lightChart.data.datasets[0].data[i]    || "",
            feedChart.data.datasets[0].data[i]     || "",
            waterChart.data.datasets[0].data[i]    || ""
        ]);
    }

    const csvContent = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.setAttribute("href", URL.createObjectURL(blob));
    link.setAttribute("download", `poultry-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Data exported successfully!", "success");
}

// ====== Event Listeners ======
window.addEventListener('load', () => {
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn)  exportBtn.addEventListener('click', exportDataToCSV);

    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn)  settingsBtn.addEventListener('click', openSettings);

    const closeModal = document.querySelector('.close-modal');
    if (closeModal)  closeModal.addEventListener('click', closeSettings);

    const settingsForm = document.getElementById('settingsForm');
    if (settingsForm) {
        settingsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            thresholds.tempMin  = parseFloat(document.getElementById('thresholdTempMin').value);
            thresholds.tempMax  = parseFloat(document.getElementById('thresholdTempMax').value);
            thresholds.humMin   = parseFloat(document.getElementById('thresholdHumMin').value);
            thresholds.humMax   = parseFloat(document.getElementById('thresholdHumMax').value);
            thresholds.lightMin = parseFloat(document.getElementById('thresholdLightMin').value);
            thresholds.lightMax = parseFloat(document.getElementById('thresholdLightMax').value);
            thresholds.feedMin  = parseFloat(document.getElementById('thresholdFeedMin').value);
            thresholds.feedMax  = parseFloat(document.getElementById('thresholdFeedMax').value);
            thresholds.waterMin = parseFloat(document.getElementById('thresholdWaterMin').value);
            thresholds.waterMax = parseFloat(document.getElementById('thresholdWaterMax').value);
            thresholds.doorOpenAlert = document.getElementById('doorOpenAlert').checked;
            localStorage.setItem('thresholds', JSON.stringify(thresholds));
            showToast('Thresholds saved', 'success');
            closeSettings();
        });
    }

    window.addEventListener('click', (evt) => {
        const modal = document.getElementById('settingsModal');
        if (evt.target === modal) closeSettings();
    });
});

// ====== Theme ======
const themeSwitch = document.getElementById('themeSwitch');

function applyTheme(isLight) {
    if (isLight) {
        document.body.classList.add('light');
        themeSwitch.checked = true;
        document.querySelector('.toggle-label').textContent = '☀️';
        localStorage.setItem('theme', 'light');
    } else {
        document.body.classList.remove('light');
        themeSwitch.checked = false;
        document.querySelector('.toggle-label').textContent = '🌙';
        localStorage.setItem('theme', 'dark');
    }
}
applyTheme(localStorage.getItem('theme') === 'light');
themeSwitch.addEventListener('change', () => applyTheme(themeSwitch.checked));

// ====== Thresholds ======
const defaultThresholds = {
    tempMin:  15,  tempMax:  35,   // typical poultry house range °C
    humMin:   40,  humMax:   80,   // % relative humidity
    lightMin: 20,  lightMax: 100,  // brightness % from ESP32
    feedMin:  10,  feedMax:  100,  // grams — alert when hopper exceeds limit
    waterMin: 20,  waterMax: 100,  // %
    doorOpenAlert: true
};
let thresholds = JSON.parse(localStorage.getItem('thresholds') || 'null') || defaultThresholds;

function openSettings() {
    document.getElementById('settingsModal').style.display = 'block';
    document.getElementById('thresholdTempMin').value  = thresholds.tempMin;
    document.getElementById('thresholdTempMax').value  = thresholds.tempMax;
    document.getElementById('thresholdHumMin').value   = thresholds.humMin;
    document.getElementById('thresholdHumMax').value   = thresholds.humMax;
    document.getElementById('thresholdLightMin').value = thresholds.lightMin;
    document.getElementById('thresholdLightMax').value = thresholds.lightMax;
    document.getElementById('thresholdFeedMin').value  = thresholds.feedMin;
    document.getElementById('thresholdFeedMax').value  = thresholds.feedMax;
    document.getElementById('thresholdWaterMin').value = thresholds.waterMin;
    document.getElementById('thresholdWaterMax').value = thresholds.waterMax;
    const doorChk = document.getElementById('doorOpenAlert');
    if (doorChk) doorChk.checked = thresholds.doorOpenAlert !== false;
}
function closeSettings() {
    document.getElementById('settingsModal').style.display = 'none';
}

// Threshold check — called after each Firebase update
function checkThresholds() {
    const temp  = parseFloat(temperatureEl.textContent) || 0;
    const hum   = parseFloat(humidityEl.textContent)    || 0;
    const light = parseFloat(lightEl.textContent)       || 0;
    const feed  = parseFloat(feedEl.textContent)       || 0;
    const water = parseFloat(waterLevelEl.textContent) || 0;
    const doorStatus = doorEl.textContent === "CLOSED";

    if (temp < thresholds.tempMin || temp > thresholds.tempMax) {
        showToast(`Temperature out of range: ${temp.toFixed(1)} °C`, "danger");
        logAlertToAlertCenter({
            type: 'danger',
            icon: '🚨',
            title: 'Temperature out of range',
            detail: `${temp.toFixed(1)} °C — allowed ${thresholds.tempMin}–${thresholds.tempMax} °C`
        });
    }

    if (hum < thresholds.humMin || hum > thresholds.humMax) {
        showToast(`Humidity out of range: ${hum.toFixed(1)} %`, "warning");
        logAlertToAlertCenter({
            type: 'warning',
            icon: '⚠',
            title: 'Humidity out of range',
            detail: `${hum.toFixed(1)} % — allowed ${thresholds.humMin}–${thresholds.humMax} %`
        });
    }

    if (light < thresholds.lightMin || light > thresholds.lightMax) {
        showToast(`Light level out of range: ${light} %`, "warning");
        logAlertToAlertCenter({
            type: 'warning',
            icon: '💡',
            title: 'Light level out of range',
            detail: `${light} % — allowed ${thresholds.lightMin}–${thresholds.lightMax} %`
        });
    }

    if (feed < thresholds.feedMin || feed > thresholds.feedMax) {
        showToast(`Feed level out of range: ${feed} g`, "danger");
        logAlertToAlertCenter({
            type: 'danger',
            icon: '🍛',
            title: 'Feed level out of range',
            detail: `${feed} g — allowed ${thresholds.feedMin}–${thresholds.feedMax} g`
        });
    }

    if (water < thresholds.waterMin || water > thresholds.waterMax) {
        showToast(`Water level out of range: ${water} %`, "warning");
        logAlertToAlertCenter({
            type: 'warning',
            icon: '💧',
            title: 'Water level out of range',
            detail: `${water} % — allowed ${thresholds.waterMin}–${thresholds.waterMax} %`
        });
    }

    if (!doorStatus && thresholds.doorOpenAlert) {
        showToast("Door opened unexpectedly!", "danger");
        logAlertToAlertCenter({
            type: 'danger',
            icon: '🚨',
            title: 'Door opened unexpectedly',
            detail: 'Door state changed while it should be closed.'
        });
    }

}

// ====== Charts ======
let tempChart, humChart, lightChart, feedChart, waterChart;

function initChart() {
    const chartDefaults = (label, color, yLabel = '') => ({
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label,
                borderColor: color,
                backgroundColor: color.replace(')', ',0.2)').replace('rgb', 'rgba'),
                tension: 0.3,
                data: []
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { type: 'category', ticks: { maxRotation: 45, minRotation: 45 } },
                y: { beginAtZero: false, title: { display: !!yLabel, text: yLabel } }
            }
        }
    });

    tempChart = new Chart(document.getElementById('tempChart').getContext('2d'),
        chartDefaults('Temperature (°C)', '#ff4d4d', '°C'));

    humChart = new Chart(document.getElementById('humChart').getContext('2d'),
        chartDefaults('Humidity (%)', '#00ccff', '%'));

    lightChart = new Chart(document.getElementById('lightChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Light Level (%)',
                borderColor: '#ffcc00',
                backgroundColor: 'rgba(255,204,0,0.2)',
                tension: 0.3,
                data: []
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { type: 'category', ticks: { maxRotation: 45, minRotation: 45 } },
                y: { min: 0, max: 100, title: { display: true, text: 'Brightness (%)' } }
            }
        }
    });

    feedChart = new Chart(document.getElementById('feedChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Feed Weight (g)',
                borderColor: '#ff9933',
                backgroundColor: 'rgba(255,153,51,0.2)',
                tension: 0.3,
                data: []
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { type: 'category', ticks: { maxRotation: 45, minRotation: 45 } },
                y: { beginAtZero: true, title: { display: true, text: 'grams' } }
            }
        }
    });

    waterChart = new Chart(document.getElementById('waterChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Water Level (%)',
                borderColor: '#00ccff',
                backgroundColor: 'rgba(0,204,255,0.2)',
                tension: 0.3,
                data: []
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: { type: 'category', ticks: { maxRotation: 45, minRotation: 45 } },
                y: { min: 0, max: 100, title: { display: true, text: 'Percentage (%)' } }
            }
        }
    });
}

window.addEventListener('load', initChart);

// ====== Stats ======
function calculateStats(array) {
    if (!array.length) return { min: '--', max: '--', avg: '--' };
    const nums = array.map(Number);
    return {
        min: Math.min(...nums).toFixed(1),
        max: Math.max(...nums).toFixed(1),
        avg: (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1)
    };
}

function updateStats() {
    if (!tempChart || !humChart || !lightChart || !feedChart || !waterChart) return;
    const t = calculateStats(tempChart.data.datasets[0].data);
    const h = calculateStats(humChart.data.datasets[0].data);
    const l = calculateStats(lightChart.data.datasets[0].data);
    const f = calculateStats(feedChart.data.datasets[0].data);
    const w = calculateStats(waterChart.data.datasets[0].data);
    document.getElementById('statTemp').textContent  = `${t.min} / ${t.max} / ${t.avg}`;
    document.getElementById('statHum').textContent   = `${h.min} / ${h.max} / ${h.avg}`;
    document.getElementById('statLight').textContent = `${l.min} / ${l.max} / ${l.avg}`;
    document.getElementById('statFeed').textContent  = `${f.min} / ${f.max} / ${f.avg}`;
    document.getElementById('statWater').textContent = `${w.min} / ${w.max} / ${w.avg}`;
}

// ================================
// Helper: rebuild chart from Firebase snapshot entries
// ================================
function rebuildChart(chart, entries, parseFn) {
    const now = new Date().toLocaleTimeString();
    chart.data.labels           = entries.map(([, ], i) =>
        i === entries.length - 1 ? now : `T-${entries.length - 1 - i}`
    );
    chart.data.datasets[0].data = entries.map(([, v]) => parseFn(v));
    chart.update();
}

// ════════════════════════════════════════════
// REAL Firebase Listeners
// ════════════════════════════════════════════

// ════════════════════════════════════════════
// Door Status - REAL Firebase Listener (true=CLOSED, false=OPEN)
let lastDoorOpen = null; // track transitions to avoid repeated alerts
db.ref("/data/door_status").on("value", (snapshot) => {
    const doorClosed = snapshot.val();
    const isClosed = (doorClosed === true || doorClosed === "true");
    const isOpen = !isClosed;

    if (isClosed) {
        doorEl.textContent = "CLOSED";
        doorEl.className = "safe-text";
    } else {
        doorEl.textContent = "OPEN";
        doorEl.className = "danger-text";
    }

    // Smart security logic: only trigger on OPEN transition
    if (lastDoorOpen === null) {
        lastDoorOpen = isOpen;
    } else if (!lastDoorOpen && isOpen) {
        handleIntrusionIfArmed();
        lastDoorOpen = true;
    } else if (lastDoorOpen && !isOpen) {
        lastDoorOpen = false;
    }

    checkThresholds();
});


// ─── Gauge Elements ───────────────────────────────────────────────────────────
const tempGaugeEl  = document.getElementById("tempGauge");
const humGaugeEl   = document.getElementById("humGauge");
const lightGaugeEl = document.getElementById("lightGauge");
const feedGaugeEl  = document.getElementById("feedGauge");
const waterGaugeEl = document.getElementById("waterGauge");

// ====== Gauge Update Logic ======
/**
 * @param {HTMLElement} element - The gauge-fill element
 * @param {number} value - The current value
 * @param {number} min - Lower threshold for "medium" warning
 * @param {number} max - Upper threshold for "high" alert
 * @param {number} scale - Max possible value for width (e.g., 100 for %)
 */
function updateGauge(element, value, min, max, scale = 100) {
    if (!element) return;
    
    // Calculate width percentage relative to scale
    const width = Math.min(Math.max((value / scale) * 100, 0), 100);
    element.style.width = `${width}%`;

    // Update colors based on thresholds
    element.classList.remove('low', 'medium', 'high');
    if (value < min) {
        element.classList.add('medium'); // Green/Safe
    } else if (value >= min && value <= max) {
        element.classList.add('low'); // Warning
    } else {
        element.classList.add('high'); // Critical
    }
}

// ════════════════════════════════════════════
// Updated Firebase Listeners
// ════════════════════════════════════════════

// ── Temperature (DHT22) ──
db.ref("/data/temperature").limitToLast(20).on("value", (snapshot) => {
    const raw = snapshot.val();
    if (!raw || !tempChart) return;
    const entries = Object.entries(raw);
    const latest = parseFloat(entries[entries.length - 1][1]);
    
    temperatureEl.textContent = latest.toFixed(1) + " °C";
    
    // Update Gauge: Green < 30, Yellow up to 35, Red > 35 (approximate)
    updateGauge(tempGaugeEl, latest, 30, 35, 50); 
    
    rebuildChart(tempChart, entries, v => parseFloat(v));
    updateStats();
    checkThresholds();
});

// ── Humidity (DHT22) ──
db.ref("/data/humidity").limitToLast(20).on("value", (snapshot) => {
    const raw = snapshot.val();
    if (!raw || !humChart) return;
    const entries = Object.entries(raw);
    const latest = parseFloat(entries[entries.length - 1][1]);

    humidityEl.textContent = latest.toFixed(1) + " %";
    
    // Update Gauge: Green < 60, Yellow up to 80, Red > 80
    updateGauge(humGaugeEl, latest, 60, 80, 100);

    rebuildChart(humChart, entries, v => parseFloat(v));
    updateStats();
    checkThresholds();
});

// ── Light (MH-Sensor) ──
db.ref("/data/light").limitToLast(20).on("value", (snapshot) => {
    const raw = snapshot.val();
    if (!raw || !lightChart) return;
    const entries = Object.entries(raw);
    const latest = parseInt(entries[entries.length - 1][1], 10);

    lightEl.textContent = latest + " %";
    
    // Update Gauge
    updateGauge(lightGaugeEl, latest, 50, 85, 100);

    rebuildChart(lightChart, entries, v => parseInt(v, 10));
    updateStats();
    checkThresholds();
});

// ── Feed Weight (HX711) ──
db.ref("/data/weight").limitToLast(20).on("value", (snapshot) => {
    const raw = snapshot.val();
    if (!raw || !feedChart) return;
    const entries = Object.entries(raw);
    const latest = Math.max(0, parseFloat(entries[entries.length - 1][1]));

    feedEl.textContent = latest.toFixed(1) + " g";
    
    // Update Gauge: Logic is inverted for feed (Red when LOW), 
    // but for the UI bar we'll show fill level relative to 5kg
    updateGauge(feedGaugeEl, latest, 10, 50, 100);

    rebuildChart(feedChart, entries, v => Math.max(0, parseFloat(v)));
    updateStats();
    checkThresholds();
});

// ── Water Level (MH-Sensor) ──
db.ref("/data/water_level").limitToLast(20).on("value", (snapshot) => {
    const raw = snapshot.val();
    if (!raw || !waterChart) return;
    const entries = Object.entries(raw);
    const latest = parseInt(entries[entries.length - 1][1], 10);

    waterLevelEl.textContent = latest + " %";
    
    // Update Gauge
    updateGauge(waterGaugeEl, latest, 20, 50, 100);

    rebuildChart(waterChart, entries, v => parseInt(v, 10));
    updateStats();
    checkThresholds();
});
// ================================
// Device Control + Smart Security
// ================================

// In-memory mirror of Firebase command booleans
let _ledOn       = false;
let _securityOn  = false;

// ── Helpers to update the toggle UI without re-triggering 'change' ──
function applyLedUI(isOn) {
    _ledOn = isOn;
    if (ledToggleEl)   ledToggleEl.checked = isOn;
    if (ledStatusEl) {
        ledStatusEl.textContent = isOn ? 'ON' : 'OFF';
        ledStatusEl.className   = 'status-pill ' + (isOn ? 'status-on' : 'status-off');
    }
}

function applySecurityUI(isArmed) {
    _securityOn = isArmed;
    if (securityToggleEl)   securityToggleEl.checked = isArmed;
    if (securityStatusEl) {
        securityStatusEl.textContent = isArmed ? 'ARMED' : 'DISARMED';
        securityStatusEl.className   = 'status-pill ' + (isArmed ? 'status-on' : 'status-off');
    }
}

// ── Firebase → UI: keep toggles in sync with DB truth ──
db.ref('/commands/led_on').on('value', (snap) => {
    const val = snap.val();
    if (val !== null) applyLedUI(val === true || val === 'true');
});

db.ref('/commands/security_on').on('value', (snap) => {
    const val = snap.val();
    if (val !== null) applySecurityUI(val === true || val === 'true');
});

function handleIntrusionIfArmed() {
    if (!_securityOn) return;   // Security disarmed → stay silent

    if (intrusionAlertEl) intrusionAlertEl.style.display = 'block';

    showToast('🚨 Intrusion Alert: Door opened while Security is ARMED.', 'danger');
    logAlertToAlertCenter({
        type: 'danger',
        icon: '🚨',
        title: 'Intrusion Alert',
        detail: 'Door opened while Security is ARMED.'
    });

    try {
        alarmSound.currentTime = 0;
        alarmSound.play();
    } catch (e) { /* ignore autoplay restrictions */ }
}

function wireDeviceControls() {
    if (ledToggleEl) {
        ledToggleEl.addEventListener('change', () => {
            const isOn = !!ledToggleEl.checked;
            applyLedUI(isOn);
            // Write command to Firebase — ESP32 reads /commands/led_on
            db.ref('/commands/led_on').set(isOn).catch(console.error);
        });
    }

    if (securityToggleEl) {
        securityToggleEl.addEventListener('change', () => {
            const isArmed = !!securityToggleEl.checked;
            applySecurityUI(isArmed);
            // Write command to Firebase — ESP32 reads /commands/security_on
            db.ref('/commands/security_on').set(isArmed).catch(console.error);

            // Stop local alarm sound when disarming
            if (!isArmed) {
                try { alarmSound.pause(); alarmSound.currentTime = 0; } catch (e) {}
                if (intrusionAlertEl) intrusionAlertEl.style.display = 'none';
            }
        });
    }
}

wireDeviceControls();