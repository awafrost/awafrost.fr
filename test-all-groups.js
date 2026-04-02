// Test pour récupérer TOUS les groupes et leurs images
const USER_ID = '1743461749';

async function testAllGroups() {
  console.log('🔵 Récupération de TOUS les groupes pour l\'utilisateur', USER_ID);
  console.log('');
  
  try {
    // API pour récupérer les groupes de l'utilisateur
    const url = `https://groups.roblox.com/v1/users/${USER_ID}/groups`;
    console.log('🔵 Endpoint:', url);
    console.log('');
    
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    
    console.log('Status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Total groupes:', data.data?.length || 0);
      console.log('');
      
      if (data.data && data.data.length > 0) {
        console.log('Groupes trouvés:');
        console.log('---');
        
        for (const group of data.data) {
          console.log(`\n📌 Groupe: ${group.group.name}`);
          console.log(`   ID: ${group.group.id}`);
          console.log(`   Role: ${group.role?.name || 'N/A'}`);
          
          // Tester les différents formats d'URL d'image
          const formats = [
            `https://www.roblox.com/group-thumbnails?groupId=${group.group.id}&width=150&height=150&format=png`,
            `https://thumbs.roblox.com/group-thumbnails?groupId=${group.group.id}&width=150&height=150&format=png`,
            `https://roblox.com/group-thumbnails?groupId=${group.group.id}&width=150&height=150&format=png`,
          ];
          
          for (let i = 0; i < formats.length; i++) {
            console.log(`   Image URL ${i+1}: ${formats[i]}`);
            try {
              const imgRes = await fetch(formats[i], { method: 'HEAD' });
              if (imgRes.ok) {
                console.log(`   ✅ Image ${i+1} trouvée (${imgRes.status})`);
              } else {
                console.log(`   ❌ Image ${i+1} not found (${imgRes.status})`);
              }
            } catch (e) {
              console.log(`   ❌ Image ${i+1} erreur: ${e.message}`);
            }
          }
        }
      }
    } else {
      console.error('❌ Error:', res.status, res.statusText);
      const text = await res.text();
      console.error('Response:', text.substring(0, 200));
    }
  } catch (e) {
    console.error('❌ Fetch error:', e.message);
  }
}

testAllGroups().then(() => {
  console.log('\n✅ Test completed');
  process.exit(0);
}).catch(e => {
  console.error('❌ Fatal error:', e);
  process.exit(1);
});
