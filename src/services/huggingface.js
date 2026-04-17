export const callMistralAPI = async (userMessage, systemPrompt, pdfContent = '') => {
  try {
    console.log('Calling Vercel API endpoint...');
    console.log('API call parameters:', {
      userMessage: userMessage.substring(0, 100),
      systemPrompt: systemPrompt.substring(0, 100),
      pdfContentLength: pdfContent.length,
      pdfContentPreview: pdfContent.substring(0, 200),
    });

    const apiUrl = import.meta.env.DEV
      ? 'http://localhost:3000/api/chat'
      : '/api/chat';

    const pdfContentToSend = pdfContent || '';
    const requestBody = {
      userMessage,
      systemPrompt,
      pdfContent: pdfContentToSend,
    };
    console.log('Sending request body:', {
      pdfContentLength: pdfContentToSend.length,
      pdfContentType: typeof pdfContentToSend,
      isPdfContentEmpty: pdfContentToSend.length === 0,
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
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
