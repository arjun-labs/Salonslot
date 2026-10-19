import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, onSnapshot, runTransaction, deleteField, getDocs, arrayUnion } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= config ================= */
const firebaseConfig = {
  apiKey: "AIzaSyD5CSchGGl9NTsPDgwmfRkhrvyogCRrbZ0",
  authDomain: "salonslot-d44af.firebaseapp.com",
  projectId: "salonslot-d44af",
  storageBucket: "salonslot-d44af.firebasestorage.app",
  messagingSenderId: "1041857314935",
  appId: "1:1041857314935:web:ac9cb74373273477a80672",
  measurementId: "G-JRT51QDC97"
};
const ADMIN_EMAIL = "vishwakarmaarjun128@gmail.com";
const ADMIN_UPI = "vishwakarmaarjun128@okaxis";
const ADMIN_NAME = "SalonSlot";
const PLANS = { monthly:{price:499, days:30}, halfyearly:{price:2699, days:182}, yearly:{price:4999, days:365} };
const TRIAL_DAYS = 7;
const DAY = 864e5;
const APP_VERSION = "2026.10.19-9";
const IS_BETA = /\/beta\//.test(location.pathname);
const MAIN_URL = () => location.origin + location.pathname.replace(/\/beta\/.*$/, "/") + location.search;
// customers never use the test version
if (IS_BETA && new URLSearchParams(location.search).get("s")) location.replace(MAIN_URL());

const fb = initializeApp(firebaseConfig);
const auth = getAuth(fb);
const db = getFirestore(fb);

