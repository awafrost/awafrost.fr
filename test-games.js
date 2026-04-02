// Test script pour vérifier les IDs de jeux
const gameIds = [286090429, 606849621, 142823291];

async function testGameIds() {
  console.log('Testing game IDs with Roblox API...\n');
  
  // Test multiget endpoint
  try {
    const url = `https://games.roblox.com/v1/games/multiget?universeIds=${gameIds.join(',')}`;
    console.log('🔵 Testing multiget endpoint:', url);
    const res = await fetch(url);
    console.log('Status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Response:', JSON.stringify(data, null, 2));
    } else {
      const text = await res.text();
      console.log('❌ Error response:', text);
    }
  } catch (e) {
    console.error('❌ Fetch error:', e);
  }

  console.log('\n---\n');

  // Test each ID individually
  for (const id of gameIds) {
    try {
      const url = `https://games.roblox.com/v1/games/multiget?universeIds=${id}`;
      console.log(`🔵 Testing ID ${id}: ${url}`);
      const res = await fetch(url);
      console.log(`Status: ${res.status}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          console.log(`✅ Found: ${data.data[0].name}`);
        } else {
          console.log('❌ No data returned');
        }
      } else {
        console.log(`❌ Error: ${res.status}`);
      }
    } catch (e) {
      console.error(`❌ Fetch error:`, e.message);
    }
    console.log();
  }

  // Try place-to-universe conversion
  console.log('---\n');
  console.log('🔵 Trying to convert placeId to universeId...\n');
  
  for (const id of gameIds) {
    try {
      // Try the places endpoint
      const url = `https://games.roblox.com/v1/games/PlaceId/${id}`;
      console.log(`Testing PlaceId endpoint for ${id}: ${url}`);
      const res = await fetch(url);
      console.log(`Status: ${res.status}`);
      
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Response:`, JSON.stringify(data, null, 2));
      } else {
        const text = await res.text();
        console.log(`Response: ${text.substring(0, 100)}...`);
      }
    } catch (e) {
      console.error(`❌ Error:`, e.message);
    }
    console.log();
  }
}

testGameIds().then(() => {
  console.log('\n✅ Test completed');
  process.exit(0);
}).catch(e => {
  console.error('❌ Test failed:', e);
  process.exit(1);
});
