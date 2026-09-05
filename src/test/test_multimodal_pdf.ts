import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

async function testMultimodalPdf() {
  console.log('Probando lectura multimodal de PDF escaneado con Gemini 2.5 Flash en OpenRouter...');
  
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('Falta OPENROUTER_API_KEY');
    return;
  }

  // Leer el PDF escaneado
  const pdfPath = 'storage/raw_bases/expediente_essalud_piura/BASES Y ANEXOS/BASES CP3_202606051808.pdf';
  const pdfBuffer = fs.readFileSync(pdfPath);
  
  // Tomar los primeros 2 MB para probar (o el archivo completo si es pequeño)
  console.log(`Tamaño total del PDF: ${(pdfBuffer.length / (1024 * 1024)).toFixed(2)} MB`);
  const base64Pdf = pdfBuffer.toString('base64');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://thequantpartners.com',
      'X-Title': 'Licitaciones QP Engine'
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '¿Cuál es la Entidad convocante, la Nomenclatura del proceso, el Objeto de contratación y el Valor Referencial que aparecen en la carátula o primeras páginas de este documento de bases escaneado?'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:application/pdf;base64,${base64Pdf}`
              }
            }
          ]
        }
      ],
      max_tokens: 1000
    })
  });

  console.log('Status HTTP:', response.status);
  const data = (await response.json()) as any;
  if (!response.ok) {
    console.error('Error de API:', JSON.stringify(data, null, 2));
  } else {
    console.log('\n✅ ¡GEMINI LEYÓ EL PDF ESCANEADO CON ÉXITO!');
    console.log(data.choices?.[0]?.message?.content);
  }
}

testMultimodalPdf();