/* ================= text ================= */
const T = {
 en:{
  tagline:"Salon booking, made simple",
  welcome_h:"Run your salon's bookings from one phone",
  welcome_p:"Customers open your link, pick a barber, a service and a time. You see every booking the moment it comes in.",
  signin:"Sign in with Google", signin_note:"Open this page in Chrome to sign in. Sign-in doesn't work inside WhatsApp or Instagram.", free_trial:"7-day free trial. No card needed.",
  signin_fail:"Sign-in didn't finish. Open the link in Chrome and try again.",
  step:"Step", of:"of", next:"Next", back:"Back", finish:"Start my salon",
  s1_h:"Your salon", salon_name:"Salon name", owner_name:"Owner name", phone:"WhatsApp number", area:"Area / city", optional:"optional",
  s2_h:"Opening hours", opens:"Opens at", closes:"Closes at", open_days:"Open on",
  s3_h:"Services and prices", s3_p:"Tap a suggestion to add it, or type your own.", svc_name:"Service", price:"Price ₹", mins:"Minutes", add_service:"Add service",
  s4_h:"Your barbers", s4_p:"Add a photo, name and speciality for each barber. Customers see these when they book.", how_many:"How many barbers?",
  barber_name:"Name", speciality:"Speciality", spec_ph:"e.g. Beard expert, Hair colour", add_barber:"Add barber", tap_photo:"Tap the circle to add a photo",
  s5_h:"You're ready", s5_p:"Your 7-day free trial starts now. Share your booking link and start taking bookings.",
  need_name:"Enter the salon name and a 10-digit WhatsApp number to continue.", need_svc:"Add at least one service with a price.", need_barber:"Add at least one barber with a name.",
  nav_home:"Today", nav_book:"Book", nav_barber:"Barbers", nav_plan:"Plan", nav_settings:"Settings", nav_admin:"Admin",
  hello:"Good to see you", today_bk:"Today's bookings", earned:"Earned today", upcoming:"Coming up",
  no_bk:"No bookings yet.", add_walkin:"Add walk-in / phone booking",
  mark_done:"Mark done", cancel:"Cancel", whatsapp:"WhatsApp", calendar:"Google Calendar", remind:"Send reminder",
  st_booked:"Booked", st_done:"Done", st_cancelled:"Cancelled", online:"Online", walkin:"Walk-in",
  trial_left:"Free trial: {n} days left", plan_left:"{plan} plan: {n} days left", expired:"Your plan has ended. Online booking is paused.", recharge:"Recharge",
  paused_admin:"Your account is paused. Contact SalonSlot to switch it back on.",
  link_h:"Your booking link", link_p:"Share this link on WhatsApp, Instagram and Google. Customers book from their own phone, no app needed.", copy:"Copy", copied:"Copied", share_wa:"Share on WhatsApp", open_link:"Open booking page", qr_p:"Print this QR and keep it on the counter.",
  share_msg:"Book your appointment at {salon} online: {link}",
  book_h:"Book an appointment", book_owner:"Add a booking for a walk-in or phone customer.",
  pick_svc:"1. Choose a service", pick_barber:"2. Choose a barber", any_barber:"Any barber", any_sub:"First one free",
  pick_date:"3. Choose a day", pick_time:"4. Choose a time", your_details:"5. Your details", cust_name:"Name", cust_phone:"Mobile number", cust_email:"Email (for Google Calendar reminder)", bad_email:"That email doesn't look right. Check it or leave it empty.", barber_email:"Gmail (for Google Calendar)", barber_phone:"WhatsApp number", private_note:"Only you see this. Customers never see barber numbers.", no_phone:"No WhatsApp number saved. Add it in Settings → Barbers.", send_each:"Send each barber their day", send_all_p:"Each barber gets all of today's bookings in one message on their own WhatsApp. Tap the big button, send, come back, and the next barber is ready.",
  send:"Send", sent:"Sent", send_all:"Start: send to {name}", send_next:"Next: send to {name}", all_sent:"All barbers have today's schedule.", send_again:"Send again from the start",
  cal_note:"Customer and barber emails are already added as guests. Tap Save in Google Calendar, then Send, so they get the invite.", cal_note_c:"The salon is already added as a guest. Tap Save in Google Calendar, then Send.",
  confirm_bk:"Confirm booking", closed_day:"The salon is closed this day.", no_slots:"No free times left this day. Try another day.", pick_svc_first:"Choose a service first.",
  need_details:"Enter a name and a 10-digit mobile number.", taken:"Someone just booked that time. Please pick another.",
  booked_h:"Booking confirmed", booked_p:"{svc} with {barber} on {date} at {time}.", book_another:"Make another booking",
  tell_salon:"Send booking to salon on WhatsApp", tell_salon_p:"Tap to let the salon know on WhatsApp too.",
  msgs_h:"Messages for this booking", send_cust:"Send to customer", send_barber:"Send to barber",
  bk_closed_h:"Online booking is paused", bk_closed_p:"Please call or WhatsApp the salon to book.",
  nf_h:"Salon not found", nf_p:"This booking link isn't right. Ask the salon for its link again.",
  barber_h:"Barber view", barber_p:"Pick a barber to see their bookings. Send each one on WhatsApp.", your_day:"Bookings",
  plan_h:"Your plan", status:"Status", active:"Active", trial:"Free trial", ends:"Ends on", ended:"Ended",
  choose_plan:"Choose a plan", monthly:"Monthly", halfyearly:"6 months", yearly:"Yearly", per_month:"per month", per_half:"for 6 months", per_year:"per year", save:"Save ₹989", save_half:"Save ₹295",
  pay_h:"Pay with Google Pay or any UPI app", pay_steps:"Scan the QR with GPay, PhonePe or Paytm. The amount fills in automatically.", upi_id:"UPI ID",
  utr_h:"After paying", utr_p:"Enter the transaction ID (UTR) from GPay. Your plan switches on once the payment is checked, usually within a few hours.", utr:"Transaction ID / UTR", submit_pay:"I have paid",
  pending:"₹{amt} payment sent for checking (UTR {utr}). Your plan switches on once it's checked.",
  activated:"Plan active until {date}",
  set_h:"Settings", salon_details:"Salon details", services:"Services", barbers:"Barbers", saved:"Saved", save_fail:"Couldn't save. Check the internet and try again.",
  account:"Account", logout:"Sign out", signed_as:"Signed in as",
  install_h:"Put it on the home screen", install_p:"In Chrome, tap ⋮ then \"Add to Home screen\". It opens like an app.",
  new_bk:"New booking: {name} at {time}",
  address:"Shop address", address_ph:"Shop no., building, street, landmark", maplink:"Google Maps link", maplink_help:"In Google Maps, find your shop, tap Share, then copy the link and paste it here.",
  bad_map:"That isn't a Google Maps link. Paste the link from Google Maps → Share, or leave it empty.", need_addr:"Enter the shop address and area so customers can find you.",
  addr_h:"Salon address", how_reach:"How to get there", directions:"Open in Google Maps", addr_missing:"Add your shop address so customers can find you.",
  bk_count:"{n} bookings", bk_count1:"1 booking", by_barber:"Bookings by barber", tap_barber:"Tap a barber to see their times.",
  send_summary:"Send today's summary on WhatsApp", summary_h:"Today at {salon}", summary_none:"No bookings", send_day:"Send {name}'s day on WhatsApp",
  rem_h:"Coming up in {n} min", rem_send:"Send reminder", rem_later:"Later", rem_msg:"Reminder: {name}, your {svc} at {salon} is at {time} (in {n} minutes). See you soon!",
  new_ver:"A new version of the app is ready.", new_ver_btn:"Update now", beta:"TEST VERSION · uses real data",
  remove:"Remove", today:"Today", tomorrow:"Tomorrow", loading:"Loading…",
  adm_h:"Admin", adm_p:"Every salon on SalonSlot. Approve payments and switch salons on or off.",
  adm_salons:"Salons", adm_live:"Live", adm_pending:"Payments to check", adm_collected:"Collected",
  adm_none:"No salons yet.", approve:"Approve", reject:"Reject", turn_off:"Switch off", turn_on:"Switch on", extend7:"+7 days trial",
  adm_paid:"Paid {plan} · UTR {utr}", adm_off:"Off", adm_check:"Check this UTR in your GPay before approving.",
  download:"Full backup (technical file)", download_p:"Saves every salon and booking as a file on this device. Do this once a week.",
  adj_days:"Change days", days:"days", adj_done:"Now ends on {date}", csv_h:"Salon list (Excel / Google Sheets)", csv_p:"Name, owner, WhatsApp, email, address, Maps link, plan and end date for every salon, in one sheet. Opens in Excel, Google Sheets or Numbers.", csv_btn:"Download salon list", csv_done:"{n} salons saved", approved:"Approved", rejected:"Payment request removed", switched:"Updated",
  dw:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], mon:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  sugg:[["Haircut",200,30],["Beard trim",100,30],["Shave",80,30],["Hair colour",600,60],["Facial",800,60],["Head massage",250,30],["Hair spa",900,60],["Kids haircut",150,30],["Threading",50,10],["Upper lip",30,10],["Eyebrow shaping",80,20],["Clean-up",400,45]]
 },
 hi:{
  tagline:"सैलून बुकिंग, आसान",
  welcome_h:"अपने सैलून की सारी बुकिंग एक फ़ोन से चलाइए",
  welcome_p:"ग्राहक आपका link खोलकर barber, service और time चुनता है। Booking आते ही आपको दिख जाती है।",
  signin:"Google से login करें", signin_note:"Login के लिए ये page Chrome में खोलें। WhatsApp या Instagram के अंदर login नहीं होता।", free_trial:"7 दिन का free trial. कोई card नहीं चाहिए।",
  signin_fail:"Login पूरा नहीं हुआ। Link को Chrome में खोलकर फिर कोशिश करें।",
  step:"Step", of:"/", next:"आगे", back:"पीछे", finish:"सैलून चालू करो",
  s1_h:"आपका सैलून", salon_name:"सैलून का नाम", owner_name:"मालिक का नाम", phone:"WhatsApp नंबर", area:"एरिया / शहर", optional:"ज़रूरी नहीं",
  s2_h:"खुलने का समय", opens:"खुलता है", closes:"बंद होता है", open_days:"किन दिनों खुला है",
  s3_h:"Services और दाम", s3_p:"Suggestion पर tap करके जोड़ें, या खुद लिखें।", svc_name:"Service", price:"दाम ₹", mins:"मिनट", add_service:"Service जोड़ें",
  s4_h:"आपके barbers", s4_p:"हर barber की photo, नाम और speciality डालें। Booking करते वक़्त ग्राहक को ये दिखेगा।", how_many:"कितने barbers हैं?",
  barber_name:"नाम", speciality:"Speciality", spec_ph:"जैसे Beard expert, Hair colour", add_barber:"Barber जोड़ें", tap_photo:"Photo लगाने के लिए गोले पर tap करें",
  s5_h:"सब तैयार है", s5_p:"आपका 7 दिन का free trial अभी शुरू हो गया। Booking link share करें और bookings लेना शुरू करें।",
  need_name:"आगे बढ़ने के लिए सैलून का नाम और 10 अंकों का WhatsApp नंबर डालें।", need_svc:"कम से कम एक service दाम के साथ डालें।", need_barber:"कम से कम एक barber का नाम डालें।",
  nav_home:"आज", nav_book:"Booking", nav_barber:"Barbers", nav_plan:"Plan", nav_settings:"Settings", nav_admin:"Admin",
  hello:"नमस्ते", today_bk:"आज की bookings", earned:"आज की कमाई", upcoming:"आगे की",
  no_bk:"अभी कोई booking नहीं है।", add_walkin:"Walk-in / फ़ोन booking जोड़ें",
  mark_done:"Done करें", cancel:"Cancel", whatsapp:"WhatsApp", calendar:"Google Calendar", remind:"Reminder भेजें",
  st_booked:"Booked", st_done:"हो गया", st_cancelled:"Cancel", online:"Online", walkin:"Walk-in",
  trial_left:"Free trial: {n} दिन बाकी", plan_left:"{plan} plan: {n} दिन बाकी", expired:"आपका plan ख़त्म हो गया। Online booking रुकी हुई है।", recharge:"Recharge करें",
  paused_admin:"आपका account अभी बंद है। चालू करवाने के लिए SalonSlot से संपर्क करें।",
  link_h:"आपका booking link", link_p:"ये link WhatsApp, Instagram और Google पर share करें। ग्राहक अपने फ़ोन से booking करेंगे, कोई app नहीं चाहिए।", copy:"Copy", copied:"Copy हो गया", share_wa:"WhatsApp पर share करें", open_link:"Booking page खोलें", qr_p:"ये QR print करके counter पर लगाएं।",
  share_msg:"{salon} में अपनी appointment online book करें: {link}",
  book_h:"Appointment बुक करें", book_owner:"Walk-in या फ़ोन वाले ग्राहक की booking जोड़ें।",
  pick_svc:"1. Service चुनें", pick_barber:"2. Barber चुनें", any_barber:"कोई भी barber", any_sub:"जो पहले free हो",
  pick_date:"3. दिन चुनें", pick_time:"4. समय चुनें", your_details:"5. आपकी जानकारी", cust_name:"नाम", cust_phone:"मोबाइल नंबर", cust_email:"Email (Google Calendar reminder के लिए)", bad_email:"Email सही नहीं लग रहा। Check करें या खाली छोड़ दें।", barber_email:"Gmail (Google Calendar के लिए)", barber_phone:"WhatsApp नंबर", private_note:"ये सिर्फ़ आपको दिखेगा। Customers को barber का नंबर कभी नहीं दिखता।", no_phone:"WhatsApp नंबर save नहीं है। Settings → Barbers में डालें।", send_each:"हर barber को उसका दिन भेजें", send_all_p:"हर barber को आज की सारी bookings एक ही message में उसके अपने WhatsApp पर जाती हैं। बड़ा button दबाएं, Send करें, वापस आएं, अगला barber तैयार मिलेगा।",
  send:"भेजें", sent:"भेजा", send_all:"शुरू करें: {name} को भेजें", send_next:"अगला: {name} को भेजें", all_sent:"सारे barbers को आज का schedule मिल गया।", send_again:"फिर से शुरू से भेजें",
  cal_note:"Customer और barber के email पहले से guest में जुड़ जाते हैं। Google Calendar में Save दबाएं, फिर Send, ताकि उन्हें invite मिले।", cal_note_c:"सैलून पहले से guest में जुड़ा है। Google Calendar में Save दबाएं, फिर Send।",
  confirm_bk:"Booking पक्की करें", closed_day:"इस दिन सैलून बंद है।", no_slots:"इस दिन कोई समय खाली नहीं है। दूसरा दिन चुनें।", pick_svc_first:"पहले service चुनें।",
  need_details:"नाम और 10 अंकों का मोबाइल नंबर डालें।", taken:"ये समय अभी किसी और ने book कर लिया। दूसरा समय चुनें।",
  booked_h:"Booking पक्की हो गई", booked_p:"{date} को {time} बजे, {barber} के साथ {svc}।", book_another:"एक और booking करें",
  tell_salon:"सैलून को WhatsApp पर booking भेजें", tell_salon_p:"सैलून को WhatsApp पर भी बताने के लिए tap करें।",
  msgs_h:"इस booking के messages", send_cust:"ग्राहक को भेजें", send_barber:"Barber को भेजें",
  bk_closed_h:"Online booking अभी बंद है", bk_closed_p:"Booking के लिए सैलून को call या WhatsApp करें।",
  nf_h:"सैलून नहीं मिला", nf_p:"ये booking link सही नहीं है। सैलून से link दोबारा माँगें।",
  barber_h:"Barber की screen", barber_p:"Barber चुनें और उसकी bookings देखें। हर booking WhatsApp पर भेज सकते हैं।", your_day:"Bookings",
  plan_h:"आपका plan", status:"Status", active:"चालू", trial:"Free trial", ends:"ख़त्म होगा", ended:"ख़त्म",
  choose_plan:"Plan चुनें", monthly:"Monthly", halfyearly:"6 महीने", yearly:"Yearly", per_month:"हर महीना", per_half:"6 महीने के लिए", per_year:"हर साल", save:"₹989 की बचत", save_half:"₹295 की बचत",
  pay_h:"Google Pay या किसी भी UPI app से pay करें", pay_steps:"GPay, PhonePe या Paytm से QR scan करें। Amount अपने आप भर जाएगा।", upi_id:"UPI ID",
  utr_h:"Pay करने के बाद", utr_p:"GPay वाला transaction ID (UTR) डालें। Payment check होते ही plan चालू हो जाएगा, आमतौर पर कुछ घंटों में।", utr:"Transaction ID / UTR", submit_pay:"मैंने pay कर दिया",
  pending:"₹{amt} का payment check के लिए भेजा गया (UTR {utr})। Check होते ही plan चालू हो जाएगा।",
  activated:"Plan {date} तक चालू है",
  set_h:"Settings", salon_details:"सैलून की जानकारी", services:"Services", barbers:"Barbers", saved:"Save हो गया", save_fail:"Save नहीं हुआ। Internet check करके फिर कोशिश करें।",
  account:"Account", logout:"Logout", signed_as:"Login है",
  install_h:"Home screen पर लगाएं", install_p:"Chrome में ⋮ पर tap करें, फिर \"Add to Home screen\"। ये app की तरह खुलेगा।",
  new_bk:"नई booking: {name}, {time}",
  address:"दुकान का पता", address_ph:"Shop no., building, गली, landmark", maplink:"Google Maps link", maplink_help:"Google Maps में अपनी दुकान ढूँढें, Share दबाएं, link copy करके यहाँ paste करें।",
  bad_map:"ये Google Maps का link नहीं है। Google Maps → Share से link paste करें, या खाली छोड़ दें।", need_addr:"दुकान का पता और एरिया डालें, ताकि customers आप तक पहुँच सकें।",
  addr_h:"सैलून का पता", how_reach:"कैसे पहुँचें", directions:"Google Maps में खोलें", addr_missing:"दुकान का पता डालें, ताकि customers आप तक पहुँच सकें।",
  bk_count:"{n} bookings", bk_count1:"1 booking", by_barber:"Barber के हिसाब से bookings", tap_barber:"समय देखने के लिए barber पर tap करें।",
  send_summary:"आज का summary WhatsApp पर भेजें", summary_h:"{salon} में आज", summary_none:"कोई booking नहीं", send_day:"{name} का दिन WhatsApp पर भेजें",
  rem_h:"{n} मिनट में appointment", rem_send:"Reminder भेजें", rem_later:"बाद में", rem_msg:"Reminder: {name}, {salon} में आपका {svc} {time} बजे है ({n} मिनट में)। मिलते हैं!",
  new_ver:"App का नया version आ गया है।", new_ver_btn:"अभी update करें", beta:"TEST VERSION · असली data use होता है",
  remove:"हटाएं", today:"आज", tomorrow:"कल", loading:"Load हो रहा है…",
  adm_h:"Admin", adm_p:"SalonSlot के सारे सैलून। Payment approve करें और सैलून ON / OFF करें।",
  adm_salons:"सैलून", adm_live:"चालू", adm_pending:"Check करने वाले payments", adm_collected:"कुल मिले",
  adm_none:"अभी कोई सैलून नहीं है।", approve:"Approve", reject:"Reject", turn_off:"OFF करें", turn_on:"ON करें", extend7:"+7 दिन trial",
  adm_paid:"{plan} का payment · UTR {utr}", adm_off:"OFF", adm_check:"Approve करने से पहले ये UTR अपने GPay में check करें।",
  download:"पूरा backup (technical file)", download_p:"सारे सैलून और bookings इस device में file बनकर save हो जाएंगे। हफ़्ते में एक बार करें।",
  adj_days:"दिन बदलें", days:"दिन", adj_done:"अब {date} को ख़त्म होगा", csv_h:"सैलून की list (Excel / Google Sheets)", csv_p:"हर सैलून का नाम, मालिक, WhatsApp, email, पता, Maps link, plan और ख़त्म होने की तारीख़, एक ही sheet में। Excel, Google Sheets या Numbers में खुलेगी।", csv_btn:"सैलून की list download करें", csv_done:"{n} सैलून save हो गए", approved:"Approve हो गया", rejected:"Payment request हटा दी", switched:"Update हो गया",
  dw:["रवि","सोम","मंगल","बुध","गुरु","शुक्र","शनि"], mon:["जन","फ़र","मार्च","अप्रै","मई","जून","जुला","अग","सितं","अक्टू","नवं","दिसं"],
  sugg:[["Haircut",200,30],["Beard trim",100,30],["Shave",80,30],["Hair colour",600,60],["Facial",800,60],["Head massage",250,30],["Hair spa",900,60],["Kids haircut",150,30],["Threading",50,10],["Upper lip",30,10],["Eyebrow shaping",80,20],["Clean-up",400,45]]
 }
};

/* ================= helpers ================= */
let LANG = "hi"; try{ LANG = localStorage.getItem("ss_lang") || "hi"; }catch(e){}
const t = (k, v) => { let s = (T[LANG]||T.en)[k]; if (s===undefined) s = T.en[k]; if (typeof s==="string" && v) for (const x in v) s = s.split("{"+x+"}").join(v[x]); return s; };
const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid = () => Math.random().toString(36).slice(2,9);
const pad = n => String(n).padStart(2,"0");
const ymd = d => d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate());
const toMin = hm => { const [h,m] = String(hm).split(":").map(Number); return h*60+m; };
const toHM = m => pad(Math.floor(m/60))+":"+pad(m%60);
const nice = hm => { let [h,m] = hm.split(":").map(Number); const ap = h>=12?"PM":"AM"; h = h%12||12; return h+":"+pad(m)+" "+ap; };
const dayLabel = ds => { const d = new Date(ds+"T00:00"); const td = ymd(new Date()); const tm = ymd(new Date(Date.now()+DAY));
  if (ds===td) return t("today"); if (ds===tm) return t("tomorrow"); return t("dw")[d.getDay()]+" "+d.getDate()+" "+t("mon")[d.getMonth()]; };
