# SalonSlot Field (v2026.11.26-1, phase 2)

Separate small app for the field team: attendance (Start / Time out), salon visits with a camera photo, and an Admin view.
Lives at `/field/` (https://arjun-labs.github.io/Salonslot/field/). Uses the same Firebase project; the salon app is not touched.

Phase 2 adds GPS tracking while a day is open: a point every 3 minutes or after moving 50 m (kept in the phone and sent every minute when online). 15-minute rule: if the boy stays within 50 m of the Start point for the first 15 minutes and saves no visit, that day is marked "still" (no attendance). Admin gets an "आज" live tab, a per-day map (route, stops over 5 min, signal gaps) and a "पुराना डेटा मिटाएँ" button for the 90-day cleanup.

Limit of the web app: GPS runs only while the app is open and the screen is on (the app asks the phone to keep the screen awake). An Android APK (phase 3) is still to be built.

## Before first use
1. Firebase Console → Firestore → Rules: paste the whole `firestore.rules` from this repo and Publish.
2. Open `/field/` in Chrome as Arjun (Admin) → लोग → add the boy's Gmail, name, type.
3. Send the boy the `/field/` link; he signs in with that Gmail, accepts the consent text, and uses Start.

## Data (Firestore)
`field_staff/{email}`, `field_days/{email_date}`, `field_visits/{id}` (with a small thumbnail), `field_photos/{id}` (full JPEG, time and place printed on it), `field_points/{email_date_HH}` (GPS points, one doc per hour).
Location data is kept 90 days; press the cleanup button in Admin → लोग about once a month. Re-publish `firestore.rules` after pulling phase 2 (new `field_points` rules).
