import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc, updateDoc, collection, query, where, onSnapshot, runTransaction, deleteField, getDocs, arrayUnion, writeBatch, collectionGroup, deleteDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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
const APP_VERSION = "2026.10.30-5";
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
  signin:"Sign in with Google", signin_note:"Open this page in Chrome to sign in. Sign-in doesn't work inside WhatsApp or Instagram.", free_trial:"Welcome offer: 10 days free. No card needed.",
  signin_fail:"Sign-in didn't finish. Open the link in Chrome and try again.",
  step:"Step", of:"of", next:"Next", back:"Back", finish:"Start my salon",
  s1_h:"Your salon", salon_name:"Salon name", owner_name:"Owner name", phone:"WhatsApp number", area:"Area / city", optional:"optional",
  s2_h:"Opening hours", opens:"Opens at", closes:"Closes at", open_days:"Open on",
  s3_h:"Services and prices", s3_p:"Tap a suggestion to add it, or type your own.", svc_name:"Service", price:"Price ₹", mins:"Minutes", add_service:"Add service",
  s4_h:"Your barbers", s4_p:"Add a photo, name and speciality for each barber. Customers see these when they book.", how_many:"How many barbers?",
  g_for:"For", g_all:"Everyone", g_m:"Men", g_f:"Women", g_serves:"Works on", g_both:"Both", g_head_all:"For everyone", g_head_m:"Men", g_head_f:"Women",
  g_nobody:"No barber here works on {who}. Customers will not find a time for this service.", g_note:"Family salon? Mark which services are for men or women, and whom each barber works on. Customers then see only the right barbers.",
  barber_name:"Name", speciality:"Speciality", spec_ph:"e.g. Beard expert, Hair colour", add_barber:"Add barber", tap_photo:"Tap the circle to add a photo",
  s5_h:"You're ready", s5_p:"Your free trial starts now, and a welcome gift is waiting for you in Rewards. Share your booking link and start taking bookings.",
  leave_h:"Leave", leave_p:"Tap the days this barber won't come. Customers can't book them on those days.", on_leave:"On leave", leave_warn:"This barber already has {n} booking(s) on leave days. Move them:", barber_off:"{name} is on leave on {date}. Please pick another barber.", leave_saved:"Leave saved",
  nav_calendar:"Calendar", cal_h:"Calendar", cal_p:"Tap any day to see who came. Totals are for the whole month.", cal_total:"Bookings", cal_done:"Done", cal_cancel:"Cancelled", cal_earn:"Earned (done)",
  cal_by_barber:"By barber this month", cal_now:"This month", cal_none:"No bookings this day.", cal_pick:"Tap a day to see its bookings.",
  tl_h:"Day timeline", tl_p:"Tap an empty space to add a booking there. Tap a booking to add work or change its time.",
  sh_extend:"+ Add work", sh_move:"Change time", sh_close:"Close", sh_add_svc:"Add a service", sh_search:"Search a service", sh_none:"No service matches. Try a shorter word.", sh_add_min:"Or just add time", sh_mins:"+{n} min",
  cf_h:"This runs into {name}'s booking at {time}.", cf_other:"Give {name} to {barber}", cf_other_none:"No other barber is free at that time.",
  cf_shift:"Move {name} to {time}", cf_shift_none:"Can't push it back: the time after is also booked. Use Change time.", cf_keep:"Keep both as they are",
  mv_date:"New day", mv_barber:"Barber", mv_time:"New time", mv_go:"Move to {time}", mv_none:"No free time this day.",
  moved_msg:"Hi {name}, your booking at {salon} is now on {date} at {time}. Sorry for the change, see you!", moved_done:"Booking moved. Let the customer know:", send_wa:"Send on WhatsApp",
  ext_done:"Time updated", sel_slot:"Your slot",
  bill_h:"Bill", bill_p:"Prices come from your services. Change them if you charged differently.", bill_add:"Add to bill", bill_disc:"Discount (₹)", bill_pay:"Paid by", pay_cash:"Cash", pay_upi:"UPI", bill_total:"Total",
  bill_send:"Done + send bill on WhatsApp", bill_later:"Just mark done (bill later)", bill_resave_send:"Save and send again", bill_resave:"Save changes", bill_resend:"Send bill again", bill_make:"Send bill", bill_edit:"Edit bill",
  bill_no:"Bill #{n}", bill_sent_n:"Sent {n} times", bill_sent1:"Sent once", bill_not_sent:"Not sent yet", bill_sent:"Bill ready. Press Send in WhatsApp.", bill_saved:"Saved", bill_empty:"Add at least one service", bill_edit_note:"If you change the amount after sending, the bill is marked as revised.", bill_rm:"Remove",
  nav_rewards:"Rewards", rw_h:"Rewards", rw_p:"Scratch cards and offers for your salon.", rw_new:"New for you", rw_scratch:"Scratch here", rw_scratch_hint:"Rub with your finger",
  rw_tap:"Tap to open", rw_mine:"Your rewards", rw_added:"{n} days added to your plan", rw_open:"Open offer", rw_none:"No new cards right now. New offers will show up here.",
  rw_home:"A scratch card is waiting for you", rw_home_n:"{n} scratch cards are waiting for you", rw_open_btn:"Open", rw_ends:"Till {date}", rw_fail:"Couldn't open the card. Check the internet and try again.",
  rw_got:"Got on {date}", rw_gift:"Your gift", rw_partner:"Partner offers", rw_code:"Code", rw_free:"FREE", rw_preview:"Preview", rw_preview_p:"Only you see this. Nothing is added to any salon.",
  adm_rw_h:"Rewards and offers", adm_rw_p:"Scratch cards that salons see in their Rewards tab. A free-days card adds days to their plan by itself. A partner offer shows a brand's code and link.",
  adm_rw_new:"New offer", of_kind:"Type", of_days_k:"Free days (scratch card)", of_deal_k:"Partner / brand offer", of_title:"Title (on the card)", of_desc:"Short line",
  of_days:"Days to add", of_reveal:"Big text after scratch", of_note:"Line after scratch", of_brand:"Brand name", of_code:"Coupon code", of_link:"Offer link",
  of_ends:"Last day", of_newonly:"Only salons that join from now on", of_save:"Create offer", of_need:"Add a title. A free-days card needs 1 to 30 days. A link must start with https://",
  of_claims:"{n} opened", of_clicks:"{n} clicked", of_del:"Delete", of_del_sure:"Yes, delete", of_new_pill:"New salons only", of_all_pill:"All salons",
  of_make_all:"Show to all salons", of_make_new:"Only new salons", of_created:"Offer created", of_none:"No offers yet.",
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
  confirm_bk:"Confirm booking", closed_day:"The salon is closed this day.", no_slots:"No free times left this day. Try another day.", pick_svc_first:"Choose a service first (step 1)", svc_desc:"Short description", svc_desc_ph:"e.g. Includes wash, massage and blow-dry", move_up:"Move up", move_down:"Move down", min:"min", no_services:"This salon hasn't added services yet. Please call or WhatsApp the salon.",
  need_details:"Enter a name and a 10-digit mobile number.", taken:"Someone just booked that time. Please pick another.",
  booked_h:"Booking confirmed", booked_p:"{svc} with {barber} on {date} at {time}.", book_another:"Make another booking",
  tell_salon:"Send booking to salon on WhatsApp", tell_salon_p:"Tap to let the salon know on WhatsApp too.",
  msgs_h:"Messages for this booking", send_cust:"Send to customer", send_barber:"Send to barber",
  bk_closed_h:"Online booking is paused", bk_closed_p:"Please call or WhatsApp the salon to book.",
  nf_h:"Salon not found", nf_p:"This booking link isn't right. Ask the salon for its link again.",
  barber_h:"Barber view", barber_p:"Pick a barber to see their bookings. Send each one on WhatsApp.", your_day:"Bookings",
  plan_h:"Your plan", status:"Status", active:"Active", trial:"Free trial", ends:"Ends on", ended:"Ended",
  choose_plan:"Choose a plan", monthly:"Monthly", halfyearly:"6 months", yearly:"Yearly", per_month:"per month", per_half:"for 6 months", per_year:"per year", save:"Save ₹989", save_half:"Save ₹295",
  pay_h:"Pay with Google Pay or any UPI app", pay_steps:"Two ways: scan this QR from another phone with GPay, PhonePe or Paytm, or tap Copy, open GPay → \"Pay UPI ID or number\" → paste the UPI ID. Type the amount yourself.", pay_amt:"Amount to pay: ₹{amt}", upi_id:"UPI ID",
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
  lead_h:"Leads from the salon check", lead_p:"Every salon owner who filled in the salon check form, newest first.", lead_none:"No leads yet. Open the salon check at a salon and fill in the form.", lead_csv:"Download leads (Excel)", lead_today:"Today", lead_total:"Total", lead_picks:"Problems picked", lead_loss:"Loss they entered", lead_rules:"Leads can’t load. Publish the new Firestore rules in Firebase first.", lead_msg:"Hi {name}, this is Arjun from SalonSlot. Nice meeting you at {salon} today! Here is the demo: {link}", lead_more:"+ {n} more in the Excel download", lead_mo:"month", lead_areas:"Leads by area",
  adj_days:"Change days", days:"days", adj_done:"Now ends on {date}", csv_h:"Salon list (Excel / Google Sheets)", csv_p:"Name, owner, WhatsApp, email, address, Maps link, plan and end date for every salon, in one sheet. Opens in Excel, Google Sheets or Numbers.", csv_btn:"Download salon list", csv_done:"{n} salons saved", booked_by:"Online booking by", approved:"Approved", rejected:"Payment request removed", switched:"Updated",
  dw:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"], mon:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
  sugg:[["Haircut",200,30],["Beard trim",100,30],["Shave",80,30],["Hair colour",600,60],["Facial",800,60],["Head massage",250,30],["Hair spa",900,60],["Kids haircut",150,30],["Threading",50,10],["Upper lip",30,10],["Eyebrow shaping",80,20],["Clean-up",400,45]]
 },
 hi:{
  tagline:"सैलून बुकिंग, आसान",
  welcome_h:"अपने सैलून की सारी बुकिंग एक फ़ोन से चलाइए",
  welcome_p:"ग्राहक आपका link खोलकर barber, service और time चुनता है। Booking आते ही आपको दिख जाती है।",
  signin:"Google से login करें", signin_note:"Login के लिए ये page Chrome में खोलें। WhatsApp या Instagram के अंदर login नहीं होता।", free_trial:"Welcome offer: 10 दिन FREE. कोई card नहीं चाहिए।",
  signin_fail:"Login पूरा नहीं हुआ। Link को Chrome में खोलकर फिर कोशिश करें।",
  step:"Step", of:"/", next:"आगे", back:"पीछे", finish:"सैलून चालू करो",
  s1_h:"आपका सैलून", salon_name:"सैलून का नाम", owner_name:"मालिक का नाम", phone:"WhatsApp नंबर", area:"एरिया / शहर", optional:"ज़रूरी नहीं",
  s2_h:"खुलने का समय", opens:"खुलता है", closes:"बंद होता है", open_days:"किन दिनों खुला है",
  s3_h:"Services और दाम", s3_p:"Suggestion पर tap करके जोड़ें, या खुद लिखें।", svc_name:"Service", price:"दाम ₹", mins:"मिनट", add_service:"Service जोड़ें",
  s4_h:"आपके barbers", s4_p:"हर barber की photo, नाम और speciality डालें। Booking करते वक़्त ग्राहक को ये दिखेगा।", how_many:"कितने barbers हैं?",
  g_for:"किसके लिए", g_all:"सबके लिए", g_m:"पुरुष", g_f:"महिला", g_serves:"किसका काम करते हैं", g_both:"दोनों", g_head_all:"सबके लिए", g_head_m:"पुरुष (Gents)", g_head_f:"महिला (Ladies)",
  g_nobody:"कोई barber {who} का काम नहीं करता, इसलिए customer को इस service का कोई समय नहीं मिलेगा।", g_note:"Family सैलून है? बताइए कौन-सी service पुरुष या महिला की है, और कौन barber किसका काम करता है। Customer को सिर्फ़ सही barber दिखेंगे।",
  barber_name:"नाम", speciality:"Speciality", spec_ph:"जैसे Beard expert, Hair colour", add_barber:"Barber जोड़ें", tap_photo:"Photo लगाने के लिए गोले पर tap करें",
  s5_h:"सब तैयार है", s5_p:"आपका free trial अभी शुरू हो गया, और Rewards में आपके लिए एक Welcome Gift रखा है। Booking link share करें और bookings लेना शुरू करें।",
  leave_h:"छुट्टी", leave_p:"जिन दिनों ये barber नहीं आएगा, उन पर tap करें। उन दिनों customers इसके साथ booking नहीं कर पाएँगे।", on_leave:"छुट्टी पर", leave_warn:"छुट्टी वाले दिनों में इस barber की {n} booking पहले से हैं। इन्हें दूसरे समय या barber पर करें:", barber_off:"{name} {date} को छुट्टी पर है। कोई दूसरा barber चुनें।", leave_saved:"छुट्टी save हो गई",
  nav_calendar:"Calendar", cal_h:"Calendar", cal_p:"किसी भी दिन पर tap करें और देखें कौन आया। ऊपर पूरे महीने का हिसाब है।", cal_total:"Bookings", cal_done:"Done", cal_cancel:"Cancel हुईं", cal_earn:"कमाई (done)",
  cal_by_barber:"इस महीने barber के हिसाब से", cal_now:"इस महीने पर जाएं", cal_none:"इस दिन कोई booking नहीं।", cal_pick:"Bookings देखने के लिए किसी दिन पर tap करें।",
  tl_h:"दिन की timeline", tl_p:"ख़ाली जगह पर tap करें तो वहीं booking जुड़ेगी। किसी booking पर tap करके काम जोड़ें या समय बदलें।",
  sh_extend:"+ काम जोड़ें", sh_move:"समय बदलें", sh_close:"बंद करें", sh_add_svc:"Service जोड़ें", sh_search:"Service ढूँढें", sh_none:"ऐसी कोई service नहीं मिली। छोटा शब्द लिखकर देखें।", sh_add_min:"या सिर्फ़ समय बढ़ाएं", sh_mins:"+{n} मिनट",
  cf_h:"इससे {name} की {time} वाली booking से टकराव होगा।", cf_other:"{name} को {barber} के पास भेजें", cf_other_none:"उस समय कोई दूसरा barber ख़ाली नहीं है।",
  cf_shift:"{name} को {time} पर करें", cf_shift_none:"आगे नहीं खिसक सकता, उसके बाद भी booking है। \"समय बदलें\" से करें।", cf_keep:"दोनों को ऐसे ही रहने दें",
  mv_date:"नया दिन", mv_barber:"Barber", mv_time:"नया समय", mv_go:"{time} पर करें", mv_none:"इस दिन कोई समय ख़ाली नहीं।",
  moved_msg:"नमस्ते {name}, {salon} में आपकी booking अब {date} को {time} बजे है। बदलाव के लिए माफ़ी, मिलते हैं!", moved_done:"Booking का समय बदल गया। Customer को बता दें:", send_wa:"WhatsApp पर भेजें",
  ext_done:"समय बढ़ गया", sel_slot:"आपका slot",
  bill_h:"Bill", bill_p:"दाम आपकी services से भरे हैं। अलग लिया हो तो बदल दें।", bill_add:"Bill में जोड़ें", bill_disc:"Discount (₹)", bill_pay:"Payment", pay_cash:"Cash", pay_upi:"UPI", bill_total:"कुल",
  bill_send:"Done + WhatsApp पर bill भेजें", bill_later:"सिर्फ़ Done (bill बाद में)", bill_resave_send:"Save करके फिर भेजें", bill_resave:"बदलाव save करें", bill_resend:"Bill फिर भेजें", bill_make:"Bill भेजें", bill_edit:"Bill बदलें",
  bill_no:"Bill #{n}", bill_sent_n:"{n} बार भेजा", bill_sent1:"1 बार भेजा", bill_not_sent:"अभी नहीं भेजा", bill_sent:"Bill तैयार, WhatsApp में Send दबाएँ", bill_saved:"Save हो गया", bill_empty:"कम से कम एक service जोड़ें", bill_edit_note:"भेजने के बाद रकम बदली तो bill पर “बदला हुआ” लिखा जाएगा।", bill_rm:"हटाएँ",
  nav_rewards:"Rewards", rw_h:"Rewards", rw_p:"आपके सैलून के लिए scratch cards और offers।", rw_new:"आपके लिए नया", rw_scratch:"यहाँ scratch करें", rw_scratch_hint:"उँगली से घिसें",
  rw_tap:"Tap करके खोलें", rw_mine:"आपको मिले rewards", rw_added:"आपके plan में {n} दिन जुड़ गए", rw_open:"Offer खोलें", rw_none:"अभी कोई नया card नहीं है। नए offers यहीं दिखेंगे।",
  rw_home:"आपके लिए एक scratch card है", rw_home_n:"आपके लिए {n} scratch cards हैं", rw_open_btn:"खोलें", rw_ends:"{date} तक", rw_fail:"Card नहीं खुला। Internet check करके फिर कोशिश करें।",
  rw_got:"{date} को मिला", rw_gift:"आपका gift", rw_partner:"Partner offers", rw_code:"Code", rw_free:"FREE", rw_preview:"Preview", rw_preview_p:"ये सिर्फ़ आपको दिख रहा है। किसी सैलून में कुछ नहीं जुड़ेगा।",
  adm_rw_h:"Rewards और offers", adm_rw_p:"सैलून के Rewards tab में दिखने वाले scratch cards। Free-days वाले card से plan में दिन अपने आप जुड़ जाते हैं। Partner offer में brand का code और link दिखता है।",
  adm_rw_new:"नया offer", of_kind:"Type", of_days_k:"Free दिन (scratch card)", of_deal_k:"Partner / brand offer", of_title:"Title (card पर)", of_desc:"छोटी line",
  of_days:"कितने दिन जुड़ें", of_reveal:"Scratch के बाद बड़ा text", of_note:"Scratch के बाद की line", of_brand:"Brand का नाम", of_code:"Coupon code", of_link:"Offer link",
  of_ends:"आख़िरी दिन", of_newonly:"सिर्फ़ अब से जुड़ने वाले सैलून", of_save:"Offer बनाएं", of_need:"Title डालें। Free-days card में 1 से 30 दिन डालें। Link https:// से शुरू होना चाहिए।",
  of_claims:"{n} ने खोला", of_clicks:"{n} ने click किया", of_del:"Delete", of_del_sure:"हाँ, delete करें", of_new_pill:"सिर्फ़ नए सैलून", of_all_pill:"सारे सैलून",
  of_make_all:"सारे सैलून को दिखाएं", of_make_new:"सिर्फ़ नए सैलून", of_created:"Offer बन गया", of_none:"अभी कोई offer नहीं है।",
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
  confirm_bk:"Booking पक्की करें", closed_day:"इस दिन सैलून बंद है।", no_slots:"इस दिन कोई समय खाली नहीं है। दूसरा दिन चुनें।", pick_svc_first:"पहले service चुनें (step 1)", svc_desc:"छोटा description", svc_desc_ph:"जैसे: Wash, massage और blow-dry शामिल", move_up:"ऊपर करें", move_down:"नीचे करें", min:"मिनट", no_services:"इस सैलून ने अभी services नहीं डालीं। सैलून को call या WhatsApp करें।",
  need_details:"नाम और 10 अंकों का मोबाइल नंबर डालें।", taken:"ये समय अभी किसी और ने book कर लिया। दूसरा समय चुनें।",
  booked_h:"Booking पक्की हो गई", booked_p:"{date} को {time} बजे, {barber} के साथ {svc}।", book_another:"एक और booking करें",
  tell_salon:"सैलून को WhatsApp पर booking भेजें", tell_salon_p:"सैलून को WhatsApp पर भी बताने के लिए tap करें।",
  msgs_h:"इस booking के messages", send_cust:"ग्राहक को भेजें", send_barber:"Barber को भेजें",
  bk_closed_h:"Online booking अभी बंद है", bk_closed_p:"Booking के लिए सैलून को call या WhatsApp करें।",
  nf_h:"सैलून नहीं मिला", nf_p:"ये booking link सही नहीं है। सैलून से link दोबारा माँगें।",
  barber_h:"Barber की screen", barber_p:"Barber चुनें और उसकी bookings देखें। हर booking WhatsApp पर भेज सकते हैं।", your_day:"Bookings",
  plan_h:"आपका plan", status:"Status", active:"चालू", trial:"Free trial", ends:"ख़त्म होगा", ended:"ख़त्म",
  choose_plan:"Plan चुनें", monthly:"Monthly", halfyearly:"6 महीने", yearly:"Yearly", per_month:"हर महीना", per_half:"6 महीने के लिए", per_year:"हर साल", save:"₹989 की बचत", save_half:"₹295 की बचत",
  pay_h:"Google Pay या किसी भी UPI app से pay करें", pay_steps:"दो तरीके: दूसरे फ़ोन से GPay, PhonePe या Paytm में ये QR scan करें, या Copy दबाएँ, GPay खोलें → \"UPI ID या नंबर पर pay करें\" → UPI ID paste करें। Amount ख़ुद डालें।", pay_amt:"इतना pay करें: ₹{amt}", upi_id:"UPI ID",
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
  lead_h:"Salon check के leads", lead_p:"Salon check का form भरने वाले सारे सैलून मालिक, नए सबसे ऊपर।", lead_none:"अभी कोई lead नहीं। किसी सैलून पर salon check खोलकर form भरवाइए।", lead_csv:"Leads download करें (Excel)", lead_today:"आज", lead_total:"कुल", lead_picks:"चुनी दिक़्क़तें", lead_loss:"बताया नुकसान", lead_rules:"Leads नहीं खुल रहे। पहले Firebase में नए Firestore rules publish करें।", lead_msg:"नमस्ते {name} जी, मैं Arjun, SalonSlot से। आज {salon} पर आपसे मिलकर अच्छा लगा! Demo यहाँ देखिए: {link}", lead_more:"+ {n} और, Excel download में", lead_mo:"महीना", lead_areas:"इलाके के हिसाब से",
  adj_days:"दिन बदलें", days:"दिन", adj_done:"अब {date} को ख़त्म होगा", csv_h:"सैलून की list (Excel / Google Sheets)", csv_p:"हर सैलून का नाम, मालिक, WhatsApp, email, पता, Maps link, plan और ख़त्म होने की तारीख़, एक ही sheet में। Excel, Google Sheets या Numbers में खुलेगी।", csv_btn:"सैलून की list download करें", csv_done:"{n} सैलून save हो गए", booked_by:"Online booking by", approved:"Approve हो गया", rejected:"Payment request हटा दी", switched:"Update हो गया",
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

const S = { user:null, salon:null, sid:null, bookings:[], loaded:false, unsub:[], firstSnap:true, allSalons:null, offers:null, claims:{}, allClaims:null };
let SENT0 = null; try{ SENT0 = JSON.parse(localStorage.getItem("ss_sent")||"null"); }catch(e){}
const UI = { sentDay: SENT0, view:"loading", step:1, tab:"home", book:{}, bookedId:null, bookedData:null, barberId:null, planPick:"monthly", err:"", busy:false, day:{},
  scratching:null, pendingRender:false, justGot:null, prevDone:{}, ofPreview:null, ofDelAsk:null, ofErr:"", of:null };
const OF0 = () => ({ kind:"days", title:"", desc:"", days:"3", reveal:"", note:"", brand:"", code:"", link:"", ends:"", newOnly:false });
UI.of = OF0();
let D = null; // setup draft

const isAdmin = () => !!(S.user && S.user.email === ADMIN_EMAIL);
const linkFor = sid => location.origin + location.pathname.replace(/index\.html$/,"").replace(/\/beta\/$/,"/") + "?s=" + sid;
function subInfo(s){ s = s || S.salon; if (!s) return {active:false,days:0,kind:"none"};
  const exp = (s.sub&&s.sub.expires)||0, left = exp-Date.now();
  return { on: s.active!==false, active: s.active!==false && left>0, days: Math.max(0,Math.ceil(left/DAY)), kind: s.sub&&s.sub.plan ? "paid":"trial", expires:exp }; }

/* ================= slots ================= */
function busyList(slotsMap){ return Object.entries(slotsMap||{}).map(([k,dur])=>{ const i=k.lastIndexOf("_"); const hh=k.slice(i+1); return { b:k.slice(0,i), start: Number(hh.slice(0,2))*60+Number(hh.slice(2)), dur:Number(dur)||30 }; }); }
function ownerSlotsMap(date){ const m={}; S.bookings.filter(k=>k.date===date && k.status!=="cancelled").forEach(k=>{ m[slotKey(k.barberId,k.time)] = bkDur(S.salon,k); }); return m; }
const svcOf = (s,id) => (s.services||[]).find(x=>x.id===id);
const barberOf = (s,id) => (s.barbers||[]).find(x=>x.id===id);
// a booking's real length and bill include any work added in the chair
const bkDur = (s,k) => Number(k.dur) || Number((svcOf(s,k.serviceId)||{}).dur) || 30;
const bkPrice = (s,k) => [k.serviceId].concat(k.extra||[]).reduce((a,id)=>a+Number((svcOf(s,id)||{}).price||0),0);
const bkNames = (s,k) => [k.serviceId].concat(k.extra||[]).map(id=>(svcOf(s,id)||{}).name).filter(Boolean).join(" + ") || "?";
/* ---- bills: saved on the booking as k.bill = { no, items:[{n,p}], disc, total, pay, at, sent, edited } ---- */
const bkEarn = (s,k) => k.bill && k.bill.total!=null ? Number(k.bill.total)||0 : bkPrice(s,k);
const rs = n => "₹"+(Number(n)||0).toLocaleString("en-IN");
function billDraft(s, k){
  if (k.bill) return { items: (k.bill.items||[]).map(x=>({n:x.n, p:String(x.p)})), disc: k.bill.disc?String(k.bill.disc):"", pay: k.bill.pay||"cash" };
  const items = [k.serviceId].concat(k.extra||[]).map(id=>svcOf(s,id)).filter(Boolean).map(v=>({n:v.name, p:String(Number(v.price)||0)}));
  return { items: items.length ? items : [{n:bkNames(s,k), p:String(bkPrice(s,k))}], disc:"", pay:"cash" };
}
function billSum(d){ const sub = d.items.reduce((a,x)=>a+Math.max(0,Math.round(Number(x.p)||0)),0); const disc = Math.min(sub, Math.max(0,Math.round(Number(d.disc)||0))); return { sub, disc, total: sub-disc }; }
function billText(s, k, bill){
  const hi = LANG==="hi", b = barberOf(s,k.barberId)||{name:""}, addr = fullAddr(s), line = "———————";
  const L = [`*${s.name}*`, `Bill #${bill.no}${bill.edited?(hi?" (बदला हुआ)":" (revised)"):""}`];
  if (addr) L.push((hi?"पता: ":"Address: ")+addr);
  L.push(`${hi?"तारीख़":"Date"}: ${longDate(new Date(k.date+"T00:00").getTime())}, ${nice(k.time)}`, `Customer: ${k.cust}${b.name?" · Barber: "+b.name:""}`, line);
  bill.items.forEach(x=>L.push(`${x.n}: ${rs(x.p)}`));
  if (bill.disc) L.push(`Discount: −${rs(bill.disc)}`);
  L.push(`*${hi?"कुल":"Total"}: ${rs(bill.total)}* · ${bill.pay==="upi"?"UPI":"Cash"}`, line, hi?"धन्यवाद, फिर आइए!":"Thank you, see you again!", `${hi?"अगली booking यहाँ से":"Book your next visit"}: ${linkFor(S.sid)}`);
  return L.join("\n");
}
const billSentLbl = b => !b.sent ? t("bill_not_sent") : b.sent===1 ? t("bill_sent1") : t("bill_sent_n",{n:b.sent});
const hourLbl = m => { const h = Math.floor(m/60)%24; return (h%12||12)+" "+(h>=12?"PM":"AM"); };
const niceRange = (tm, dur) => { const a = nice(tm), b = nice(toHM(toMin(tm)+dur)); return a.slice(-2)===b.slice(-2) ? a.slice(0,-3)+" – "+b : a+" – "+b; };
// family salons: a service can be for men (m) or women (f); a barber can work on men, women or both
const svcFor = v => (v && (v.for==="m"||v.for==="f")) ? v.for : "all";
const barberServes = b => (b && (b.serves==="m"||b.serves==="f")) ? b.serves : "both";
const canDo = (v, b) => { const f = svcFor(v), g = barberServes(b); return f==="all" || g==="both" || f===g; };
const onLeave = (s,bid,date) => ((s.leave||{})[bid]||[]).includes(date);
function isFree(busy, b, start, dur){ return !busy.some(x => x.b===b && start < x.start+x.dur && x.start < start+dur); }
// opt.dur: length to fit (default: the service's), opt.skip: {b,start} a booking to ignore (the one being moved)
function freeSlots(salon, date, svcId, barberPref, slotsMap, opt){
  opt = opt||{}; const svc = svcOf(salon, svcId); if (!svc && !opt.dur) return [];
  const d = new Date(date+"T00:00"); if (!(salon.days||[]).includes(d.getDay())) return null;
  const open = toMin(salon.open||"10:00"), close = toMin(salon.close||"21:00"), dur = opt.dur || Number(svc.dur)||30;
  const now = new Date(); const nowM = date===ymd(now) ? now.getHours()*60+now.getMinutes() : -1;
  const cands = (barberPref && barberPref!=="any" ? salon.barbers.filter(b=>b.id===barberPref) : salon.barbers).filter(b=>!onLeave(salon,b.id,date) && (!svc || canDo(svc,b)));
  const busy = busyList(slotsMap).filter(x=>!(opt.skip && x.b===opt.skip.b && x.start===opt.skip.start)); const out = [];
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
  const svc = {name:bkNames(salon,k), price:bkPrice(salon,k)}, b = barberOf(salon,k.barberId)||{name:""}, when = dayLabel(k.date)+", "+nice(k.time), hi = LANG==="hi";
  return {
    cust: `${hi?"नमस्ते":"Hi"} ${k.cust}! ${hi?"आपकी booking पक्की है":"Your booking is confirmed"}.\n${salon.name}\n${svc.name} · ${b.name}\n${when}\n₹${svc.price}${fullAddr(salon)?"\n"+(hi?"पता: ":"Address: ")+fullAddr(salon):""}\n${hi?"रास्ता":"Map"}: ${mapUrl(salon)}`,
    remind: `Reminder: ${k.cust}, ${nice(k.time)} — ${svc.name} @ ${salon.name}. ${hi?"मिलते हैं!":"See you!"}\n${hi?"रास्ता":"Map"}: ${mapUrl(salon)}`,
    salon: `${hi?"नई booking":"New booking"}\n${k.cust} (${k.phone})\n${svc.name} · ${b.name}\n${when}`,
    barber: `${b.name}, ${hi?"आपकी नई booking":"new booking for you"}: ${k.cust}\n${svc.name} · ${when}`
  };
}
const isEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e||"").trim());
function calLink(salon, k, guests){
  const svc = {name:bkNames(salon,k)}, b = barberOf(salon,k.barberId)||{name:""};
  const s = k.date.replace(/-/g,"")+"T"+k.time.replace(":","")+"00";
  const e = k.date.replace(/-/g,"")+"T"+toHM(toMin(k.time)+bkDur(salon,k)).replace(":","")+"00";
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
  const lines = [`${t("summary_h",{salon:s.name})} · ${dayLabel(date)}`];
  s.barbers.filter(b=>!onlyBarber||b.id===onlyBarber).forEach(b=>{
    const mine = list.filter(k=>k.barberId===b.id);
    lines.push("", `*${b.name}* (${mine.length})`);
    if (!mine.length) lines.push("  "+t("summary_none"));
    mine.forEach(k=>{ lines.push(`  ${niceRange(k.time,bkDur(s,k))} – ${k.cust} · ${bkNames(s,k)}${k.status==="done"?(LANG==="hi"?" (हो गया)":" (done)"):""}`); });
  });
  return lines.join("\n");
}