const longDate = ms => { const d = new Date(ms); return d.getDate()+" "+t("mon")[d.getMonth()]+" "+d.getFullYear(); };
const digits = p => String(p||"").replace(/\D/g,"").replace(/^(91)(?=\d{10}$)/,"").replace(/^0+/,"");
const waNum = p => { const d = digits(p); return d.length===10 ? "91"+d : d; };
const waLink = (p, text) => "https://wa.me/"+waNum(p)+"?text="+encodeURIComponent(text);
const COLORS = ["#24211F","#8C6A27","#1F3E7A","#B3262B","#3E5A47","#5A4636"];
function avatar(b, cls){ if (b && b.photo) return `<img class="av ${cls||""}" src="${b.photo}" alt="">`;
  const n = (b&&b.name||"?").trim(); const c = COLORS[(n.charCodeAt(0)||0)%COLORS.length];
  return `<span class="av ${cls||""}" style="background:${c}" aria-hidden="true">${esc(n.slice(0,1).toUpperCase())}</span>`; }
function toast(m){ const el = document.createElement("div"); el.className="toast"; el.setAttribute("role","status"); el.textContent=m; document.body.appendChild(el); setTimeout(()=>el.remove(), 2600); }
function beep(){ try{ const a = new (window.AudioContext||window.webkitAudioContext)(); [0,0.18].forEach(d=>{ const o=a.createOscillator(), g=a.createGain(); o.frequency.value=880; o.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.2,a.currentTime+d); g.gain.exponentialRampToValueAtTime(.001,a.currentTime+d+.15); o.start(a.currentTime+d); o.stop(a.currentTime+d+.16); }); }catch(e){} }
const slotKey = (barberId, time) => barberId+"_"+time.replace(":","");

/* ================= state ================= */
const params = new URLSearchParams(location.search);
const CUSTOMER_SID = params.get("s");
const app = document.getElementById("app");

const S = { user:null, salon:null, sid:null, bookings:[], loaded:false, unsub:[], firstSnap:true, allSalons:null };
let SENT0 = null; try{ SENT0 = JSON.parse(localStorage.getItem("ss_sent")||"null"); }catch(e){}
const UI = { sentDay: SENT0, view:"loading", step:1, tab:"home", book:{}, bookedId:null, bookedData:null, barberId:null, planPick:"monthly", err:"", busy:false, day:{} };
let D = null; // setup draft

const isAdmin = () => !!(S.user && S.user.email === ADMIN_EMAIL);
const linkFor = sid => location.origin + location.pathname.replace(/index\.html$/,"").replace(/\/beta\/$/,"/") + "?s=" + sid;
function subInfo(s){ s = s || S.salon; if (!s) return {active:false,days:0,kind:"none"};
  const exp = (s.sub&&s.sub.expires)||0, left = exp-Date.now();
  return { on: s.active!==false, active: s.active!==false && left>0, days: Math.max(0,Math.ceil(left/DAY)), kind: s.sub&&s.sub.plan ? "paid":"trial", expires:exp }; }

/* ================= slots ================= */
function busyList(slotsMap){ return Object.entries(slotsMap||{}).map(([k,dur])=>{ const i=k.lastIndexOf("_"); const hh=k.slice(i+1); return { b:k.slice(0,i), start: Number(hh.slice(0,2))*60+Number(hh.slice(2)), dur:Number(dur)||30 }; }); }
function ownerSlotsMap(date){ const m={}; S.bookings.filter(k=>k.date===date && k.status!=="cancelled").forEach(k=>{ m[slotKey(k.barberId,k.time)] = Number((svcOf(S.salon,k.serviceId)||{}).dur)||30; }); return m; }
const svcOf = (s,id) => (s.services||[]).find(x=>x.id===id);
const barberOf = (s,id) => (s.barbers||[]).find(x=>x.id===id);
function isFree(busy, b, start, dur){ return !busy.some(x => x.b===b && start < x.start+x.dur && x.start < start+dur); }
function freeSlots(salon, date, svcId, barberPref, slotsMap){
  const svc = svcOf(salon, svcId); if (!svc) return [];
  const d = new Date(date+"T00:00"); if (!(salon.days||[]).includes(d.getDay())) return null;
  const open = toMin(salon.open||"10:00"), close = toMin(salon.close||"21:00"), dur = Number(svc.dur)||30;
  const now = new Date(); const nowM = date===ymd(now) ? now.getHours()*60+now.getMinutes() : -1;
  const cands = barberPref && barberPref!=="any" ? salon.barbers.filter(b=>b.id===barberPref) : salon.barbers;
  const busy = busyList(slotsMap); const out = [];
  const step = dur < 30 ? 10 : 15;
  for (let m=open; m+dur<=close; m+=step){ if (m<=nowM) continue; const f = cands.find(b=>isFree(busy,b.id,m,dur)); if (f) out.push({time:toHM(m), barberId:f.id}); }
  return out;
}
async function createBooking(sid, salon, b){
  const dur = Number((svcOf(salon,b.serviceId)||{}).dur)||30;
  const dref = doc(db,"salons",sid,"days",b.date), bref = doc(collection(db,"salons",sid,"bookings"));
  const key = slotKey(b.barberId, b.time);
  await runTransaction(db, async tx => {
    const d = await tx.get(dref); const slots = d.exists() ? (d.data().slots||{}) : {};
    if (!isFree(busyList(slots), b.barberId, toMin(b.time), dur)) throw new Error("taken");
    if (d.exists()) tx.update(dref, { ["slots."+key]: dur }); else tx.set(dref, { slots: { [key]: dur } });
    tx.set(bref, b);
  });
  return bref.id;
}

/* ================= messages ================= */
function msgs(salon, k){
  const svc = svcOf(salon,k.serviceId)||{name:"",price:0}, b = barberOf(salon,k.barberId)||{name:""}, when = dayLabel(k.date)+", "+nice(k.time), hi = LANG==="hi";
  return {
    cust: `${hi?"नमस्ते":"Hi"} ${k.cust}! ${hi?"आपकी booking पक्की है":"Your booking is confirmed"} ✅\n${salon.name}\n${svc.name} · ${b.name}\n${when}\n₹${svc.price}${fullAddr(salon)?"\n📍 "+fullAddr(salon):""}\n🗺️ ${mapUrl(salon)}`,
    remind: `Reminder: ${k.cust}, ${nice(k.time)} — ${svc.name} @ ${salon.name}. ${hi?"मिलते हैं!":"See you!"}\n🗺️ ${mapUrl(salon)}`,
    salon: `${hi?"नई booking":"New booking"} ✂️\n${k.cust} (${k.phone})\n${svc.name} · ${b.name}\n${when}`,
    barber: `${b.name}, ${hi?"आपकी नई booking":"new booking for you"}: ${k.cust}\n${svc.name} · ${when}`
  };
}
const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e||"").trim());
function calLink(salon, k, guests){
  const svc = svcOf(salon,k.serviceId)||{name:"",dur:30}, b = barberOf(salon,k.barberId)||{name:""};
  const s = k.date.replace(/-/g,"")+"T"+k.time.replace(":","")+"00";
  const e = k.date.replace(/-/g,"")+"T"+toHM(toMin(k.time)+(Number(svc.dur)||30)).replace(":","")+"00";
  return "https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent(svc.name+" – "+(k.cust||salon.name))+
    "&dates="+s+"/"+e+"&ctz=Asia/Kolkata&details="+encodeURIComponent(b.name+(k.phone?" · "+k.phone:""))+"&location="+encodeURIComponent([salon.name, fullAddr(salon)].filter(Boolean).join(", "))+
    ((guests=[...new Set((guests||[]).map(g=>String(g||"").trim().toLowerCase()).filter(isEmail))]).length?"&add="+encodeURIComponent(guests.join(",")):"");
}
const isMapLink = u => /^https:\/\/((www\.)?google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)/i.test(String(u||"").trim());
const mapUrl = s => isMapLink(s.mapLink) ? String(s.mapLink).trim() : "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent([s.name, s.address, s.area].filter(Boolean).join(", "));
const fullAddr = s => [s.address, s.area].filter(x=>x&&String(x).trim()).join(", ");
function addrCard(s, title){
  if (!s.address && !isMapLink(s.mapLink)) return "";
  return `<div class="card"><h3>📍 ${title||t("addr_h")}</h3>${s.address?`<p>${esc(fullAddr(s))}</p>`:""}
    <div class="row"><a class="btn primary sm" href="${esc(mapUrl(s))}" target="_blank" rel="noopener">${t("directions")}</a>
    ${s.address?`<button class="btn sm" data-a="copy" data-v="${esc(fullAddr(s))}">${t("copy")}</button>`:""}</div></div>`;
}
const contactsOf = () => UI.view==="setup" ? (D.contacts = D.contacts||{}) : (S.contacts = S.contacts||{});
const bc = id => (S.contacts||{})[id] || {};
const barberWa = (id, text) => digits(bc(id).phone).length===10 ? waLink(bc(id).phone, text) : "https://wa.me/?text="+encodeURIComponent(text);
const ownerGuests = (s,k) => [k.email, bc(k.barberId).email];
const custGuests = (s,k) => [s.ownerEmail];

function daySummary(s, date, onlyBarber){
  const list = S.bookings.filter(k=>k.date===date && k.status!=="cancelled").sort((a,b)=>a.time.localeCompare(b.time));
  const lines = [`✂️ ${t("summary_h",{salon:s.name})} · ${dayLabel(date)}`];
  s.barbers.filter(b=>!onlyBarber||b.id===onlyBarber).forEach(b=>{
    const mine = list.filter(k=>k.barberId===b.id);
    lines.push("", `*${b.name}* (${mine.length})`);
    if (!mine.length) lines.push("  "+t("summary_none"));
    mine.forEach(k=>{ const v = svcOf(s,k.serviceId)||{name:"",dur:30}; lines.push(`  ${nice(k.time)} – ${k.cust} · ${v.name} (${v.dur} min)${k.status==="done"?" ✅":""}`); });
  });
  return lines.join("\n");
}

/* ================= shell ================= */
function topBar(name, sub){
  return `<header class="top"><div class="in"><span class="pole" aria-hidden="true"></span><div class="brand">${esc(name||"SalonSlot")}<small>${esc(sub||t("tagline"))}</small></div><span class="spacer"></span>
  <div class="lang" role="group" aria-label="Language"><button data-a="lang" data-v="hi" class="${LANG==="hi"?"on":""}">हिंदी</button><button data-a="lang" data-v="en" class="${LANG==="en"?"on":""}">EN</button></div></div></header>`;
}
function render(){
  const y = window.scrollY; let html = "";
  if (CUSTOMER_SID){ html = renderCustomer(); }
  else {
    const name = S.salon ? S.salon.name : "SalonSlot", sub = S.salon ? (S.salon.area||t("tagline")) : t("tagline");
    html = topBar(name, sub)+"<main>";
    if (UI.view==="loading") html += `<div class="center"><div class="spin" aria-label="${t("loading")}"></div></div>`;
    else if (UI.view==="login") html += viewLogin();
    else if (UI.view==="setup") html += viewSetup();
    else if (UI.view==="adminOnly") html += `<button class="btn sm" data-a="adminBack">← ${t("back")}</button>` + viewAdmin();
    else html += ({home:viewHome, book:viewBook, barber:viewBarber, plan:viewPlan, settings:viewSettings, admin:viewAdmin}[UI.tab]||viewHome)();
    html += "</main>";
    if (UI.view==="main") html += navBar();
  }
  app.innerHTML = html; window.scrollTo(0,y);
  drawQRs();
}
function navBar(){
  const ic = {
    home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    book:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M9 15l2 2 4-4"/>',
    barber:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14.5c2.4.2 4 1.8 4.6 4.5"/>',
    plan:'<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 10h19M6.5 15h4"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    admin:'<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>'
  };
  const tabs = ["home","book","barber","plan","settings"].concat(isAdmin()?["admin"]:[]);
  return `<nav class="nav ${tabs.length>5?"six":""}" aria-label="Main"><div>${tabs.map(k=>
    `<button data-a="tab" data-v="${k}" class="${UI.tab===k?"on":""}" aria-current="${UI.tab===k?"page":"false"}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ic[k]}</svg>${t("nav_"+k)}</button>`).join("")}</div></nav>`;
}

