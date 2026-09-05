async function testAuth() {
  console.log('--- Test 1: Valid RUC (Consorcio Médico) ---');
  const res1 = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: '20608945123' })
  });
  console.log('Status 1:', res1.status);
  console.log('Body 1:', await res1.json());

  console.log('\n--- Test 2: Unknown RUC ---');
  const res2 = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: '20999888777' })
  });
  console.log('Status 2:', res2.status);
  console.log('Body 2:', await res2.json());
}

testAuth();
