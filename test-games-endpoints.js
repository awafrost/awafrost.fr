// Test different ways to fetch game info
const placeIds = [286090429, 606849621, 142823291]; // Original placeIds

async function testDifferentEndpoints() {
  console.log('Testing different endpoints for game data...\n');
  
  // Try 1: Direct /games endpoint with placeIds
  console.log('❶ Trying /games with placeIds:');
  try {
    const url = `https://www.roblox.com/games/getgames?places=${placeIds.join(',')}`;
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log('Data:', JSON.stringify(data, null, 2).substring(0, 200));
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
  console.log();

  // Try 2: API with place ID
  console.log('❷ Trying API endpoint with place ID:');
  try {
    const url = `https://games.roblox.com/v1/games?placeIds=${placeIds.join(',')}`;
    const res = await fetch(url);
    console.log(`Status: ${res.status}`);
    if (res.ok) {
      const data = await res.json();
      console.log('Data:', JSON.stringify(data, null, 2).substring(0, 300));
    }
  } catch (e) {
    console.log('Error:', e.message);
  }
  console.log();

  // Try 3: Get universe ID first then get game
  console.log('❸ Convert place to universe then get game:');
  for (const placeId of placeIds.slice(0, 1)) {
    try {
      // Get universe ID
      const uniRes = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`);
      if (!uniRes.ok) {
        console.log(`Status: ${uniRes.status}`);
        continue;
      }
      const uniData = await uniRes.json();
      const universeId = uniData.universeId;
      console.log(`Place ${placeId} -> Universe ${universeId}`);
      
      // Get game info
      const gameUrl = `https://games.roblox.com/v1/games/multiget?universeIds=${universeId}`;
      const gameRes = await fetch(gameUrl);
      console.log(`Games API status: ${gameRes.status}`);
      if (gameRes.ok) {
        const gameData = await gameRes.json();
        console.log('Game data:', JSON.stringify(gameData, null, 2).substring(0, 300));
      }
    } catch (e) {
      console.log('Error:', e.message);
    }
  }
}

testDifferentEndpoints().then(() => process.exit(0));
