import React from 'react';
import CertificateUploader from '../components/CertificateUploader';
import { useNavigate } from 'react-router-dom';

function UploadPage() {
  const navigate = useNavigate();

  const handleUploadSuccess = () => {
    navigate('/profile');
  };

  return (
    <div className="card upload-container fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display font-bold mb-2">Upload a New Certificate</h1>
        <p className="text-lg text-gray-500">Add another achievement to your portfolio.</p>
      </div>
      <CertificateUploader onUploadSuccess={handleUploadSuccess} />
      <div className="text-center mt-6">
        <button onClick={() => navigate('/profile')} className="btn btn-secondary">← Back to Portfolio</button>
      </div>
    </div>
  );
}

export default UploadPage;