/* ================= login ================= */
const G_ICON = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
function viewLogin(){
  return `<section class="hero"><p class="label">${t("tagline")}</p><h1>${t("welcome_h")}</h1><p>${t("welcome_p")}</p>
    <button class="btn block gbtn" data-a="login" ${UI.busy?"disabled":""}>${G_ICON} ${t("signin")}</button></section>
    ${UI.err?`<div class="banner bad" role="alert">${UI.err}</div>`:""}
    <p class="rule small">${t("free_trial")}</p>
    <p class="small muted" style="text-align:center">${t("signin_note")}</p>
    <div class="card"><p class="label">${t("plan_h")}</p><div class="plans">
      ${["monthly","halfyearly","yearly"].map(p=>`<div class="plan"><span class="label">${t(p)}</span><b>₹${PLANS[p].price.toLocaleString("en-IN")}</b><span class="small muted">${t(p==="monthly"?"per_month":p==="yearly"?"per_year":"per_half")}</span></div>`).join("")}</div></div>`;
}

/* ================= editors ================= */
function servicesEditor(o){
  const have = new Set(o.services.map(s=>s.name.toLowerCase()));
  return `<div class="chips">${t("sugg").filter(g=>!have.has(g[0].toLowerCase())).map(g=>`<button class="chip" data-a="sugg" data-v="${esc(g[0])}|${g[1]}|${g[2]}">+ ${esc(g[0])}</button>`).join("")}</div>
  <div class="stack">${o.services.map(s=>`<div class="svc">
    <label class="field"><span class="small">${t("svc_name")}</span><input type="text" id="sn_${s.id}" data-svc="${s.id}" data-k="name" value="${esc(s.name)}"></label>
    <label class="field"><span class="small">${t("price")}</span><input type="number" inputmode="numeric" id="sp_${s.id}" data-svc="${s.id}" data-k="price" value="${esc(s.price)}"></label>
    <label class="field"><span class="small">${t("mins")}</span><select id="sd_${s.id}" data-svc="${s.id}" data-k="dur">${[10,15,20,30,45,60,90,120].map(m=>`<option value="${m}" ${Number(s.dur)===m?"selected":""}>${m}</option>`).join("")}</select></label>
    <button class="x" data-a="delSvc" data-v="${s.id}" aria-label="${t("remove")}">×</button></div>`).join("")}</div>
  <button class="btn" data-a="addSvc">+ ${t("add_service")}</button>`;
}
function barbersEditor(o){
  return `<div class="field"><span>${t("how_many")}</span><div class="chips">${[1,2,3,4,5,6].map(n=>`<button class="chip ${o.barbers.length===n?"on":""}" data-a="count" data-v="${n}">${n}</button>`).join("")}</div></div>
  <p class="small muted">${t("tap_photo")}</p>
  <div class="stack">${o.barbers.map((b,i)=>`<div class="bedit">
    <div class="photo">${avatar(b,"lg")}<label for="ph_${b.id}" aria-label="Photo"></label><span class="cam" aria-hidden="true">＋</span>
      <input type="file" accept="image/*" id="ph_${b.id}" data-photo="${b.id}" hidden></div>
    <div class="stack">
      <label class="field"><span class="small">${t("barber_name")} ${i+1}</span><input type="text" id="bn_${b.id}" data-bar="${b.id}" data-k="name" value="${esc(b.name)}"></label>
      <label class="field"><span class="small">${t("speciality")} <em>(${t("optional")})</em></span><input type="text" id="bs_${b.id}" data-bar="${b.id}" data-k="spec" value="${esc(b.spec)}" placeholder="${t("spec_ph")}"></label>
      <label class="field"><span class="small">${t("barber_phone")} <em>(${t("optional")})</em></span><input type="tel" inputmode="tel" id="bp_${b.id}" data-bc="${b.id}" data-k="phone" value="${esc((contactsOf()[b.id]||{}).phone||"")}" placeholder="98XXXXXXXX"></label>
      <label class="field"><span class="small">${t("barber_email")} <em>(${t("optional")})</em></span><input type="email" inputmode="email" id="be_${b.id}" data-bc="${b.id}" data-k="email" value="${esc((contactsOf()[b.id]||{}).email||b.email||"")}" placeholder="barber@gmail.com"></label>
      <p class="small muted">${t("private_note")}</p>
      <button class="btn ghost sm" style="align-self:flex-start" data-a="delBarber" data-v="${b.id}">${t("remove")}</button>
    </div></div>`).join("")}</div>
  <button class="btn" data-a="addBarber">+ ${t("add_barber")}</button>`;
}
function salonFields(o){
  return `<label class="field"><span>${t("salon_name")}</span><input type="text" id="f_name" data-salon="name" value="${esc(o.name)}"></label>
  <label class="field"><span>${t("owner_name")}</span><input type="text" id="f_owner" data-salon="owner" value="${esc(o.owner)}"></label>
  <label class="field"><span>${t("phone")}</span><input type="tel" inputmode="tel" id="f_phone" data-salon="phone" value="${esc(o.phone)}" placeholder="98XXXXXXXX"></label>
  <label class="field"><span>${t("address")}</span><textarea id="f_addr" data-salon="address" rows="2" placeholder="${t("address_ph")}" style="width:100%;border:1px solid var(--line);background:#fff;border-radius:10px;padding:10px 12px;font:inherit;resize:vertical">${esc(o.address||"")}</textarea></label>
  <label class="field"><span>${t("area")}</span><input type="text" id="f_area" data-salon="area" value="${esc(o.area)}" placeholder="Kolshet Road, Thane"></label>
  <label class="field"><span>${t("maplink")} <em>(${t("optional")})</em></span><input type="url" inputmode="url" id="f_map" data-salon="mapLink" value="${esc(o.mapLink||"")}" placeholder="https://maps.app.goo.gl/..."><em>${t("maplink_help")}</em></label>
  ${o.mapLink && !isMapLink(o.mapLink)?`<p class="small" style="color:var(--danger)">${t("bad_map")}</p>`:""}`;
}
function hoursFields(o){
  return `<div class="row"><label class="field grow"><span>${t("opens")}</span><input type="time" id="f_open" data-salon="open" value="${o.open}"></label>
  <label class="field grow"><span>${t("closes")}</span><input type="time" id="f_close" data-salon="close" value="${o.close}"></label></div>
  <div class="field"><span>${t("open_days")}</span><div class="chips">${[1,2,3,4,5,6,0].map(d=>`<button class="chip ${o.days.includes(d)?"on":""}" data-a="day" data-v="${d}" aria-pressed="${o.days.includes(d)}">${t("dw")[d]}</button>`).join("")}</div></div>`;
}
const editTarget = () => UI.view==="setup" ? D : S.salon;

/* ================= setup ================= */
function viewSetup(){
  const n = UI.step, total = 5; let body = "";
  if (n===1) body = `<h2>${t("s1_h")}</h2>${salonFields(D)}`;
  if (n===2) body = `<h2>${t("s2_h")}</h2>${hoursFields(D)}`;
  if (n===3) body = `<h2>${t("s3_h")}</h2><p class="muted small">${t("s3_p")}</p>${servicesEditor(D)}`;
  if (n===4) body = `<h2>${t("s4_h")}</h2><p class="muted small">${t("s4_p")}</p>${barbersEditor(D)}`;
  if (n===5) body = `<div class="lock stack"><div class="big" aria-hidden="true">✂️</div><h2>${t("s5_h")}</h2><p class="muted">${t("s5_p")}</p></div>
    <div class="barbers">${D.barbers.map(b=>`<div class="bcard">${avatar(b,"lg")}<b>${esc(b.name)}</b>${b.spec?`<small>${esc(b.spec)}</small>`:""}</div>`).join("")}</div>`;
  return `${isAdmin()?`<button class="btn primary block" data-a="adminOnly">🛡️ ${t("nav_admin")}</button>`:""}<div class="stack"><p class="label">${t("step")} ${n} ${t("of")} ${total}</p><div class="steps">${Array.from({length:total},(_,i)=>`<i class="${i<n?"on":""}"></i>`).join("")}</div></div>
  <div class="card">${body}</div>
  ${UI.err?`<div class="banner bad" role="alert">${UI.err}</div>`:""}
  <div class="row">${n===1?`<button class="btn grow" data-a="logout">${t("logout")}</button>`:`<button class="btn grow" data-a="prev">${t("back")}</button>`}<button class="btn primary grow" data-a="nextStep" ${UI.busy?"disabled":""}>${n===total?t("finish"):t("next")}</button></div>`;
}
function validate(o, n){
  if (n===1 && (!o.name.trim() || digits(o.phone).length!==10)) return t("need_name");
  if (n===1 && (String(o.address||"").trim().length<8 || !String(o.area||"").trim())) return t("need_addr");
  if (n===1 && o.mapLink && !isMapLink(o.mapLink)) return t("bad_map");
  if (n===3 && !o.services.some(s=>s.name.trim() && Number(s.price)>0)) return t("need_svc");
  if (n===4 && !o.barbers.some(b=>b.name.trim())) return t("need_barber");
  return "";
}
const cleanList = o => { o.services = o.services.filter(s=>s.name.trim()).map(s=>({id:s.id,name:s.name.trim(),price:Number(s.price)||0,dur:Number(s.dur)||30}));
  o.barbers = o.barbers.filter(b=>b.name.trim()).map(b=>({id:b.id,name:b.name.trim(),spec:(b.spec||"").trim(),photo:b.photo||""})); };
function cleanContacts(o){ const out = {}; (o.barbers||[]).forEach(b=>{ const c = (o===D ? D.contacts : S.contacts)||{}; const x = c[b.id]||{}; const em = String(x.email||b.email||"").trim().toLowerCase();
  out[b.id] = { phone: digits(x.phone).length===10 ? digits(x.phone) : "", email: isEmail(em) ? em : "" }; }); return out; }

