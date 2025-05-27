import { useState, useEffect } from 'react';
import axios from 'axios';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [file, setFile] = useState(null);
  const [documentId, setDocumentId] = useState(null);
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('document', file);

    try {
      const response = await axios.post('http://localhost:3000/upload', formData);
      setDocumentId(response.data.document_id);
      setStatus('uploaded');
      setError('');
    } catch (err) {
      console.error('Upload error:', err);
      setError('אירעה שגיאה בהעלאת הקובץ');
    }
  };

  useEffect(() => {
    let intervalId;
    if (documentId) {
      intervalId = setInterval(async () => {
        try {
          const res = await axios.get(`http://localhost:3000/status/${documentId}`);
          setStatus(res.data.status);
          setError('');
        } catch (err) {
          console.error('Error fetching status:', err);
          setError('לא ניתן לקבל עדכון סטטוס');
        }
      }, 3000);
    }
    return () => clearInterval(intervalId);
  }, [documentId]);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Document Ingestion</h1>
      <div>
        <input type="file" accept=".xlsx" onChange={handleFileChange} />
        <button onClick={handleUpload} style={{ marginLeft: '10px' }}>Upload</button>
      </div>
      {documentId && <p>Document ID: {documentId}</p>}
      {status && <p>Status: {status}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default App
