// One-off seed script: populates the `items` collection with the 11 parts
// cropped from the initial catalog image. Uses the same public web config as
// the app, so it only needs `firestore.rules` to allow writes (true during dev).
//
// Keep this config in sync with src/app/core/firebase.config.ts (Node can't
// import the .ts file directly without a build step).
//
// Run with: node scripts/seed-items.mjs
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDLkfQGBG6sZSPO1JnfcfdeT7SIqy-p3Uo',
  authDomain: 'printmaker-shop.firebaseapp.com',
  projectId: 'printmaker-shop',
  storageBucket: 'printmaker-shop.firebasestorage.app',
  messagingSenderId: '294320308504',
  appId: '1:294320308504:web:8ae3d688e0d801bc209e6d',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Placeholder prices from the "Printmaker cart and success design" mockup
// (items 7-9 weren't in the mockup's 8-item sample, so these three continue
// its price range) — replace with real prices via the admin UI.
const PLACEHOLDER_PRICES = {
  1: 12,
  2: 18,
  3: 24,
  4: 9.5,
  5: 15,
  6: 22,
  7: 19,
  8: 11,
  9: 16,
  10: 14,
  11: 28,
};

// Placeholder stock, likewise from the mockup (items 7-9 filled in).
const PLACEHOLDER_STOCK = { 1: 6, 2: 3, 3: 2, 4: 12, 5: 0, 6: 4, 7: 5, 8: 8, 9: 3, 10: 7, 11: 1 };

const items = Array.from({ length: 11 }, (_, i) => {
  const n = i + 1;
  return {
    id: `item-${n}`,
    name: `Item ${n}`,
    description: '',
    imageUrl: `items/item-${n}.jpg`,
    count: PLACEHOLDER_STOCK[n],
    price: PLACEHOLDER_PRICES[n],
  };
});

for (const { id, ...data } of items) {
  await setDoc(doc(db, 'items', id), data);
  console.log('seeded', id);
}

console.log(`Done. Seeded ${items.length} items.`);
process.exit(0);
