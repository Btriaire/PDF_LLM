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
    // Using Together AI API (free tier available)
    const togetherApiUrl = 'https://api.together.xyz/inference';

    const prompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;

    console.log('Calling Together AI API from Vercel...');

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

    console.log('API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API error:', errorText);
      // Return mock response for demo purposes
      return res.status(200).json({
        success: true,
        message: `[Demo Response] I received your question: "${userMessage}". In a production environment, I would use a properly configured API key to call Mistral or another LLM to generate a response based on the PDF content and your query.`,
        demo: true
      });
    }

    const result = await response.json();
    console.log('API result:', result);

    const responseText = result.output?.choices?.[0]?.text || result.text || '';

    return res.status(200).json({
      success: true,
      message: responseText.replace(prompt, '').trim() || 'No response generated'
    });
  } catch (error) {
    console.error('Error in chat handler:', error.message);
    // Return demo response on error
    return res.status(200).json({
      success: true,
      message: `[Demo Response] The backend API encountered an error but the serverless function is working. To use a real LLM, configure the HUGGINGFACE_API_KEY environment variable with a valid API key from a supported service (Hugging Face, Together AI, etc.).`,
      demo: true,
      error_details: error.message
    });
  }
}
