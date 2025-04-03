import { readFileSync } from 'node:fs';

import { clearCollectionData, insertLegacyOrders, insertLegacyPayments, insertLegacyNotes, insertLegacyUsers, insertLegacyCounters } from './db/legacyDAO.js';

const { orders, payments, notes, users, counters } = JSON.parse(readFileSync('legacyData.txt'));

console.log('Deleting all old database data...');
await clearCollectionData();

console.log('Inserting existing user data...');
await insertLegacyUsers(users);
console.log('Inserting existing orders...');
await insertLegacyOrders(orders);
console.log('Inserting existing payments...');
await insertLegacyPayments(payments);
console.log('Inserting existing notes...');
await insertLegacyNotes(notes);
console.log('Inserting existing counters...');
await insertLegacyCounters(counters);

console.log('Done!');
process.exit();