/* ================= owner views ================= */
function subBanner(){
  const i = subInfo();
  if (!i.on) return `<div class="banner bad" role="status">${t("paused_admin")}</div>`;
  if (!i.active) return `<div class="banner bad" role="status"><span style="flex:1">${t("expired")}</span><button class="btn sm saffron" data-a="tab" data-v="plan">${t("recharge")}</button></div>`;
  if (i.days<=3 || i.kind==="trial") return `<div class="banner ${i.days<=3?"warn":"ok"}"><span style="flex:1">${i.kind==="trial"?t("trial_left",{n:i.days}):t("plan_left",{plan:t(S.salon.sub.plan),n:i.days})}</span>${i.days<=3?`<button class="btn sm saffron" data-a="tab" data-v="plan">${t("recharge")}</button>`:""}</div>`;
  return "";
}
function bookingRow(k, o){
  o = o||{}; const s = S.salon, svc = svcOf(s,k.serviceId)||{name:"?",price:0}, b = barberOf(s,k.barberId)||{name:"?"}, m = msgs(s,k);
  const pill = k.status==="done"?`<span class="pill ok">${t("st_done")}</span>`:k.status==="cancelled"?`<span class="pill bad">${t("st_cancelled")}</span>`:`<span class="pill warn">${t("st_booked")}</span>`;
  return `<div class="bk"><div class="t">${nice(k.time).replace(" ","<small>")}</small></div><div class="body">
    <div class="row" style="gap:8px"><b class="grow">${esc(k.cust)}</b>${k.src==="online"?`<span class="pill">${t("online")}</span>`:""}${pill}</div>
    <div class="row small muted" style="gap:6px">${avatar(b,"sm")}<span>${esc(b.name)} · ${esc(svc.name)} · ₹${esc(svc.price)} · ${esc(k.phone)}${k.email?" · "+esc(k.email):""}</span></div>
    ${k.status==="booked"?`<div class="row" style="gap:6px">
      <button class="btn sm primary" data-a="done" data-v="${k.id}">${t("mark_done")}</button>
      <a class="btn sm" href="${waLink(k.phone, o.remind?m.remind:m.cust)}" target="_blank" rel="noopener">${o.remind?t("remind"):t("whatsapp")}</a>
      ${o.barber||o.remind?`<a class="btn sm" href="${barberWa(k.barberId,m.barber)}" target="_blank" rel="noopener">${t("send_barber")}</a>`:""}
      <a class="btn sm" href="${calLink(s,k,ownerGuests(s,k))}" target="_blank" rel="noopener">${t("calendar")}</a>
      ${o.cancel?`<button class="btn sm ghost" data-a="cancelBk" data-v="${k.id}">${t("cancel")}</button>`:""}</div>`:""}
  </div></div>`;
}
function linkCard(){
  const l = linkFor(S.sid);
  return `<div class="card"><h2>${t("link_h")}</h2><p class="small muted">${t("link_p")}</p>
    <div class="copy"><code>${esc(l)}</code><button class="btn sm" data-a="copy" data-v="${esc(l)}">${t("copy")}</button></div>
    <div class="row"><a class="btn sm primary" href="https://wa.me/?text=${encodeURIComponent(t("share_msg",{salon:S.salon.name,link:l}))}" target="_blank" rel="noopener">${t("share_wa")}</a>
    <a class="btn sm" href="${esc(l)}" target="_blank" rel="noopener">${t("open_link")}</a></div>
    <div class="qr" data-qr="${esc(l)}" role="img" aria-label="QR"></div><p class="small muted" style="text-align:center">${t("qr_p")}</p></div>`;
}
function sendAllCard(today, td){
  const withBk = S.salon.barbers.filter(b=>today.some(k=>k.barberId===b.id && k.status!=="cancelled"));
  const sent = (UI.sentDay && UI.sentDay.date===td) ? UI.sentDay.ids : [];
  const next = withBk.find(b=>!sent.includes(b.id));
  const noPhone = S.salon.barbers.some(b=>digits(bc(b.id).phone).length!==10);
  return `<hr><p class="label">${t("send_each")}</p><p class="small muted">${t("send_all_p")}</p>
    <div class="stack" style="gap:6px">${withBk.length ? withBk.map(b=>{ const n = today.filter(k=>k.barberId===b.id && k.status!=="cancelled").length, done = sent.includes(b.id);
      return `<div class="row" style="gap:8px">${avatar(b,"sm")}<span class="grow"><b>${esc(b.name)}</b> <span class="small muted">· ${n===1?t("bk_count1"):t("bk_count",{n})}${digits(bc(b.id).phone).length===10?"":" · ⚠️"}</span></span>
        ${done?`<span class="pill ok">✓ ${t("sent")}</span>`:`<a class="btn sm" data-a="sendDay" data-v="${b.id}" href="${barberWa(b.id, daySummary(S.salon, td, b.id))}" target="_blank" rel="noopener">${t("send")}</a>`}</div>`; }).join("") : `<p class="small muted">${t("no_bk")}</p>`}</div>
    ${next?`<a class="btn primary block" data-a="sendDay" data-v="${next.id}" href="${barberWa(next.id, daySummary(S.salon, td, next.id))}" target="_blank" rel="noopener">${sent.length?t("send_next",{name:esc(next.name)}):t("send_all",{name:esc(next.name)})}</a>`
      : withBk.length?`<div class="banner ok">✓ ${t("all_sent")}</div>`:""}
    ${sent.length?`<button class="btn ghost sm" data-a="resetSent">${t("send_again")}</button>`:""}
    ${noPhone?`<p class="small muted">⚠️ ${t("no_phone")}</p>`:""}`;
}
function viewHome(){
  const td = ymd(new Date());
  const today = S.bookings.filter(k=>k.date===td).sort((a,b)=>a.time.localeCompare(b.time));
  const earned = today.filter(k=>k.status==="done").reduce((s,k)=>s+Number((svcOf(S.salon,k.serviceId)||{}).price||0),0);
  const nowHM = toHM(new Date().getHours()*60+new Date().getMinutes());
  const up = today.filter(k=>k.status==="booked" && k.time>=nowHM).length;
  const later = S.bookings.filter(k=>k.date>td && k.status==="booked").sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,8);
  let last = "";
  return `${subBanner()}
  ${!String(S.salon.address||"").trim()?`<div class="banner warn"><span style="flex:1">${t("addr_missing")}</span><button class="btn sm saffron" data-a="tab" data-v="settings">${t("nav_settings")}</button></div>`:""}
  <div><p class="muted">${t("hello")}${S.salon.owner?", "+esc(S.salon.owner):""}</p><h1>${dayLabel(td)}</h1></div>
  <div class="stats"><div class="stat"><b>${today.filter(k=>k.status!=="cancelled").length}</b><span>${t("today_bk")}</span></div>
    <div class="stat"><b>${up}</b><span>${t("upcoming")}</span></div><div class="stat"><b>₹${earned}</b><span>${t("earned")}</span></div></div>
  <button class="btn primary block" data-a="walkin">+ ${t("add_walkin")}</button>
  <div class="card"><h2>${t("by_barber")}</h2><p class="small muted">${t("tap_barber")}</p>
    <div class="barbers">${S.salon.barbers.map(b=>{ const n = today.filter(k=>k.barberId===b.id && k.status!=="cancelled").length;
      const nxt = today.find(k=>k.barberId===b.id && k.status==="booked" && k.time>=nowHM);
      return `<button class="bcard" data-a="openBarber" data-v="${b.id}">${avatar(b)}<b>${esc(b.name)}</b><span class="pill ${n?"warn":""}">${n===1?t("bk_count1"):t("bk_count",{n})}</span>${nxt?`<small>${nice(nxt.time)} · ${esc(nxt.cust)}</small>`:""}</button>`; }).join("")}</div>
    <a class="btn saffron block" href="https://wa.me/?text=${encodeURIComponent(daySummary(S.salon, td))}" target="_blank" rel="noopener">${t("send_summary")}</a>
    ${sendAllCard(today, td)}</div>
  <div class="card"><h2>${t("today_bk")}</h2>${today.length?`<div>${today.map(k=>bookingRow(k,{remind:true,cancel:true})).join("")}</div>`:`<p class="muted">${t("no_bk")}</p>`}</div>
  ${later.length?`<div class="card"><h2>${t("upcoming")}</h2><div>${later.map(k=>{const h=k.date!==last?`<p class="label" style="margin-top:6px">${dayLabel(k.date)}</p>`:"";last=k.date;return h+bookingRow(k,{cancel:true});}).join("")}</div></div>`:""}
  ${linkCard()}`;
}
function bookingForm(salon, slotsFor, ownerMode){
  const B = UI.book; const days = Array.from({length:7},(_,i)=>ymd(new Date(Date.now()+i*DAY)));
  if (!B.date) B.date = days.find(d=>(salon.days||[]).includes(new Date(d+"T00:00").getDay())) || days[0];
  const map = slotsFor(B.date);
  if (map===undefined && CUSTOMER_SID) setTimeout(()=>loadDay(B.date),0);
  const slots = B.svc ? (map===undefined ? undefined : freeSlots(salon, B.date, B.svc, B.barber||"any", map)) : [];
  return `
  <div class="card"><h3>${t("pick_svc")}</h3><div class="chips">${salon.services.map(s=>`<button class="chip ${B.svc===s.id?"on":""}" data-a="bSvc" data-v="${s.id}">${esc(s.name)} · ₹${esc(s.price)}</button>`).join("")}</div></div>
  <div class="card"><h3>${t("pick_barber")}</h3><div class="barbers">
    <button class="bcard ${(!B.barber||B.barber==="any")?"on":""}" data-a="bBarber" data-v="any"><span class="av lg" style="background:var(--surface2);color:var(--muted)" aria-hidden="true">✂</span><b>${t("any_barber")}</b><small>${t("any_sub")}</small></button>
    ${salon.barbers.map(b=>`<button class="bcard ${B.barber===b.id?"on":""}" data-a="bBarber" data-v="${b.id}">${avatar(b,"lg")}<b>${esc(b.name)}</b>${b.spec?`<small>${esc(b.spec)}</small>`:""}</button>`).join("")}</div></div>
  <div class="card"><h3>${t("pick_date")}</h3><div class="hscroll">${days.map(d=>{const dt=new Date(d+"T00:00");const closed=!(salon.days||[]).includes(dt.getDay());
    return `<button class="date ${B.date===d?"on":""}" data-a="bDate" data-v="${d}" ${closed?"disabled":""}><small>${t("dw")[dt.getDay()]}</small><b>${dt.getDate()}</b><small>${t("mon")[dt.getMonth()]}</small></button>`}).join("")}</div></div>
  <div class="card"><h3>${t("pick_time")}</h3>${!B.svc?`<p class="muted small">${t("pick_svc_first")}</p>`:slots===undefined?`<div class="spin"></div>`:slots===null?`<p class="muted">${t("closed_day")}</p>`:slots.length?`<div class="slots">${slots.map(s=>`<button class="slot ${B.time===s.time?"on":""}" data-a="bTime" data-v="${s.time}">${nice(s.time)}</button>`).join("")}</div>`:`<p class="muted">${t("no_slots")}</p>`}</div>
  <div class="card"><h3>${t("your_details")}</h3>
    <label class="field"><span>${t("cust_name")}</span><input type="text" id="c_name" autocomplete="name" data-book="name" value="${esc(B.name||"")}"></label>
    <label class="field"><span>${t("cust_phone")}</span><input type="tel" inputmode="tel" autocomplete="tel" id="c_phone" data-book="phone" value="${esc(B.phone||"")}" placeholder="98XXXXXXXX"></label>
    <label class="field"><span>${t("cust_email")} <em>(${t("optional")})</em></span><input type="email" inputmode="email" autocomplete="email" id="c_email" data-book="email" value="${esc(B.email||"")}" placeholder="name@gmail.com"></label>
    ${UI.err?`<div class="banner bad" role="alert">${UI.err}</div>`:""}
    <button class="btn primary block" data-a="confirm" ${UI.busy?"disabled":""}>${t("confirm_bk")}</button></div>`;
}
function viewBook(){
  if (UI.bookedData){ const k = UI.bookedData, s = S.salon, m = msgs(s,k), svc = svcOf(s,k.serviceId), b = barberOf(s,k.barberId);
    return `<div class="card lock"><div class="big" aria-hidden="true">✅</div><h2>${t("booked_h")}</h2>
      <p>${t("booked_p",{svc:esc(svc.name),barber:esc(b.name),date:dayLabel(k.date),time:nice(k.time)})}</p></div>
    <div class="card"><h3>${t("msgs_h")}</h3>
      <div class="msg"><span class="to">${esc(k.cust)} · ${esc(k.phone)}</span>${esc(m.cust)}</div>
      <div class="row"><a class="btn sm primary" href="${waLink(k.phone,m.cust)}" target="_blank" rel="noopener">${t("send_cust")}</a>
      <a class="btn sm" href="${barberWa(k.barberId,m.barber)}" target="_blank" rel="noopener">${t("send_barber")}</a>
      <a class="btn sm" href="${calLink(s,k,ownerGuests(s,k))}" target="_blank" rel="noopener">${t("calendar")}</a></div>
      <p class="small muted">${t("cal_note")}</p></div>
    <button class="btn block" data-a="bookAgain">${t("book_another")}</button>`; }
  return `<div><h1>${t("book_h")}</h1><p class="small muted" style="margin-top:4px">${t("book_owner")}</p></div>` + bookingForm(S.salon, d=>ownerSlotsMap(d), true);
}
function viewBarber(){
  if (!UI.barberId && S.salon.barbers[0]) UI.barberId = S.salon.barbers[0].id;
  const b = barberOf(S.salon, UI.barberId); const td = ymd(new Date());
  const mine = S.bookings.filter(k=>k.barberId===UI.barberId && k.date>=td && k.status!=="cancelled").sort((a,c)=>(a.date+a.time).localeCompare(c.date+c.time));
  let last = "";
  return `<div><h1>${t("barber_h")}</h1><p class="small muted" style="margin-top:4px">${t("barber_p")}</p></div>
  <div class="hscroll">${S.salon.barbers.map(x=>`<button class="bcard ${x.id===UI.barberId?"on":""}" style="flex:none;width:112px" data-a="pickBarber" data-v="${x.id}">${avatar(x)}<b>${esc(x.name)}</b></button>`).join("")}</div>
  ${b?`<div class="card"><div class="row">${avatar(b,"lg")}<div class="grow"><h2>${esc(b.name)}</h2>${b.spec?`<p class="muted small">${esc(b.spec)}</p>`:""}</div></div>
    <a class="btn saffron sm" style="align-self:flex-start" href="${barberWa(b.id, daySummary(S.salon, td, b.id))}" target="_blank" rel="noopener">${t("send_day",{name:esc(b.name)})}</a>
    ${digits(bc(b.id).phone).length===10?`<span class="small muted">📱 ${esc(bc(b.id).phone)}</span>`:`<span class="small muted">${t("no_phone")}</span>`}<hr>
    <h3>${t("your_day")}</h3>${mine.length?`<div>${mine.map(k=>{const h=k.date!==last?`<p class="label" style="margin-top:6px">${dayLabel(k.date)}</p>`:"";last=k.date;return h+bookingRow(k,{barber:true});}).join("")}</div>`:`<p class="muted">${t("no_bk")}</p>`}</div>`:""}`;
}
const upiUri = amt => "upi://pay?pa="+ADMIN_UPI+"&pn="+encodeURIComponent(ADMIN_NAME)+"&am="+amt+"&cu=INR&tn="+encodeURIComponent("SalonSlot "+(S.salon?S.salon.name:""));
function viewPlan(){
  const i = subInfo(), p = PLANS[UI.planPick], pr = S.salon.payReq;
  const status = !i.on?`<span class="pill bad">${t("adm_off")}</span>`:!i.active?`<span class="pill bad">${t("ended")}</span>`:i.kind==="trial"?`<span class="pill warn">${t("trial")}</span>`:`<span class="pill ok">${t("active")} · ${t(S.salon.sub.plan)}</span>`;
  return `<h1>${t("plan_h")}</h1>${!i.on?subBanner():""}
  <div class="card"><div class="row"><span class="label grow">${t("status")}</span>${status}</div>
    ${i.expires?`<div class="row"><span class="muted grow">${i.active?t("ends"):t("ended")}</span><b>${longDate(i.expires)}</b></div>`:""}</div>
  ${pr?`<div class="banner ok">${t("pending",{amt:PLANS[pr.plan].price,utr:esc(pr.utr)})}</div>`:""}
  <div class="card"><h3>${t("choose_plan")}</h3><div class="plans">
    ${["monthly","halfyearly","yearly"].map(k=>`<button class="plan ${UI.planPick===k?"on":""}" data-a="planPick" data-v="${k}"><span class="label">${t(k)}</span><b>₹${PLANS[k].price.toLocaleString("en-IN")}</b><span class="small muted">${t(k==="monthly"?"per_month":k==="yearly"?"per_year":"per_half")}</span>${k!=="monthly"?`<span class="pill ok" style="align-self:flex-start;margin-top:4px">${t(k==="yearly"?"save":"save_half")}</span>`:""}</button>`).join("")}</div></div>
  <div class="card"><h3>${t("pay_h")} · ₹${p.price.toLocaleString("en-IN")}</h3><p class="small muted">${t("pay_steps")}</p>
    <div class="qr" data-qr="${esc(upiUri(p.price))}" role="img" aria-label="UPI QR"></div>
    <div class="copy"><span class="small muted">${t("upi_id")}</span><code>${ADMIN_UPI}</code><button class="btn sm" data-a="copy" data-v="${ADMIN_UPI}">${t("copy")}</button></div>
    <a class="btn saffron block" href="${upiUri(p.price)}">Pay ₹${p.price.toLocaleString("en-IN")} · GPay / UPI</a></div>
  <div class="card"><h3>${t("utr_h")}</h3><p class="small muted">${t("utr_p")}</p>
    <label class="field"><span>${t("utr")}</span><input type="text" id="utr" inputmode="numeric" value="${esc(UI.utr||"")}" data-ui="utr"></label>
    ${UI.err?`<div class="banner bad" role="alert">${UI.err}</div>`:""}
    <button class="btn primary" data-a="paid" ${UI.busy?"disabled":""}>${t("submit_pay")} · ${t(UI.planPick)}</button></div>`;
}
function viewSettings(){
  const s = S.salon;
  return `<h1>${t("set_h")}</h1>
  <div class="card"><h2>${t("salon_details")}</h2>${salonFields(s)}${hoursFields(s)}</div>
  <div class="card"><h2>${t("services")}</h2>${servicesEditor(s)}</div>
  <div class="card"><h2>${t("barbers")}</h2>${barbersEditor(s)}</div>
  ${linkCard()}
  <div class="card"><h3>${t("install_h")}</h3><p class="small muted">${t("install_p")}</p></div>
  <div class="card"><h3>${t("account")}</h3><div class="who">${S.user.photoURL?`<img src="${esc(S.user.photoURL)}" alt="">`:""}<div><span class="small muted">${t("signed_as")}</span><br><b>${esc(S.user.email)}</b></div></div>
    <button class="btn" data-a="logout">${t("logout")}</button></div>`;
}

