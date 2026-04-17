export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { userMessage, systemPrompt } = req.body;

  if (!userMessage) {
    return res.status(400).json({ error: 'userMessage is required' });
  }

  const hfApiUrl = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'HUGGINGFACE_API_KEY not configured' });
  }

  try {
    const prompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;

    console.log('Calling Mistral API from Vercel...');

    const response = await fetch(hfApiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 256,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
        options: {
          wait_for_model: true,
        }
      })
    });

    console.log('Mistral API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mistral API error:', errorText);
      return res.status(response.status).json({
        error: `API error: ${response.status}`,
        details: errorText
      });
    }

    const result = await response.json();
    console.log('Mistral API result:', result);

    const generatedText = result[0]?.generated_text || result.generated_text || '';
    const responseText = generatedText.replace(prompt, '').trim();

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
