async function testClientChunk() {
  const res = await fetch('http://localhost:3000/_next/static/chunks/app/portal/%5Bslug%5D/page.js');
  console.log('Status chunk:', res.status);
  const text = await res.text();
  console.log('Chunk length:', text.length);
  if (text.includes('@supabase.js')) {
    console.warn('⚠️ Found @supabase.js reference in chunk!');
  } else {
    console.log('✅ Clean! No @supabase.js reference in client chunk.');
  }
}
testClientChunk();