/* ================= admin ================= */
function viewAdmin(){
  if (!isAdmin()) return "";
  const list = S.allSalons;
  if (!list) return `<h1>${t("adm_h")}</h1><div class="center"><div class="spin"></div></div>`;
  const now = Date.now();
  const live = list.filter(x=>subInfo(x).active).length, pend = list.filter(x=>x.payReq);
  const collected = list.reduce((a,x)=>a+(x.payments||[]).reduce((b,p)=>b+(Number(p.amt)||0),0),0);
  const sorted = list.slice().sort((a,b)=>(b.payReq?1:0)-(a.payReq?1:0) || ((a.sub||{}).expires||0)-((b.sub||{}).expires||0));
  return `<div><h1>${t("adm_h")}</h1><p class="small muted" style="margin-top:4px">${t("adm_p")}</p></div>
  <div class="stats"><div class="stat"><b>${list.length}</b><span>${t("adm_salons")}</span></div><div class="stat"><b>${live}</b><span>${t("adm_live")}</span></div><div class="stat"><b>₹${collected.toLocaleString("en-IN")}</b><span>${t("adm_collected")}</span></div></div>
  ${pend.length?`<div class="banner warn">${t("adm_pending")}: <b>${pend.length}</b></div>`:""}
  <div class="card">${sorted.length?sorted.map(x=>{ const i=subInfo(x);
    const pill = !i.on?`<span class="pill bad">${t("adm_off")}</span>`:!i.active?`<span class="pill bad">${t("ended")}</span>`:i.days<=3?`<span class="pill warn">${i.days}d</span>`:`<span class="pill ok">${i.kind==="trial"?t("trial"):t((x.sub||{}).plan)}</span>`;
    return `<div class="srow"><div class="row" style="gap:8px"><b class="grow">${esc(x.name||"—")}</b>${pill}</div>
      <span class="small muted">${esc(x.owner||"")}${x.phone?" · "+esc(x.phone):""}${x.area?" · "+esc(x.area):""}<br>${esc(x.ownerEmail||"")}</span>
      <span class="small">${i.expires?(i.active?t("ends"):t("ended"))+": <b>"+longDate(i.expires)+"</b>":""}</span>
      ${x.payReq?`<div class="banner warn" style="flex-direction:column;align-items:flex-start"><span>${t("adm_paid",{plan:t(x.payReq.plan)+" ₹"+PLANS[x.payReq.plan].price,utr:esc(x.payReq.utr)})}</span><span class="small muted">${t("adm_check")}</span>
        <div class="row"><button class="btn sm primary" data-a="admApprove" data-v="${x.id}">${t("approve")}</button><button class="btn sm ghost" data-a="admReject" data-v="${x.id}">${t("reject")}</button></div></div>`:""}
      <div class="row" style="gap:6px">${i.on?`<button class="btn sm danger" data-a="admToggle" data-v="${x.id}">${t("turn_off")}</button>`:`<button class="btn sm primary" data-a="admToggle" data-v="${x.id}">${t("turn_on")}</button>`}
        <span class="row" style="gap:4px" role="group" aria-label="${t("adj_days")}">${[-7,-1,1,7].map(d=>`<button class="btn sm ${d<0?"ghost":""}" data-a="admAdjust" data-v="${x.id}|${d}" aria-label="${d>0?"+":""}${d} ${t("days")}">${d>0?"+":"−"}${Math.abs(d)} ${t("days")}</button>`).join("")}</span>
        ${x.phone?`<a class="btn sm" href="${waLink(x.phone,"")}" target="_blank" rel="noopener">${t("whatsapp")}</a>`:""}
        <a class="btn sm ghost" href="${esc(linkFor(x.id))}" target="_blank" rel="noopener">${t("open_link")}</a></div></div>`; }).join(""):`<p class="muted">${t("adm_none")}</p>`}</div>
  <div class="card"><h3>📋 ${t("csv_h")}</h3><p class="small muted">${t("csv_p")}</p><button class="btn primary" data-a="admCsv" ${UI.busy?"disabled":""}>${t("csv_btn")}</button></div>
  <div class="card"><h3>${t("download")}</h3><p class="small muted">${t("download_p")}</p><button class="btn" data-a="admDownload" ${UI.busy?"disabled":""}>${t("download")}</button></div>`;
}
function watchAdmin(){
  if (UI.view==="adminOnly") setTimeout(()=>{ if (UI.view==="adminOnly") render(); }, 1500);
  if (!isAdmin() || S.adminUnsub) return;
  S.adminUnsub = onSnapshot(collection(db,"salons"), snap => { S.allSalons = snap.docs.map(d=>({id:d.id,...d.data()})); if (UI.tab==="admin" || UI.view==="adminOnly") render(); },
    err => { console.error(err); S.allSalons = []; render(); });
}

/* ================= customer page ================= */
const C = { salon:null, state:"loading", days:{} };
function renderCustomer(){
  if (C.state==="loading") return topBar("SalonSlot")+`<main><div class="center"><div class="spin"></div></div></main>`;
  if (C.state==="nf") return topBar("SalonSlot")+`<main><div class="card lock"><div class="big" aria-hidden="true">🔍</div><h2>${t("nf_h")}</h2><p class="muted">${t("nf_p")}</p></div></main>`;
  const s = C.salon, i = subInfo(s);
  let body = "";
  if (!i.active) body = `<div class="card lock"><div class="big" aria-hidden="true">📞</div><h2>${t("bk_closed_h")}</h2><p class="muted">${t("bk_closed_p")}</p>
      ${s.phone?`<div class="copy"><code>${esc(s.phone)}</code><button class="btn sm" data-a="copy" data-v="${esc(s.phone)}">${t("copy")}</button></div><a class="btn primary" href="${waLink(s.phone,"")}" target="_blank" rel="noopener">${t("whatsapp")}</a>`:""}</div>${addrCard(s)}`;
  else if (UI.bookedData){ const k = UI.bookedData, m = msgs(s,k), svc = svcOf(s,k.serviceId), b = barberOf(s,k.barberId);
    body = `<div class="card lock"><div class="big" aria-hidden="true">✅</div><h2>${t("booked_h")}</h2>
      <p>${t("booked_p",{svc:esc(svc.name),barber:esc(b.name),date:dayLabel(k.date),time:nice(k.time)})}</p>
      <a class="btn" href="${calLink(s,k,custGuests(s,k))}" target="_blank" rel="noopener">${t("calendar")}</a>
      <p class="small muted">${t("cal_note_c")}</p></div>
      ${addrCard(s, t("how_reach"))}
      ${s.phone?`<div class="card"><p class="small muted">${t("tell_salon_p")}</p><a class="btn primary block" href="${waLink(s.phone,m.salon)}" target="_blank" rel="noopener">${t("tell_salon")}</a></div>`:""}
      <button class="btn block" data-a="bookAgain">${t("book_another")}</button>`; }
  else body = `<div><h1>${t("book_h")}</h1></div>` + addrCard(s) + bookingForm(s, d => C.days[d], false);
  return topBar(s.name, s.area||t("tagline"))+`<main>${body}</main>`;
}
function loadDay(date){
  if (!CUSTOMER_SID || C.days[date]!==undefined || C["l_"+date]) return;
  C["l_"+date] = true;
  getDoc(doc(db,"salons",CUSTOMER_SID,"days",date)).then(d=>{ C.days[date] = d.exists() ? (d.data().slots||{}) : {}; C["l_"+date]=false; render(); })
    .catch(()=>{ C.days[date] = {}; C["l_"+date]=false; render(); });
}
async function initCustomer(){
  try{ const d = await getDoc(doc(db,"salons",CUSTOMER_SID)); if (!d.exists()) { C.state="nf"; render(); return; }
    C.salon = {id:d.id, ...d.data()}; C.state="ok"; document.title = C.salon.name+" · SalonSlot"; render(); }
  catch(e){ console.error(e); C.state="nf"; render(); }
}

