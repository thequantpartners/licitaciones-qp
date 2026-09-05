async function testRedirect() {
  const res = await fetch('http://localhost:3000/dashboard', { redirect: 'manual' });
  console.log('Status:', res.status);
  console.log('Location header:', res.headers.get('location'));
}
testRedirect();
