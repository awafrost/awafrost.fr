// Test one universe at a time with different formats
const universeIds = [111958650, 245662005, 66654135]; // Arsenal, Jailbreak, MM2

async function testOneByOne() {
  console.log('Testing universe IDs one by one:\n');
  
  for (const id of universeIds) {
    console.log(`Testing universe ${id}:`);
    
    // Test 1: Direct call with query param
    try {
      const url = `https://games.roblox.com/v1/games/multiget?universeIds=${id}`;
      console.log(`URL: ${url}`);
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      console.log(`Status: ${res.status}`);
      
      if (res.ok) {
        const data = await res.json();
        if (data.data && data.data.length > 0) {
          console.log(`✅ Success! Game: ${data.data[0].name}`);
        } else {
          console.log('❌ Empty data array');
        }
      } else {
        const text = await res.text();
        console.log(`Error: ${text.substring(0, 100)}`);
      }
    } catch (e) {
      console.log(`Exception: ${e.message}`);
    }
    console.log();
  }
}

testOneByOne().then(() => process.exit(0));
