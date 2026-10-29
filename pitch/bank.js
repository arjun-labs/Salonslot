/* SalonSlot pitch game: the problem bank.
   Each game shows 6 of these at random (ones shown last time come up less).
   Add a new problem by copying one block. Keep every "pts" line to what the app really does today.
   ic = icon name (see ICONS in game.js). them/us = one comparison point shown on the offer screen. */
window.SS_BANK = [
  { id:"phone", ic:"phone",
    en:{ t:"Booking calls in the middle of work", s:"Scissors in hand, phone ringing", h:"Clients book themselves",
         pts:["From the counter QR or a WhatsApp link, 24 hours, no app, no login","The client picks the service, barber and time","A new booking shows on your phone with a sound"],
         them:"Phone / diary: bookings only when the shop is open and you are free", us:"24-hour booking, no app for the client, English + Hindi" },
    hi:{ t:"काम के बीच booking का फ़ोन", s:"कैंची हाथ में है और फ़ोन बज रहा है", h:"Client ख़ुद booking करता है",
         pts:["Counter के QR या WhatsApp link से, 24 घंटे, बिना app और बिना login","Service, barber और time client ख़ुद चुनता है","नई booking आते ही आपके फ़ोन पर आवाज़ के साथ दिखती है"],
         them:"फ़ोन / डायरी: दुकान खुली हो और आप फ़्री हों तभी booking", us:"24 घंटे booking, client का कोई app नहीं, हिंदी + English" } },

  { id:"diary", ic:"diary",
    en:{ t:"Diary mix-ups", s:"Two names on one time, or the page is missing", h:"Double booking cannot happen",
         pts:["Clients only see free times","One slot, one booking","Today, tomorrow and the whole week on one screen"],
         them:"Diary: costs ₹0, but every mistake costs a client", us:"Every booking confirmed, on your phone" },
    hi:{ t:"डायरी की गड़बड़", s:"एक time पर दो नाम, या पन्ना ही नहीं मिलता", h:"Double booking हो ही नहीं सकती",
         pts:["Client को सिर्फ़ ख़ाली time दिखते हैं","एक slot पर एक ही booking","आज, कल और पूरे हफ़्ते की booking एक screen पर"],
         them:"डायरी: ₹0, पर हर गड़बड़ का नुकसान", us:"हर booking पक्की, phone पर" } },

  { id:"line", ic:"line",
    en:{ t:"Clients get tired of waiting and leave", s:"Long wait, and they walk to the next salon", h:"Clients come at their time, straight to the chair",
         pts:["Clients book a time before they come","The app reminds you 20 minutes before each booking","Short 10-minute slots, so a threading does not block half an hour"],
         them:"Big software: demo calls, training, long setup", us:"Live in 5 minutes, I set it up at your shop" },
    hi:{ t:"Client लाइन में थककर चला जाता है", s:"इंतज़ार लंबा हुआ तो दूसरी दुकान", h:"Client अपने time पर सीधा कुर्सी पर",
         pts:["Client पहले से time book करके आता है","हर booking से 20 मिनट पहले app आपको याद दिलाता है","10 मिनट के छोटे slots, ताकि threading पर आधा घंटा न जाए"],
         them:"बड़े software: demo call, training, लंबा setup", us:"5 मिनट में चालू, मैं दुकान पर आकर करता हूँ" } },

  { id:"barber", ic:"barber",
    en:{ t:"Not sure which barber is free when", s:"Telling every barber his schedule again and again", h:"Each barber gets his own column",
         pts:["Today’s timeline shows every barber’s bookings side by side","One tap sends each barber his day on WhatsApp","Tap an empty spot on the timeline to add a walk-in there"],
         them:"Big software: lots of options to learn", us:"Only what you need, easy to run" },
    hi:{ t:"कौन barber कब ख़ाली, पता नहीं", s:"हर barber को उसका schedule बार-बार बताना", h:"हर barber का अपना कॉलम",
         pts:["आज की timeline में हर barber की bookings अगल-बगल","एक tap में हर barber को उसका दिन WhatsApp पर","Timeline में ख़ाली जगह tap करो, वहीं walk-in booking"],
         them:"बड़े software: बहुत options, सीखना पड़ता है", us:"सिर्फ़ ज़रूरी चीज़ें, चलाना आसान" } },

  { id:"bill", ic:"bill",
    en:{ t:"No bill for the client, no record of earnings", s:"By evening you don’t know what you made today", h:"Bill on WhatsApp, totals done for you",
         pts:["Tap “Done” and the prices are already filled in, with discount and Cash / UPI","The bill goes straight to the client’s WhatsApp, with your booking link at the bottom","Today’s earnings on Home, the month’s totals in Calendar"],
         them:"Diary: adding up totals by hand every evening", us:"Day and month totals add up by themselves" },
    hi:{ t:"Client को bill नहीं, कमाई का हिसाब नहीं", s:"शाम को पता नहीं आज कितना बना", h:"WhatsApp पर bill, अपने आप हिसाब",
         pts:["“Done” दबाते ही दाम भरे मिलते हैं, discount और Cash / UPI के साथ","Bill सीधे client के WhatsApp पर, नीचे आपकी booking का link","दिन की कमाई Home पर, महीने का हिसाब Calendar में"],
         them:"डायरी: हर शाम हाथ से जोड़ना", us:"दिन और महीने का हिसाब अपने आप" } },

  { id:"family", ic:"family",
    en:{ t:"The right barber for ladies and gents", s:"In a family salon, bookings go to the wrong person", h:"Made for family salons",
         pts:["Mark each service as for men, for women or for everyone","Mark whom each barber works on: men, women or both","A ladies service shows only the people who do ladies work, and “any barber” picks from them"],
         them:"Big software: setup mostly in English", us:"English + Hindi, one tap per service and barber" },
    hi:{ t:"Ladies-Gents के लिए सही barber", s:"Family सैलून में ग़लत barber को booking", h:"Family सैलून के लिए बना",
         pts:["हर service पर: पुरुष, महिला या सबके लिए","हर barber पर: पुरुष, महिला या दोनों का काम","Ladies service पर सिर्फ़ ladies का काम करने वाले दिखते हैं, “कोई भी” भी उन्हीं में से चुनता है"],
         them:"बड़े software: setup ज़्यादातर English में", us:"हिंदी + English, हर service और barber पर 1 tap" } },

  { id:"noshow", ic:"bell",
    en:{ t:"Clients book and then forget to come", s:"The slot stays empty and someone else was turned away", h:"Reminders before every booking",
         pts:["The app reminds you 20 minutes before each booking","Send the client a WhatsApp reminder in one tap","The client can add the booking to Google Calendar"],
         them:"Diary: no reminder at all", us:"A reminder before every booking" },
    hi:{ t:"Client booking करके भूल जाता है", s:"Slot ख़ाली रहा, और किसी और को मना कर दिया था", h:"हर booking से पहले याद दिलाना",
         pts:["हर booking से 20 मिनट पहले app आपको याद दिलाता है","एक tap में client को WhatsApp reminder","Client booking को Google Calendar में जोड़ सकता है"],
         them:"डायरी: कोई reminder नहीं", us:"हर booking से पहले reminder" } },

  { id:"night", ic:"moon",
    en:{ t:"Clients want to book at night or on holidays", s:"The shop is closed, nobody picks up the phone", h:"Your shop takes bookings even when closed",
         pts:["Your booking link works 24 hours, 7 days","Clients only see times when you are open","In the morning, every booking is waiting on your screen"],
         them:"Phone: closed shop means a lost booking", us:"Bookings come in even at night" },
    hi:{ t:"Client रात को या छुट्टी के दिन booking चाहता है", s:"दुकान बंद है, फ़ोन कोई नहीं उठाता", h:"दुकान बंद हो, booking फिर भी चालू",
         pts:["आपका booking link 24 घंटे, सातों दिन चलता है","Client को सिर्फ़ वही time दिखते हैं जब दुकान खुली हो","सुबह सारी bookings आपकी screen पर तैयार"],
         them:"फ़ोन: दुकान बंद तो booking गई", us:"रात में भी booking आती है" } },

  { id:"extra", ic:"plus",
    en:{ t:"A client adds a service in the middle", s:"“Do the beard too” and the next booking gets late", h:"“+ Add work” sorts it out",
         pts:["Add the service or extra minutes to the booking in one tap","If it runs into the next booking, the app offers to give that next client to a free barber","Or it moves the next booking later and writes the WhatsApp message for you"],
         them:"Diary: the whole day gets pushed and nobody is told", us:"The app shows the way out in one screen" },
    hi:{ t:"Client बीच में और काम जुड़वाता है", s:"“दाढ़ी भी कर दो” और अगली booking लेट", h:"“+ काम जोड़ें” से हल",
         pts:["एक tap में service या extra मिनट booking में जुड़ते हैं","अगली booking से टकराए तो app अगले client को किसी ख़ाली barber को देने का रास्ता देता है","या अगली booking आगे खिसकाकर WhatsApp message तैयार कर देता है"],
         them:"डायरी: पूरा दिन खिसक जाता है, किसी को पता नहीं", us:"App एक screen में रास्ता बताता है" } },

  { id:"leave", ic:"leave",
    en:{ t:"A barber is on leave and his clients still come", s:"Bookings were made with someone who isn’t here", h:"Mark leave, bookings stop",
         pts:["Tap the days a barber is on leave","Clients can’t book with him on those days","Bookings already made for that day show a “Change time” button"],
         them:"Diary: you find out when the client arrives", us:"Leave marked, bookings blocked in advance" },
    hi:{ t:"Barber छुट्टी पर, फिर भी उसके client आ जाते हैं", s:"जो है ही नहीं उसके नाम booking", h:"छुट्टी mark करो, booking बंद",
         pts:["Barber की छुट्टी के दिन tap करके mark करो","उन दिनों client उसके साथ booking नहीं कर सकता","उस दिन की पहले वाली bookings पर “समय बदलें” का बटन"],
         them:"डायरी: client आए तब पता चलता है", us:"छुट्टी पहले से mark, booking बंद" } },

  { id:"move", ic:"move",
    en:{ t:"Changing a client’s time takes many calls", s:"Calling back and forth to find a new slot", h:"“Change time” in two taps",
         pts:["Pick a new day and a free time, any barber who can do it","The WhatsApp message to the client is written for you","The old slot opens up for others straight away"],
         them:"Phone: three calls to move one booking", us:"Two taps, message ready" },
    hi:{ t:"Client का time बदलना मतलब कई फ़ोन", s:"नया slot ढूँढने के लिए बार-बार call", h:"“समय बदलें” दो tap में",
         pts:["नया दिन और ख़ाली time चुनो, उस काम के लायक कोई भी barber","Client के लिए WhatsApp message अपने आप तैयार","पुराना slot तुरंत दूसरों के लिए ख़ाली"],
         them:"फ़ोन: एक booking के लिए तीन call", us:"दो tap, message तैयार" } },

  { id:"short", ic:"line",
    en:{ t:"Small jobs block big chunks of time", s:"A 10-minute threading takes a half-hour slot", h:"Every service at its real length",
         pts:["Set each service from 10 to 120 minutes","Short services get 10-minute slots","More clients fit in the same day"],
         them:"Diary: everything in half-hour blocks", us:"Slots that match the work" },
    hi:{ t:"छोटे काम पर बड़ा time block", s:"10 मिनट की threading, आधे घंटे का slot", h:"हर service का असली time",
         pts:["हर service 10 से 120 मिनट तक सेट करो","छोटी services के लिए 10 मिनट के slots","एक ही दिन में ज़्यादा client"],
         them:"डायरी: सब आधे-आधे घंटे में", us:"काम के हिसाब से slot" } },

  { id:"month", ic:"chart",
    en:{ t:"No idea how the month went", s:"Which barber did how much? Nobody knows", h:"The month in one screen",
         pts:["Calendar shows every day of the month","Tap a day to see who came and what was earned","Totals for each barber for the whole month"],
         them:"Diary: flipping pages at month end", us:"Month and barber totals ready" },
    hi:{ t:"महीने का हिसाब पता नहीं", s:"किस barber ने कितना काम किया? किसी को नहीं पता", h:"पूरा महीना एक screen पर",
         pts:["Calendar में महीने का हर दिन","किसी दिन पर tap करो: कौन आया, कितनी कमाई","हर barber का पूरे महीने का हिसाब"],
         them:"डायरी: महीने के आख़िर में पन्ने पलटो", us:"महीने और barber का हिसाब तैयार" } },

  { id:"find", ic:"map",
    en:{ t:"New clients can’t find the shop", s:"“Where exactly is it?” calls before every visit", h:"Address and map with every booking",
         pts:["Your address shows on the booking page","An “Open in Google Maps” button takes them to your door","The booking confirmation on WhatsApp carries the map link too"],
         them:"Phone: explaining the way again and again", us:"Map link with every booking" },
    hi:{ t:"नया client दुकान ढूँढ नहीं पाता", s:"हर बार “कहाँ पर है?” वाला call", h:"हर booking के साथ पता और map",
         pts:["Booking page पर आपकी दुकान का पता","“Google Maps में खोलें” से सीधा दुकान तक","WhatsApp वाले booking message में भी map का link"],
         them:"फ़ोन: बार-बार रास्ता समझाना", us:"हर booking के साथ map link" } },

  { id:"walkin", ic:"walk",
    en:{ t:"Walk-ins clash with booked clients", s:"A walk-in sits down and the booked client arrives", h:"Walk-ins go on the same screen",
         pts:["Add a walk-in in two taps from Home","That time is blocked for online booking straight away","Booked and walk-in clients side by side on the timeline"],
         them:"Diary: walk-ins never get written down", us:"Every client in one place" },
    hi:{ t:"Walk-in और booking वाले client टकराते हैं", s:"Walk-in बैठा, और booking वाला भी आ गया", h:"Walk-in भी उसी screen पर",
         pts:["Home से दो tap में walk-in entry","वो time online booking के लिए तुरंत बंद","Booking और walk-in, दोनों timeline में अगल-बगल"],
         them:"डायरी: walk-in कभी लिखा ही नहीं जाता", us:"हर client एक जगह" } },

  { id:"insta", ic:"insta",
    en:{ t:"People ask on Instagram but never book", s:"“Price?” “Free today?” and then nothing", h:"A booking link in your bio",
         pts:["Put your booking link in your Instagram bio and WhatsApp status","Clients see services, prices and barber photos","They book in under a minute, without calling"],
         them:"DMs: replying one by one, bookings lost", us:"One link: see, choose, book" },
    hi:{ t:"Instagram पर लोग पूछते हैं, पर booking नहीं करते", s:"“Rate?” “आज free है?” और फिर कुछ नहीं", h:"Bio में booking link",
         pts:["अपना booking link Instagram bio और WhatsApp status पर","Client services, दाम और barber की photo देखता है","बिना call किए, एक मिनट में booking"],
         them:"DM: एक-एक को जवाब, booking छूट जाती है", us:"एक link: देखो, चुनो, book करो" } }
];

/* The price point, always shown next to the problem's own point */
window.SS_PRICE = {
  en:{ them:"₹99 trial, then ₹499 a month but billed for the year at once (≈ ₹5,988)*", us:"₹499 every month, no lock-in, stop any time" },
  hi:{ them:"₹99 के बाद ₹499 महीना, पर साल का एक साथ (≈ ₹5,988)*", us:"₹499 हर महीना, कोई lock नहीं, जब चाहें बंद" }
};
