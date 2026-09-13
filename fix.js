const fs = require('fs');
const files = [
  'components/LeaderboardTable.tsx',
  'components/OutbidModal.tsx',
  'components/CasteProfileModal.tsx',
  'components/ShareCardModal.tsx',
  'components/AddCasteModal.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  content = content.replace(/\\\$\{/g, '${');
  fs.writeFileSync(f, content);
  console.log('Fixed ' + f);
});
