export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage, systemPrompt } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: 'userMessage is required' });
  }

  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'HUGGINGFACE_API_KEY not configured' });
  }

  try {
    const togetherApiUrl = 'https://api.together.ai/inference';
    const prompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;

    console.log('Calling Together AI Mistral API...');

    const response = await fetch(togetherApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistralai/Mistral-7B-Instruct-v0.1',
        prompt: prompt,
        max_tokens: 256,
        temperature: 0.7,
        top_p: 0.95,
      })
    });

    console.log('Together AI response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Together AI error:', errorText);
      return res.status(response.status).json({
        error: `API error: ${response.status}`,
        details: errorText
      });
    }

    const result = await response.json();
    console.log('Together AI result:', result);

    const responseText = result.output?.[0] || '';
    const finalMessage = responseText.replace(prompt, '').trim();

    return res.status(200).json({
      success: true,
      message: finalMessage || 'No response generated'
    });
  } catch (error) {
    console.error('Error in chat handler:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
