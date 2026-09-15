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

// Placeholder price — replace with real prices via the admin UI.
const PLACEHOLDER_PRICES = {
  1: 0.01,
  2: 0.01,
  3: 0.01,
  4: 0.01,
  5: 0.01,
  6: 0.01,
  7: 0.01,
  8: 0.01,
  9: 0.01,
  10: 0.01,
  11: 0.01,
};

const items = Array.from({ length: 11 }, (_, i) => {
  const n = i + 1;
  return {
    id: `item-${n}`,
    name: `Item ${n}`,
    description: '',
    imageUrl: `items/item-${n}.jpg`,
    price: PLACEHOLDER_PRICES[n],
  };
});

for (const { id, ...data } of items) {
  await setDoc(doc(db, 'items', id), data);
  console.log('seeded', id);
}

console.log(`Done. Seeded ${items.length} items.`);
process.exit(0);
