// Vérifier si le groupe 13212005 existe et récupérer les infos
const GROUP_ID = 13212005;
const USER_ID = '1743461749';

async function testGroupInfo() {
  console.log('🔵 Vérification du groupe 13212005');
  console.log('');
  
  try {
    const url = `https://groups.roblox.com/v1/groups/${GROUP_ID}`;
    console.log('Endpoint:', url);
    
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    
    console.log('Status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ Groupe trouvé:');
      console.log('   Nom:', data.name);
      console.log('   ID:', data.id);
      console.log('   Membres:', data.memberCount);
      console.log('   Owner ID:', data.owner?.id);
      
      // Tester les URLs d'image du groupe
      const imageUrl = `https://www.roblox.com/group-thumbnails?groupId=${GROUP_ID}&width=150&height=150&format=png`;
      console.log('');
      console.log('🔵 Test image URL:', imageUrl);
      
      const imgRes = await fetch(imageUrl, { method: 'HEAD' });
      console.log('Image Status:', imgRes.status);
      if (imgRes.ok) {
        console.log('✅ Image existe');
      } else {
        console.log('❌ Image pas trouvée');
      }
    } else {
      console.error('❌ Groupe non trouvé');
      const text = await res.text();
      console.error('Error:', text);
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
  
  console.log('\n---\n');
  
  // Essayer l'API pour les utilisateurs affiliés au groupe
  console.log('🔵 Test endpoint pour vérifier les rôles de l\'utilisateur dans le groupe');
  try {
    const url = `https://groups.roblox.com/v1/groups/${GROUP_ID}/users/${USER_ID}`;
    console.log('Endpoint:', url);
    
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });
    
    console.log('Status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('✅ User trouvé dans le groupe:');
      console.log(JSON.stringify(data, null, 2).substring(0, 500));
    }
  } catch (e) {
    console.error('❌ Error:', e.message);
  }
}

testGroupInfo().then(() => {
  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