/* ================= shell ================= */
function topBar(name, sub){
  return `<header class="top"><div class="in"><span class="pole" aria-hidden="true"></span><div class="brand">${esc(name||"SalonSlot")}<small>${esc(sub||t("tagline"))}</small></div><span class="spacer"></span>
  <div class="lang" role="group" aria-label="Language"><button data-a="lang" data-v="hi" class="${LANG==="hi"?"on":""}">हिंदी</button><button data-a="lang" data-v="en" class="${LANG==="en"?"on":""}">EN</button></div></div></header>`;
}
function render(){
  if (UI.scratching){ UI.pendingRender = true; return; } // don't wipe a card while someone is scratching it
  const y = window.scrollY; let html = "";
  if (CUSTOMER_SID){ html = renderCustomer(); }
  else {
    const name = S.salon ? S.salon.name : "SalonSlot", sub = S.salon ? (S.salon.area||t("tagline")) : t("tagline");
    html = topBar(name, sub)+`<main class="t-${UI.view==="main"?UI.tab:UI.view}">`;
    if (UI.view==="loading") html += `<div class="center"><div class="spin" aria-label="${t("loading")}"></div></div>`;
    else if (UI.view==="login") html += viewLogin();
    else if (UI.view==="setup") html += viewSetup();
    else if (UI.view==="adminOnly") html += `<button class="btn sm" data-a="adminBack">← ${t("back")}</button>` + viewAdmin();
    else html += ({home:viewHome, calendar:viewCalendar, book:viewBook, barber:viewBarber, rewards:viewRewards, plan:viewPlan, settings:viewSettings, admin:viewAdmin}[UI.tab]||viewHome)();
    html += "</main>";
    if (UI.view==="main") html += navBar() + viewSheet();
  }
  document.body.classList.toggle("owner", !CUSTOMER_SID && UI.view==="main");
  app.innerHTML = html; window.scrollTo(0,y);
  drawQRs(); initScratch();
}
function navBar(){
  const ic = {
    home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    book:'<circle cx="12" cy="12" r="9"/><path d="M12 8v8M8 12h8"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M7.5 14h2M11 14h2M14.5 14h2M7.5 17.5h2M11 17.5h2"/>',
    barber:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><circle cx="17.5" cy="9" r="2.5"/><path d="M17 14.5c2.4.2 4 1.8 4.6 4.5"/>',
    rewards:'<rect x="3" y="8.5" width="18" height="12.5" rx="1.5"/><path d="M3 12.5h18M12 8.5V21M12 8.5C10.6 5.3 7.2 4.4 6.8 6.4 6.4 8.4 9.8 8.5 12 8.5zm0 0c1.4-3.2 4.8-4.1 5.2-2.1.4 2-3 2.1-5.2 2.1z"/>',
    plan:'<rect x="2.5" y="5.5" width="19" height="13" rx="2"/><path d="M2.5 10h19M6.5 15h4"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2.5 12h3M18.5 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    admin:'<path d="M12 3l8 3v6c0 4.5-3.4 8.2-8 9-4.6-.8-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>'
  };
  const tabs = ["home","calendar","book","rewards","plan","settings"].concat(isAdmin()?["admin"]:[]);
  const fresh = freshOffers().length;
  return `<nav class="nav ${tabs.length>6?"seven":tabs.length>5?"six":""}" aria-label="Main"><div>${tabs.map(k=>
    `<button data-a="tab" data-v="${k}" class="${UI.tab===k?"on":""}" aria-current="${UI.tab===k?"page":"false"}"><span class="ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ic[k]}</svg>${k==="rewards"&&fresh?`<i class="dot" aria-label="${fresh}"></i>`:""}</span>${t("nav_"+k)}</button>`).join("")}</div></nav>`;
}

