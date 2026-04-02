// Test différents endpoints pour les groupes
const USER_ID = '1743461749';

async function testGroupEndpoints() {
  const endpoints = [
    `https://groups.roblox.com/v1/users/${USER_ID}/groups`,
    `https://groups.roblox.com/v1/user/${USER_ID}/groups`,
    `https://groups.roblox.com/v2/users/${USER_ID}/groups`,
    `https://groups.roblox.com/v2/user/${USER_ID}/groups`,
    `https://groups.roblox.com/v1/user/${USER_ID}/groups/roles`,
    `https://apis.roblox.com/groups/v1/user/${USER_ID}/groups`,
  ];
  
  for (const url of endpoints) {
    try {
      console.log(`🔵 Testing: ${url}`);
      const res = await fetch(url, {
        headers: { 'Accept': 'application/json' }
      });
      
      console.log(`   Status: ${res.status}`);
      
      if (res.ok) {
        const data = await res.json();
        const count = (data.data?.length || data.groups?.length || 0);
        console.log(`   ✅ Found ${count} groups`);
        if (count > 0) {
          console.log(`   First group sample:`, JSON.stringify((data.data || data.groups)[0], null, 2).substring(0, 300));
        }
      }
    } catch (e) {
      console.log(`   ❌ Error: ${e.message}`);
    }
    console.log();
  }
}

testGroupEndpoints().then(() => {
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
