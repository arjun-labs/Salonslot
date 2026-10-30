/* SalonSlot pitch game. Problems come from bank.js; UI text below in English (default) and Hindi. */
(function(){
  var DEMO = "https://arjun-labs.github.io/Salonslot/?s=xWvAeZNfg8ZW6fHMV3xQJ8AHlqx1";
  var SHOW = 6, MAX = 3, DAYS = 26;

  var UI = {
    en:{ k0:"30-second salon check", h0:"What is the biggest <em>problem</em> in your salon?", p0:"Pick yours from the list and see how SalonSlot fixes it.",
         r1:"Pick 1 to 3 of your problems", r2:"Open the fix for each one", r3:"See your own numbers and the offer",
         k1:"Step 1 · Pick", h1:"Which of these happen in your salon?", p1:"Tap the 1 to 3 that bother you most.", shuffle:"↻ Show other problems",
         k2:"Step 2 · See the fix", h2:"Your problem, SalonSlot’s fix",
         k3:"Step 3 · Your numbers", h3:"How much does it cost you every month?", p3:"Change the numbers to match your salon.",
         l_lost:"How many clients a day leave because of waiting or mix-ups?", l_avg:"Average bill per client (₹)", loss_h:"Your monthly loss ("+DAYS+" days)",
         free:"Welcome offer: 10 days FREE", offer_h:"A fix for all of it, <em>₹499</em> a month",
         yr:"Or ₹4,999 a year (≈ ₹417 a month). The monthly plan has no lock-in, so you can stop any time.",
         foot:"* Big salon software prices are estimates from public ads and listings; every company’s plans differ.",
         c_demo:"Try a demo booking on your phone", c_start:"Start your salon now", c_wa:"Talk to Arjun on WhatsApp", c_info:"See full details",
         again:"Start again for the next salon", back:"← Back", less:"Less", more:"More",
         start:"Start the check →", pick0:"Pick at least 1", pickN:"See the fix ({n}) →", max:"Up to 3",
         openFirst:"Open the fixes first", toCalc:"See your numbers →", open:"Open the fix →", yours:"Your problem", fix:"SalonSlot’s fix", demo:"See it in the demo",
         sc_all1:"Your problem is solved", sc_allN:"All your problems are solved", sc_tap:"Tap “Open the fix” on each problem",
         note:"{n} client{s} × {avg} × "+DAYS+" days", vs:"SalonSlot is ₹499 a month. Keep just {need} more client{s} a month and it pays for itself.",
         vs0:"Nobody leaves? Great! SalonSlot still saves the time spent on calls, the diary and the accounts.",
         others:"Others", big:"Big software", wa:"Hi Arjun, I want SalonSlot for my salon.",
         f_h:"Before we start", f_name:"Your name", f_salon:"Salon name", f_area:"Area / locality", f_phone:"Mobile number",
         f_note:"We will use your number only to talk about SalonSlot, and we will never share it.",
         fill:"Fill in all 4 details", e_name:"Please enter your name", e_salon:"Please enter the salon name", e_area:"Please enter the area, or tap one below", e_phone:"Please enter a 10-digit mobile number" },
    hi:{ k0:"30 सेकंड का खेल", h0:"आपके सैलून की सबसे बड़ी <em>दिक़्क़त</em> कौन-सी है?", p0:"नीचे से अपनी दिक़्क़त चुनिए, और देखिए SalonSlot उसे कैसे ख़त्म करता है।",
         r1:"अपनी 1 से 3 दिक़्क़तें चुनिए", r2:"हर दिक़्क़त का हल खोलिए", r3:"अपना हिसाब और offer देखिए",
         k1:"Step 1 · चुनिए", h1:"इनमें से आपके सैलून में क्या होता है?", p1:"जो सबसे ज़्यादा परेशान करती है, वो 1 से 3 दिक़्क़तें tap करें।", shuffle:"↻ दूसरी दिक़्क़तें दिखाएँ",
         k2:"Step 2 · हल देखिए", h2:"आपकी दिक़्क़त, SalonSlot का हल",
         k3:"Step 3 · आपका हिसाब", h3:"गड़बड़ी से हर महीने कितना जाता है?", p3:"अपने सैलून के हिसाब से नंबर बदलिए।",
         l_lost:"रोज़ कितने client लाइन या गड़बड़ी की वजह से वापस चले जाते हैं?", l_avg:"एक client का औसत bill (₹)", loss_h:"महीने का नुकसान ("+DAYS+" दिन)",
         free:"Welcome offer: 10 दिन FREE", offer_h:"आपकी सारी दिक़्क़तों का हल, <em>₹499</em> महीना",
         yr:"या ₹4,999 साल का (≈ ₹417 महीना)। हर महीने वाले plan में कोई lock नहीं, जब चाहें बंद।",
         foot:"* बड़े salon software के दाम public ads और जानकारी पर अंदाज़ा हैं; हर कंपनी के plan अलग होते हैं।",
         c_demo:"अपने फ़ोन से demo booking करें", c_start:"अभी अपना सैलून चालू करें", c_wa:"Arjun से WhatsApp पर बात", c_info:"पूरी जानकारी देखें",
         again:"अगले सैलून के लिए फिर से शुरू करें", back:"← पीछे", less:"कम करें", more:"बढ़ाएँ",
         start:"खेल शुरू करें →", pick0:"कम से कम 1 चुनें", pickN:"हल देखें ({n}) →", max:"ज़्यादा से ज़्यादा 3",
         openFirst:"पहले हल खोलें", toCalc:"अपना हिसाब देखें →", open:"हल खोलें →", yours:"आपकी दिक़्क़त", fix:"SalonSlot का हल", demo:"Demo में देखें",
         sc_all1:"आपकी दिक़्क़त का हल मिल गया", sc_allN:"आपकी सारी दिक़्क़तों का हल मिल गया", sc_tap:"हर दिक़्क़त पर “हल खोलें” दबाएँ",
         note:"{n} client × {avg} × "+DAYS+" दिन", vs:"SalonSlot ₹499 महीना, यानी महीने में सिर्फ़ {need} client बचे तो पैसा वसूल।",
         vs0:"एक भी client नहीं जाता? बढ़िया! SalonSlot फिर भी फ़ोन, डायरी और हिसाब का समय बचाता है।",
         others:"दूसरे", big:"बड़े software", wa:"नमस्ते Arjun, मुझे अपने सैलून के लिए SalonSlot चाहिए।",
         f_h:"शुरू करने से पहले", f_name:"आपका नाम", f_salon:"सैलून का नाम", f_area:"इलाका / Area", f_phone:"Mobile नंबर",
         f_note:"आपका नंबर सिर्फ़ SalonSlot के बारे में बात करने के लिए है, किसी और को नहीं दिया जाएगा।",
         fill:"ऊपर की 4 जानकारी भरें", e_name:"अपना नाम लिखें", e_salon:"सैलून का नाम लिखें", e_area:"इलाका लिखें, या नीचे से चुनें", e_phone:"10 अंकों का mobile नंबर डालें" }
  };

  var I = {
    phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
    diary:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5z"/><path d="M9 8l6 6M15 8l-6 6"/>',
    line:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M10 2h4"/>',
    barber:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-2a6 6 0 0 1 12 0v2"/><path d="M17 11l2 2 4-4"/>',
    bill:'<path d="M6 2h12v20l-3-2-3 2-3-2-3 2z"/><path d="M9 7h6M9 11h6M9 15h4"/>',
    family:'<circle cx="8" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><path d="M2 21v-2a5 5 0 0 1 10 0v2M12 21v-2a5 5 0 0 1 10 0v2"/>',
    bell:'<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',
    moon:'<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
    plus:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    leave:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 14l6 5M15 14l-6 5"/>',
    move:'<path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
    chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    map:'<path d="M12 22s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="10" r="2.5"/>',
    walk:'<circle cx="13" cy="4" r="2"/><path d="M9 21l2-6 3 3v3M7 12l3-4 4 1 3 3M10 8l-1 5"/>',
    insta:'<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>'
  };
  var TICK = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5L20 7"/></svg>';
  var ico = function(k, s){ s = s||22; return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(I[k]||I.plus)+'</svg>'; };

  var BANK = window.SS_BANK || [], PRICE = window.SS_PRICE;
  var LANG = "en"; try{ LANG = localStorage.getItem("ss_pitch_lang") || "en"; }catch(e){}
  if (LANG!=="en" && LANG!=="hi") LANG = "en";
  var $ = function(id){ return document.getElementById(id); };
  var byId = function(id){ for (var i=0;i<BANK.length;i++) if (BANK[i].id===id) return BANK[i]; return null; };
  var L = function(p){ return p[LANG] || p.en; };
  var u = function(k, v){ var x = UI[LANG][k]; if (v) for (var n in v) x = x.split("{"+n+"}").join(v[n]); return x; };
  var rs = function(n){ return "₹"+Math.round(n).toLocaleString("en-IN"); };
  var esc = function(s){ return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];}); };

  /* ---- picking 6 problems: unseen ones first, then random; last round's set comes up less ---- */
  var seen = []; try{ seen = JSON.parse(localStorage.getItem("ss_pitch_seen")||"[]"); }catch(e){}
  function shuffle(a){ for (var i=a.length-1;i>0;i--){ var j = Math.floor(Math.random()*(i+1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function draw(n, keep){
    keep = keep||[]; var pool = BANK.map(function(p){ return p.id; }).filter(function(id){ return keep.indexOf(id)<0; });
    var fresh = shuffle(pool.filter(function(id){ return seen.indexOf(id)<0; })), old = shuffle(pool.filter(function(id){ return seen.indexOf(id)>=0; }));
    var out = fresh.concat(old).slice(0, n);
    seen = seen.filter(function(id){ return out.indexOf(id)<0; }).concat(out).slice(-BANK.length+SHOW);
    try{ localStorage.setItem("ss_pitch_seen", JSON.stringify(seen)); }catch(e){}
    return out;
  }
  /* ---- the 3 details before the game ---- */
  var digits = function(v){ var d = String(v||"").replace(/\D/g,""); if (d.length===12 && d.slice(0,2)==="91") d = d.slice(2); if (d.length===11 && d[0]==="0") d = d.slice(1); return d; };
  var FIELDS = ["f_name","f_salon","f_area","f_phone"];
  function form(){ return { name:$("f_name").value.trim(), salon:$("f_salon").value.trim(), area:$("f_area").value.trim(), phone:digits($("f_phone").value) }; }
  function formOk(f){ return f.name.length>=2 && f.salon.length>=2 && f.area.length>=2 && /^[6-9]\d{9}$/.test(f.phone); }
  function formErr(f){ return f.name.length<2 ? ["f_name","e_name"] : f.salon.length<2 ? ["f_salon","e_salon"] : f.area.length<2 ? ["f_area","e_area"] : !/^[6-9]\d{9}$/.test(f.phone) ? ["f_phone","e_phone"] : null; }
  // the area of the last salon is kept, since a day's visits are usually in one area
  function markArea(){ var v = $("f_area").value.trim().toLowerCase(); document.querySelectorAll("[data-area]").forEach(function(b){ var on = b.dataset.area.toLowerCase()===v; b.classList.toggle("on", on); b.setAttribute("aria-pressed", String(on)); }); }
  try{ $("f_area").value = localStorage.getItem("ss_pitch_area") || ""; }catch(e){}
  markArea();
  function leadStart(f){
    if (window.SS_LEAD) return window.SS_LEAD.start({ name:f.name, salon:f.salon, area:f.area, phone:f.phone, lang:LANG });
    // lead.js not loaded (offline): park it for lead.js to send next time
    var id = "p"+Date.now().toString(36)+Math.random().toString(36).slice(2,10);
    try{ var q = JSON.parse(localStorage.getItem("ss_pitch_queue")||"[]"); q.push({ id:id, baseSent:false, patch:null, base:{ name:f.name.slice(0,60), salon:f.salon.slice(0,80), area:f.area.slice(0,60), phone:f.phone, lang:LANG, at:Date.now(), src:"pitch" } }); localStorage.setItem("ss_pitch_queue", JSON.stringify(q)); }catch(e){}
    return id;
  }
  var finTimer = null;
  function leadFinish(){
    if (!st.lead) return; clearTimeout(finTimer);
    finTimer = setTimeout(function(){
      var picks = st.pick.map(function(id){ var p = byId(id); return p ? p.en.t : id; });
      var data = { picks:picks, lost:st.lost, avg:st.avg };
      if (window.SS_LEAD) window.SS_LEAD.finish(st.lead.id, data);
      else try{ var q = JSON.parse(localStorage.getItem("ss_pitch_queue")||"[]"), it = q.filter(function(x){ return x.id===st.lead.id; })[0];
        var patch = { picks:picks, lost:st.lost, avg:st.avg, doneAt:Date.now() };
        if (it) it.patch = patch; else q.push({ id:st.lead.id, base:null, baseSent:true, patch:patch });
        localStorage.setItem("ss_pitch_queue", JSON.stringify(q)); }catch(e){}
    }, 1200);
  }

  function newRound(){ return { step:0, shown:shuffle(draw(SHOW)), pick:[], open:{}, lost:1, avg:200, lead:null }; }
  var st = newRound();

  /* ---- language ---- */
  function applyLang(){
    document.documentElement.lang = LANG;
    document.querySelectorAll("[data-t]").forEach(function(el){ el.textContent = u(el.dataset.t); });
    document.querySelectorAll("[data-th]").forEach(function(el){ el.innerHTML = u(el.dataset.th); });
    document.querySelectorAll("[data-ta]").forEach(function(el){ el.setAttribute("aria-label", u(el.dataset.ta)); });
    document.querySelectorAll("[data-lang]").forEach(function(b){ b.setAttribute("aria-pressed", String(b.dataset.lang===LANG)); });
    var wa = document.querySelector(".btn.wa"); if (wa) wa.href = "https://wa.me/918850865540?text="+encodeURIComponent(u("wa"));
    document.title = LANG==="hi" ? "SalonSlot · आपकी दिक़्क़त, हमारा हल" : "SalonSlot · Your problem, our fix";
    go(st.step, true);
  }

  /* ---- screens ---- */
  function drawProbs(){
    var full = st.pick.length>=MAX;
    $("probs").innerHTML = st.shown.map(function(id){
      var p = byId(id); if (!p) return ""; var x = L(p), on = st.pick.indexOf(id)>=0, dis = full && !on;
      return '<button type="button" class="prob'+(on?' on':'')+'" data-p="'+id+'" aria-pressed="'+on+'"'+(dis?' aria-disabled="true"':'')+'>'+
        '<span class="ck" aria-hidden="true">'+(on?TICK:'')+'</span><span class="ic">'+ico(p.ic)+'</span><b>'+esc(x.t)+'</b><small>'+esc(x.s)+'</small></button>';
    }).join("");
    $("shuffle").hidden = st.pick.length>=MAX || BANK.length<=SHOW;
  }
  function drawSols(){
    var n = 0;
    $("sols").innerHTML = st.pick.map(function(id){
      var p = byId(id), x = L(p), open = !!st.open[id]; if (open) n++;
      return '<div class="sol'+(open?'':' locked')+(st.justOpened===id?' pop':'')+'">'+
        '<div class="q"><span class="ic">'+ico(p.ic,20)+'</span><div><small>'+u("yours")+'</small><b>'+esc(x.t)+'</b></div></div>'+
        '<button type="button" class="open" data-o="'+id+'">'+u("open")+'</button>'+
        '<div class="a"><span class="tag">'+u("fix")+'</span><h3>'+esc(x.h)+'</h3><ul>'+x.pts.map(function(q){ return '<li>'+TICK+'<span>'+esc(q)+'</span></li>'; }).join("")+'</ul>'+
        '<a class="demo" href="'+DEMO+'" target="_blank" rel="noopener">'+u("demo")+'</a></div></div>';
    }).join("");
    st.justOpened = null;
    $("scoreN").textContent = n+"/"+st.pick.length;
    $("scoreT").textContent = n===st.pick.length ? (n===1?u("sc_all1"):u("sc_allN")) : u("sc_tap");
  }
  function drawCalc(){
    var loss = st.lost*st.avg*DAYS, need = Math.max(1, Math.ceil(499/st.avg)), en = LANG==="en";
    $("o_lost").textContent = st.lost;
    $("o_avg").textContent = rs(st.avg);
    $("lossAmt").textContent = rs(loss);
    $("lossNote").textContent = u("note",{ n:st.lost, s: en && st.lost!==1 ? "s" : "", avg:rs(st.avg) });
    $("vsLine").textContent = loss>0 ? u("vs",{ need:need, s: en && need!==1 ? "s" : "" }) : u("vs0");
    var first = byId(st.pick[0]) || BANK[0], a = L(first), b = L(PRICE);
    $("cmp").innerHTML = [[u("others"), a.them, a.us], [u("big"), b.them, b.us]].map(function(r){
      return '<div class="them"><b>'+esc(r[0])+'</b><strong>'+esc(r[1])+'</strong></div><div class="us"><b>SalonSlot</b><strong>'+esc(r[2])+'</strong></div>';
    }).join("");
  }
  function syncPick(){
    var next = $("next"), hint = $("hint"), k = st.pick.length;
    next.disabled = k===0; next.textContent = k ? u("pickN",{n:k}) : u("pick0");
    hint.hidden = k<MAX; hint.textContent = u("max");
  }
  function syncOpen(){
    var all = st.pick.every(function(id){ return st.open[id]; }), next = $("next");
    next.disabled = !all; next.textContent = all ? u("toCalc") : u("openFirst");
  }
  function go(n, keepScroll){
    st.step = n;
    for (var i=0;i<4;i++){ $("s"+i).hidden = i!==n; $("d"+i).className = i<=n?"on":""; }
    var next = $("next");
    document.querySelector(".bar").hidden = n===3;
    $("back").hidden = n===0; $("hint").hidden = true; next.disabled = false;
    if (n===0){ var ok = formOk(form()); next.textContent = ok ? u("start") : u("fill"); }
    var who = $("who1"); if (st.lead){ who.hidden = false; who.innerHTML = '<b>'+esc(st.lead.name)+'</b> · '+esc(st.lead.salon)+' · '+esc(st.lead.area); } else who.hidden = true;
    if (n===1){ drawProbs(); syncPick(); }
    if (n===2){ drawSols(); syncOpen(); }
    if (n===3){ drawCalc(); if (!keepScroll) leadFinish(); }
    if (!keepScroll) window.scrollTo(0,0);
  }

  document.addEventListener("click", function(e){
    var el = e.target.closest("[data-p],[data-o],[data-step],[data-lang]"); if (!el) return;
    if (el.dataset.lang){ LANG = el.dataset.lang; try{ localStorage.setItem("ss_pitch_lang", LANG); }catch(x){} applyLang(); return; }
    if (el.dataset.p){ var id = el.dataset.p, i = st.pick.indexOf(id);
      if (i>=0) st.pick.splice(i,1); else if (st.pick.length<MAX) st.pick.push(id); else return;
      drawProbs(); syncPick(); var b = document.querySelector('[data-p="'+id+'"]'); if (b) b.focus(); }
    else if (el.dataset.o){ st.open[el.dataset.o] = true; st.justOpened = el.dataset.o; drawSols(); syncOpen();
      try{ navigator.vibrate && navigator.vibrate(30); }catch(x){} }
    else if (el.dataset.step){ var k = el.dataset.step, d = Number(el.dataset.d);
      if (k==="lost") st.lost = Math.max(0, Math.min(30, st.lost+d)); else st.avg = Math.max(50, Math.min(5000, st.avg+d));
      drawCalc(); leadFinish(); }
  });
  // swap the cards not picked for new ones from the bank; picked ones stay in place
  $("shuffle").addEventListener("click", function(){
    var fresh = draw(SHOW - st.pick.length, st.pick.concat(st.shown)), k = 0;
    if (fresh.length < SHOW - st.pick.length) fresh = fresh.concat(draw(SHOW - st.pick.length - fresh.length, st.pick.concat(fresh)));
    st.shown = st.shown.map(function(id){ return st.pick.indexOf(id)>=0 ? id : (fresh[k++] || id); });
    drawProbs();
  });
  $("next").addEventListener("click", function(){
    if (this.disabled) return;
    if (st.step===0){
      var f = form(), bad = formErr(f), er = $("f_err");
      FIELDS.forEach(function(k){ $(k).removeAttribute("aria-invalid"); });
      if (bad){ $(bad[0]).setAttribute("aria-invalid","true"); er.textContent = u(bad[1]); er.hidden = false; $(bad[0]).focus(); return; }
      er.hidden = true; $("f_phone").value = f.phone;
      try{ localStorage.setItem("ss_pitch_area", f.area); }catch(e){}
      if (!st.lead || st.lead.phone!==f.phone || st.lead.name!==f.name || st.lead.salon!==f.salon || st.lead.area!==f.area) st.lead = { id:leadStart(f), name:f.name, salon:f.salon, area:f.area, phone:f.phone };
    }
    go(Math.min(3, st.step+1));
  });
  $("leadForm").addEventListener("click", function(e){ var b = e.target.closest("[data-area]"); if (!b) return; $("f_area").value = b.dataset.area; markArea(); $("f_area").dispatchEvent(new Event("input", {bubbles:true})); });
  $("leadForm").addEventListener("input", function(){ markArea(); $("f_err").hidden = true; FIELDS.forEach(function(k){ $(k).removeAttribute("aria-invalid"); }); if (st.step===0) $("next").textContent = formOk(form()) ? u("start") : u("fill"); });
  $("leadForm").addEventListener("submit", function(e){ e.preventDefault(); $("next").click(); });
  $("back").addEventListener("click", function(){ go(Math.max(0, st.step-1)); });
  $("again").addEventListener("click", function(){ st = newRound(); ["f_name","f_salon","f_phone"].forEach(function(k){ $(k).value = ""; }); markArea(); go(0); });
  applyLang();
})();
