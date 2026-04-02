#!/usr/bin/env node

// Script pour tester les endpoints API Roblox

const userId = '1743461749';

async function testEndpoint(name, url) {
  console.log(`\n📍 Test: ${name}`);
  console.log(`🔗 URL: ${url}`);
  try {
    const res = await fetch(url);
    const text = await res.text();
    console.log(`✅ Status: ${res.status}`);
    
    try {
      const data = JSON.parse(text);
      console.log('📦 Response:', JSON.stringify(data, null, 2).slice(0, 500));
    } catch {
      console.log('📦 Response (text):', text.slice(0, 300));
    }
  } catch (e) {
    console.error('❌ Error:', String(e));
  }
}

async function runTests() {
  console.log('🧪 Testing Roblox API Endpoints\n');
  console.log('=' .repeat(60));

  // 1. Tester le profil utilisateur
  await testEndpoint(
    'Get User Profile',
    `https://users.roblox.com/v1/users/${userId}`
  );

  // 2. Tester les amis
  await testEndpoint(
    'Get Friends List',
    `https://friends.roblox.com/v1/users/${userId}/friends?limit=9`
  );

  // 3. Tester les avatars  
  const friendIds = '5118010048,8353917238,9970857095,7790361083,7329949705,7769489796,4679867369,2646883503,5187930897';
  await testEndpoint(
    'Get Avatar Headshots',
    `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${friendIds}&size=150x150&format=png&isCircular=true`
  );

  // 4. Tester les jeux favoris
  const gameIds = '286090429,606849621,142823291';
  await testEndpoint(
    'Get Games Info',
    `https://games.roblox.com/v1/games?universeIds=${gameIds}`
  );

  // 5. Tester le groupe
  await testEndpoint(
    'Get Group Info',
    `https://groups.roblox.com/v1/groups/13212005`
  );

  // 6. Tester l'icône du groupe
  console.log(`\n📍 Test: Get Group Icon`);
  console.log(`🔗 URL: https://www.roblox.com/group-thumbnails?groupId=13212005&width=150&height=150&format=png`);
  console.log('✅ This is a direct image URL');

  console.log('\n' + '='.repeat(60));
  console.log('✅ Tests completed!');
}

runTests().catch(console.error);
