import { useEffect, useState } from 'react';
import { db, storage } from '../services/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { ref, uploadBytes, getBytes, deleteObject } from 'firebase/storage';

export const usePDFs = (userId) => {
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPDFs = async () => {
    // TEMPORARY: Skip Firebase, just keep in-memory list
    return;
  };

  useEffect(() => {
    fetchPDFs();
  }, [userId]);

  const uploadPDF = async (file, title) => {
    if (!userId) throw new Error('User not authenticated');
    setLoading(true);
    try {
      console.log('Uploading:', file.name);

      // TEMPORARY: Mock upload - just add to local state
      const newPDF = {
        id: Date.now().toString(),
        userId,
        fileName: file.name,
        title: title || file.name,
        fileSize: file.size,
        uploadedAt: new Date(),
        storagePath: `pdfs/${userId}/${Date.now()}-${file.name}`,
      };

      setPdfs([...pdfs, newPDF]);
      console.log('PDF added to list');
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePDF = async (pdfId, storagePath) => {
    setLoading(true);
    try {
      await deleteDoc(doc(db, 'pdfs', pdfId));
      const fileRef = ref(storage, storagePath);
      await deleteObject(fileRef);
      await fetchPDFs();
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { pdfs, loading, error, uploadPDF, deletePDF };
};
