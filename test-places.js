// Test script to find valid game universe IDs
// Try some popular Roblox games

const popularGames = [
  { name: 'Adopt Me', placeId: 920587237 },
  { name: 'Bloxburg', placeId: 185655149 },
  { name: 'Brookhaven', placeId: 4922552819 },
  { name: 'Arsenal', placeId: 286090429 }, // User's favorite
  { name: 'Jailbreak', placeId: 606849621 }, // User's favorite
  { name: 'Murder Mystery 2', placeId: 142823291 }, // User's favorite
];

async function testGame(name, placeId) {
  try {
    // Try to get info about a place
    const url = `https://apis.roblox.com/universes/v1/places/${placeId}/universe`;
    console.log(`🔵 Checking ${name} (placeId=${placeId}): ${url}`);
    
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    
    console.log(`Status: ${res.status}`);
    
    if (res.ok) {
      const data = await res.json();
      const universeId = data.universeId;
      console.log(`✅ Found! universeId=${universeId}`);
      
      // Now try to get the game info with this universeId
      const gameUrl = `https://games.roblox.com/v1/games/multiget?universeIds=${universeId}`;
      const gameRes = await fetch(gameUrl);
      if (gameRes.ok) {
        const gameData = await gameRes.json();
        if (gameData.data && gameData.data.length > 0) {
          console.log(`Game info: ${gameData.data[0].name}`);
        }
      }
    } else {
      const text = await res.text();
      console.log(`❌ Error: ${text.substring(0, 100)}`);
    }
  } catch (e) {
    console.error(`❌ Error: ${e.message}`);
  }
  console.log();
}

async function testAllGames() {
  for (const game of popularGames) {
    await testGame(game.name, game.placeId);
  }
}

testAllGames().then(() => {
  console.log('\n✅ Test completed');
  process.exit(0);
}).catch(e => {
  console.error('❌ Test failed:', e);
  process.exit(1);
});
