import dotenv from 'dotenv';
dotenv.config();

async function testOpenRouter() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  console.log('Probando conexión con OpenRouter API...');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://licitacionesqp.com',
      'X-Title': 'Licitaciones QP Engine'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'Eres el auditor pericial de Licitaciones QP. Responde con un saludo breve y confirma que estás listo para auditar contrataciones del Estado peruano.'
        },
        {
          role: 'user',
          content: 'Smith, confirma conexión con OpenRouter y Gemini 2.0 Flash.'
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`❌ Error en OpenRouter (${response.status}):`, errorText);
    return;
  }

  const data = (await response.json()) as any;
  console.log('✅ Conexión exitosa con OpenRouter!');
  console.log('Respuesta del modelo:', data.choices[0].message.content);
}

testOpenRouter().catch(console.error);
