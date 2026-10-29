/* Saves the salon owner's details from the pitch game into Firestore "leads".
   If the save fails (no internet, rules not published yet), the lead waits in this phone's
   storage and is sent again the next time the page opens or another lead is saved. */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, doc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const app = initializeApp({
  apiKey: "AIzaSyD5CSchGGl9NTsPDgwmfRkhrvyogCRrbZ0",
  authDomain: "salonslot-d44af.firebaseapp.com",
  projectId: "salonslot-d44af",
  storageBucket: "salonslot-d44af.firebasestorage.app",
  messagingSenderId: "1041857314935",
  appId: "1:1041857314935:web:ac9cb74373273477a80672"
}, "pitch");
const db = getFirestore(app);
const QKEY = "ss_pitch_queue";

const readQ = () => { try{ return JSON.parse(localStorage.getItem(QKEY) || "[]"); }catch(e){ return []; } };
const writeQ = q => { try{ localStorage.setItem(QKEY, JSON.stringify(q.slice(-200))); }catch(e){} };

// one queued item = { id, base, patch } ; base is written once, patch merged after
async function send(item){
  const ref = doc(db, "leads", item.id);
  if (!item.baseSent){ await setDoc(ref, item.base); item.baseSent = true; }
  if (item.patch && Object.keys(item.patch).length){ await updateDoc(ref, item.patch); item.patch = null; }
}
// one flush at a time; whatever was added meanwhile is sent by a follow-up run
let flushing = false, again = false;
async function flush(){
  if (flushing){ again = true; return; }
  flushing = true;
  try{
    const done = {};   // id -> { base: true?, patch: JSON of the patch that went out }
    for (const it of readQ()){
      const before = JSON.stringify(it.patch || null), hadBase = !!it.baseSent;
      try{ await send(it); done[it.id] = { base:true, patch:before }; }
      catch(e){ console.warn("lead not sent yet", e && e.code); if (!hadBase && it.baseSent) done[it.id] = { base:true, patch:null }; }
    }
    // merge with the stored queue as it is NOW, so a result added during the send is kept
    const fresh = readQ().filter(x=>{
      const d = done[x.id]; if (!d) return true;
      if (d.base) x.baseSent = true;
      if (d.patch && JSON.stringify(x.patch || null)===d.patch) x.patch = null;
      return !(x.baseSent && !x.patch);
    });
    writeQ(fresh);
  } finally { flushing = false; }
  if (again){ again = false; flush(); }
}

window.SS_LEAD = {
  // returns the lead id at once; the write happens in the background
  start(d){
    const id = doc(collection(db, "leads")).id;
    const base = { name:String(d.name).trim().slice(0,60), salon:String(d.salon).trim().slice(0,80), phone:String(d.phone), lang:d.lang==="hi"?"hi":"en", at:Date.now(), src:"pitch" };
    const q = readQ(); q.push({ id, base, patch:null, baseSent:false }); writeQ(q);
    flush();
    return id;
  },
  finish(id, p){
    const q = readQ(), it = q.find(x=>x.id===id);
    const patch = { picks:(p.picks||[]).slice(0,3).map(x=>String(x).slice(0,80)), lost:Math.round(Number(p.lost)||0), avg:Math.round(Number(p.avg)||0), doneAt:Date.now() };
    if (it){ it.patch = patch; writeQ(q); } else { q.push({ id, base:null, baseSent:true, patch }); writeQ(q); }
    flush();
  },
  pending(){ return readQ().length; }
};
flush();
window.addEventListener("online", flush);
