import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, orderBy, limit, getDocs, writeBatch, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= config ================= */
const firebaseConfig = {
  apiKey: "AIzaSyD5CSchGGl9NTsPDgwmfRkhrvyogCRrbZ0",
  authDomain: "salonslot-d44af.firebaseapp.com",
  projectId: "salonslot-d44af",
  storageBucket: "salonslot-d44af.firebasestorage.app",
  messagingSenderId: "1041857314935",
  appId: "1:1041857314935:web:ac9cb74373273477a80672"
};
const ADMIN_EMAIL = "vishwakarmaarjun128@gmail.com";
const FIELD_VERSION = "2026.11.26-1";
const RADIUS = 50, FIFTEEN = 15 * 60000;
const CONSENT_VER = 1;
const RETAIN_DAYS = 90;

const fb = initializeApp(firebaseConfig);
const auth = getAuth(fb);
const db = getFirestore(fb);

/* ================= small helpers ================= */
const $app = document.getElementById("app");
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const pad = n => String(n).padStart(2, "0");
const dateStr = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fmtTime = ms => ms ? new Date(ms).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }) : "—";
const fmtDate = s => { const [y, m, d] = s.split("-"); return `${d}-${m}-${y}`; };
const fmtDur = ms => { const m = Math.max(0, Math.floor(ms / 60000)); return `${Math.floor(m / 60)} घंटा ${pad(m % 60)} मिनट`; };
const mapLink = l => l ? `https://www.google.com/maps?q=${l.lat},${l.lng}` : "";
const RESULT = { interest: "रुचि है", later: "बाद में आना", refused: "मना किया", signup: "signup हुआ" };
const KIND = { salary: "सैलरी वाला", commission: "commission वाला" };

/* attendance for one day: rules in the PRD. Phase 1 has no GPS movement rule yet. */
function dayStatus(d, today) {
  if (d.fix) return "fixed";
  if (d.act === "still") return d.out > 0 || d.date < today ? "still" : "open";
  if (d.out > 0) return "ok";
  return d.date === today ? "open" : "missed";
}
const STATUS = {
  ok: ["हाज़िरी लगी", "ok"], fixed: ["Admin ने ठीक की", "ok"],
  open: ["काम चालू", "open"], still: ["हाज़िरी नहीं (15 मिनट एक जगह रुका)", "bad"], missed: ["हाज़िरी नहीं (Time out नहीं दबाया)", "bad"]
};
const chip = st => `<span class="chip ${STATUS[st][1]}">${STATUS[st][0]}</span>`;

function csv(rows) {
  const cell = v => { v = v == null ? "" : String(v); if (/^[=+\-@]/.test(v)) v = "'" + v; return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  return "﻿" + rows.map(r => r.map(cell).join(",")).join("\r\n");
}
function download(name, text) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
  a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}