/* ================= QR ================= */
function drawQRs(){ document.querySelectorAll("[data-qr]").forEach(el=>{ if (el.dataset.done) return;
  if (!window.QRCode){ setTimeout(drawQRs, 400); return; } el.dataset.done="1";
  new QRCode(el,{text:el.dataset.qr,width:190,height:190,correctLevel:QRCode.CorrectLevel.M}); }); }

/* ================= saving ================= */
let saveTimer = null;
function queueSave(){ clearTimeout(saveTimer); saveTimer = setTimeout(saveSalon, 900); }
async function saveSalon(){
  saveTimer = null; if (!S.salon || !S.sid) return; const s = S.salon;
  const contacts = cleanContacts(s);
  const clean = JSON.parse(JSON.stringify({services:s.services, barbers:s.barbers})); cleanList(clean);
  setDoc(doc(db,"salons",S.sid,"private","contacts"), { barbers: contacts }).catch(e=>console.error(e));
  try{ await updateDoc(doc(db,"salons",S.sid), { name:s.name, owner:s.owner, phone:s.phone, address:String(s.address||"").trim(), mapLink: isMapLink(s.mapLink)?String(s.mapLink).trim():"", area:s.area, open:s.open, close:s.close, days:s.days, services:clean.services, barbers:clean.barbers });
    toast(t("saved")); }catch(e){ console.error(e); toast(t("save_fail")); }
}

/* ================= back button ================= */
const NAV = [];
function pushNav(){ NAV.push({view:UI.view, tab:UI.tab, step:UI.step, barberId:UI.barberId, bookedData:UI.bookedData}); try{ history.pushState({n:NAV.length}, ""); }catch(e){} }
window.addEventListener("popstate", () => { const st = NAV.pop(); if (!st) return; Object.assign(UI, st); UI.err=""; if (UI.view==="adminOnly"||UI.tab==="admin") watchAdmin(); render(); window.scrollTo(0,0); });
const goBack = fallback => { if (NAV.length) history.back(); else { fallback(); render(); } };

/* ================= actions ================= */
const go = fn => { const r = fn(); render(); return r; };
const A = {
  lang:v=>go(()=>{ LANG=v; try{localStorage.setItem("ss_lang",v);}catch(e){} }),
  login: async ()=>{ UI.err=""; UI.busy=true; render(); const p = new GoogleAuthProvider(); p.setCustomParameters({prompt:"select_account"});
    try{ await signInWithPopup(auth,p); }
    catch(e){ if (e && /popup-blocked|operation-not-supported|cancelled-popup/.test(e.code||"")) { try{ await signInWithRedirect(auth,p); return; }catch(e2){} }
      if (e && e.code!=="auth/popup-closed-by-user") UI.err = t("signin_fail"); }
    UI.busy=false; render(); },
  logout: async ()=>{ await signOut(auth); },
  adminOnly:()=>go(()=>{ pushNav(); UI.view="adminOnly"; watchAdmin(); window.scrollTo(0,0); }),
  adminBack:()=>goBack(()=>{ UI.view="setup"; }),
  tab:v=>go(()=>{ if (v!==UI.tab) pushNav(); UI.tab=v; UI.err=""; if (v!=="book") UI.bookedData=null; if (v==="admin") watchAdmin(); window.scrollTo(0,0); }),
  walkin:()=>go(()=>{ pushNav(); UI.tab="book"; UI.bookedData=null; UI.book={}; window.scrollTo(0,0); }),
  prev:()=>{ UI.err=""; goBack(()=>{ if (UI.step>1) UI.step--; }); },
  nextStep: async ()=>{ const e = validate(D, UI.step); UI.err = e; if (e){ render(); return; }
    if (UI.step<5){ pushNav(); UI.step++; if (UI.step===4 && !D.barbers.length) D.barbers.push({id:uid(),name:"",spec:"",photo:""}); if (UI.step===5) cleanList(D); render(); window.scrollTo(0,0); return; }
    UI.busy=true; render(); cleanList(D); const now = Date.now();
    const data = { ...D, ownerUid:S.user.uid, ownerEmail:S.user.email||"", active:true, createdAt:now, sub:{ plan:null, trialStart:now, expires: now+TRIAL_DAYS*DAY } };
    const contacts = cleanContacts(D); delete data.contacts;
    try{ await setDoc(doc(db,"salons",S.user.uid), data); await setDoc(doc(db,"salons",S.user.uid,"private","contacts"), { barbers: contacts }); }catch(err){ console.error(err); UI.err = t("save_fail"); UI.busy=false; render(); return; }
    UI.busy=false; startOwner(S.user.uid); },
  day:v=>{ const o = editTarget(); const d=Number(v), i=o.days.indexOf(d); if (i>=0) o.days.splice(i,1); else o.days.push(d); render(); if (o===S.salon) queueSave(); },
  sugg:v=>{ const o = editTarget(); const [n,p,d]=v.split("|"); o.services.push({id:uid(),name:n,price:Number(p),dur:Number(d)}); UI.err=""; render(); if (o===S.salon) queueSave(); },
  addSvc:()=>{ const o = editTarget(); o.services.push({id:uid(),name:"",price:"",dur:30}); render(); },
  delSvc:v=>{ const o = editTarget(); o.services=o.services.filter(s=>s.id!==v); render(); if (o===S.salon) queueSave(); },
  count:v=>{ const o = editTarget(); const n=Number(v); while(o.barbers.length<n) o.barbers.push({id:uid(),name:"",spec:"",photo:""}); if (o.barbers.length>n) o.barbers=o.barbers.slice(0,n); render(); if (o===S.salon) queueSave(); },
  addBarber:()=>{ const o = editTarget(); o.barbers.push({id:uid(),name:"",spec:"",photo:""}); render(); },
  delBarber:v=>{ const o = editTarget(); o.barbers=o.barbers.filter(b=>b.id!==v); render(); if (o===S.salon) queueSave(); },
  done:v=>{ updateDoc(doc(db,"salons",S.sid,"bookings",v),{status:"done"}).catch(()=>toast(t("save_fail"))); },
  cancelBk:async v=>{ const k = S.bookings.find(x=>x.id===v); if (!k) return;
    try{ await updateDoc(doc(db,"salons",S.sid,"bookings",v),{status:"cancelled"}); await updateDoc(doc(db,"salons",S.sid,"days",k.date),{["slots."+slotKey(k.barberId,k.time)]:deleteField()}).catch(()=>{}); }catch(e){ toast(t("save_fail")); } },
  bSvc:v=>go(()=>{ UI.book.svc=v; UI.book.time=null; if (CUSTOMER_SID) loadDay(UI.book.date); }),
  bBarber:v=>go(()=>{ UI.book.barber=v; UI.book.time=null; }),
  bDate:v=>go(()=>{ UI.book.date=v; UI.book.time=null; if (CUSTOMER_SID) loadDay(v); }),
  bTime:v=>go(()=>{ UI.book.time=v; UI.err=""; }),
  confirm: async ()=>{ const B = UI.book; const salon = CUSTOMER_SID ? C.salon : S.salon, sid = CUSTOMER_SID || S.sid;
    if (!B.svc||!B.time){ UI.err = t("pick_time"); render(); return; }
    if (!(B.name||"").trim() || digits(B.phone).length!==10){ UI.err = t("need_details"); render(); return; }
    const em = (B.email||"").trim().toLowerCase(); if (em && !isEmail(em)){ UI.err = t("bad_email"); render(); return; }
    const map = CUSTOMER_SID ? (C.days[B.date]||{}) : ownerSlotsMap(B.date);
    const slot = (freeSlots(salon,B.date,B.svc,B.barber||"any",map)||[]).find(s=>s.time===B.time);
    if (!slot){ UI.err = t("taken"); render(); return; }
    const k = { date:B.date, time:B.time, serviceId:B.svc, barberId:slot.barberId, cust:B.name.trim().slice(0,60), phone:digits(B.phone), status:"booked", created:Date.now(), src: CUSTOMER_SID?"online":"walkin" };
    if (em) k.email = em.slice(0,100);
    UI.busy=true; UI.err=""; render();
    try{ await createBooking(sid, salon, k); UI.bookedData = k; if (CUSTOMER_SID){ delete C.days[B.date]; } window.scrollTo(0,0); }
    catch(e){ console.error(e); UI.err = e.message==="taken" ? t("taken") : t("save_fail"); if (CUSTOMER_SID){ delete C.days[B.date]; loadDay(B.date); } }
    UI.busy=false; render(); },
  bookAgain:()=>go(()=>{ const keep = CUSTOMER_SID ? {name:UI.book.name, phone:UI.book.phone, email:UI.book.email} : {}; UI.bookedData=null; UI.book=keep; if (CUSTOMER_SID) loadDay(ymd(new Date())); }),
  pickBarber:v=>go(()=>{ UI.barberId=v; }),
  sendDay:v=>{ const td = ymd(new Date()); let sd = {date:td, ids:[]}; try{ const x = JSON.parse(localStorage.getItem("ss_sent")||"null"); if (x && x.date===td) sd = x; }catch(e){}
    if (UI.sentDay && UI.sentDay.date===td) sd = UI.sentDay; if (!sd.ids.includes(v)) sd.ids.push(v); UI.sentDay = sd; try{ localStorage.setItem("ss_sent", JSON.stringify(sd)); }catch(e){} setTimeout(render, 400); },
  resetSent:()=>go(()=>{ UI.sentDay = {date:ymd(new Date()), ids:[]}; try{ localStorage.removeItem("ss_sent"); }catch(e){} }),
  openBarber:v=>go(()=>{ pushNav(); UI.barberId=v; UI.tab="barber"; window.scrollTo(0,0); }),
  remSent:v=>{ markReminded(v); updateDoc(doc(db,"salons",S.sid,"bookings",v),{reminded:true}).catch(()=>{}); setTimeout(checkReminders,300); },
  remLater:v=>{ markReminded(v); checkReminders(); },
  reload:()=>{ location.reload(); },
  planPick:v=>go(()=>{ UI.planPick=v; UI.err=""; }),
  copy:v=>{ try{ navigator.clipboard.writeText(v).then(()=>toast(t("copied")),()=>toast(v)); }catch(e){ toast(v); } },
  paid: async ()=>{ const u=(UI.utr||"").trim(); if (u.length<6){ UI.err = t("utr"); render(); return; }
    UI.busy=true; render();
    try{ await updateDoc(doc(db,"salons",S.sid),{ payReq:{ plan:UI.planPick, utr:u.slice(0,40), at:Date.now() } }); UI.utr=""; UI.err=""; }catch(e){ UI.err=t("save_fail"); }
    UI.busy=false; render(); },
  admApprove: async id=>{ const x = S.allSalons.find(s=>s.id===id); if (!x||!x.payReq) return; const pl = PLANS[x.payReq.plan];
    const base = Math.max(Date.now(), (x.sub||{}).expires||0), till = base + pl.days*DAY;
    try{ await updateDoc(doc(db,"salons",id),{ "sub.plan":x.payReq.plan, "sub.expires":till, active:true, payReq:deleteField(), payments:arrayUnion({plan:x.payReq.plan, amt:pl.price, utr:x.payReq.utr, at:Date.now(), till}) }); toast(t("approved")); }catch(e){ console.error(e); toast(t("save_fail")); } },
  admReject: async id=>{ try{ await updateDoc(doc(db,"salons",id),{ payReq:deleteField() }); toast(t("rejected")); }catch(e){ toast(t("save_fail")); } },
  admToggle: async id=>{ const x = S.allSalons.find(s=>s.id===id); try{ await updateDoc(doc(db,"salons",id),{ active: x.active===false }); toast(t("switched")); }catch(e){ toast(t("save_fail")); } },
  admAdjust: async v=>{ const [id, ds] = v.split("|"); const d = Number(ds); const x = S.allSalons.find(s=>s.id===id); if (!x) return;
    const cur = (x.sub||{}).expires||0; const base = d>0 ? Math.max(Date.now(), cur) : cur;
    const next = Math.max(0, base + d*DAY);
    try{ await updateDoc(doc(db,"salons",id),{ "sub.expires": next }); toast(t("adj_done",{date:longDate(next)})); }catch(e){ toast(t("save_fail")); } },
  admCsv: ()=>{
    const cell = v => { const x = String(v==null?"":v).replace(/\r?\n/g," ").trim(); return /[",;]/.test(x) ? '"'+x.replace(/"/g,'""')+'"' : x; };
    const head = ["Salon name","Owner","WhatsApp","Email","Address","Area / city","Google Maps link","Status","Plan","Plan ends","Joined","Total paid (Rs)","Barbers","Booking link"];
    const rows = (S.allSalons||[]).slice().sort((a,b)=>(a.createdAt||0)-(b.createdAt||0)).map(x=>{ const i = subInfo(x);
      return [x.name, x.owner, x.phone, x.ownerEmail, x.address, x.area, x.mapLink,
        !i.on?"OFF":i.active?"Active":"Ended", (x.sub&&x.sub.plan)||"Trial",
        i.expires?new Date(i.expires).toISOString().slice(0,10):"", x.createdAt?new Date(x.createdAt).toISOString().slice(0,10):"",
        (x.payments||[]).reduce((a,p)=>a+(Number(p.amt)||0),0), (x.barbers||[]).length, linkFor(x.id)].map(cell).join(","); });
    const blob = new Blob(["\ufeff"+[head.join(",")].concat(rows).join("\r\n")], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "salonslot-salons-"+ymd(new Date())+".csv"; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},1000);
    toast(t("csv_done",{n:rows.length})); },
  admDownload: async ()=>{ UI.busy=true; render();
    try{ const out = [];
      for (const x of S.allSalons){ const bs = await getDocs(collection(db,"salons",x.id,"bookings")); out.push({...x, bookings: bs.docs.map(d=>({id:d.id,...d.data()}))}); }
      const blob = new Blob([JSON.stringify({exported:new Date().toISOString(), salons:out},null,2)],{type:"application/json"});
      const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "salonslot-backup-"+ymd(new Date())+".json"; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},1000);
    }catch(e){ console.error(e); toast(t("save_fail")); }
    UI.busy=false; render(); }
};

