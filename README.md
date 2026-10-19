# SalonSlot

Salon booking app for barbers and salons, in Hindi and English.

- **Owners** sign in with Google, set up their salon (hours, services, barbers with photos) and get a booking link.
- **Customers** open the link (`?s=<salonId>`), pick a service, barber, day and time, and book. No login needed.
- **Admin** (the app owner) sees every salon, approves UPI payments and switches salons on or off.

Built as a static site (GitHub Pages) on Firebase Auth + Cloud Firestore.
Security rules live in `firestore.rules` — paste them into Firebase Console → Firestore → Rules.

## Test link
`/beta/` is a copy of the app for trying changes before everyone gets them:
https://arjun-labs.github.io/Salonslot/beta/ — it uses the same Firebase data, so test with your own salon.
New changes go to `beta/` first; once checked, they are copied to the root for all salons.
Bump `APP_VERSION` in `app.js` and `version.json` together so open apps show the "new version" banner.