const brandFoot = () => `<p class="brandfoot">${t("booked_by")} <a href="https://www.instagram.com/salon.slot/" target="_blank" rel="noopener"><b>SalonSlot</b> · @salon.slot</a><br><span>Powered by <a href="https://www.instagram.com/visualzonefilms/" target="_blank" rel="noopener">Visual Zone Films</a></span></p>`;

/* ================= login ================= */
const G_ICON = '<svg viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
function viewLogin(){
  return `<section class="hero"><p class="label">${t("tagline")}</p><h1>${t("welcome_h")}</h1><p>${t("welcome_p")}</p>
    <button class="btn block gbtn" data-a="login" ${UI.busy?"disabled":""}>${G_ICON} ${t("signin")}</button></section>
    ${UI.err?`<div class="banner bad" role="alert">${UI.err}</div>`:""}
    <p class="rule small">${t("free_trial")}</p>
    <p class="small muted" style="text-align:center">${t("signin_note")}</p>
    <div class="card"><p class="label">${t("plan_h")}</p><div class="plans">
      ${["monthly","halfyearly","yearly"].map(p=>`<div class="plan"><span class="label">${t(p)}</span><b>₹${PLANS[p].price.toLocaleString("en-IN")}</b><span class="small muted">${t(p==="monthly"?"per_month":p==="yearly"?"per_year":"per_half")}</span></div>`).join("")}</div></div>${brandFoot()}`;
}

/* ================= editors ================= */
function servicesEditor(o){
  const have = new Set(o.services.map(s=>s.name.toLowerCase()));
  return `<div class="chips">${t("sugg").filter(g=>!have.has(g[0].toLowerCase())).map(g=>`<button class="chip" data-a="sugg" data-v="${esc(g[0])}|${g[1]}|${g[2]}">+ ${esc(g[0])}</button>`).join("")}</div>
  <div class="stack">${o.services.map((s,i)=>`<div class="svcbox"><div class="row" style="justify-content:space-between"><span class="label">${i+1}. ${esc(s.name||t("svc_name"))}</span>
    <span class="row" style="gap:4px"><button class="btn sm ghost" data-a="svcUp" data-v="${s.id}" ${i===0?"disabled":""} aria-label="${t("move_up")}">↑</button><button class="btn sm ghost" data-a="svcDown" data-v="${s.id}" ${i===o.services.length-1?"disabled":""} aria-label="${t("move_down")}">↓</button></span></div>
    <div class="svc">
    <label class="field"><span class="small">${t("svc_name")}</span><input type="text" id="sn_${s.id}" data-svc="${s.id}" data-k="name" value="${esc(s.name)}"></label>
    <label class="field"><span class="small">${t("price")}</span><input type="number" inputmode="numeric" id="sp_${s.id}" data-svc="${s.id}" data-k="price" value="${esc(s.price)}"></label>
    <label class="field"><span class="small">${t("mins")}</span><select id="sd_${s.id}" data-svc="${s.id}" data-k="dur">${[10,15,20,30,45,60,90,120].map(m=>`<option value="${m}" ${Number(s.dur)===m?"selected":""}>${m}</option>`).join("")}</select></label>
    <button class="x" data-a="delSvc" data-v="${s.id}" aria-label="${t("remove")}">×</button></div>
    <label class="field"><span class="small">${t("svc_desc")} <em>(${t("optional")})</em></span><input type="text" maxlength="120" id="sx_${s.id}" data-svc="${s.id}" data-k="desc" value="${esc(s.desc||"")}" placeholder="${t("svc_desc_ph")}"></label>
    <div class="field"><span class="small">${t("g_for")}</span><div class="chips" role="radiogroup" aria-label="${t("g_for")}">${["all","m","f"].map(g=>`<button class="chip ${svcFor(s)===g?"on":""}" role="radio" aria-checked="${svcFor(s)===g}" data-a="svcFor" data-v="${s.id}|${g}">${t("g_"+g)}</button>`).join("")}</div></div>
    ${svcFor(s)!=="all" && o.barbers.some(b=>b.name&&b.name.trim()) && !o.barbers.some(b=>b.name&&b.name.trim()&&canDo(s,b))?`<p class="small" style="color:var(--danger)">⚠️ ${t("g_nobody",{who:t("g_"+svcFor(s))})}</p>`:""}</div>`).join("")}</div>
  <button class="btn" data-a="addSvc">+ ${t("add_service")}</button>`;
}
function barbersEditor(o){
  return `<div class="field"><span>${t("how_many")}</span><div class="chips">${[1,2,3,4,5,6].map(n=>`<button class="chip ${o.barbers.length===n?"on":""}" data-a="count" data-v="${n}">${n}</button>`).join("")}</div></div>
  <p class="small muted">${t("tap_photo")}</p><p class="small muted">${t("g_note")}</p>
  <div class="stack">${o.barbers.map((b,i)=>`<div class="bedit">
    <div class="photo">${avatar(b,"lg")}<label for="ph_${b.id}" aria-label="Photo"></label><span class="cam" aria-hidden="true">＋</span>
      <input type="file" accept="image/*" id="ph_${b.id}" data-photo="${b.id}" hidden></div>
    <div class="stack">
      <label class="field"><span class="small">${t("barber_name")} ${i+1}</span><input type="text" id="bn_${b.id}" data-bar="${b.id}" data-k="name" value="${esc(b.name)}"></label>
      <label class="field"><span class="small">${t("speciality")} <em>(${t("optional")})</em></span><input type="text" id="bs_${b.id}" data-bar="${b.id}" data-k="spec" value="${esc(b.spec)}" placeholder="${t("spec_ph")}"></label>
      <div class="field"><span class="small">${t("g_serves")}</span><div class="chips" role="radiogroup" aria-label="${t("g_serves")}">${["m","f","both"].map(g=>`<button class="chip ${barberServes(b)===g?"on":""}" role="radio" aria-checked="${barberServes(b)===g}" data-a="barServes" data-v="${b.id}|${g}">${t("g_"+g)}</button>`).join("")}</div></div>
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
const cleanList = o => { o.services = o.services.filter(s=>s.name.trim()).map(s=>({id:s.id,name:s.name.trim(),price:Number(s.price)||0,dur:Number(s.dur)||30,desc:String(s.desc||"").trim().slice(0,120), ...(svcFor(s)!=="all"?{for:svcFor(s)}:{})}));
  o.barbers = o.barbers.filter(b=>b.name.trim()).map(b=>({id:b.id,name:b.name.trim(),spec:(b.spec||"").trim(),photo:b.photo||"", ...(barberServes(b)!=="both"?{serves:barberServes(b)}:{})})); };
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
  o = o||{}; const s = S.salon, svc = {name:bkNames(s,k), price:bkPrice(s,k)}, b = barberOf(s,k.barberId)||{name:"?"}, m = msgs(s,k);
  const pill = k.status==="done"?`<span class="pill ok">${t("st_done")}</span>`:k.status==="cancelled"?`<span class="pill bad">${t("st_cancelled")}</span>`:`<span class="pill warn">${t("st_booked")}</span>`;
  const manage = !o.view && S.bookings.some(x=>x.id===k.id);
  return `<div class="bk"><div class="t">${nice(k.time).replace(" ","<small>")}</small></div><div class="body">
    <div class="row" style="gap:8px"><b class="grow">${esc(k.cust)}</b>${k.src==="online"?`<span class="pill">${t("online")}</span>`:""}${k.bill?`<span class="pill">${t("bill_no",{n:k.bill.no})}</span>`:""}${pill}</div>
    <div class="row small muted" style="gap:6px">${avatar(b,"sm")}<span>${niceRange(k.time,bkDur(s,k))} · ${esc(b.name)} · ${esc(svc.name)} · ${rs(bkEarn(s,k))}${k.bill?" "+(k.bill.pay==="upi"?"UPI":"Cash"):""} · ${esc(k.phone)}${k.email?" · "+esc(k.email):""}</span></div>
    ${k.status==="done" && manage?`<div class="row" style="gap:6px">
      ${k.bill?`<a class="btn sm primary" data-a="billResent" data-v="${k.id}" href="${waLink(k.phone, billText(s,k,{...k.bill, edited:!!k.bill.edited}))}" target="_blank" rel="noopener">${t("bill_resend")}</a><button class="btn sm" data-a="billOpen" data-v="${k.id}">${t("bill_edit")}</button><span class="small muted">${billSentLbl(k.bill)}</span>`
        :`<button class="btn sm primary" data-a="billOpen" data-v="${k.id}">${t("bill_make")}</button>`}</div>`:""}
    ${k.status==="booked"?`<div class="row" style="gap:6px">
      <button class="btn sm primary" data-a="done" data-v="${k.id}">${t("mark_done")}</button>
      ${manage?`<button class="btn sm" data-a="sheetMode" data-v="${k.id}|extend">${t("sh_extend")}</button><button class="btn sm" data-a="sheetMode" data-v="${k.id}|move">${t("sh_move")}</button>`:""}
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
  const earned = today.filter(k=>k.status==="done").reduce((s,k)=>s+bkEarn(S.salon,k),0);
  const tlDate = UI.tlDate || td, tlMin = ymd(new Date(Date.now()-DAY)), tlMax = ymd(new Date(Date.now()+6*DAY));
  const nowHM = toHM(new Date().getHours()*60+new Date().getMinutes());
  const up = today.filter(k=>k.status==="booked" && k.time>=nowHM).length;
  const later = S.bookings.filter(k=>k.date>td && k.status==="booked").sort((a,b)=>(a.date+a.time).localeCompare(b.date+b.time)).slice(0,8);
  let last = "";
  const fresh = freshOffers().length;
  return `${subBanner()}
  ${fresh?`<button class="giftbar" data-a="tab" data-v="rewards"><span class="gi" aria-hidden="true">🎁</span><span class="grow">${fresh===1?t("rw_home"):t("rw_home_n",{n:fresh})}</span><b>${t("rw_open_btn")} →</b></button>`:""}
  ${!String(S.salon.address||"").trim()?`<div class="banner warn"><span style="flex:1">${t("addr_missing")}</span><button class="btn sm saffron" data-a="tab" data-v="settings">${t("nav_settings")}</button></div>`:""}
  <div><p class="muted">${t("hello")}${S.salon.owner?", "+esc(S.salon.owner):""}</p><h1>${dayLabel(td)}</h1></div>
  <div class="stats"><div class="stat"><b>${today.filter(k=>k.status!=="cancelled").length}</b><span>${t("today_bk")}</span></div>
    <div class="stat"><b>${up}</b><span>${t("upcoming")}</span></div><div class="stat"><b>${rs(earned)}</b><span>${t("earned")}</span></div></div>
  <button class="btn primary block" data-a="walkin">+ ${t("add_walkin")}</button>
  <div class="cols"><div class="colA">
  <div class="card"><div class="row" style="gap:6px"><h2 class="grow">${t("tl_h")}</h2>
      <button class="btn sm ghost" data-a="tlDay" data-v="-1" ${tlDate<=tlMin?"disabled":""} aria-label="${t("back")}">‹</button><b style="min-width:96px;text-align:center">${dayLabel(tlDate)}</b>
      <button class="btn sm ghost" data-a="tlDay" data-v="1" ${tlDate>=tlMax?"disabled":""} aria-label="${t("next")}">›</button></div>
    <p class="small muted">${t("tl_p")}</p>${dayTimeline(tlDate)}</div>
  </div><div class="colB">
  <div class="card"><h2>${t("by_barber")}</h2><p class="small muted">${t("tap_barber")}</p>
    <div class="barbers">${S.salon.barbers.map(b=>{ const n = today.filter(k=>k.barberId===b.id && k.status!=="cancelled").length;
      const nxt = today.find(k=>k.barberId===b.id && k.status==="booked" && k.time>=nowHM);
      return `<button class="bcard" data-a="openBarber" data-v="${b.id}">${avatar(b)}<b>${esc(b.name)}</b>${onLeave(S.salon,b.id,td)?`<span class="pill bad">${t("on_leave")}</span>`:""}<span class="pill ${n?"warn":""}">${n===1?t("bk_count1"):t("bk_count",{n})}</span>${nxt?`<small>${nice(nxt.time)} · ${esc(nxt.cust)}</small>`:""}</button>`; }).join("")}</div>
    <a class="btn saffron block" href="https://wa.me/?text=${encodeURIComponent(daySummary(S.salon, td))}" target="_blank" rel="noopener">${t("send_summary")}</a>
    ${sendAllCard(today, td)}</div>
  <div class="card"><h2>${t("today_bk")}</h2>${today.length?`<div>${today.map(k=>bookingRow(k,{remind:true,cancel:true})).join("")}</div>`:`<p class="muted">${t("no_bk")}</p>`}</div>
  ${later.length?`<div class="card"><h2>${t("upcoming")}</h2><div>${later.map(k=>{const h=k.date!==last?`<p class="label" style="margin-top:6px">${dayLabel(k.date)}</p>`:"";last=k.date;return h+bookingRow(k,{cancel:true});}).join("")}</div></div>`:""}
  ${linkCard()}</div></div>`;
}
// free times grouped in one row per hour: "2 PM  2:00 2:15 [2:30] 2:45"
function slotGrid(slots, sel, act, withBarber){
  const g = {}; slots.forEach(s=>{ const h = Math.floor(toMin(s.time)/60); (g[h] = g[h]||[]).push(s); });
  return `<div class="hrs">${Object.keys(g).map(Number).sort((a,b)=>a-b).map(h=>`<div class="hrow"><span class="hl">${hourLbl(h*60)}</span><div class="hs">${g[h].map(s=>{
    const v = withBarber ? s.time+"|"+s.barberId : s.time;
    return `<button class="slot ${sel===s.time?"on":""}" data-a="${act}" data-v="${v}" aria-label="${nice(s.time)}">${nice(s.time).slice(0,-3)}</button>`; }).join("")}</div></div>`).join("")}</div>`;
}
function selBox(salon, B, slots){
  const sl = B.time && slots.find(s=>s.time===B.time); if (!sl) return "";
  const svc = svcOf(salon, B.svc)||{dur:30,name:""}, b = barberOf(salon, sl.barberId)||{name:""};
  return `<div class="selbox" role="status"><span class="label">${t("sel_slot")}</span><b>${niceRange(B.time, Number(svc.dur)||30)}</b><span class="small">${esc(svc.name)} · ${esc(b.name)} · ${dayLabel(B.date)}</span></div>`;
}

