import { useState } from 'react';
import { callMistralAPI } from '../services/huggingface';

export const useChat = (userId, pdfId) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pdfContent, setPdfContent] = useState('');

  const sendMessage = async (userMessage) => {
    if (!userMessage.trim()) return;
    setLoading(true);
    setError(null);

    try {
      // Add user message to local state
      const userMsg = { id: Date.now(), role: 'user', content: userMessage };
      setMessages(prev => [...prev, userMsg]);

      console.log('Calling Mistral API...');
      const systemPrompt = `Tu es un assistant intelligent qui répond à des questions sur des documents PDF.
Utilise le contexte fourni pour répondre précisément et concisément.`;

      const userMessages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ];

      const aiResponse = await callMistralAPI(userMessages, '');
      console.log('Got Mistral response:', aiResponse);

      // Add AI response to local state
      const assistantMsg = { id: Date.now() + 1, role: 'assistant', content: aiResponse };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Error in chat:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const setPdfText = (text) => {
    setPdfContent(text);
  };

  return { messages, loading, error, sendMessage, setPdfText };
};