app.addEventListener("click", e => { const el = e.target.closest("[data-a]"); if (!el || el.disabled) return; const f = A[el.dataset.a]; if (f){ if (el.tagName!=="A") e.preventDefault(); f(el.dataset.v); } });
app.addEventListener("input", e => { const el = e.target, d = el.dataset; const o = editTarget();
  if (d.salon && o){ o[d.salon] = el.value; if (o===S.salon) queueSave(); }
  else if (d.svc && o){ const s = o.services.find(x=>x.id===d.svc); if (s){ s[d.k] = el.value; if (o===S.salon) queueSave(); } }
  else if (d.bar && o){ const b = o.barbers.find(x=>x.id===d.bar); if (b){ b[d.k] = el.value; if (o===S.salon) queueSave(); } }
  else if (d.bc){ const c = contactsOf(); c[d.bc] = {...(c[d.bc]||{}), [d.k]: el.value}; if (UI.view==="main") queueSave(); }
  else if (d.book){ UI.book[d.book] = el.value; }
  else if (d.ui){ UI[d.ui] = el.value; }
});
app.addEventListener("change", e => { const el = e.target; const o = editTarget();
  if (el.dataset.svc && el.tagName==="SELECT" && o){ const s = o.services.find(x=>x.id===el.dataset.svc); if (s){ s.dur = Number(el.value); if (o===S.salon) queueSave(); } }
  if (el.dataset.photo && el.files && el.files[0] && o){ const id = el.dataset.photo; const fr = new FileReader();
    fr.onload = () => { const img = new Image(); img.onload = () => { const c = document.createElement("canvas"), z = 220, m = Math.min(img.width,img.height);
      c.width = c.height = z; c.getContext("2d").drawImage(img,(img.width-m)/2,(img.height-m)/2,m,m,0,0,z,z);
      const b = o.barbers.find(x=>x.id===id); if (b){ b.photo = c.toDataURL("image/jpeg",0.72); render(); if (o===S.salon) queueSave(); } }; img.src = fr.result; };
    fr.readAsDataURL(el.files[0]); }
});

/* ================= owner boot ================= */
function stopOwner(){ S.unsub.forEach(f=>{try{f()}catch(e){}}); S.unsub=[]; if (S.adminUnsub){ S.adminUnsub(); S.adminUnsub=null; } S.salon=null; S.bookings=[]; S.allSalons=null; S.contacts={}; }
function startOwner(sid){
  S.sid = sid; S.firstSnap = true;
  S.unsub.push(onSnapshot(doc(db,"salons",sid), d => {
    if (!d.exists()){ if (UI.view!=="setup" && UI.view!=="adminOnly"){ D = { name:"", owner:S.user.displayName||"", phone:"", address:"", mapLink:"", area:"", open:"10:00", close:"21:00", days:[0,1,2,3,4,5,6], services:[], barbers:[] }; UI.view="setup"; UI.step=1; render(); } return; }
    const fresh = {id:d.id, ...d.data()};
    if (S.salon && (saveTimer || document.activeElement && document.activeElement.closest && document.activeElement.closest("[data-salon],[data-svc],[data-bar]"))){
      // keep local edits, take server-owned fields
      S.salon.sub = fresh.sub; S.salon.active = fresh.active; S.salon.payReq = fresh.payReq; S.salon.payments = fresh.payments;
    } else S.salon = fresh;
    if (UI.view!=="main"){ UI.view="main"; UI.tab="home"; }
    if (!(document.activeElement && document.activeElement.matches && document.activeElement.matches("input,select,textarea"))) render();
  }, err => { console.error(err); }));
  S.unsub.push(onSnapshot(doc(db,"salons",sid,"private","contacts"), d => {
    if (saveTimer) return; S.contacts = d.exists() ? (d.data().barbers||{}) : {};
    if (UI.view==="main" && !(document.activeElement && document.activeElement.matches && document.activeElement.matches("input,select,textarea"))) render();
  }, err => console.error(err)));
  const since = ymd(new Date(Date.now()-DAY));
  S.unsub.push(onSnapshot(query(collection(db,"salons",sid,"bookings"), where("date",">=",since)), snap => {
    if (!S.firstSnap) snap.docChanges().forEach(ch=>{ if (ch.type==="added"){ const k = ch.doc.data(); if (k.src==="online"){ beep(); toast(t("new_bk",{name:k.cust,time:dayLabel(k.date)+" "+nice(k.time)})); } } });
    S.firstSnap = false; S.bookings = snap.docs.map(d=>({id:d.id,...d.data()})); setTimeout(checkReminders,0);
    if (UI.view==="main" && !(document.activeElement && document.activeElement.matches && document.activeElement.matches("input,select,textarea"))) render();
  }, err => console.error(err)));
}

/* ================= reminders ================= */
const remDone = new Set(); try{ JSON.parse(localStorage.getItem("ss_rem")||"[]").forEach(x=>remDone.add(x)); }catch(e){}
function markReminded(id){ remDone.add(id); try{ localStorage.setItem("ss_rem", JSON.stringify([...remDone].slice(-300))); }catch(e){} }
const overlay = document.createElement("div"); overlay.id="overlay"; document.body.appendChild(overlay);
overlay.addEventListener("click", e => { const el = e.target.closest("[data-a]"); if (!el) return; const f = A[el.dataset.a]; if (f){ if (el.tagName!=="A") e.preventDefault(); f(el.dataset.v); } });
let remShown = null;
function checkReminders(){
  const box = document.getElementById("remBox");
  if (CUSTOMER_SID || !S.salon || UI.view!=="main"){ if (box) box.remove(); return; }
  const now = new Date(), td = ymd(now), nowM = now.getHours()*60+now.getMinutes();
  const due = S.bookings.filter(k=>k.date===td && k.status==="booked" && !k.reminded && !remDone.has(k.id) && toMin(k.time)-nowM<=20 && toMin(k.time)-nowM>=0)
    .sort((a,b)=>a.time.localeCompare(b.time))[0];
  if (!due){ if (box) box.remove(); remShown=null; return; }
  const n = toMin(due.time)-nowM, svc = svcOf(S.salon,due.serviceId)||{name:""}, b = barberOf(S.salon,due.barberId)||{name:""};
  const msg = t("rem_msg",{name:due.cust, svc:svc.name, salon:S.salon.name, time:nice(due.time), n}) + "\n🗺️ " + mapUrl(S.salon);
  const html = `<div id="remBox" class="rembox" role="alertdialog" aria-live="assertive"><p class="label">⏰ ${t("rem_h",{n})}</p>
    <b>${esc(due.cust)} · ${nice(due.time)}</b><span class="small">${esc(svc.name)} · ${esc(b.name)} · ${esc(due.phone)}</span>
    <div class="row"><a class="btn saffron sm" data-a="remSent" data-v="${due.id}" href="${waLink(due.phone,msg)}" target="_blank" rel="noopener">${t("rem_send")}</a><button class="btn sm" data-a="remLater" data-v="${due.id}">${t("rem_later")}</button></div></div>`;
  if (box) box.outerHTML = html; else overlay.insertAdjacentHTML("beforeend", html);
  if (remShown!==due.id){ remShown = due.id; beep(); setTimeout(beep,700); try{ navigator.vibrate && navigator.vibrate([200,100,200]); }catch(e){} }
}
setInterval(checkReminders, 30000);

/* ================= new version ================= */
async function checkVersion(){
  try{ const r = await fetch("version.json?t="+Date.now(), {cache:"no-store"}); if (!r.ok) return; const j = await r.json();
    if (j.v && j.v!==APP_VERSION && !document.getElementById("verBox"))
      overlay.insertAdjacentHTML("afterbegin", `<div id="verBox" class="verbox" role="status"><span>${t("new_ver")}</span><button class="btn sm saffron" data-a="reload">${t("new_ver_btn")}</button></div>`);
  }catch(e){}
}
setInterval(checkVersion, 5*60*1000);
document.addEventListener("visibilitychange", ()=>{ if (document.visibilityState==="visible"){ checkVersion(); checkReminders(); } });
setTimeout(checkVersion, 8000);
// only the admin stays on the test version; everyone else is sent to the main link
function betaGate(){ if (!IS_BETA) return; if (S.user && !isAdmin()) { location.replace(MAIN_URL()); return; }
  if (isAdmin() && !document.querySelector(".betabar")) overlay.insertAdjacentHTML("afterbegin", `<div class="betabar">${t("beta")}</div>`); }

/* ================= start ================= */
if (CUSTOMER_SID){ render(); initCustomer().then(()=>loadDay(ymd(new Date()))); }
else {
  render();
  getRedirectResult(auth).catch(()=>{ UI.err = t("signin_fail"); });
  onAuthStateChanged(auth, u => { stopOwner(); S.user = u; betaGate();
    if (!u){ UI.view="login"; UI.busy=false; render(); return; }
    UI.view="loading"; render(); startOwner(u.uid); if (isAdmin()) watchAdmin(); });
}
