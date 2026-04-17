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
    // Using Ollama running locally on port 11434
    // Make sure Ollama is running: ollama run mistral
    const ollamaUrl = process.env.OLLAMA_URL || 'http://localhost:11434/api/generate';

    const prompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;

    console.log('Calling Ollama Mistral API...');

    const response = await fetch(ollamaUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral',
        prompt: prompt,
        stream: false,
        temperature: 0.7,
      })
    });

    console.log('Ollama response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Ollama error:', errorText);
      return res.status(response.status).json({
        error: `Ollama API error: ${response.status}. Make sure Ollama is running: ollama run mistral`,
        details: errorText
      });
    }

    const result = await response.json();
    console.log('Ollama result:', result);

    const responseText = result.response || '';
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
