export const onRequestPost: PagesFunction<{ GEMINI_API_KEY?: string }> = async (context) => {
  const { request, env } = context;

  if (!env.GEMINI_API_KEY) {
    return new Response(JSON.stringify({ error: 'Gemini API Key configuration missing' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let question: string;
  try {
    const body = (await request.json()) as { question?: unknown };
    if (!body || typeof body.question !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid payload: question must be a string' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    question = body.question.trim();
  } catch {
    return new Response(JSON.stringify({ error: 'Malformed JSON payload' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  if (!question || question.length > 500) {
    return new Response(JSON.stringify({ error: 'Question must be between 1 and 500 characters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${env.GEMINI_API_KEY}`;

  const payload = {
    contents: [{ parts: [{ text: question }] }],
    systemInstruction: {
      parts: [{ text: 'You are the "Oracle" for the developer enterk0d3. Your personality is brutalist, concise, slightly chaotic, and technical. Answer in short, punchy sentences. Respond as if you are a terminal output.' }]
    },
    generationConfig: {
      temperature: 0.9,
      maxOutputTokens: 256,
    }
  };

  try {
    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ error: 'Oracle unreachable', text: 'SYSTEM_ERROR: ORACLE_UNREACHABLE.' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'SYSTEM_ERROR: ORACLE_SILENT.';

    return new Response(JSON.stringify({ text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Oracle Failure', text: 'SYSTEM_ERROR: ORACLE_FAILURE.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};