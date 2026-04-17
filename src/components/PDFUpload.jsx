import { useState } from 'react';
import { extractTextFromPDF } from '../utils/pdfExtractor';

export const PDFUpload = ({ userId, onUpload }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !title) return;
    setLoading(true);
    setError(null);
    try {
      console.log('Extracting text from PDF...');
      const pdfText = await extractTextFromPDF(file);
      console.log(`Extracted ${pdfText.length} characters from PDF`);

      const newPDF = {
        id: Date.now().toString(),
        userId,
        fileName: file.name,
        title: title || file.name,
        fileSize: file.size,
        uploadedAt: new Date(),
        storagePath: `pdfs/${userId}/${Date.now()}-${file.name}`,
        text: pdfText,
      };
      onUpload(newPDF);
      setFile(null);
      setTitle('');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-6 mb-6 backdrop-blur">
      <h2 className="text-lg font-bold text-cyan-400 mb-4">Upload PDF</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Titre..."
          className="w-full px-4 py-2 bg-slate-700 border border-cyan-500/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
          required
        />
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full px-4 py-2 bg-slate-700 border border-cyan-500/20 rounded-lg text-white file:bg-cyan-600/20 file:text-cyan-300 file:border-0 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          required
        />
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading || !file || !title}
          className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-lg font-medium disabled:opacity-50 transition"
        >
          {loading ? 'Upload...' : 'Envoyer'}
        </button>
      </form>
    </div>
  );
};
