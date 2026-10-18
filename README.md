# SalonSlot

Salon booking app for barbers and salons, in Hindi and English.

- **Owners** sign in with Google, set up their salon (hours, services, barbers with photos) and get a booking link.
- **Customers** open the link (`?s=<salonId>`), pick a service, barber, day and time, and book. No login needed.
- **Admin** (the app owner) sees every salon, approves UPI payments and switches salons on or off.

Built as a static site (GitHub Pages) on Firebase Auth + Cloud Firestore.
Security rules live in `firestore.rules` — paste them into Firebase Console → Firestore → Rules.
