const STOP_WORDS = new Set([
  'the','a','an','is','are','was','were','be','been','have','has','had','do','does','did',
  'will','would','could','should','may','might','i','you','he','she','it','we','they',
  'what','which','who','when','where','why','how','this','that','and','or','but','in',
  'on','at','to','for','of','with','by','from','as','into',
  'le','la','les','de','du','des','un','une','et','ou','en','dans','sur','pour','par',
  'avec','est','sont','que','qui','quoi','quel','quelle','ce','se','sa','son','ses','me',
  'mon','ma','mes','je','tu','il','elle','nous','vous','ils','elles','pas','ne',
]);

function findRelevantChunks(pdfContent, question, maxChunks = 5) {
  const CHUNK_WORDS = 300;
  const OVERLAP_WORDS = 50;

  const words = pdfContent.split(/\s+/);

  // If small enough, return as-is
  if (words.length <= CHUNK_WORDS * maxChunks) return pdfContent;

  // Build chunks with overlap
  const chunks = [];
  for (let i = 0; i < words.length; i += CHUNK_WORDS - OVERLAP_WORDS) {
    const chunk = words.slice(i, i + CHUNK_WORDS).join(' ');
    if (chunk.trim()) chunks.push({ text: chunk, index: chunks.length });
  }

  // Extract keywords from question
  const keywords = question.toLowerCase()
    .replace(/[^a-z0-9àâçéèêëîïôùûü\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 2 && !STOP_WORDS.has(w));

  if (keywords.length === 0) {
    // No keywords — return first maxChunks
    return chunks.slice(0, maxChunks).map(c => c.text).join('\n\n---\n\n');
  }

  // Score each chunk by keyword frequency
  const scored = chunks.map(c => {
    const lower = c.text.toLowerCase();
    const score = keywords.reduce((sum, kw) => {
      const matches = (lower.match(new RegExp(kw, 'g')) || []).length;
      return sum + matches;
    }, 0);
    return { ...c, score };
  });

  // Keep top chunks, restore original order
  const top = scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks)
    .sort((a, b) => a.index - b.index);

  return top.map(c => c.text).join('\n\n---\n\n');
}

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

    let finalSystemPrompt = systemPrompt || 'You are a helpful assistant.';
    if (pdfContent) {
      const relevantContent = findRelevantChunks(pdfContent, userMessage);
      finalSystemPrompt += `\n\nDocument Content (most relevant excerpts):\n${relevantContent}`;
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
