# SalonSlot Field (v2026.11.23-1, phase 1)

Separate small app for the field team: attendance (Start / Time out), salon visits with a camera photo, and an Admin view.
Lives at `/field/` (https://arjun-labs.github.io/Salonslot/field/). Uses the same Firebase project; the salon app is not touched.

Phase 1 has no continuous GPS. Location is taken once at Start, at each visit and at Time out. The 15-minute / 50 m rule comes in phase 2.

## Before first use
1. Firebase Console → Firestore → Rules: paste the whole `firestore.rules` from this repo and Publish.
2. Open `/field/` in Chrome as Arjun (Admin) → लोग → add the boy's Gmail, name, type.
3. Send the boy the `/field/` link; he signs in with that Gmail, accepts the consent text, and uses Start.

## Data (Firestore)
`field_staff/{email}`, `field_days/{email_date}`, `field_visits/{id}` (with a small thumbnail), `field_photos/{id}` (full JPEG, time and place printed on it).
Location data is meant to be kept 90 days; a cleanup job is not built yet.
