// Test new edition mapping (Mondays only)
const fs = require('fs');
const path = require('path');

const editionsDir = path.join(__dirname, 'public', 'editions');

function parseEditionFolder(folderName) {
  const match = folderName.match(/Edition (\d+)/);
  if (match) {
    const editionNum = parseInt(match[1]);
    // Edition 02 = June 24, 2024 (first Monday)
    const startDate = new Date('2024-06-24');
    startDate.setDate(startDate.getDate() + (editionNum - 2) * 7);
    return startDate.toISOString().split('T')[0];
  }
  return null;
}

try {
  const folders = fs.readdirSync(editionsDir)
    .filter(name => {
      const fullPath = path.join(editionsDir, name);
      return fs.statSync(fullPath).isDirectory() && name.startsWith('Edition');
    })
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });

  console.log('\n📰 FIXED: Only Editions with Images (Mondays Only):\n');
  
  let count = 0;
  folders.forEach(folder => {
    const editionPath = path.join(editionsDir, folder);
    const files = fs.readdirSync(editionPath)
      .filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png'));
    
    if (files.length > 0) {
      count++;
      const date = parseEditionFolder(folder);
      const url = `http://localhost:3001/${date}/fullpaper`;
      const dateObj = new Date(date);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
      
      console.log(`${count}. ${folder} - ${dayName} ${date}`);
      console.log(`   Images: ${files.length}`);
      console.log(`   URL: ${url}`);
      console.log('');
    }
  });
  
  console.log(`✅ Total Editions with Images: ${count}\n`);
  
} catch (error) {
  console.error('Error:', error.message);
}