/* ---- owner: one day as a timeline, a column per barber ---- */
const PPM = 1.3; // pixels per minute
function dayTimeline(date){
  const s = S.salon, open = toMin(s.open||"10:00"), close = toMin(s.close||"21:00");
  if (!(close > open) || !s.barbers.length) return "";
  const list = S.bookings.filter(k=>k.date===date && k.status!=="cancelled");
  const hours = []; for (let m=Math.ceil(open/60)*60; m<=close; m+=60) hours.push(m);
  const nowD = new Date(), nowM = date===ymd(nowD) ? nowD.getHours()*60+nowD.getMinutes() : -1;
  const closedDay = !(s.days||[]).includes(new Date(date+"T00:00").getDay());
  const cols = `grid-template-columns:48px repeat(${s.barbers.length}, minmax(112px,1fr))`;
  return `<div class="tlwrap">${closedDay?`<p class="small muted">${t("closed_day")}</p>`:""}
    <div class="tlhead" style="${cols}"><span></span>${s.barbers.map(b=>`<span class="tlb">${avatar(b,"sm")}<b>${esc(b.name)}</b></span>`).join("")}</div>
    <div class="tlbody" style="${cols};height:${Math.round((close-open)*PPM)}px">
      <div class="tlhours">${hours.map(m=>`<span style="top:${Math.round((m-open)*PPM)}px">${hourLbl(m)}</span>`).join("")}</div>
      ${s.barbers.map(b=>`<div class="tlcol ${onLeave(s,b.id,date)?"off":""}" data-a="tlTap" data-v="${b.id}" data-date="${date}" data-open="${open}">${onLeave(s,b.id,date)?`<span class="tloff">${t("on_leave")}</span>`:""}
        ${hours.map(m=>`<i class="tlline" style="top:${Math.round((m-open)*PPM)}px"></i>`).join("")}
        ${list.filter(k=>k.barberId===b.id).map(k=>{ const st = toMin(k.time), d = bkDur(s,k);
          return `<button class="tlbk ${k.status}" data-a="sheet" data-v="${k.id}" style="top:${Math.round((st-open)*PPM)}px;height:${Math.max(Math.round(d*PPM)-2,22)}px"><b>${esc(k.cust)}</b><small>${niceRange(k.time,d)} · ${esc(bkNames(s,k))}</small></button>`; }).join("")}
      </div>`).join("")}
      ${nowM>=open && nowM<=close?`<i class="tlnow" style="top:${Math.round((nowM-open)*PPM)}px" aria-hidden="true"></i>`:""}
    </div></div>`;
}

