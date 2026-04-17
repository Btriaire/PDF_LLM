export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage, systemPrompt, pdfContent } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: 'userMessage is required' });
  }

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GROQ_API_KEY not configured' });
  }

  try {
    console.log('Calling Groq Llama API with PDF context...');

    // Groq Llama 3.3 has a 128k token context window (~500k chars), but we limit
    // to 80k chars to leave room for the conversation and response.
    const MAX_PDF_CHARS = 80000;
    const truncatedContent = pdfContent && pdfContent.length > MAX_PDF_CHARS
      ? pdfContent.slice(0, MAX_PDF_CHARS) + '\n\n[Document truncated due to length...]'
      : pdfContent;

    let finalSystemPrompt = systemPrompt || 'You are a helpful assistant.';
    if (truncatedContent) {
      finalSystemPrompt += `\n\nDocument Content:\n${truncatedContent}`;
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
