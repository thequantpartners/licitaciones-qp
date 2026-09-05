async function testProduction() {
  console.log('Testing live production at https://licitaciones.thequantpartners.com/api/auth/login...');
  const res = await fetch('https://licitaciones.thequantpartners.com/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: '20608945123' })
  });

  console.log('Production Auth Status:', res.status);
  const data = await res.json();
  console.log('Production Auth Data:', data);

  const resPortal = await fetch('https://licitaciones.thequantpartners.com/portal/consorcio-medico');
  console.log('Production Portal Status:', resPortal.status);
}

testProduction();