/* ---- owner: bottom sheet to add work or move a booking ---- */
const curK = () => UI.sheet && S.bookings.find(x=>x.id===UI.sheet.id);
function cfOpts(k, cf){
  const s = S.salon, next = S.bookings.find(x=>x.id===cf.nextId); if (!next) return null;
  const nd = bkDur(s,k)+cf.add, end = toMin(k.time)+nd, ndur = bkDur(s,next), close = toMin(s.close||"21:00");
  const map = ownerSlotsMap(k.date); map[slotKey(k.barberId,k.time)] = nd; delete map[slotKey(next.barberId,next.time)];
  const busy = busyList(map);
  const other = s.barbers.find(b=>b.id!==next.barberId && canDo(svcOf(s,next.serviceId),b) && !onLeave(s,b.id,next.date) && isFree(busy,b.id,toMin(next.time),ndur));
  const ns = Math.ceil(end/5)*5;
  return { next, other, shiftTo: ns+ndur<=close && isFree(busy,next.barberId,ns,ndur) ? toHM(ns) : null };
}
function viewSheet(){
  const sh = UI.sheet; if (!sh) return "";
  const s = S.salon, k = curK(); if (!k) return "";
  const d = bkDur(s,k), b = barberOf(s,k.barberId)||{name:"?"}, m = msgs(s,k);
  let body = "";
  if (sh.mode==="bill" && UI.bill){
    const dr = UI.bill, sm = billSum(dr), old = k.bill;
    body = `<div class="row" style="gap:8px"><h2 class="grow">${old?t("bill_no",{n:old.no}):t("bill_h")}</h2>${old?`<span class="small muted">${billSentLbl(old)}</span>`:""}</div>
      <p class="small muted">${t("bill_p")}</p>
      <div class="stack" style="gap:6px">${dr.items.map((x,i)=>`<div class="billrow"><span class="grow">${esc(x.n)}</span>
        <label class="billp"><span aria-hidden="true">₹</span><input type="number" inputmode="numeric" min="0" id="bp_${i}" data-bill="p" data-i="${i}" value="${esc(x.p)}" aria-label="${esc(x.n)}"></label>
        <button class="x" data-a="billDel" data-v="${i}" aria-label="${t("bill_rm")}: ${esc(x.n)}" ${dr.items.length<2?"disabled":""}>×</button></div>`).join("")}</div>
      <p class="label">${t("bill_add")}</p><div class="chips">${s.services.map(v=>`<button class="chip" data-a="billAdd" data-v="${v.id}">+ ${esc(v.name)} · ${rs(v.price)}</button>`).join("")}</div>
      <div class="billrow"><label class="grow" for="bdisc">${t("bill_disc")}</label><label class="billp"><span aria-hidden="true">₹</span><input type="number" inputmode="numeric" min="0" id="bdisc" data-bill="disc" value="${esc(dr.disc)}" placeholder="0"></label></div>
      <p class="label">${t("bill_pay")}</p><div class="chips">${["cash","upi"].map(p=>`<button class="chip ${dr.pay===p?"on":""}" data-a="billPay" data-v="${p}" aria-pressed="${dr.pay===p}">${t("pay_"+p)}</button>`).join("")}</div>
      <div class="billtot"><span>${t("bill_total")}</span><b id="billTotal">${rs(sm.total)}</b></div>
      <button class="btn primary block" data-a="billSend">${old?t("bill_resave_send"):t("bill_send")}</button>
      <button class="btn block" data-a="billSave">${old?t("bill_resave"):t("bill_later")}</button>
      ${old&&old.sent?`<p class="small muted">${t("bill_edit_note")}</p>`:""}`;
  } else if (sh.mode==="msg"){
    body = `<div class="banner ok">✓ ${t("moved_done")}</div><div class="msg">${esc(sh.wa.text)}</div>
      <a class="btn primary block" href="${waLink(sh.wa.phone, sh.wa.text)}" target="_blank" rel="noopener" data-a="sheetClose">${t("send_wa")}</a>`;
  } else if (sh.mode==="extend" && sh.conflict){
    const o = cfOpts(k, sh.conflict);
    if (!o){ UI.sheet.conflict = null; return viewSheet(); }
    body = `<div class="banner warn">⚠️ ${t("cf_h",{name:esc(o.next.cust), time:nice(o.next.time)})}</div>
      ${o.other?`<button class="btn primary block" data-a="cfOther">${t("cf_other",{name:esc(o.next.cust), barber:esc(o.other.name)})}</button>`:`<p class="small muted">${t("cf_other_none")}</p>`}
      ${o.shiftTo?`<button class="btn block" data-a="cfShift">${t("cf_shift",{name:esc(o.next.cust), time:nice(o.shiftTo)})}</button>`:`<p class="small muted">${t("cf_shift_none")}</p>`}
      <button class="btn ghost block" data-a="cfKeep">${t("cf_keep")}</button>`;
  } else if (sh.mode==="extend"){
    const have = new Set([k.serviceId].concat(k.extra||[]));
    body = `<p class="label">${t("sh_add_svc")}</p>
      <input type="search" id="shSearch" class="shsearch" data-shs="1" autocomplete="off" placeholder="🔍 ${t("sh_search")}" aria-label="${t("sh_search")}">
      <div class="chips" id="shChips">${s.services.filter(v=>!have.has(v.id) && canDo(v,b)).map(v=>`<button class="chip" data-a="shSvc" data-v="${v.id}" data-name="${esc(String(v.name||"").toLowerCase())}">+ ${esc(v.name)} · ${esc(v.dur)} ${t("min")}</button>`).join("")}</div>
      <p class="small muted" id="shNone" hidden>${t("sh_none")}</p>
      <p class="label">${t("sh_add_min")}</p><div class="row" style="gap:6px">${[10,15,30].map(n=>`<button class="btn sm" data-a="shMin" data-v="${n}">${t("sh_mins",{n})}</button>`).join("")}</div>`;
  } else if (sh.mode==="move"){
    const days = Array.from({length:7},(_,i)=>ymd(new Date(Date.now()+i*DAY)));
    const slots = freeSlots(s, sh.mvDate, k.serviceId, sh.mvBarber, ownerSlotsMap(sh.mvDate), { dur:d, skip: sh.mvDate===k.date ? {b:k.barberId, start:toMin(k.time)} : null });
    const sel = sh.mvTime && (slots||[]).find(x=>x.time===sh.mvTime);
    body = `<p class="label">${t("mv_date")}</p><div class="hscroll">${days.map(x=>{ const dt = new Date(x+"T00:00"), closed = !(s.days||[]).includes(dt.getDay());
        return `<button class="date ${sh.mvDate===x?"on":""}" data-a="mvDate" data-v="${x}" ${closed?"disabled":""}><small>${t("dw")[dt.getDay()]}</small><b>${dt.getDate()}</b><small>${t("mon")[dt.getMonth()]}</small></button>`; }).join("")}</div>
      <p class="label">${t("mv_barber")}</p><div class="chips"><button class="chip ${sh.mvBarber==="any"?"on":""}" data-a="mvBarber" data-v="any">${t("any_barber")}</button>${s.barbers.filter(x=>canDo(svcOf(s,k.serviceId),x)).map(x=>`<button class="chip ${sh.mvBarber===x.id?"on":""}" data-a="mvBarber" data-v="${x.id}">${esc(x.name)}</button>`).join("")}</div>
      <p class="label">${t("mv_time")}</p>${slots===null?`<p class="muted">${t("closed_day")}</p>`:slots.length?slotGrid(slots, sh.mvTime, "mvTime", true):`<p class="muted">${t("mv_none")}</p>`}
      ${sel?`<button class="btn primary block mvgo" data-a="mvGo" ${UI.busy?"disabled":""}>${t("mv_go",{time:dayLabel(sh.mvDate)+" "+niceRange(sel.time,d)})} · ${esc((barberOf(s,sel.barberId)||{}).name||"")}</button>`:""}`;
  } else {
    body = `<div class="stack" style="gap:8px">
      ${k.status==="booked"?`<button class="btn primary block" data-a="done" data-v="${k.id}">${t("mark_done")}</button>
      <div class="row" style="gap:8px"><button class="btn grow" data-a="sheetMode" data-v="${k.id}|extend">${t("sh_extend")}</button><button class="btn grow" data-a="sheetMode" data-v="${k.id}|move">${t("sh_move")}</button></div>`:""}
      ${k.status==="done"?(k.bill?`<div class="row" style="gap:8px"><a class="btn primary grow" data-a="billResent" data-v="${k.id}" href="${waLink(k.phone, billText(s,k,k.bill))}" target="_blank" rel="noopener">${t("bill_resend")}</a><button class="btn grow" data-a="billOpen" data-v="${k.id}">${t("bill_edit")}</button></div><p class="small muted">${t("bill_no",{n:k.bill.no})} · ${billSentLbl(k.bill)}</p>`
        :`<button class="btn primary block" data-a="billOpen" data-v="${k.id}">${t("bill_make")}</button>`):""}
      <div class="row" style="gap:8px"><a class="btn grow" href="${waLink(k.phone, m.remind)}" target="_blank" rel="noopener">${t("whatsapp")}</a><a class="btn grow" href="${barberWa(k.barberId,m.barber)}" target="_blank" rel="noopener">${t("send_barber")}</a></div>
      ${k.status==="booked"?`<button class="btn ghost block" data-a="cancelBk" data-v="${k.id}">${t("cancel")}</button>`:""}</div>`;
  }
  return `<div class="sheetbg" data-a="sheetClose"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="${esc(k.cust)}">
    <div class="shhead"><div class="grow"><b>${esc(k.cust)}</b><span class="small muted">${dayLabel(k.date)} · ${niceRange(k.time,d)} · ${esc(b.name)}</span><span class="small">${esc(bkNames(s,k))} · ${rs(bkEarn(s,k))}</span></div>
      <button class="btn sm ghost" data-a="sheetClose" aria-label="${t("sh_close")}">✕</button></div>${body}</div>`;
}
// change a booking and keep the day's slot map (what customers see as taken) in step
async function updateBk(k, patch){
  const n = {...k, ...patch}, oKey = slotKey(k.barberId,k.time), nKey = slotKey(n.barberId,n.time), nd = bkDur(S.salon,n);
  const b = writeBatch(db);
  b.update(doc(db,"salons",S.sid,"bookings",k.id), patch);
  if (k.date===n.date) b.set(doc(db,"salons",S.sid,"days",n.date), { slots: { [nKey]: nd, ...(oKey!==nKey?{[oKey]:deleteField()}:{}) } }, { merge:true });
  else { b.set(doc(db,"salons",S.sid,"days",k.date), { slots: { [oKey]: deleteField() } }, { merge:true }); b.set(doc(db,"salons",S.sid,"days",n.date), { slots: { [nKey]: nd } }, { merge:true }); }
  await b.commit();
  Object.assign(k, patch); // local copy until the live update arrives
}
// save the bill on the booking (and mark it done); with send, WhatsApp opens first so the browser treats it as the tap's own window
function saveBill(send){
  const k = curK(), s = S.salon, d = UI.bill; if (!k || !d) return;
  const items = d.items.map(x=>({ n:String(x.n||"").slice(0,60), p:Math.max(0,Math.round(Number(x.p)||0)) })).filter(x=>x.n);
  if (!items.length){ toast(t("bill_empty")); return; }
  const { disc, total } = billSum({ items, disc:d.disc }), old = k.bill;
  const changed = !!old && (old.total!==total || (old.disc||0)!==disc || JSON.stringify(old.items)!==JSON.stringify(items));
  const no = old ? old.no : (Number(s.billSeq)||0)+1;
  const bill = { no, items, disc, total, pay: d.pay==="upi"?"upi":"cash", at: old&&old.at ? old.at : Date.now(),
    sent: (old ? Number(old.sent)||0 : 0) + (send?1:0), edited: !!old && (!!old.edited || (changed && (Number(old.sent)||0)>0)) };
  if (send) window.open(waLink(k.phone, billText(s, k, bill)), "_blank", "noopener");
  const b = writeBatch(db);
  b.update(doc(db,"salons",S.sid,"bookings",k.id), { status:"done", bill });
  if (!old){ b.update(doc(db,"salons",S.sid), { billSeq: no }); s.billSeq = no; }
  Object.assign(k, { status:"done", bill });
  UI.sheet = null; UI.bill = null; render();
  b.commit().then(()=>toast(send?t("bill_sent"):t("bill_saved"))).catch(e=>{ console.error(e); toast(t("save_fail")); });
}
async function doExtend(k, add, svcId, force){
  const s = S.salon, nd = bkDur(s,k)+add, st = toMin(k.time), end = st+nd;
  const next = S.bookings.filter(x=>x.id!==k.id && x.date===k.date && x.barberId===k.barberId && x.status!=="cancelled" && toMin(x.time)>=st && toMin(x.time)<end).sort((a,b)=>a.time.localeCompare(b.time))[0];
  if (next && !force){ UI.sheet.conflict = { add, svcId, nextId: next.id }; render(); return false; }
  try{ await updateBk(k, { dur: nd, ...(svcId ? { extra: (k.extra||[]).concat(svcId) } : {}) }); toast(t("ext_done")); UI.sheet = null; render(); return true; }
  catch(e){ console.error(e); toast(t("save_fail")); render(); return false; }
}
const movedMsg = (k, date, time) => t("moved_msg",{name:k.cust, salon:S.salon.name, date:dayLabel(date), time:nice(time)});

/* ---- calendar: any month, bookings per day, month totals ---- */
async function loadMonth(ym){
  S.month = S.month||{}; if (S.month[ym]!==undefined || S["ml_"+ym]) return; S["ml_"+ym] = true;
  const [y,m] = ym.split("-").map(Number), a = ym+"-01", z = ym+"-"+pad(new Date(y,m,0).getDate());
  try{ const q = await getDocs(query(collection(db,"salons",S.sid,"bookings"), where("date",">=",a), where("date","<=",z))); S.month[ym] = q.docs.map(d=>({id:d.id,...d.data()})); }
  catch(e){ console.error(e); S.month[ym] = []; }
  S["ml_"+ym] = false; render();
}
function monthList(ym){
  const base = (S.month||{})[ym]; if (base===undefined) return undefined;
  const mp = new Map(base.filter(k=>String(k.date||"").startsWith(ym)).map(k=>[k.id,k])); S.bookings.filter(k=>k.date.startsWith(ym)).forEach(k=>mp.set(k.id,k));
  return [...mp.values()];
}
function viewCalendar(){
  const s = S.salon, td = ymd(new Date()), ym = UI.calYM || td.slice(0,7), list = monthList(ym);
  if (list===undefined) setTimeout(()=>loadMonth(ym),0);
  const [y,m] = ym.split("-").map(Number), nDays = new Date(y,m,0).getDate(), start = new Date(y,m-1,1).getDay();
  const all = list||[], live = all.filter(k=>k.status!=="cancelled"), done = all.filter(k=>k.status==="done"), canc = all.filter(k=>k.status==="cancelled");
  const per = {}; live.forEach(k=>{ per[k.date] = (per[k.date]||0)+1; });
  const max = Math.max(1, ...Object.values(per));
  const cells = []; for (let i=0;i<start;i++) cells.push(`<span class="cday blank"></span>`);
  for (let d=1; d<=nDays; d++){ const ds = ym+"-"+pad(d), n = per[ds]||0, lvl = n ? Math.ceil(n/max*3) : 0;
    cells.push(`<button class="cday lv${lvl} ${ds===td?"today":""} ${UI.calDay===ds?"on":""}" data-a="calDay" data-v="${ds}" aria-label="${d} ${t("mon")[m-1]}: ${n}"><b>${d}</b>${n?`<span>${n}</span>`:""}</button>`); }
  const dayList = UI.calDay && UI.calDay.startsWith(ym) ? all.filter(k=>k.date===UI.calDay).sort((a,b)=>a.time.localeCompare(b.time)) : null;
  const old = ymd(new Date(Date.now()-DAY));
  return `<div><h1>${t("cal_h")}</h1><p class="small muted" style="margin-top:4px">${t("cal_p")}</p></div>
  <div class="cols cal2"><div class="colA">
  <div class="card"><div class="row" style="gap:6px"><button class="btn sm ghost" data-a="calMove" data-v="-1" aria-label="${t("back")}">‹</button>
      <h2 class="grow" style="text-align:center">${t("mon")[m-1]} ${y}</h2><button class="btn sm ghost" data-a="calMove" data-v="1" aria-label="${t("next")}">›</button></div>
    ${ym!==td.slice(0,7)?`<button class="btn sm" style="align-self:center" data-a="calMove" data-v="0">${t("cal_now")}</button>`:""}
    ${list===undefined?`<div class="spin"></div>`:`<div class="cal"><span class="cdw">${t("dw").join(`</span><span class="cdw">`)}</span>${cells.join("")}</div>`}</div>
  ${list===undefined?"":`<div class="stats"><div class="stat"><b>${live.length}</b><span>${t("cal_total")}</span></div><div class="stat"><b>${done.length}</b><span>${t("cal_done")}</span></div><div class="stat"><b>₹${done.reduce((a,k)=>a+bkEarn(s,k),0).toLocaleString("en-IN")}</b><span>${t("cal_earn")}</span></div></div>
  ${canc.length?`<p class="small muted" style="text-align:center">${t("cal_cancel")}: ${canc.length}</p>`:""}
  </div><div class="colB">
  ${dayList?`<div class="card"><h2>${dayLabel(UI.calDay)}</h2>${dayList.length?`<div>${dayList.map(k=>bookingRow(k,{cancel:true, view:k.date<old})).join("")}</div>`:`<p class="muted">${t("cal_none")}</p>`}</div>`:`<p class="small muted" style="text-align:center">${t("cal_pick")}</p>`}
  ${live.length?`<div class="card"><h3>${t("cal_by_barber")}</h3>${s.barbers.map(b=>{ const mine = live.filter(k=>k.barberId===b.id), earn = mine.filter(k=>k.status==="done").reduce((a,k)=>a+bkEarn(s,k),0);
    return `<div class="row" style="gap:8px">${avatar(b,"sm")}<b class="grow">${esc(b.name)}</b><span class="small">${mine.length===1?t("bk_count1"):t("bk_count",{n:mine.length})} · ₹${earn.toLocaleString("en-IN")}</span></div>`; }).join("")}</div>`:""}`}
  </div></div>`;
}

