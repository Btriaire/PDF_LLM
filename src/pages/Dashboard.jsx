import { useState } from 'react';
import { Header } from '../components/Header';
import { PDFUpload } from '../components/PDFUpload';
import { PDFList } from '../components/PDFList';
import { ChatInterface } from '../components/ChatInterface';

export const Dashboard = ({ userId }) => {
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [pdfs, setPdfs] = useState([]);

  const handlePDFUpload = (newPDF) => {
    setPdfs([...pdfs, newPDF]);
  };

  const handleDeletePDF = (pdfId) => {
    setPdfs(pdfs.filter(pdf => pdf.id !== pdfId));
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Header title="PDF Chat" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <PDFUpload userId={userId} onUpload={handlePDFUpload} />
            <PDFList pdfs={pdfs} onSelectPDF={setSelectedPDF} onDeletePDF={handleDeletePDF} />
          </div>
          <div className="lg:col-span-2">
            <ChatInterface userId={userId} pdf={selectedPDF} />
          </div>
        </div>
      </div>
    </div>
  );
};
