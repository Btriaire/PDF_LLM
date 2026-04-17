export const callMistralAPI = async (messages, systemPrompt) => {
  try {
    const userMessage = messages.find(m => m.role === 'user')?.content || '';

    console.log('Calling Vercel API endpoint...');

    const apiUrl = import.meta.env.DEV
      ? 'http://localhost:3000/api/chat'  // Local dev server
      : '/api/chat';  // Production (Vercel)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userMessage,
        systemPrompt,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API error: ${response.status}`);
    }

    const result = await response.json();

    if (result.success) {
      return result.message;
    } else {
      throw new Error(result.error || 'Unknown error from API');
    }
  } catch (error) {
    console.error('Error calling API:', error);
    throw error;
  }
};