// services split into Men / Women / Everyone only when the salon uses those tags
function svcGroups(salon){
  const list = salon.services||[]; if (!list.some(v=>svcFor(v)!=="all")) return [{head:"", list}];
  return ["m","f","all"].map(g=>({ head:t("g_head_"+g), list:list.filter(v=>svcFor(v)===g) })).filter(x=>x.list.length);
}
function bookingForm(salon, slotsFor, ownerMode){
  const B = UI.book; const days = Array.from({length:7},(_,i)=>ymd(new Date(Date.now()+i*DAY)));
  if (!B.svc && salon.services.length===1) B.svc = salon.services[0].id;
  if (!B.date) B.date = days.find(d=>(salon.days||[]).includes(new Date(d+"T00:00").getDay())) || days[0];
  const map = slotsFor(B.date);
  if (map===undefined && CUSTOMER_SID) setTimeout(()=>loadDay(B.date),0);
  const slots = B.svc ? (map===undefined ? undefined : freeSlots(salon, B.date, B.svc, B.barber||"any", map)) : [];
  return `
  <div class="card ${UI.flashSvc?"flash":""}" id="svcCard"><h3>${t("pick_svc")}</h3>${!salon.services.length?`<p class="muted">${t("no_services")}</p>`:""}${svcGroups(salon).map(g=>`${g.head?`<p class="label svchead">${g.head}</p>`:""}<div class="svclist" role="radiogroup" ${g.head?`aria-label="${g.head}"`:""}>${g.list.map(s=>`<button class="svcopt ${B.svc===s.id?"on":""}" role="radio" aria-checked="${B.svc===s.id}" data-a="bSvc" data-v="${s.id}">
      <span class="tick" aria-hidden="true">${B.svc===s.id?"✓":""}</span>
      <span class="nm"><b>${esc(s.name)}</b><small>⏱ ${esc(s.dur)} ${t("min")}</small>${s.desc?`<span class="ds">${esc(s.desc)}</span>`:""}</span>
      <span class="pr">₹${esc(s.price)}</span></button>`).join("")}</div>`).join("")}</div>
  <div class="card" id="barberCard"><h3>${t("pick_barber")}</h3><div class="barbers">
    <button class="bcard ${(!B.barber||B.barber==="any")?"on":""}" data-a="bBarber" data-v="any"><span class="av lg" style="background:var(--surface2);color:var(--muted)" aria-hidden="true">✂</span><b>${t("any_barber")}</b><small>${t("any_sub")}</small></button>
    ${salon.barbers.filter(b=>!B.svc || canDo(svcOf(salon,B.svc),b)).map(b=>{ const off = onLeave(salon,b.id,B.date); return `<button class="bcard ${B.barber===b.id?"on":""} ${off?"off":""}" data-a="bBarber" data-v="${b.id}">${avatar(b,"lg")}<b>${esc(b.name)}</b>${off?`<span class="pill bad">${t("on_leave")}</span>`:b.spec?`<small>${esc(b.spec)}</small>`:""}</button>`; }).join("")}</div>
    ${B.barber && B.barber!=="any" && onLeave(salon,B.barber,B.date)?`<div class="banner warn">${t("barber_off",{name:esc((barberOf(salon,B.barber)||{}).name||""), date:dayLabel(B.date)})}</div>`:""}</div>
  <div class="card" id="dateCard"><h3>${t("pick_date")}</h3><div class="hscroll">${days.map(d=>{const dt=new Date(d+"T00:00");const closed=!(salon.days||[]).includes(dt.getDay());
    return `<button class="date ${B.date===d?"on":""}" data-a="bDate" data-v="${d}" ${closed?"disabled":""}><small>${t("dw")[dt.getDay()]}</small><b>${dt.getDate()}</b><small>${t("mon")[dt.getMonth()]}</small></button>`}).join("")}</div></div>
  <div class="card" id="timeCard"><h3>${t("pick_time")}</h3>${!B.svc?`<button class="btn block" data-a="toSvc">↑ ${t("pick_svc_first")}</button>`:slots===undefined?`<div class="spin"></div>`:slots===null?`<p class="muted">${t("closed_day")}</p>`:slots.length?slotGrid(slots, B.time, "bTime")+selBox(salon, B, slots):`<p class="muted">${t("no_slots")}</p>`}</div>
  <div class="card" id="detailsCard"><h3>${t("your_details")}</h3>
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
function leaveCard(b){
  const s = S.salon, days = Array.from({length:21},(_,i)=>ymd(new Date(Date.now()+i*DAY)));
  const hit = S.bookings.filter(k=>k.barberId===b.id && k.status==="booked" && onLeave(s,b.id,k.date)).sort((a,c)=>(a.date+a.time).localeCompare(c.date+c.time));
  return `<h3>🌴 ${t("leave_h")}</h3><p class="small muted">${t("leave_p")}</p>
    <div class="hscroll">${days.map(d=>{ const dt = new Date(d+"T00:00"), on = onLeave(s,b.id,d);
      return `<button class="date ${on?"leave":""}" data-a="leaveToggle" data-v="${b.id}|${d}" aria-pressed="${on}"><small>${t("dw")[dt.getDay()]}</small><b>${dt.getDate()}</b><small>${on?t("on_leave"):t("mon")[dt.getMonth()]}</small></button>`; }).join("")}</div>
    ${hit.length?`<div class="banner warn" style="flex-direction:column;align-items:stretch;gap:8px"><span>${t("leave_warn",{n:hit.length})}</span>
      ${hit.map(k=>`<div class="row" style="gap:8px"><span class="grow small"><b>${esc(k.cust)}</b> · ${dayLabel(k.date)} ${nice(k.time)}</span><button class="btn sm" data-a="sheetMode" data-v="${k.id}|move">${t("sh_move")}</button></div>`).join("")}</div>`:""}`;
}
function viewBarber(){
  if (!barberOf(S.salon, UI.barberId) && S.salon.barbers[0]) UI.barberId = S.salon.barbers[0].id;
  const b = barberOf(S.salon, UI.barberId); const td = ymd(new Date());
  const mine = S.bookings.filter(k=>k.barberId===UI.barberId && k.date>=td && k.status!=="cancelled").sort((a,c)=>(a.date+a.time).localeCompare(c.date+c.time));
  let last = "";
  return `<div><h1>${t("barber_h")}</h1><p class="small muted" style="margin-top:4px">${t("barber_p")}</p></div>
  <div class="hscroll">${S.salon.barbers.map(x=>`<button class="bcard ${x.id===UI.barberId?"on":""}" style="flex:none;width:112px" data-a="pickBarber" data-v="${x.id}">${avatar(x)}<b>${esc(x.name)}</b></button>`).join("")}</div>
  ${b?`<div class="card"><div class="row">${avatar(b,"lg")}<div class="grow"><h2>${esc(b.name)}</h2>${b.spec?`<p class="muted small">${esc(b.spec)}</p>`:""}</div></div>
    <a class="btn saffron sm" style="align-self:flex-start" href="${barberWa(b.id, daySummary(S.salon, td, b.id))}" target="_blank" rel="noopener">${t("send_day",{name:esc(b.name)})}</a>
    ${digits(bc(b.id).phone).length===10?`<span class="small muted">📱 ${esc(bc(b.id).phone)}</span>`:`<span class="small muted">${t("no_phone")}</span>`}<hr>
    ${leaveCard(b)}<hr>
    <h3>${t("your_day")}</h3>${mine.length?`<div>${mine.map(k=>{const h=k.date!==last?`<p class="label" style="margin-top:6px">${dayLabel(k.date)}</p>`:"";last=k.date;return h+bookingRow(k,{barber:true});}).join("")}</div>`:`<p class="muted">${t("no_bk")}</p>`}</div>`:""}`;
}
// Personal UPI ID: GPay blocks pre-filled amount links/QRs to personal IDs with a fake "bank limit" error.
// So the QR carries only the UPI ID; the payer types the amount. With a merchant (business) UPI ID, am/mc/tr can come back.
const upiUri = () => "upi://pay?pa="+ADMIN_UPI+"&pn="+encodeURIComponent(ADMIN_NAME)+"&cu=INR";
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
    <div class="banner warn"><b>${t("pay_amt",{amt:p.price.toLocaleString("en-IN")})}</b></div>
    <div class="qr" data-qr="${esc(upiUri())}" role="img" aria-label="UPI QR"></div>
    <div class="copy"><span class="small muted">${t("upi_id")}</span><code>${ADMIN_UPI}</code><button class="btn saffron sm" data-a="copy" data-v="${ADMIN_UPI}">${t("copy")}</button></div></div>
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

/* ================= rewards ================= */
// offers/{id}: kind "days" (scratch card that adds free days) or "deal" (partner/brand code + link)
function offerLive(o){ return !!o && o.active===true && (!o.endsAt || o.endsAt > Date.now()); }
function offerFor(o, s){ return offerLive(o) && (!o.newSince || ((s&&s.createdAt)||0) >= o.newSince); }
const byOrder = (a,b) => (a.order||0)-(b.order||0) || (a.createdAt||0)-(b.createdAt||0);
function freshOffers(){ if (!S.salon || !S.offers) return []; return S.offers.filter(o=>offerFor(o,S.salon) && !(S.claims||{})[o.id]).sort(byOrder); }
function revealBig(o){ return o.reveal || (o.kind==="deal" ? (o.code||"") : "+"+(Number(o.days)||0)+" "+t("days")+" "+t("rw_free")); }
function revealNote(o){ return o.note || (o.kind==="days" ? t("rw_added",{n:Number(o.days)||0}) : ""); }
function cardHead(o){
  return `<div class="shead"><span class="label">${esc(o.kind==="deal" ? (o.brand||t("rw_partner")) : "SalonSlot")}</span><b>${esc(o.title||"")}</b>
    ${o.desc?`<span class="small">${esc(o.desc)}</span>`:""}${o.endsAt?`<span class="small soft">${t("rw_ends",{date:longDate(o.endsAt)})}</span>`:""}</div>`;
}
function scratchCard(o, preview){
  return `<div class="scard ${o.kind==="deal"?"deal":""}">${cardHead(o)}
    <div class="sarea"><div class="sreveal"><span class="label">${t("rw_gift")}</span><b class="sbig">${esc(revealBig(o))}</b>${revealNote(o)?`<span class="small">${esc(revealNote(o))}</span>`:""}</div>
      <canvas data-scratch="${o.id}" ${preview?'data-preview="1"':""} aria-hidden="true"></canvas></div>
    <button class="btn sm ghost stap" data-a="${preview?"rwPrevOpen":"rwReveal"}" data-v="${o.id}">${t("rw_tap")}</button></div>`;
}
function rewardDone(o, c){
  const deal = o.kind==="deal";
  return `<div class="scard open ${deal?"deal":""} ${UI.justGot===o.id?"pop":""}">${cardHead(o)}
    <div class="sarea"><div class="sreveal"><span class="label">${t("rw_gift")}</span><b class="sbig">${esc(revealBig(o))}</b>${revealNote(o)?`<span class="small">${esc(revealNote(o))}</span>`:""}</div></div>
    ${deal && o.code?`<div class="copy"><span class="small muted">${t("rw_code")}</span><code>${esc(o.code)}</code><button class="btn sm" data-a="copy" data-v="${esc(o.code)}">${t("copy")}</button></div>`:""}
    ${deal && o.link?`<a class="btn primary block" data-a="rwClick" data-v="${o.id}" href="${esc(o.link)}" target="_blank" rel="noopener">${t("rw_open")} →</a>`:""}
    ${c && c.at?`<span class="small muted">${t("rw_got",{date:longDate(c.at)})}</span>`:""}</div>`;
}
function viewRewards(){
  const fresh = freshOffers(), cl = S.claims||{};
  const mine = (S.offers||[]).filter(o=>cl[o.id]).sort((a,b)=>(cl[b.id].at||0)-(cl[a.id].at||0));
  const freshDays = fresh.filter(o=>o.kind!=="deal"), freshDeals = fresh.filter(o=>o.kind==="deal");
  return `<div><h1>${t("rw_h")}</h1><p class="small muted" style="margin-top:4px">${t("rw_p")}</p></div>
  ${S.offers===null?`<div class="center"><div class="spin"></div></div>`:""}
  ${freshDays.length?`<p class="label">${t("rw_new")}</p><div class="sgrid">${freshDays.map(o=>scratchCard(o)).join("")}</div>`:""}
  ${freshDeals.length?`<p class="label">${t("rw_partner")}</p><div class="sgrid">${freshDeals.map(o=>scratchCard(o)).join("")}</div>`:""}
  ${S.offers!==null && !fresh.length?`<div class="card lock"><div class="big" aria-hidden="true">🎁</div><p class="muted">${t("rw_none")}</p></div>`:""}
  ${mine.length?`<p class="label">${t("rw_mine")}</p><div class="sgrid">${mine.map(o=>rewardDone(o, cl[o.id])).join("")}</div>`:""}`;
}
async function claimOffer(o){
  const cref = doc(db,"salons",S.sid,"claims",o.id);
  const days = o.kind==="deal" ? 0 : (Number(o.days)||0);
  const data = { oid:o.id, days, at:Date.now() };
  if (days>0){
    const cur = (S.salon.sub||{}).expires||0, now = Date.now();
    const next = (cur>now ? cur : now) + days*DAY;
    const b = writeBatch(db);
    b.set(cref, data);
    b.update(doc(db,"salons",S.sid), { "sub.expires": next, lastClaim: o.id });
    await b.commit();
  } else await setDoc(cref, data);
}

/* scratch: silver layer on a canvas, rubbed away with a finger or mouse */
function initScratch(){
  document.querySelectorAll("canvas[data-scratch]").forEach(cv=>{
    if (cv.dataset.init) return; cv.dataset.init = "1";
    const box = cv.parentElement, w = box.clientWidth, h = box.clientHeight, r = window.devicePixelRatio||1;
    if (!w || !h) return;
    cv.width = Math.round(w*r); cv.height = Math.round(h*r);
    const g = cv.getContext("2d", {willReadFrequently:true}); g.scale(r,r);
    g.fillStyle = "#C8C4BC"; g.fillRect(0,0,w,h);
    g.strokeStyle = "rgba(255,255,255,.32)"; g.lineWidth = 5;
    for (let x=-h; x<w; x+=14){ g.beginPath(); g.moveTo(x,h); g.lineTo(x+h,0); g.stroke(); }
    g.fillStyle = "#24211F"; g.textAlign = "center"; g.textBaseline = "middle";
    g.font = "700 20px Hind, system-ui, sans-serif"; g.fillText(t("rw_scratch"), w/2, h/2-10);
    g.font = "500 14px Hind, system-ui, sans-serif"; g.fillText(t("rw_scratch_hint"), w/2, h/2+14);
    g.globalCompositeOperation = "destination-out"; g.strokeStyle = "#000"; g.fillStyle = "#000"; g.lineCap = "round"; g.lineJoin = "round"; g.lineWidth = 40;
    const id = cv.dataset.scratch, preview = !!cv.dataset.preview;
    let down = false, last = null, moves = 0, fin = false;
    const pos = e => { const b = cv.getBoundingClientRect(); return [e.clientX-b.left, e.clientY-b.top]; };
    const cleared = () => { const d = g.getImageData(0,0,cv.width,cv.height).data; let c=0, n=0; for (let i=3; i<d.length; i+=4*37){ n++; if (d[i]===0) c++; } return n ? c/n : 0; };
    const finish = () => { if (fin) return; fin = true; down = false; cv.style.transition = "opacity .45s"; cv.style.opacity = "0";
      setTimeout(()=>{ UI.scratching = null; UI.pendingRender = false; preview ? A.rwPrevOpen(id) : A.rwReveal(id); }, 460); };
    cv.addEventListener("pointerdown", e => { if (fin) return; down = true; UI.scratching = id; try{ cv.setPointerCapture(e.pointerId); }catch(x){}
      last = pos(e); g.beginPath(); g.arc(last[0], last[1], 20, 0, 7); g.fill(); e.preventDefault(); });
    cv.addEventListener("pointermove", e => { if (!down) return; const p = pos(e); g.beginPath(); g.moveTo(last[0],last[1]); g.lineTo(p[0],p[1]); g.stroke(); last = p;
      if (++moves % 6 === 0 && cleared() > 0.45) finish(); });
    const up = () => { if (!down) return; down = false; if (cleared() > 0.45) finish();
      else { UI.scratching = null; if (UI.pendingRender){ UI.pendingRender = false; render(); } } };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up); cv.addEventListener("pointerleave", up);
  });
}

function adminRewards(){
  const offers = (S.offers||[]).slice().sort(byOrder), o = UI.of;
  const cnt = {}, clk = {}; (S.allClaims||[]).forEach(c=>{ cnt[c.oid] = (cnt[c.oid]||0)+1; if (c.clicked) clk[c.oid] = (clk[c.oid]||0)+1; });
  const f = (k, label, type, ph) => `<label class="field"><span class="small">${label}</span><input type="${type||"text"}" id="of_${k}" data-of="${k}" value="${esc(o[k])}" ${ph?`placeholder="${esc(ph)}"`:""} ${type==="number"?'inputmode="numeric" min="1" max="30"':""}></label>`;
  return `<div class="card"><h2>🎁 ${t("adm_rw_h")}</h2><p class="small muted">${t("adm_rw_p")}</p>
    ${offers.length?offers.map(x=>{ const live = offerLive(x);
      return `<div class="srow"><div class="row" style="gap:8px"><b class="grow">${esc(x.title||"—")}</b>${live?`<span class="pill ok">${t("active")}</span>`:`<span class="pill bad">${t("adm_off")}</span>`}</div>
        <span class="small muted">${x.kind==="deal"?esc((x.brand||"")+" · "+(x.code||"")):"+"+esc(x.days)+" "+t("days")} · ${x.newSince?t("of_new_pill"):t("of_all_pill")}${x.endsAt?" · "+t("rw_ends",{date:longDate(x.endsAt)}):""}</span>
        <span class="small"><b>${t("of_claims",{n:cnt[x.id]||0})}</b>${x.kind==="deal"?" · "+t("of_clicks",{n:clk[x.id]||0}):""}</span>
        <div class="row" style="gap:6px">
          <button class="btn sm ${x.active?"danger":"primary"}" data-a="ofToggle" data-v="${x.id}">${x.active?t("turn_off"):t("turn_on")}</button>
          <button class="btn sm" data-a="ofAudience" data-v="${x.id}">${x.newSince?t("of_make_all"):t("of_make_new")}</button>
          <button class="btn sm" data-a="ofPreview" data-v="${x.id}">${t("rw_preview")}</button>
          ${UI.ofDelAsk===x.id?`<button class="btn sm danger" data-a="ofDel" data-v="${x.id}">${t("of_del_sure")}</button>`:`<button class="btn sm ghost" data-a="ofDelAsk" data-v="${x.id}">${t("of_del")}</button>`}</div>
        ${UI.ofPreview===x.id?`<p class="small muted">${t("rw_preview_p")}</p>${UI.prevDone[x.id]?rewardDone(x,null):scratchCard(x,true)}`:""}</div>`; }).join(""):`<p class="muted">${t("of_none")}</p>`}
    <hr><h3>${t("adm_rw_new")}</h3>
    <div class="field"><span class="small">${t("of_kind")}</span><div class="chips">
      <button class="chip ${o.kind==="days"?"on":""}" data-a="ofKind" data-v="days" aria-pressed="${o.kind==="days"}">${t("of_days_k")}</button>
      <button class="chip ${o.kind==="deal"?"on":""}" data-a="ofKind" data-v="deal" aria-pressed="${o.kind==="deal"}">${t("of_deal_k")}</button></div></div>
    ${o.kind==="deal"?f("brand",t("of_brand"),"text","Brand"):""}
    ${f("title",t("of_title"),"text",o.kind==="deal"?"20% off on hair colour":"Diwali Bonus")}
    ${f("desc",t("of_desc")+" ("+t("optional")+")")}
    ${o.kind==="days"?f("days",t("of_days"),"number"):f("code",t("of_code"),"text","SALON20")+f("link",t("of_link")+" ("+t("optional")+")","url","https://")}
    ${f("reveal",t("of_reveal")+" ("+t("optional")+")","text",o.kind==="days"?"+"+(o.days||3)+" "+t("days")+" FREE":(o.code||"SALON20"))}
    ${f("note",t("of_note")+" ("+t("optional")+")")}
    ${f("ends",t("of_ends")+" ("+t("optional")+")","date")}
    <label class="row small" style="gap:8px"><input type="checkbox" id="of_newOnly" data-of="newOnly" ${o.newOnly?"checked":""} style="width:20px;height:20px">${t("of_newonly")}</label>
    ${UI.ofErr?`<div class="banner bad" role="alert">${UI.ofErr}</div>`:""}
    <button class="btn primary" data-a="ofSave" ${UI.busy?"disabled":""}>${t("of_save")}</button></div>`;
}
const WELCOME = () => ({ kind:"days", days:3, title:"Welcome Gift", desc:"SalonSlot परिवार में स्वागत है!", reveal:"10 दिन FREE",
  note:"आपके free trial में 3 दिन और जुड़ गए। अब पूरे 10 दिन आराम से चलाइए।", active:true, newSince:Date.now(), endsAt:0, order:0, createdAt:Date.now() });
let welcomeTried = false;
function seedWelcome(){ if (!isAdmin() || !S.offers || welcomeTried || S.offers.some(o=>o.id==="welcome")) return; welcomeTried = true;
  setDoc(doc(db,"offers","welcome"), WELCOME()).catch(e=>console.error("welcome offer", e)); }

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
  ${leadsCard()}
  ${adminRewards()}
  <div class="card"><h3>📋 ${t("csv_h")}</h3><p class="small muted">${t("csv_p")}</p><button class="btn primary" data-a="admCsv" ${UI.busy?"disabled":""}>${t("csv_btn")}</button></div>
  <div class="card"><h3>${t("download")}</h3><p class="small muted">${t("download_p")}</p><button class="btn" data-a="admDownload" ${UI.busy?"disabled":""}>${t("download")}</button></div>`;
}
/* ---- admin: leads collected by the pitch game (/pitch/) ---- */
const DEMO_LINK = "https://arjun-labs.github.io/Salonslot/?s=xWvAeZNfg8ZW6fHMV3xQJ8AHlqx1";
function leadsCard(){
  const L = S.leads; if (!L) return `<div class="card"><h3>${t("lead_h")}</h3><div class="spin"></div></div>`;
  const td = ymd(new Date()), today = L.filter(x=>x.at && ymd(new Date(x.at))===td).length, show = L.slice(0,30);
  const when = ms => { const d = new Date(ms); return longDate(ms)+", "+nice(pad(d.getHours())+":"+pad(d.getMinutes())); };
  const cnt = {}; L.forEach(x=>{ const a = String(x.area||"").trim(); if (!a) return; const k = a[0].toUpperCase()+a.slice(1).toLowerCase(); cnt[k] = (cnt[k]||0)+1; });
  const byArea = Object.entries(cnt).sort((a,b)=>b[1]-a[1]);
  return `<div class="card"><h3>${t("lead_h")}</h3><p class="small muted">${t("lead_p")}</p>
    ${S.leadsErr?`<div class="banner warn">${t("lead_rules")}</div>`:""}
    <div class="stats"><div class="stat"><b>${today}</b><span>${t("lead_today")}</span></div><div class="stat"><b>${L.length}</b><span>${t("lead_total")}</span></div></div>
    ${byArea.length?`<p class="label">${t("lead_areas")}</p><div class="chips">${byArea.map(([a,n])=>`<span class="chip">${esc(a)} · <b>${n}</b></span>`).join("")}</div>`:""}
    ${show.length?show.map(x=>`<div class="srow"><div class="row" style="gap:8px"><b class="grow">${esc(x.name||"—")} · ${esc(x.salon||"")}${x.area?` · <span style="color:var(--gold-deep)">${esc(x.area)}</span>`:""}</b><span class="pill">${x.lang==="hi"?"हिं":"EN"}</span></div>
      <span class="small muted">${x.at?when(x.at):""} · <a href="tel:+91${esc(x.phone)}">${esc(x.phone)}</a></span>
      ${(x.picks||[]).length?`<span class="small"><b>${t("lead_picks")}:</b> ${(x.picks||[]).map(esc).join(" · ")}</span>`:""}
      ${x.avg?`<span class="small"><b>${t("lead_loss")}:</b> ${esc(x.lost)} × ₹${esc(x.avg)} × 26 = ₹${((Number(x.lost)||0)*(Number(x.avg)||0)*26).toLocaleString("en-IN")} / ${t("lead_mo")}</span>`:""}
      <div class="row" style="gap:6px"><a class="btn sm primary" href="${waLink(x.phone, t("lead_msg",{name:x.name||"", salon:x.salon||"", link:DEMO_LINK}))}" target="_blank" rel="noopener">${t("whatsapp")}</a><a class="btn sm" href="tel:+91${esc(x.phone)}">Call</a></div></div>`).join("")
      :`<p class="muted">${t("lead_none")}</p>`}
    ${L.length>show.length?`<p class="small muted">${t("lead_more",{n:L.length-show.length})}</p>`:""}
    ${L.length?`<button class="btn" data-a="leadCsv">${t("lead_csv")}</button>`:""}</div>`;
}
function watchAdmin(){
  if (UI.view==="adminOnly") setTimeout(()=>{ if (UI.view==="adminOnly") render(); }, 1500);
  if (!isAdmin() || S.adminUnsub) return;
  S.adminUnsub = onSnapshot(collection(db,"salons"), snap => { S.allSalons = snap.docs.map(d=>({id:d.id,...d.data()})); if (UI.tab==="admin" || UI.view==="adminOnly") render(); },
    err => { console.error(err); S.allSalons = []; render(); });
  S.adminClaimsUnsub = onSnapshot(collectionGroup(db,"claims"), snap => { S.allClaims = snap.docs.map(d=>({sid:d.ref.parent.parent.id, ...d.data()})); if ((UI.tab==="admin" || UI.view==="adminOnly") && !typing()) render(); },
    err => { console.error(err); S.allClaims = []; });
  S.adminLeadsUnsub = onSnapshot(collection(db,"leads"), snap => { S.leads = snap.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>(b.at||0)-(a.at||0)); S.leadsErr = false; if ((UI.tab==="admin" || UI.view==="adminOnly") && !typing()) render(); },
    err => { console.error(err); S.leads = []; S.leadsErr = true; if (UI.tab==="admin" || UI.view==="adminOnly") render(); });
  watchOffers();
}
const typing = () => !!(document.activeElement && document.activeElement.matches && document.activeElement.matches("input,select,textarea"));
function watchOffers(){
  if (S.offersUnsub || !S.user) return;
  S.offersUnsub = onSnapshot(collection(db,"offers"), snap => { S.offers = snap.docs.map(d=>({id:d.id,...d.data()})); seedWelcome();
    if ((UI.view==="main" || UI.view==="adminOnly") && !typing()) render(); },
    err => { console.error(err); S.offers = []; });
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
  return topBar(s.name, s.area||t("tagline"))+`<main>${body}${brandFoot()}</main>`;
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
// booking form: after each choice, glide to the next step (service → barber → day → time → details), below the sticky top bar
function stepTo(id){ setTimeout(()=>{ const el = document.getElementById(id); if (!el) return; const top = el.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" }); }, 80); }
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
  svcUp:v=>{ const o = editTarget(); const i = o.services.findIndex(s=>s.id===v); if (i>0){ [o.services[i-1],o.services[i]]=[o.services[i],o.services[i-1]]; render(); if (o===S.salon) queueSave(); } },
  svcDown:v=>{ const o = editTarget(); const i = o.services.findIndex(s=>s.id===v); if (i>=0 && i<o.services.length-1){ [o.services[i+1],o.services[i]]=[o.services[i],o.services[i+1]]; render(); if (o===S.salon) queueSave(); } },
  svcFor:v=>{ const o = editTarget(); const [id,g] = v.split("|"); const x = o.services.find(q=>q.id===id); if (!x) return; if (g==="all") delete x.for; else x.for = g; render(); if (o===S.salon) queueSave(); },
  barServes:v=>{ const o = editTarget(); const [id,g] = v.split("|"); const x = o.barbers.find(q=>q.id===id); if (!x) return; if (g==="both") delete x.serves; else x.serves = g; render(); if (o===S.salon) queueSave(); },
  delSvc:v=>{ const o = editTarget(); o.services=o.services.filter(s=>s.id!==v); render(); if (o===S.salon) queueSave(); },
  count:v=>{ const o = editTarget(); const n=Number(v); while(o.barbers.length<n) o.barbers.push({id:uid(),name:"",spec:"",photo:""}); if (o.barbers.length>n) o.barbers=o.barbers.slice(0,n); render(); if (o===S.salon) queueSave(); },
  addBarber:()=>{ const o = editTarget(); o.barbers.push({id:uid(),name:"",spec:"",photo:""}); render(); },
  delBarber:v=>{ const o = editTarget(); o.barbers=o.barbers.filter(b=>b.id!==v); render(); if (o===S.salon) queueSave(); },
  done:v=>{ const k = S.bookings.find(x=>x.id===v);
    if (k){ A.billOpen(v); return; }
    if (UI.sheet){ UI.sheet=null; render(); } updateDoc(doc(db,"salons",S.sid,"bookings",v),{status:"done"}).catch(()=>toast(t("save_fail"))); },
  billOpen:v=>{ const k = S.bookings.find(x=>x.id===v); if (!k) return; UI.bill = billDraft(S.salon, k); UI.sheet = { id:v, mode:"bill" }; render(); },
  billAdd:v=>{ const sv = svcOf(S.salon,v); if (!sv || !UI.bill) return; UI.bill.items.push({n:sv.name, p:String(Number(sv.price)||0)}); render(); },
  billDel:v=>{ if (!UI.bill || UI.bill.items.length<2) return; UI.bill.items.splice(Number(v),1); render(); },
  billPay:v=>go(()=>{ if (UI.bill) UI.bill.pay = v==="upi"?"upi":"cash"; }),
  billSend:()=>saveBill(true),
  billSave:()=>saveBill(false),
  billResent:v=>{ const k = S.bookings.find(x=>x.id===v); if (!k || !k.bill) return; const n = (Number(k.bill.sent)||0)+1;
    k.bill.sent = n; setTimeout(render, 300); updateDoc(doc(db,"salons",S.sid,"bookings",v),{"bill.sent":n}).catch(()=>{}); },
  cancelBk:async v=>{ const k = S.bookings.find(x=>x.id===v); if (!k) return; if (UI.sheet){ UI.sheet=null; render(); }
    try{ await updateDoc(doc(db,"salons",S.sid,"bookings",v),{status:"cancelled"}); await updateDoc(doc(db,"salons",S.sid,"days",k.date),{["slots."+slotKey(k.barberId,k.time)]:deleteField()}).catch(()=>{}); }catch(e){ toast(t("save_fail")); } },
  bSvc:v=>{ go(()=>{ UI.book.svc=v; { const sl = CUSTOMER_SID ? C.salon : S.salon, bb = UI.book.barber && UI.book.barber!=="any" && barberOf(sl,UI.book.barber); if (bb && !canDo(svcOf(sl,v),bb)) UI.book.barber = "any"; } UI.book.time=UI.book.prefTime||null; UI.flashSvc=false; if (CUSTOMER_SID) loadDay(UI.book.date); }); stepTo("barberCard"); },
  toSvc:()=>{ UI.flashSvc=true; render(); const el=document.getElementById("svcCard"); if (el) el.scrollIntoView({behavior:"smooth", block:"start"}); setTimeout(()=>{ UI.flashSvc=false; render(); }, 1600); },
  bBarber:v=>{ go(()=>{ UI.book.barber=v; UI.book.time=null; }); stepTo("dateCard"); },
  bDate:v=>{ go(()=>{ UI.book.date=v; UI.book.time=null; if (CUSTOMER_SID) loadDay(v); }); stepTo("timeCard"); },
  bTime:v=>{ go(()=>{ UI.book.time=v; UI.err=""; }); stepTo("detailsCard"); },
  confirm: async ()=>{ const B = UI.book; const salon = CUSTOMER_SID ? C.salon : S.salon, sid = CUSTOMER_SID || S.sid;
    if (!B.svc){ A.toSvc(); return; }
    if (!B.time){ UI.err = t("pick_time"); render(); const el=document.getElementById("timeCard"); if (el) el.scrollIntoView({behavior:"smooth", block:"start"}); return; }
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
  sheet: v=>go(()=>{ UI.sheet = { id:v, mode:"menu" }; }),
  sheetMode: v=>go(()=>{ const [id,mode] = v.split("|"); const k = S.bookings.find(x=>x.id===id);
    UI.sheet = { id, mode, mvDate: k ? (k.date<ymd(new Date())?ymd(new Date()):k.date) : ymd(new Date()), mvBarber: k ? k.barberId : "any", mvTime:null }; }),
  sheetClose: ()=>{ setTimeout(()=>{ UI.sheet = null; render(); }, 0); },
  shSvc: v=>{ const k = curK(), sv = svcOf(S.salon,v); if (k && sv) doExtend(k, Number(sv.dur)||30, v, false); },
  shMin: v=>{ const k = curK(); if (k) doExtend(k, Number(v)||15, null, false); },
  cfKeep: ()=>{ const k = curK(), cf = UI.sheet.conflict; if (k && cf) doExtend(k, cf.add, cf.svcId, true); },
  cfOther: async ()=>{ const k = curK(), cf = UI.sheet.conflict; const o = k && cf && cfOpts(k, cf); if (!o || !o.other) return;
    try{ await updateBk(o.next, { barberId: o.other.id }); await doExtend(k, cf.add, cf.svcId, true); }catch(e){ console.error(e); toast(t("save_fail")); render(); } },
  cfShift: async ()=>{ const k = curK(), cf = UI.sheet.conflict; const o = k && cf && cfOpts(k, cf); if (!o || !o.shiftTo) return;
    try{ await updateBk(o.next, { time: o.shiftTo }); const ok = await doExtend(k, cf.add, cf.svcId, true);
      if (ok){ UI.sheet = { id:o.next.id, mode:"msg", wa:{ phone:o.next.phone, text:movedMsg(o.next, o.next.date, o.shiftTo) } }; render(); } }
    catch(e){ console.error(e); toast(t("save_fail")); render(); } },
  mvDate: v=>go(()=>{ UI.sheet.mvDate = v; UI.sheet.mvTime = null; }),
  mvBarber: v=>go(()=>{ UI.sheet.mvBarber = v; UI.sheet.mvTime = null; }),
  mvTime: v=>go(()=>{ const [tm] = v.split("|"); UI.sheet.mvTime = tm; }),
  mvGo: async ()=>{ const k = curK(), sh = UI.sheet; if (!k || !sh.mvTime) return; const s = S.salon, d = bkDur(s,k);
    const sl = (freeSlots(s, sh.mvDate, k.serviceId, sh.mvBarber, ownerSlotsMap(sh.mvDate), { dur:d, skip: sh.mvDate===k.date ? {b:k.barberId, start:toMin(k.time)} : null })||[]).find(x=>x.time===sh.mvTime);
    if (!sl){ toast(t("taken")); render(); return; }
    UI.busy = true; render();
    try{ await updateBk(k, { date: sh.mvDate, time: sl.time, barberId: sl.barberId, reminded: false });
      UI.sheet = { id:k.id, mode:"msg", wa:{ phone:k.phone, text:movedMsg(k, sh.mvDate, sl.time) } }; }
    catch(e){ console.error(e); toast(t("save_fail")); }
    UI.busy = false; render(); },
  leaveToggle: async v=>{ const [bid, d] = v.split("|"); const s = S.salon; const old = ymd(new Date(Date.now()-DAY));
    const cur = ((s.leave||{})[bid]||[]).filter(x=>x>=old); const next = cur.includes(d) ? cur.filter(x=>x!==d) : cur.concat(d).sort();
    s.leave = {...(s.leave||{}), [bid]: next}; render();
    try{ await updateDoc(doc(db,"salons",S.sid), { ["leave."+bid]: next }); toast(t("leave_saved")); }catch(e){ console.error(e); toast(t("save_fail")); } },
  tlDay: v=>go(()=>{ const cur = new Date((UI.tlDate||ymd(new Date()))+"T00:00"); cur.setDate(cur.getDate()+Number(v)); UI.tlDate = ymd(cur); }),
  tlTap: (v, e, el)=>{ const open = Number(el.dataset.open), r = el.getBoundingClientRect(); const m = open + Math.max(0, Math.floor((e.clientY - r.top)/PPM/15)*15);
    pushNav(); UI.tab = "book"; UI.bookedData = null; UI.book = { barber: v, date: el.dataset.date, time: toHM(m), prefTime: toHM(m) }; UI.err = ""; render(); window.scrollTo(0,0); },
  calMove: v=>go(()=>{ const n = Number(v); const td = ymd(new Date()); if (!n){ UI.calYM = td.slice(0,7); UI.calDay = null; return; }
    const [y,m] = (UI.calYM||td.slice(0,7)).split("-").map(Number); const d = new Date(y, m-1+n, 1); UI.calYM = d.getFullYear()+"-"+pad(d.getMonth()+1); UI.calDay = null; }),
  calDay: v=>go(()=>{ UI.calDay = UI.calDay===v ? null : v; }),
  rwReveal: async id=>{ const o = (S.offers||[]).find(x=>x.id===id); if (!o || UI.claiming || (S.claims||{})[id]) { render(); return; }
    UI.claiming = true; UI.scratching = null;
    try{ await claimOffer(o); UI.justGot = id; beep(); try{ navigator.vibrate && navigator.vibrate(120); }catch(e){} setTimeout(()=>{ UI.justGot = null; }, 2500); }
    catch(e){ console.error(e); toast(t("rw_fail")); }
    UI.claiming = false; render(); },
  rwClick: id=>{ const c = (S.claims||{})[id]; if (c && !c.clicked) updateDoc(doc(db,"salons",S.sid,"claims",id),{clicked:true}).catch(()=>{}); },
  rwPrevOpen: id=>go(()=>{ UI.scratching = null; UI.prevDone[id] = true; }),
  ofKind: v=>go(()=>{ UI.of.kind = v; UI.ofErr = ""; }),
  ofPreview: id=>go(()=>{ UI.ofPreview = UI.ofPreview===id ? null : id; UI.prevDone[id] = false; }),
  ofToggle: async id=>{ const x = (S.offers||[]).find(o=>o.id===id); if (!x) return; try{ await updateDoc(doc(db,"offers",id),{ active: !x.active }); toast(t("switched")); }catch(e){ console.error(e); toast(t("save_fail")); } },
  ofAudience: async id=>{ const x = (S.offers||[]).find(o=>o.id===id); if (!x) return; try{ await updateDoc(doc(db,"offers",id),{ newSince: x.newSince ? 0 : Date.now() }); toast(t("switched")); }catch(e){ console.error(e); toast(t("save_fail")); } },
  ofDelAsk: id=>go(()=>{ UI.ofDelAsk = id; }),
  ofDel: async id=>{ UI.ofDelAsk = null; try{ await deleteDoc(doc(db,"offers",id)); toast(t("switched")); }catch(e){ console.error(e); toast(t("save_fail")); } render(); },
  ofSave: async ()=>{ const o = UI.of; const days = Math.round(Number(o.days)||0), link = String(o.link||"").trim();
    if (!String(o.title).trim() || (o.kind==="days" && (days<1 || days>30)) || (o.kind==="deal" && !String(o.code).trim() && !link) || (link && !/^https:\/\/\S+$/i.test(link))){ UI.ofErr = t("of_need"); render(); return; }
    const now = Date.now();
    const data = { kind:o.kind, title:String(o.title).trim().slice(0,60), desc:String(o.desc||"").trim().slice(0,120), reveal:String(o.reveal||"").trim().slice(0,40), note:String(o.note||"").trim().slice(0,140),
      active:true, order:now, createdAt:now, newSince: o.newOnly ? now : 0, endsAt: o.ends ? new Date(o.ends+"T23:59:59").getTime() : 0, days: o.kind==="days" ? days : 0 };
    if (o.kind==="deal"){ data.brand = String(o.brand||"").trim().slice(0,40); data.code = String(o.code||"").trim().slice(0,30); data.link = link; }
    UI.busy = true; UI.ofErr = ""; render();
    try{ await setDoc(doc(collection(db,"offers")), data); UI.of = OF0(); toast(t("of_created")); }catch(e){ console.error(e); UI.ofErr = t("save_fail"); }
    UI.busy = false; render(); },
  admReject: async id=>{ try{ await updateDoc(doc(db,"salons",id),{ payReq:deleteField() }); toast(t("rejected")); }catch(e){ toast(t("save_fail")); } },
  admToggle: async id=>{ const x = S.allSalons.find(s=>s.id===id); try{ await updateDoc(doc(db,"salons",id),{ active: x.active===false }); toast(t("switched")); }catch(e){ toast(t("save_fail")); } },
  admAdjust: async v=>{ const [id, ds] = v.split("|"); const d = Number(ds); const x = S.allSalons.find(s=>s.id===id); if (!x) return;
    const cur = (x.sub||{}).expires||0; const base = d>0 ? Math.max(Date.now(), cur) : cur;
    const next = Math.max(0, base + d*DAY);
    try{ await updateDoc(doc(db,"salons",id),{ "sub.expires": next }); toast(t("adj_done",{date:longDate(next)})); }catch(e){ toast(t("save_fail")); } },
  leadCsv: ()=>{
    const cell = v => { const x = String(v==null?"":v).replace(/\r?\n/g," ").trim(); return /[",;]/.test(x) ? '"'+x.replace(/"/g,'""')+'"' : x; };
    const head = ["Date","Time","Owner name","Salon","Area","Mobile","Language","Problems picked","Clients lost per day","Average bill (Rs)","Monthly loss (Rs)"];
    const rows = (S.leads||[]).map(x=>{ const d = x.at ? new Date(x.at) : null;
      return [d?ymd(d):"", d?pad(d.getHours())+":"+pad(d.getMinutes()):"", x.name, x.salon, x.area||"", x.phone, x.lang==="hi"?"Hindi":"English", (x.picks||[]).join(" | "),
        x.lost==null?"":x.lost, x.avg==null?"":x.avg, x.avg?(Number(x.lost)||0)*(Number(x.avg)||0)*26:""].map(cell).join(","); });
    const blob = new Blob(["\ufeff"+[head.join(",")].concat(rows).join("\r\n")], {type:"text/csv;charset=utf-8"});
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "salonslot-leads-"+ymd(new Date())+".csv"; document.body.appendChild(a); a.click(); setTimeout(()=>{URL.revokeObjectURL(a.href); a.remove();},1000);
    toast(t("csv_done",{n:rows.length})); },
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

app.addEventListener("click", e => { const el = e.target.closest("[data-a]"); if (!el || el.disabled) return; const f = A[el.dataset.a]; if (f){ if (el.tagName!=="A") e.preventDefault(); f(el.dataset.v, e, el); } });
// add-work search: matching services jump to the top and light up, the rest fade
function filterShChips(q){
  q = String(q||"").trim().toLowerCase(); let hits = 0;
  document.querySelectorAll("#shChips .chip").forEach(c=>{ const m = !q || (c.dataset.name||"").includes(q);
    if (m && q) hits++; c.classList.toggle("hit", !!q && m); c.classList.toggle("dim", !!q && !m); c.style.order = q && m ? "0" : "1"; });
  const none = document.getElementById("shNone"); if (none) none.hidden = !q || hits>0;
}
app.addEventListener("input", e => { const el = e.target, d = el.dataset; if (d.shs){ filterShChips(el.value); return; } const o = editTarget();
  if (d.salon && o){ o[d.salon] = el.value; if (o===S.salon) queueSave(); }
  else if (d.svc && o){ const s = o.services.find(x=>x.id===d.svc); if (s){ s[d.k] = el.value; if (o===S.salon) queueSave(); } }
  else if (d.bar && o){ const b = o.barbers.find(x=>x.id===d.bar); if (b){ b[d.k] = el.value; if (o===S.salon) queueSave(); } }
  else if (d.bc){ const c = contactsOf(); c[d.bc] = {...(c[d.bc]||{}), [d.k]: el.value}; if (UI.view==="main") queueSave(); }
  else if (d.book){ UI.book[d.book] = el.value; }
  else if (d.of){ UI.of[d.of] = el.type==="checkbox" ? el.checked : el.value; }
  else if (d.bill && UI.bill){ if (d.bill==="p"){ const x = UI.bill.items[Number(d.i)]; if (x) x.p = el.value; } else UI.bill[d.bill] = el.value;
    const tot = document.getElementById("billTotal"); if (tot) tot.textContent = rs(billSum(UI.bill).total); }
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
function stopOwner(){ S.unsub.forEach(f=>{try{f()}catch(e){}}); S.unsub=[]; if (S.adminUnsub){ S.adminUnsub(); S.adminUnsub=null; }
  ["adminClaimsUnsub","offersUnsub","adminLeadsUnsub"].forEach(k=>{ if (S[k]){ try{ S[k](); }catch(e){} S[k]=null; } });
  S.salon=null; S.bookings=[]; S.allSalons=null; S.contacts={}; S.offers=null; S.claims={}; S.allClaims=null; }
function startOwner(sid){
  S.sid = sid; S.firstSnap = true;
  S.unsub.push(onSnapshot(doc(db,"salons",sid), d => {
    if (!d.exists()){ if (UI.view!=="setup" && UI.view!=="adminOnly"){ D = { name:"", owner:S.user.displayName||"", phone:"", address:"", mapLink:"", area:"", open:"10:00", close:"21:00", days:[0,1,2,3,4,5,6], services:[], barbers:[] }; UI.view="setup"; UI.step=1; render(); } return; }
    const fresh = {id:d.id, ...d.data()};
    if (S.salon && (saveTimer || document.activeElement && document.activeElement.closest && document.activeElement.closest("[data-salon],[data-svc],[data-bar]"))){
      // keep local edits, take server-owned fields
      S.salon.sub = fresh.sub; S.salon.active = fresh.active; S.salon.leave = fresh.leave; S.salon.payReq = fresh.payReq; S.salon.payments = fresh.payments;
    } else S.salon = fresh;
    if (UI.view!=="main"){ UI.view="main"; UI.tab="home"; }
    if (!(document.activeElement && document.activeElement.matches && document.activeElement.matches("input,select,textarea"))) render();
  }, err => { console.error(err); }));
  S.unsub.push(onSnapshot(doc(db,"salons",sid,"private","contacts"), d => {
    if (saveTimer) return; S.contacts = d.exists() ? (d.data().barbers||{}) : {};
    if (UI.view==="main" && !(document.activeElement && document.activeElement.matches && document.activeElement.matches("input,select,textarea"))) render();
  }, err => console.error(err)));
  watchOffers();
  S.unsub.push(onSnapshot(collection(db,"salons",sid,"claims"), snap => {
    S.claims = {}; snap.docs.forEach(d=>{ S.claims[d.id] = d.data(); });
    if (UI.view==="main" && !typing()) render();
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
  const msg = t("rem_msg",{name:due.cust, svc:svc.name, salon:S.salon.name, time:nice(due.time), n}) + "\n" + (LANG==="hi"?"रास्ता: ":"Map: ") + mapUrl(S.salon);
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
