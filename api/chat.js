export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage, systemPrompt, pdfContent } = req.body;

  console.log('API received request:', {
    hasUserMessage: !!userMessage,
    hasSystemPrompt: !!systemPrompt,
    pdfContentLength: pdfContent?.length || 0,
    pdfContentPreview: pdfContent?.substring(0, 200) || 'empty',
  });

  if (!userMessage) {
    return res.status(400).json({ error: 'userMessage is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  try {
    console.log('Calling Groq Llama API with PDF context...');

    let finalSystemPrompt = systemPrompt || 'You are a helpful assistant.';
    if (pdfContent) {
      finalSystemPrompt += `\n\nDocument Content:\n${pdfContent}`;
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: finalSystemPrompt
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 2048
      })
    });

    console.log('Groq response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq error:', errorText);
      return res.status(response.status).json({
        error: `Groq API error: ${response.status}`,
        details: errorText
      });
    }

    const result = await response.json();
    console.log('Groq result:', result);

    const responseText = result.choices[0]?.message?.content || '';

    return res.status(200).json({
      success: true,
      message: responseText || 'No response generated'
    });
  } catch (error) {
    console.error('Error in chat handler:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
