// Quick test to show available editions
const fs = require('fs');
const path = require('path');

const editionsDir = path.join(__dirname, 'public', 'editions');

function parseEditionFolder(folderName) {
  const match = folderName.match(/Edition (\d+)/);
  if (match) {
    const editionNum = parseInt(match[1]);
    const startDate = new Date('2024-06-22');
    startDate.setDate(startDate.getDate() + (editionNum - 1) * 7);
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

  console.log('\n📰 Available Editions:\n');
  
  folders.forEach(folder => {
    const editionPath = path.join(editionsDir, folder);
    const files = fs.readdirSync(editionPath)
      .filter(f => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png'));
    
    const date = parseEditionFolder(folder);
    const url = `http://localhost:3001/${date}/fullpaper`;
    
    console.log(`${folder} (${date})`);
    console.log(`  Images: ${files.length}`);
    console.log(`  URL: ${url}`);
    console.log('');
  });
  
} catch (error) {
  console.error('Error:', error.message);
}
