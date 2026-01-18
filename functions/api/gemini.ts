export const onRequestPost: PagesFunction<{ GEMINI_API_KEY: string }> = async (context) => {
  const { request, env } = context;
  
  if (!env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'Gemini API Key missing' }), { status: 500 });
  }

  const body: any = await request.json();
  const { question } = body;

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;

  const payload = {
    contents: [{ parts: [{ text: question }] }],
    systemInstruction: {
      parts: [{ text: 'You are the "Oracle" for the developer enterk0d3. Your personality is brutalist, concise, slightly chaotic, and technical. Answer in short, punchy sentences. Respond as if you are a terminal output.' }]
    },
    generationConfig: {
      temperature: 0.9,
    }
  };

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data: any = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'SYSTEM_ERROR: ORACLE_SILENT.';

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Oracle Failure' }), { status: 500 });
  }
};