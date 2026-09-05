async function main() {
  const res = await fetch('http://localhost:3000/portal/consorcio-medico');
  console.log('Status:', res.status);
  const html = await res.text();
  console.log('Full HTML:', html);
}
main();
