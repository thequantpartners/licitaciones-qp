async function test() {
  const res = await fetch('http://localhost:3000/api/portal/consorcio-medico/whatsapp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ whatsapp: '51924464410' })
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Data:', data);
}

test();
