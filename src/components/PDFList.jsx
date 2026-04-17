export const PDFList = ({ pdfs = [], onSelectPDF, onDeletePDF }) => {
  const handleDelete = (pdfId) => {
    if (confirm('Supprimer?')) onDeletePDF(pdfId);
  };

  return (
    <div className="bg-slate-800 border border-cyan-500/30 rounded-xl p-6 backdrop-blur">
      <h2 className="text-lg font-bold text-cyan-400 mb-4">PDFs</h2>
      {pdfs.length === 0 ? (
        <p className="text-slate-400 text-sm">Aucun PDF</p>
      ) : (
        <div className="space-y-2">
          {pdfs.map((pdf) => (
            <div
              key={pdf.id}
              onClick={() => onSelectPDF(pdf)}
              className="p-3 border border-cyan-500/20 rounded-lg flex justify-between items-center hover:bg-slate-700/50 hover:border-cyan-500/50 cursor-pointer transition group"
            >
              <div>
                <p className="font-medium text-white group-hover:text-cyan-300 transition">{pdf.title}</p>
                <p className="text-xs text-slate-400">{(pdf.fileSize / 1024).toFixed(2)} KB</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(pdf.id);
                }}
                className="ml-2 px-2 py-1 text-red-400 hover:bg-red-500/20 rounded text-xs transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
