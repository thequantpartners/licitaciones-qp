async function testDemo() {
  console.log('--- Test 1: Without consent (Should fail with legal error) ---');
  const res1 = await fetch('http://localhost:3000/api/portal/consorcio-medico/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ whatsapp: '987654321', consentimiento: false })
  });
  console.log('Status 1:', res1.status);
  console.log('Body 1:', await res1.json());

  console.log('\n--- Test 2: With explicit Ley 29733 consent (Should succeed) ---');
  const res2 = await fetch('http://localhost:3000/api/portal/consorcio-medico/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ whatsapp: '987654321', consentimiento: true })
  });
  console.log('Status 2:', res2.status);
  console.log('Body 2:', await res2.json());
}

testDemo();
