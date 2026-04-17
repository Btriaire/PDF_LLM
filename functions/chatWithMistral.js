import { https } from 'firebase-functions';
import fetch from 'node-fetch';

export const chatWithMistral = https.onCall(async (data, context) => {
  const { userMessage, systemPrompt } = data;

  const hfApiUrl = 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2';
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new Error('HUGGINGFACE_API_KEY environment variable is not set');
  }

  try {
    const prompt = `${systemPrompt}\n\nUser: ${userMessage}\n\nAssistant:`;

    console.log('Calling Mistral API from Cloud Function...');

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
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Mistral API result:', result);

    const generatedText = result[0]?.generated_text || result.generated_text || '';
    const responseText = generatedText.replace(prompt, '').trim();

    return {
      success: true,
      message: responseText || 'No response generated'
    };
  } catch (error) {
    console.error('Error in chatWithMistral:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
});
