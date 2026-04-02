// Test friends fetching
const USER_ID = '1743461749';

async function testFriends() {
  console.log('🔵 Testing friends fetching...\n');
  
  // Step 1: Get friends list
  console.log('Step 1: Get friends list');
  const friendsUrl = `https://friends.roblox.com/v1/users/${USER_ID}/friends?limit=9`;
  console.log('URL:', friendsUrl);
  
  try {
    const res = await fetch(friendsUrl);
    console.log('Status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('Friends count:', data.data?.length);
      console.log('First friend:', JSON.stringify(data.data?.[0], null, 2));
      
      if (data.data && data.data.length > 0) {
        const friendIds = data.data.slice(0, 9).map(f => f.id);
        console.log('\n✅ Friend IDs:', friendIds);
        
        // Step 2: Get friend names
        console.log('\n\nStep 2: Get friend names');
        for (const friendId of friendIds.slice(0, 3)) { // Test just first 3
          try {
            const userUrl = `https://users.roblox.com/v1/users/${friendId}`;
            const userRes = await fetch(userUrl);
            console.log(`Friend ${friendId}: Status=${userRes.status}`);
            
            if (userRes.ok) {
              const userData = await userRes.json();
              console.log(`  displayName: ${userData.displayName}`);
              console.log(`  name: ${userData.name}`);
            }
          } catch (e) {
            console.error(`  Error: ${e.message}`);
          }
        }
        
        // Step 3: Get avatars
        console.log('\n\nStep 3: Get avatar headshots');
        const ids = friendIds.slice(0, 3).join(',');
        const avatarUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${ids}&size=150x150&format=png&isCircular=true`;
        console.log('URL:', avatarUrl);
        
        const avatarRes = await fetch(avatarUrl);
        console.log('Status:', avatarRes.status);
        
        if (avatarRes.ok) {
          const avatarData = await avatarRes.json();
          console.log('Avatar data:', JSON.stringify(avatarData, null, 2).substring(0, 500));
        } else {
          console.error('Error:', avatarRes.statusText);
        }
      }
    } else {
      console.error('Error:', res.statusText);
    }
  } catch (e) {
    console.error('Fetch error:', e.message);
  }
}

testFriends().then(() => {
  process.exit(0);
}).catch(e => {
  console.error('Fatal error:', e);
  process.exit(1);
});
