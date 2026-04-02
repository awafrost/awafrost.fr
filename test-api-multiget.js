// Quick test of the new API endpoint
const universeIds = [111958650, 245662005, 66654135];

async function testAPI() {
  try {
    const url = `https://games.roblox.com/v1/games/multiget?universeIds=${universeIds.join(',')}`;
    console.log('🔵 Testing URL:', url);
    
    const res = await fetch(url);
    console.log('Status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Response data:');
      console.log(JSON.stringify(data, null, 2).substring(0, 1000));
    } else {
      console.error('❌ Error:', res.statusText);
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

testAPI().then(() => process.exit(0));
