// Tester tous les formats d'URL pour les images de groupe
const GROUP_ID = 13212005;

async function testGroupImageURLs() {
  console.log('🔵 Test de différentes URLs d\'image pour le groupe', GROUP_ID);
  console.log('');
  
  const urls = [
    `https://www.roblox.com/group-thumbnails?groupId=${GROUP_ID}&width=150&height=150&format=png`,
    `https://www.roblox.com/group-thumbnails?groupId=${GROUP_ID}&width=150&height=150&format=Png`,
    `https://roblox.com/group-thumbnails?groupId=${GROUP_ID}&width=150&height=150&format=png`,
    `https://thumbnails.roblox.com/v1/groups/${GROUP_ID}/icons?size=150x150&format=png`,
    `https://tr.roblox.com/group-thumbnails?groupId=${GROUP_ID}&width=150&height=150&format=png`,
    `https://assetdelivery.roblox.com/v1/asset-thumbnail/groups/${GROUP_ID}?size=150x150&format=Png`,
    `https://www.roblox.com/group-thumbnails?groupId=${GROUP_ID}/avatar`,
    `https://roblox.com/GroupProfile/Group.aspx?gid=${GROUP_ID}`,
  ];
  
  for (const url of urls) {
    try {
      console.log(`🔵 Testing: ${url}`);
      
      const res = await fetch(url, { 
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0'
        }
      });
      
      console.log(`   Status: ${res.status}`);
      
      if (res.status === 200 || res.status === 304) {
        console.log(`   ✅ URL works!`);
        console.log(`   Content-Type: ${res.headers.get('content-type')}`);
        console.log(`   Content-Length: ${res.headers.get('content-length')}`);
      } else if (res.status === 404) {
        console.log(`   ❌ Not found`);
      }
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
    }
  }
}

testGroupImageURLs().then(() => {
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
