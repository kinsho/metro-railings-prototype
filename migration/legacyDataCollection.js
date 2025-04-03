import { writeFileSync } from 'node:fs';

import { pullLegacyData } from './db/legacyDAO.js';

const legacyData = await pullLegacyData();
console.log('Writing out the data to a text file...');
writeFileSync('legacyData.txt', JSON.stringify(legacyData));

console.log('Done!');
process.exit();