function getPos() {
  return new Promise(res => {
    if (!navigator.geolocation) return res(null);
    const f0 = TRK.fix; if (f0 && Date.now() - f0.t < 20000) return res({ lat: f0.lat, lng: f0.lng, acc: f0.acc }); // tracker has a fresh fix
    navigator.geolocation.getCurrentPosition(
      p => res({ lat: +p.coords.latitude.toFixed(6), lng: +p.coords.longitude.toFixed(6), acc: Math.round(p.coords.accuracy) }),
      () => { const f = TRK.fix; // GPS busy: fall back to the tracker's fix if it is under 2 minutes old
        res(f && Date.now() - f.t < 120000 ? { lat: f.lat, lng: f.lng, acc: f.acc } : null); },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 });
  });
}
function loadImg(file) {
  return new Promise((res, rej) => {
    const u = URL.createObjectURL(file), i = new Image();
    i.onload = () => { URL.revokeObjectURL(u); res(i); };
    i.onerror = () => rej(new Error("image"));
    i.src = u;
  });
}
function scaled(img, max, q, stamp) {
  const k = Math.min(1, max / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
  const g = c.getContext("2d");
  g.drawImage(img, 0, 0, c.width, c.height);
  if (stamp) { // time and place printed on the photo itself
    const h = Math.max(18, Math.round(c.width / 28));
    g.fillStyle = "rgba(0,0,0,.55)"; g.fillRect(0, c.height - h * 1.6, c.width, h * 1.6);
    g.fillStyle = "#fff"; g.font = `${h}px sans-serif`; g.textBaseline = "middle";
    g.fillText(stamp, h * .5, c.height - h * .8);
  }
  return c.toDataURL("image/jpeg", q);
}
async function makePhotos(file, stamp) {
  const img = await loadImg(file);
  let photo = scaled(img, 960, 0.7, stamp);
  if (photo.length > 650000) photo = scaled(img, 800, 0.55, stamp);
  return { photo, thumb: scaled(img, 140, 0.6) };
}


/* ================= GPS tracking (phase 2) ================= */
const toRad = x => x * Math.PI / 180;
function dist(a, b) {
  const R = 6371000, dLa = toRad(b.lat - a.lat), dLo = toRad(b.lng - a.lng);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLo / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}
const TRK = { id: null, day: null, buf: [], early: [], last: null, lastFix: 0, fix: null, bat: null, timer: null, flushT: null, lock: null, flushing: false };
const bufKey = () => "fieldbuf_" + TRK.day.id, earlyKey = () => "fieldearly_" + TRK.day.id;
const keep = () => { try { localStorage.setItem(bufKey(), JSON.stringify(TRK.buf)); localStorage.setItem(earlyKey(), JSON.stringify(TRK.early)); } catch (e) { /* storage full or blocked */ } };

function startTracking(d) {
  if (TRK.id != null || !navigator.geolocation || !d || d.out) return;
  TRK.day = d;
  try { TRK.buf = JSON.parse(localStorage.getItem(bufKey()) || "[]"); TRK.early = JSON.parse(localStorage.getItem(earlyKey()) || "[]"); } catch (e) { TRK.buf = []; TRK.early = []; }
  TRK.last = TRK.buf[TRK.buf.length - 1] || TRK.early[TRK.early.length - 1] || null;
  TRK.lastFix = Date.now();
  TRK.id = navigator.geolocation.watchPosition(onPos, () => {}, { enableHighAccuracy: true, maximumAge: 10000, timeout: 30000 });
  TRK.flushT = setInterval(() => flush(), 60000);
  if (!d.act) TRK.timer = setTimeout(check15, Math.max(1000, d.start + FIFTEEN + 5000 - Date.now()));
  wake();
  if (navigator.getBattery) navigator.getBattery().then(b => { TRK.bat = b; }).catch(() => {});
}
function onPos(p) {
  const d = TRK.day; if (!d || d.out) return;
  const now = Date.now(), pt = { t: now, lat: +p.coords.latitude.toFixed(6), lng: +p.coords.longitude.toFixed(6), acc: Math.round(p.coords.accuracy) };
  if (TRK.bat) pt.bat = Math.round(TRK.bat.level * 100);
  TRK.lastFix = now; TRK.fix = { lat: pt.lat, lng: pt.lng, acc: pt.acc, t: now };
  const L = TRK.last;
  if (pt.acc > 150 && L) return;            // very poor fix, ignore
  if (L && now - L.t < 20000) return;       // at most one point per 20 s
  if (!L || now - L.t >= 180000 || dist(L, pt) >= RADIUS) { // every 3 min, or after moving 50 m
    TRK.last = pt; TRK.buf.push(pt);
    if (now - d.start <= FIFTEEN + 60000) TRK.early.push(pt);
    keep();
    if (!d.act && now - d.start <= FIFTEEN && d.startLoc && dist(d.startLoc, pt) > RADIUS) setAct("ok15");
  }
}
function check15() { // the 15-minute rule: moved out of 50 m, or saved a visit, counts; clearly stood still does not
  const d = TRK.day; if (!d || d.act || d.out) return;
  const moved = TRK.early.some(p => p.t - d.start <= FIFTEEN && dist(d.startLoc, p) > RADIUS) || S.visits.some(v => v.dayId === d.id);
  if (moved) return setAct("ok15");
  const ev = TRK.early.filter(p => p.t - d.start <= FIFTEEN + 60000);
  if (ev.length >= 2 && ev[ev.length - 1].t - d.start >= 10 * 60000) return setAct("still");
  setAct("nodata");                          // not enough GPS to decide: Admin checks
}
async function setAct(v) {
  const d = TRK.day || todayDay(); if (!d || d.act === v || d.act === "ok15") return;
  try {
    await updateDoc(doc(db, "field_days", d.id), { act: v }); d.act = v;
    const td = todayDay(); if (td) td.act = v;
    if (S.role === "staff" && S.view === "home") render();
  } catch (e) { console.error(e); }
}
async function flush() { // points go up one document per hour; failures stay in the phone buffer
  const d = TRK.day; if (!d || !TRK.buf.length || !navigator.onLine || TRK.flushing) return true;
  TRK.flushing = true;
  const batch = TRK.buf.slice(), byHour = {};
  batch.forEach(p => { const h = pad(new Date(p.t).getHours()); (byHour[h] = byHour[h] || []).push(p); });
  try {
    for (const [h, pts] of Object.entries(byHour))
      await setDoc(doc(db, "field_points", `${d.id}_${h}`), { email: S.email, dayId: d.id, date: d.date, pts: arrayUnion(...pts) }, { merge: true });
    TRK.buf = TRK.buf.slice(batch.length); keep(); return true;
  } catch (e) { console.error(e); return false; }
  finally { TRK.flushing = false; }
}
function stopTracking() {
  if (TRK.id != null) navigator.geolocation.clearWatch(TRK.id);
  clearInterval(TRK.flushT); clearTimeout(TRK.timer);
  if (TRK.lock) { TRK.lock.release().catch(() => {}); TRK.lock = null; }
  if (TRK.day) { try { localStorage.removeItem(bufKey()); localStorage.removeItem(earlyKey()); } catch (e) { /* ignore */ } }
  Object.assign(TRK, { id: null, day: null, buf: [], early: [], last: null, fix: null, flushing: false });
}
async function wake() { // keeps the screen on while working, so the browser keeps giving GPS
  try { if ("wakeLock" in navigator && !TRK.lock) { TRK.lock = await navigator.wakeLock.request("screen"); TRK.lock.addEventListener("release", () => { TRK.lock = null; }); } } catch (e) { /* not allowed */ }
}
document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible" && TRK.id != null) { wake(); flush(); } });
window.addEventListener("online", () => { if (TRK.id != null) flush(); });
function trackNote() {
  if (TRK.id == null) return "";
  const ago = Date.now() - TRK.lastFix, m = Math.floor(ago / 60000);
  return ago > 5 * 60000 ? `<div class="msg bad" id="trk">GPS नहीं मिल रहा (${m} मिनट से)। फ़ोन की Location चालू रखें और इस screen को खुला रखें।</div>`
    : `<div class="msg" id="trk">📍 Tracking चालू · screen चालू रखें, app बंद न करें</div>`;
}

/* ================= state ================= */
const S = {
  ready: false, user: null, email: "", role: null, staff: null,
  view: "home", busy: false, msg: "", bad: false,
  today: dateStr(), days: [], visits: [],
  form: blankForm(), overlay: "",
  adm: { tab: "people", staff: [], visits: [], days: [], live: {}, map: null, fStaff: "", fFrom: "" }
};
function blankForm() { return { salon: "", owner: "", phone: "", demo: "yes", result: "interest", follow: "", file: null, preview: "" }; }
function say(m, bad) { S.msg = m; S.bad = !!bad; }
const dayId = () => `${S.email}_${S.today}`;
const todayDay = () => S.days.find(d => d.date === S.today);

/* ================= data ================= */
async function loadStaffData() {
  const [ds, vs] = await Promise.all([
    getDocs(query(collection(db, "field_days"), where("email", "==", S.email))),
    getDocs(query(collection(db, "field_visits"), where("email", "==", S.email)))
  ]);
  S.days = ds.docs.map(x => ({ id: x.id, ...x.data() })).sort((a, b) => b.date.localeCompare(a.date));
  S.visits = vs.docs.map(x => ({ id: x.id, ...x.data() })).sort((a, b) => b.at - a.at);
}
async function loadAdminData() {
  const [st, vs, ds] = await Promise.all([
    getDocs(collection(db, "field_staff")),
    getDocs(query(collection(db, "field_visits"), orderBy("at", "desc"), limit(100))),
    getDocs(query(collection(db, "field_days"), orderBy("date", "desc"), limit(300)))
  ]);
  S.adm.staff = st.docs.map(x => ({ id: x.id, ...x.data() })).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  S.adm.visits = vs.docs.map(x => ({ id: x.id, ...x.data() }));
  S.adm.days = ds.docs.map(x => ({ id: x.id, ...x.data() }));
}

onAuthStateChanged(auth, async u => {
  S.user = u; S.role = null; S.staff = null; S.ready = false; render();
  try {
    if (u) {
      S.email = (u.email || "").toLowerCase(); S.today = dateStr();
      if (S.email === ADMIN_EMAIL && u.emailVerified) { S.role = "admin"; await loadAdminData(); }
      else {
        const s = await getDoc(doc(db, "field_staff", S.email));
        if (s.exists() && s.data().active) { S.role = "staff"; S.staff = s.data(); await loadStaffData(); const td = todayDay(); if (td && !td.out) startTracking(td); }
        else S.role = "none";
      }
    }
  } catch (e) { console.error(e); say("डेटा नहीं खुला। नेट देखकर दोबारा खोलें।", true); }
  S.ready = true; render();
});
getRedirectResult(auth).catch(() => {});

/* ================= screens ================= */
function header() {
  return `<div class="top"><div class="in"><div class="brand">SalonSlot Field<small>${esc(S.staff ? S.staff.name : S.role === "admin" ? "Admin" : "")}</small></div><div class="spacer"></div>${S.user ? `<button class="link" data-act="logout">बाहर निकलें</button>` : ""}</div></div>`;
}
function msgBox() { return S.msg ? `<div class="msg ${S.bad ? "bad" : ""}" role="status">${esc(S.msg)}</div>` : ""; }

function render() {
  let h;
  if (!S.ready) h = `<p class="boot">लोड हो रहा है…</p>`;
  else if (!S.user) h = loginView();
  else if (S.role === "admin") h = header() + adminView();
  else if (S.role === "staff") h = header() + staffView();
  else h = header() + `<main><div class="card"><h2>आपका email जुड़ा नहीं है</h2><p>Arjun से कहें कि वे <b>${esc(S.email)}</b> को Field Team में जोड़ दें, फिर दोबारा खोलें।</p></div></main>`;
  $app.innerHTML = h + (S.overlay ? `<div class="overlay" data-act="closeov"><img alt="फोटो" src="${S.overlay}"></div>` : "");
}

function loginView() {
  return `${header()}<main><div class="card login"><h2>Field Team में आपका स्वागत है</h2>
  <p class="muted">काम की हाज़िरी और सैलून visits यहीं दर्ज होंगे। अपने Google account से अंदर आएँ।</p>
  ${msgBox()}<button class="btn gold" data-act="login">Google से login करें</button>
  <p class="small muted">Chrome में खोलें। WhatsApp या Instagram के अंदर login नहीं चलता।</p></div></main>`;
}

/* ---------- staff ---------- */
function consentView() {
  return `<main><div class="card"><h2>पहले यह पढ़ें और सहमति दें</h2>
  <div class="consent"><ul>
   <li><b>क्या दर्ज होगा:</b> आपकी हाज़िरी (Start और Time out का समय), हर visit का फोटो, और Start, Time out और हर visit के समय की लोकेशन।</li>
   <li><b>कब:</b> सिर्फ़ काम के घंटों में, यानी Start दबाने से Time out दबाने तक। इसके बाहर कुछ दर्ज नहीं होगा।</li>
   <li><b>कौन देखेगा:</b> सिर्फ़ Arjun (Admin) और आप खुद अपना डेटा।</li>
   <li><b>कितने दिन:</b> ${RETAIN_DAYS} दिन तक रखा जाएगा, उसके बाद मिटाया जाएगा।</li>
   <li><b>क्यों:</b> काम का सबूत रखने, हाज़िरी लगाने और commission का हिसाब करने के लिए।</li>
   <li>सहमति के बिना app आगे नहीं चलेगा। आप जब चाहें Arjun को बोलकर अपना खाता बंद करवा सकते हैं।</li>
  </ul></div>${msgBox()}
  <button class="btn gold" data-act="consent" ${S.busy ? "disabled" : ""}>मैं सहमत हूँ</button></div></main>`;
}

function staffView() {
  if (!S.staff.consentAt) return consentView();
  const nav = `<nav class="nav"><button data-act="nav" data-v="home" class="${S.view === "home" || S.view === "visit" ? "on" : ""}">होम</button><button data-act="nav" data-v="mine" class="${S.view === "mine" ? "on" : ""}">मेरा दिन</button></nav>`;
  if (S.view === "visit") return `<main>${visitForm()}</main>${nav}`;
  if (S.view === "mine") return `<main>${mineView()}</main>${nav}`;
  return `<main>${homeView()}</main>${nav}`;
}

function homeView() {
  const d = todayDay(), todays = S.visits.filter(v => v.date === S.today);
  const missed = S.days.filter(x => dayStatus(x, S.today) === "missed" && x.date >= dateStr(new Date(Date.now() - 3 * 864e5)));
  let h = msgBox();
  if (missed.length) h += `<div class="msg bad">${missed.map(x => fmtDate(x.date)).join(", ")} को Time out नहीं दबाया, इसलिए उस दिन की हाज़िरी नहीं लगी। Arjun से बात करें।</div>`;
  if (!d) {
    h += `<div class="card"><h2>नमस्ते ${esc(S.staff.name)}</h2><p class="muted">आज ${fmtDate(S.today)}। काम शुरू करने के लिए Start दबाएँ। लोकेशन चालू होनी चाहिए।</p>
    <button class="btn big" data-act="start" ${S.busy ? "disabled" : ""}>${S.busy ? "लोकेशन ले रहे हैं…" : "Start"}</button></div>`;
  } else if (!d.out) {
    h += `<div class="card"><div class="row"><h2>काम चालू</h2><span class="spacer"></span>${chip("open")}</div>
    <div class="timer" id="elapsed">${fmtDur(Date.now() - d.start)}</div>
    ${trackNote()}
    <p class="muted small">Start: ${fmtTime(d.start)} · आज के visits: ${todays.length}</p>
    <button class="btn gold" data-act="newvisit">＋ सैलून visit जोड़ें</button>
    <button class="btn ghost" data-act="timeout" ${S.busy ? "disabled" : ""}>Time out</button></div>`;
  } else {
    h += `<div class="card"><div class="row"><h2>आज का दिन पूरा</h2><span class="spacer"></span>${chip("ok")}</div>
    <p>Start ${fmtTime(d.start)} → Time out ${fmtTime(d.out)}<br>कुल <b>${d.hours} घंटे</b> · visits <b>${todays.length}</b></p></div>`;
  }
  if (todays.length) h += `<h3>आज के visits</h3><div class="list">${todays.map(visitItem).join("")}</div>`;
  return h;
}
function visitItem(v) {
  return `<div class="card item"><img class="th" alt="" src="${esc(v.thumb)}"><div><b>${esc(v.salon)}</b><br><span class="small muted">${fmtTime(v.at)} · ${esc(RESULT[v.result] || v.result)}${v.demo ? " · demo हुआ" : ""}</span></div></div>`;
}
function mineView() {
  const rows = S.days.slice(0, 31).map(d => {
    const n = S.visits.filter(v => v.date === d.date).length, st = dayStatus(d, S.today);
    return `<div class="card"><div class="row"><b>${fmtDate(d.date)}</b><span class="spacer"></span>${chip(st)}</div>
    <span class="small muted">${fmtTime(d.start)} → ${fmtTime(d.out)}${d.hours ? " · " + d.hours + " घंटे" : ""} · visits ${n}</span></div>`;
  }).join("");
  return `<h2>मेरा दिन</h2>${msgBox()}<div class="list">${rows || `<p class="muted">अभी कोई दिन दर्ज नहीं।</p>`}</div>`;
}

function visitForm() {
  const f = S.form, d = todayDay();
  if (!d || d.out) return `<div class="card"><p>Visit जोड़ने के लिए पहले आज का Start दबाएँ।</p><button class="btn ghost" data-act="nav" data-v="home">वापस</button></div>`;
  return `<h2>सैलून visit</h2>${msgBox()}
  <form class="card" id="vform" novalidate>
    <label>दुकान के बाहर से फोटो (कैमरे से, ज़रूरी)
      <div class="photo" style="${f.preview ? `background-image:url(${f.preview})` : ""}">${f.preview ? "" : "फोटो लेने के लिए नीचे का बटन दबाएँ"}</div></label>
    <input type="file" id="pfile" accept="image/*" capture="environment" hidden>
    <button type="button" class="btn ghost" data-act="pickphoto">${f.preview ? "फोटो बदलें" : "📷 फोटो लें"}</button>
    <label>सैलून का नाम<input name="salon" value="${esc(f.salon)}" maxlength="80" autocomplete="off"></label>
    <label>मालिक का नाम<input name="owner" value="${esc(f.owner)}" maxlength="60" autocomplete="off"></label>
    <label>मालिक का मोबाइल नंबर<input name="phone" value="${esc(f.phone)}" inputmode="tel" maxlength="20" autocomplete="off"></label>
    <div><b class="small">Demo हुआ?</b><div class="seg" style="margin-top:6px">
      <label><input type="radio" name="demo" value="yes" ${f.demo === "yes" ? "checked" : ""}> हाँ</label>
      <label><input type="radio" name="demo" value="no" ${f.demo === "no" ? "checked" : ""}> नहीं</label></div></div>
    <label>नतीजा<select name="result">${Object.entries(RESULT).map(([k, v]) => `<option value="${k}" ${f.result === k ? "selected" : ""}>${v}</option>`).join("")}</select></label>
    <label>अगला follow-up (वैकल्पिक)<input type="date" name="follow" value="${esc(f.follow)}"></label>
    <button class="btn gold" type="submit" ${S.busy ? "disabled" : ""}>${S.busy ? "सेव हो रहा है…" : "Visit सेव करें"}</button>
    <button class="btn ghost" type="button" data-act="nav" data-v="home">रद्द करें</button>
  </form>`;
}

/* ---------- admin ---------- */
function adminView() {
  const A = S.adm, tabs = [["people", "लोग"], ["live", "आज"], ["visits", "Visits"], ["days", "हाज़िरी"]];
  if (A.map) return `<main>${mapView()}</main>`;
  let body = "";
  if (A.tab === "live") body = adminLive();
  else if (A.tab === "people") body = adminPeople();
  else if (A.tab === "visits") body = adminVisits();
  else body = adminDays();
  return `<main><div class="tabs">${tabs.map(([k, v]) => `<button data-act="atab" data-v="${k}" class="${A.tab === k ? "on" : ""}">${v}</button>`).join("")}<button data-act="refresh">↻ ताज़ा करें</button></div>${msgBox()}${body}</main>`;
}
function adminPeople() {
  const code = "FS" + Math.floor(1000 + Math.random() * 9000);
  const list = S.adm.staff.map(s => `<div class="card"><div class="row"><b>${esc(s.name)}</b><span class="spacer"></span><span class="chip ${s.active ? "ok" : "bad"}">${s.active ? "चालू" : "बंद"}</span></div>
   <span class="small muted">${esc(s.email)} · ${esc(KIND[s.kind] || s.kind)} · code ${esc(s.code)} · सहमति: ${s.consentAt ? fmtDate(dateStr(new Date(s.consentAt))) : "बाकी"}</span>
   <button class="btn ghost sm" data-act="toggle" data-id="${esc(s.id)}">${s.active ? "बंद करें" : "चालू करें"}</button></div>`).join("");
  return `<form class="card" id="sform" novalidate><h3>नया लड़का जोड़ें</h3>
   <label>नाम<input name="name" maxlength="60"></label>
   <label>Gmail (Google login वाला)<input name="email" type="email" inputmode="email" autocapitalize="off"></label>
   <label>प्रकार<select name="kind"><option value="salary">सैलरी वाला</option><option value="commission">commission वाला</option></select></label>
   <label>Partner code<input name="code" value="${code}" maxlength="12"></label>
   <button class="btn gold" type="submit">जोड़ें</button></form>
   <div class="list">${list || `<p class="muted">अभी कोई नहीं जुड़ा।</p>`}</div>
   <div class="card"><h3>${RETAIN_DAYS} दिन से पुराना डेटा</h3><p class="small muted">फोटो, visits, लोकेशन और हाज़िरी जो ${RETAIN_DAYS} दिन से पुरानी हैं, यहाँ से मिटाएँ (सहमति में यही वादा है)। महीने में एक बार दबाएँ।</p>
   <button class="btn danger sm" data-act="purge">पुराना डेटा मिटाएँ</button></div>`;
}
function filteredVisits() {
  const A = S.adm;
  return A.visits.filter(v => (!A.fStaff || v.email === A.fStaff) && (!A.fFrom || v.date >= A.fFrom));
}
function filterBar() {
  const A = S.adm;
  return `<div class="card"><label>लड़का<select name="fStaff"><option value="">सब</option>${A.staff.map(s => `<option value="${esc(s.id)}" ${A.fStaff === s.id ? "selected" : ""}>${esc(s.name)}</option>`).join("")}</select></label>
  <label>इस तारीख़ से<input type="date" name="fFrom" value="${esc(A.fFrom)}"></label></div>`;
}
function adminVisits() {
  const vs = filteredVisits();
  const list = vs.map(v => `<div class="card item"><img class="th" data-act="photo" data-id="${esc(v.id)}" alt="फोटो" src="${esc(v.thumb)}">
   <div><b>${esc(v.salon)}</b> <span class="chip">${esc(RESULT[v.result] || v.result)}</span><br>
   <span class="small muted">${esc(v.name)} · ${fmtDate(v.date)} ${fmtTime(v.at)}<br>मालिक: ${esc(v.owner)} · ${esc(v.phone)} · demo ${v.demo ? "हुआ" : "नहीं"}${v.follow ? " · follow-up " + esc(v.follow) : ""}<br>
   ${v.loc ? `<a href="${mapLink(v.loc)}" target="_blank" rel="noopener">नक़्शे पर देखें</a> (±${v.loc.acc}m)` : ""}</span></div></div>`).join("");
  return `${filterBar()}<div class="row"><b>${vs.length} visits</b><span class="spacer"></span><button class="btn sm ghost" data-act="csvv">Excel (CSV) डाउनलोड</button></div>
   <div class="list">${list || `<p class="muted">कोई visit नहीं।</p>`}</div><p class="small muted">आख़िरी 100 visits दिखते हैं।</p>`;
}
function adminDays() {
  const A = S.adm, rows = A.days.filter(d => (!A.fStaff || d.email === A.fStaff) && (!A.fFrom || d.date >= A.fFrom));
  const tr = rows.map(d => {
    const st = dayStatus(d, S.today), n = A.visits.filter(v => v.dayId === d.id).length;
    return `<tr><td>${fmtDate(d.date)}</td><td>${esc(d.name)}</td><td>${fmtTime(d.start)}</td><td>${fmtTime(d.out)}</td><td>${d.hours || "—"}</td><td>${n}</td><td>${chip(st)}${d.act === "nodata" ? ` <span class="chip open">GPS कम</span>` : ""}<br><button class="btn sm ghost" data-act="map" data-id="${esc(d.id)}">नक़्शा</button>${st === "missed" ? `<br><button class="btn sm gold" data-act="fix" data-id="${esc(d.id)}">ठीक करें</button>` : ""}</td></tr>`;
  }).join("");
  return `${filterBar()}<div class="row"><b>${rows.length} दिन</b><span class="spacer"></span><button class="btn sm ghost" data-act="csvd">Excel (CSV) डाउनलोड</button></div>
   <div class="card scroll"><table><thead><tr><th>तारीख़</th><th>नाम</th><th>Start</th><th>Out</th><th>घंटे</th><th>Visits</th><th>हाज़िरी</th></tr></thead><tbody>${tr || `<tr><td colspan="7" class="muted">कोई दिन नहीं।</td></tr>`}</tbody></table></div>
   <p class="small muted">"ठीक करें" तब दबाएँ जब लड़के की ग़लती नहीं थी (फ़ोन बंद, नेट नहीं)।</p>`;
}


/* ---------- admin: live list, day map, cleanup ---------- */
async function loadLive() {
  const q = await getDocs(query(collection(db, "field_points"), where("date", "==", S.today)));
  const live = {};
  q.docs.forEach(x => (x.data().pts || []).forEach(p => { const k = x.data().dayId; if (!live[k] || p.t > live[k].t) live[k] = p; }));
  S.adm.live = live;
}
function adminLive() {
  const A = S.adm, open = A.days.filter(d => d.date === S.today && !d.out), done = A.days.filter(d => d.date === S.today && d.out);
  const card = d => {
    const p = A.live[d.id], ago = p ? Math.floor((Date.now() - p.t) / 60000) : null;
    return `<div class="card"><div class="row"><b>${esc(d.name)}</b><span class="spacer"></span>${chip(dayStatus(d, S.today))}</div>
    <span class="small muted">Start ${fmtTime(d.start)}${d.out ? " → " + fmtTime(d.out) : ""} · ${p ? `आख़िरी बिंदु ${ago} मिनट पहले${p.bat != null ? ", battery " + p.bat + "%" : ""} · <a href="${mapLink(p)}" target="_blank" rel="noopener">नक़्शे पर</a>` : "अभी कोई बिंदु नहीं"}</span>
    ${!d.out && ago != null && ago > 10 ? `<span class="chip bad">${ago} मिनट से सिग्नल नहीं</span>` : ""}
    <button class="btn sm ghost" data-act="map" data-id="${esc(d.id)}">आज का रास्ता</button></div>`;
  };
  return `<h3>अभी काम पर (${open.length})</h3><div class="list">${open.map(card).join("") || `<p class="muted">अभी कोई Start पर नहीं।</p>`}</div>
  <h3>आज पूरा किया (${done.length})</h3><div class="list">${done.map(card).join("") || `<p class="muted">कोई नहीं।</p>`}</div>`;
}
function analyse(pts) {
  let km = 0; for (let i = 1; i < pts.length; i++) km += dist(pts[i - 1], pts[i]);
  const stops = [], gaps = [];
  for (let i = 0; i < pts.length;) {
    let j = i; while (j + 1 < pts.length && dist(pts[i], pts[j + 1]) <= RADIUS) j++;
    if (pts[j].t - pts[i].t >= 5 * 60000) stops.push({ from: pts[i].t, to: pts[j].t, lat: pts[i].lat, lng: pts[i].lng });
    i = j + 1;
  }
  for (let i = 1; i < pts.length; i++) if (pts[i].t - pts[i - 1].t > 10 * 60000) gaps.push({ from: pts[i - 1].t, to: pts[i].t });
  return { km: km / 1000, stops, gaps };
}
async function openMap(id) {
  const d = S.adm.days.find(x => x.id === id); if (!d) return;
  S.adm.map = { d, pts: [], visits: [], loading: true, a: { km: 0, stops: [], gaps: [] } }; render();
  try {
    const [ps, vs] = await Promise.all([
      getDocs(query(collection(db, "field_points"), where("dayId", "==", id))),
      getDocs(query(collection(db, "field_visits"), where("dayId", "==", id)))]);
    const m = S.adm.map; if (!m || m.d.id !== id) return;
    m.pts = ps.docs.flatMap(x => x.data().pts || []).sort((a, b) => a.t - b.t);
    m.visits = vs.docs.map(x => ({ id: x.id, ...x.data() })).sort((a, b) => a.at - b.at);
    m.a = analyse(m.pts); m.loading = false;
  } catch (e) { console.error(e); say("नक़्शे का डेटा नहीं खुला।", true); if (S.adm.map) S.adm.map.loading = false; }
  render(); setTimeout(drawMap, 0);
}
function mapView() {
  const m = S.adm.map, a = m.a;
  return `<button class="btn ghost sm" data-act="mapback">← वापस</button>
  <h2>${esc(m.d.name)} · ${fmtDate(m.d.date)}</h2>${msgBox()}
  <div class="row">${chip(dayStatus(m.d, S.today))}${m.d.act === "nodata" ? `<span class="chip open">GPS कम</span>` : ""}</div>
  <p class="small muted">Start ${fmtTime(m.d.start)} → ${fmtTime(m.d.out)} · ${m.pts.length} बिंदु · करीब ${a.km.toFixed(1)} किमी · visits ${m.visits.length}</p>
  ${m.loading ? `<p class="muted">नक़्शा लोड हो रहा है…</p>` : `<div id="map" style="height:52vh;border-radius:12px;border:1px solid var(--line)"></div>`}
  ${a.stops.length ? `<h3>रुके (5 मिनट से ज़्यादा)</h3><div class="list">${a.stops.map((s, i) => `<div class="card"><b>${fmtTime(s.from)} → ${fmtTime(s.to)}</b> · ${Math.round((s.to - s.from) / 60000)} मिनट<br><span class="small muted" id="area${i}">${s.area ? esc(s.area) : ""}</span> <a class="small" href="${mapLink(s)}" target="_blank" rel="noopener">नक़्शे पर</a></div>`).join("")}</div>` : ""}
  ${a.gaps.length ? `<h3>सिग्नल नहीं (10 मिनट से ज़्यादा)</h3><div class="card small">${a.gaps.map(g => `${fmtTime(g.from)} → ${fmtTime(g.to)}`).join("<br>")}</div>` : ""}`;
}
function drawMap() {
  const m = S.adm.map, el = document.getElementById("map");
  if (!m || !el || !window.L) return;
  if (m.lmap) m.lmap.remove();
  const map = m.lmap = L.map(el);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap" }).addTo(map);
  const ll = m.pts.map(p => [p.lat, p.lng]);
  if (ll.length) { const line = L.polyline(ll, { color: "#B3262B", weight: 4 }).addTo(map); map.fitBounds(line.getBounds().pad(0.25), { maxZoom: 17 }); }
  else if (m.d.startLoc) map.setView([m.d.startLoc.lat, m.d.startLoc.lng], 15); else map.setView([19.2183, 72.9781], 12);
  const dot = (p, color, text) => L.circleMarker([p.lat, p.lng], { radius: 8, color: "#fff", weight: 2, fillColor: color, fillOpacity: 1 }).addTo(map).bindPopup(text);
  if (m.d.startLoc) dot(m.d.startLoc, "#2E6B45", "Start " + fmtTime(m.d.start));
  if (m.d.outLoc) dot(m.d.outLoc, "#1F3E7A", "Time out " + fmtTime(m.d.out));
  m.a.stops.forEach(s => dot(s, "#6E665C", `रुके ${fmtTime(s.from)}–${fmtTime(s.to)}`));
  m.visits.forEach(v => v.loc && dot(v.loc, "#B08A3E", `${esc(v.salon)} · ${fmtTime(v.at)}`));
  nameStops(m);
}
async function nameStops(m) { // area names from OpenStreetMap, one per second, first 8 stops
  for (let i = 0; i < Math.min(8, m.a.stops.length); i++) {
    const s = m.a.stops[i]; if (s.area) continue;
    try {
      const r = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&zoom=16&accept-language=hi,en&lat=${s.lat}&lon=${s.lng}`);
      const a = (await r.json()).address || {};
      s.area = a.suburb || a.neighbourhood || a.city_district || a.village || a.town || a.city || "";
      const el = document.getElementById("area" + i); if (el && S.adm.map === m) el.textContent = s.area;
    } catch (e) { /* offline or blocked: skip */ }
    await new Promise(r => setTimeout(r, 1100));
    if (S.adm.map !== m) return;
  }
}
async function purgeOld() {
  const cutoff = Date.now() - RETAIN_DAYS * 864e5, cd = dateStr(new Date(cutoff));
  const jobs = [["field_photos", "at", cutoff], ["field_visits", "at", cutoff], ["field_points", "date", cd], ["field_days", "date", cd]];
  let n = 0;
  for (const [col, f, v] of jobs) {
    for (;;) {
      const q = await getDocs(query(collection(db, col), where(f, "<", v), limit(400)));
      if (!q.docs.length) break;
      const b = writeBatch(db); q.docs.forEach(x => b.delete(doc(db, col, x.id))); await b.commit(); n += q.docs.length;
    }
  }
  return n;
}

/* ================= actions ================= */
async function act(name, el) {
  const A = S.adm;
  switch (name) {
    case "login": {
      say("");
      try { await signInWithPopup(auth, new GoogleAuthProvider()); }
      catch (e) {
        if (e && (e.code === "auth/popup-blocked" || e.code === "auth/operation-not-supported-in-this-environment")) return signInWithRedirect(auth, new GoogleAuthProvider());
        say("Login पूरा नहीं हुआ। Chrome में खोलकर दोबारा कोशिश करें।", true); render();
      }
      return;
    }
    case "logout": await flush(); stopTracking(); await signOut(auth); S.view = "home"; say(""); return;
    case "nav": S.view = el.dataset.v; S.today = dateStr(); say(""); if (S.view === "mine" || S.view === "home") await reloadStaff(); return render();
    case "consent": {
      S.busy = true; render();
      try { const t = Date.now(); await updateDoc(doc(db, "field_staff", S.email), { consentAt: t, consentVer: CONSENT_VER }); S.staff.consentAt = t; say(""); }
      catch (e) { console.error(e); say("सहमति सेव नहीं हुई। नेट देखें और दोबारा दबाएँ।", true); }
      S.busy = false; return render();
    }
    case "start": {
      S.busy = true; say(""); render();
      const pos = await getPos();
      if (!pos) { S.busy = false; say("लोकेशन नहीं मिली। फ़ोन की Location और Chrome की Location permission चालू करें, फिर दोबारा Start दबाएँ।", true); return render(); }
      try {
        S.today = dateStr();
        const d = { email: S.email, name: S.staff.name, kind: S.staff.kind, date: S.today, start: Date.now(), out: 0, hours: 0, startLoc: pos };
        await setDoc(doc(db, "field_days", dayId()), d);
        const nd = { id: dayId(), ...d }; S.days.unshift(nd); startTracking(nd);
      } catch (e) { console.error(e); say("Start सेव नहीं हुआ। नेट देखें और दोबारा कोशिश करें।", true); }
      S.busy = false; return render();
    }
    case "timeout": {
      const d = todayDay(); if (!d || d.out) return;
      if (!confirm("Time out दबाने के बाद आज के visit नहीं जोड़ सकेंगे। पक्का?")) return;
      S.busy = true; say(""); render();
      await flush();
      const pos = await getPos(), out = Date.now();
      const upd = { out, hours: Math.round((out - d.start) / 36e5 * 100) / 100 };
      if (pos) upd.outLoc = pos;
      try { await updateDoc(doc(db, "field_days", d.id), upd); Object.assign(d, upd); stopTracking(); say("Time out हो गया। आज का दिन पूरा।"); }
      catch (e) { console.error(e); say("Time out सेव नहीं हुआ। नेट देखकर दोबारा दबाएँ।", true); }
      S.busy = false; return render();
    }
    case "newvisit": S.form = blankForm(); S.view = "visit"; say(""); return render();
    case "pickphoto": document.getElementById("pfile").click(); return;
    case "atab": A.tab = el.dataset.v; A.map = null; say(""); if (A.tab === "live") { try { await loadLive(); } catch (e) { console.error(e); } } return render();
    case "map": return openMap(el.dataset.id);
    case "mapback": if (A.map && A.map.lmap) A.map.lmap.remove(); A.map = null; return render();
    case "purge": {
      if (!confirm(`${RETAIN_DAYS} दिन से पुराना सारा Field डेटा (फोटो, visits, लोकेशन, हाज़िरी) हमेशा के लिए मिट जाएगा। पक्का?`)) return;
      try { const n = await purgeOld(); say(`${n} पुराने रिकॉर्ड मिटाए।`); await loadAdminData(); } catch (e) { console.error(e); say("मिटाना पूरा नहीं हुआ।", true); }
      return render();
    }
    case "refresh": try { await loadAdminData(); if (A.tab === "live") await loadLive(); say("ताज़ा हो गया।"); } catch (e) { say("ताज़ा नहीं हुआ।", true); } return render();
    case "toggle": {
      const s = A.staff.find(x => x.id === el.dataset.id); if (!s) return;
      try { await updateDoc(doc(db, "field_staff", s.id), { active: !s.active }); s.active = !s.active; say(""); } catch (e) { say("बदलाव नहीं हुआ।", true); }
      return render();
    }
    case "fix": {
      const d = A.days.find(x => x.id === el.dataset.id); if (!d) return;
      if (!confirm(`${d.name} की ${fmtDate(d.date)} की हाज़िरी ठीक करें?`)) return;
      try { await updateDoc(doc(db, "field_days", d.id), { fix: true, fixAt: Date.now() }); d.fix = true; say("हाज़िरी ठीक कर दी।"); } catch (e) { say("ठीक नहीं हुआ।", true); }
      return render();
    }
    case "photo": {
      S.overlay = el.getAttribute("src"); render();
      try { const p = await getDoc(doc(db, "field_photos", el.dataset.id)); if (p.exists()) { S.overlay = p.data().photo; render(); } } catch (e) { /* thumbnail stays */ }
      return;
    }
    case "closeov": S.overlay = ""; return render();
    case "csvv": return download(`field-visits-${S.today}.csv`, csv([
      ["तारीख़", "समय", "लड़का", "सैलून", "मालिक", "फ़ोन", "Demo", "नतीजा", "Follow-up", "Lat", "Lng", "Accuracy(m)"],
      ...filteredVisits().map(v => [v.date, fmtTime(v.at), v.name, v.salon, v.owner, v.phone, v.demo ? "हाँ" : "नहीं", RESULT[v.result] || v.result, v.follow || "", v.loc ? v.loc.lat : "", v.loc ? v.loc.lng : "", v.loc ? v.loc.acc : ""])]));
    case "csvd": return download(`field-attendance-${S.today}.csv`, csv([
      ["तारीख़", "लड़का", "प्रकार", "Start", "Time out", "घंटे", "Visits", "हाज़िरी"],
      ...A.days.filter(d => (!A.fStaff || d.email === A.fStaff) && (!A.fFrom || d.date >= A.fFrom)).map(d => [d.date, d.name, KIND[d.kind] || d.kind, fmtTime(d.start), fmtTime(d.out), d.hours || "", A.visits.filter(v => v.dayId === d.id).length, STATUS[dayStatus(d, S.today)][0]])]));
  }
}
async function reloadStaff() { try { await loadStaffData(); } catch (e) { /* keep what we have */ } }

const fail = (m) => { say(m, true); render(); };
async function saveVisit() {
  const f = S.form, d = todayDay();
  const phone = f.phone.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "");
  if (!f.file) return fail("दुकान के बाहर का फोटो ज़रूरी है।", true);
  if (!f.salon.trim()) return fail("सैलून का नाम लिखें।", true);
  if (!f.owner.trim()) return fail("मालिक का नाम लिखें।", true);
  if (!/^[6-9]\d{9}$/.test(phone)) return fail("मालिक का 10 अंकों का सही मोबाइल नंबर लिखें।", true);
  if (!d || d.out) return fail("आज का दिन चालू नहीं है।", true);
  S.busy = true; say(""); render();
  const pos = await getPos();
  if (!pos) { S.busy = false; say("लोकेशन नहीं मिली। Location चालू करके दोबारा दबाएँ।", true); return render(); }
  try {
    const at = Date.now(), stamp = `${fmtDate(S.today)} ${fmtTime(at)} · ${pos.lat}, ${pos.lng}`;
    const { photo, thumb } = await makePhotos(f.file, stamp);
    const id = (crypto.randomUUID ? crypto.randomUUID() : String(at) + Math.random().toString(16).slice(2));
    const v = { email: S.email, name: S.staff.name, date: S.today, dayId: d.id, salon: f.salon.trim(), owner: f.owner.trim(), phone, demo: f.demo === "yes", result: f.result, follow: f.follow || "", thumb, loc: pos, at };
    const b = writeBatch(db);
    b.set(doc(db, "field_photos", id), { email: S.email, photo, at });
    b.set(doc(db, "field_visits", id), v);
    await b.commit();
    S.visits.unshift({ id, ...v }); setAct("ok15"); S.form = blankForm(); S.view = "home"; say("Visit सेव हो गया।");
  } catch (e) { console.error(e); say("Visit सेव नहीं हुआ। नेट देखकर दोबारा दबाएँ। फोटो और जानकारी बनी रहेगी।", true); }
  S.busy = false; render();
}

async function addStaff(form) {
  const v = Object.fromEntries(new FormData(form));
  const email = (v.email || "").trim().toLowerCase();
  if (!v.name.trim()) return say("नाम लिखें।", true), render();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return say("सही Gmail लिखें।", true), render();
  if (S.adm.staff.some(s => s.id === email)) return say("यह email पहले से जुड़ा है।", true), render();
  try {
    const rec = { name: v.name.trim(), email, kind: v.kind, code: (v.code || "").trim(), active: true, consentAt: 0 };
    await setDoc(doc(db, "field_staff", email), rec);
    S.adm.staff.push({ id: email, ...rec }); say(`${rec.name} जुड़ गया। उसे इस app का link भेजें।`);
  } catch (e) { console.error(e); say("जुड़ा नहीं। नेट या rules देखें।", true); }
  render();
}

/* ================= events ================= */
document.addEventListener("click", e => {
  const el = e.target.closest("[data-act]");
  if (el) { e.preventDefault(); act(el.dataset.act, el); }
});
document.addEventListener("submit", e => {
  e.preventDefault();
  if (e.target.id === "vform") saveVisit();
  if (e.target.id === "sform") addStaff(e.target);
});
document.addEventListener("input", e => {
  const t = e.target;
  if (t.closest("#vform") && t.name && S.form.hasOwnProperty(t.name)) S.form[t.name] = t.value;
});
document.addEventListener("change", async e => {
  const t = e.target;
  if (t.closest("#vform") && t.name && S.form.hasOwnProperty(t.name)) S.form[t.name] = t.value;
  if (t.name === "fStaff" || t.name === "fFrom") { S.adm[t.name] = t.value; render(); }
  if (t.id === "pfile" && t.files[0]) {
    const file = t.files[0];
    if (file.lastModified && Date.now() - file.lastModified > 3 * 60000) { say("पुरानी फोटो नहीं चलेगी। अभी दुकान के बाहर से कैमरे से फोटो लें।", true); return render(); }
    if (S.form.preview) URL.revokeObjectURL(S.form.preview);
    S.form.file = file; S.form.preview = URL.createObjectURL(file); say(""); render();
  }
});
setInterval(() => {
  const el = document.getElementById("elapsed"), d = S.role === "staff" && todayDay();
  if (el && d && !d.out) el.textContent = fmtDur(Date.now() - d.start);
  if (document.getElementById("trk") && S.view === "home") render();
}, 30000);
window.__fieldVersion = FIELD_VERSION;
