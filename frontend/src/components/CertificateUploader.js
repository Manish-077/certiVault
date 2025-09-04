import React, { useState } from 'react';
import { uploadFileToBackend, createCertificate } from '../utils/api';
import * as pdfjsLib from 'pdfjs-dist/build/pdf';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `/pdf.worker.min.mjs`;

function CertificateUploader({ onUploadSuccess }) {
  const [name, setName] = useState('');
  const [issuer, setIssuer] = useState('');
  const [dateIssued, setDateIssued] = useState('');
  const [file, setFile] = useState(null);
  const [thumbnail, setThumbnail] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filePreview, setFilePreview] = useState('');

  const [dragOver, setDragOver] = useState(false);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFilePreview(URL.createObjectURL(selectedFile));

      if (selectedFile.type === 'application/pdf') {
        const fileReader = new FileReader();
        fileReader.onload = async () => {
          const typedarray = new Uint8Array(fileReader.result);
          const pdf = await pdfjsLib.getDocument(typedarray).promise;
          const page = await pdf.getPage(1);
          const viewport = page.getViewport({ scale: 1 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          await page.render({ canvasContext: context, viewport: viewport }).promise;
          setThumbnail(canvas.toDataURL());
        };
        fileReader.readAsArrayBuffer(selectedFile);
      }
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const selectedFile = e.dataTransfer.files[0];
    if (selectedFile) {
      handleFileChange({ target: { files: [selectedFile] } });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !name || !issuer) {
      setError('Please fill in all fields and select a file.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const uploaded = await uploadFileToBackend(file);
      const uploadedUrl = uploaded?.url;
      if (!uploadedUrl) {
        setError('File upload failed. Please try again.');
        setLoading(false);
        return;
      }

      await createCertificate({
        name,
        issuer,
        dateIssued,
        fileUrl: uploadedUrl,
        thumbnail, // Send the thumbnail data URL
        tags: tags.split(',').map(t => t.trim()).filter(Boolean)
      });

      setSuccess('Certificate added to your portfolio successfully!');
      setName('');
      setIssuer('');
      setDateIssued('');
      setFile(null);
      setThumbnail('');
      setTags('');
      setFilePreview('');
      e.target.reset();

      if (onUploadSuccess) {
        setTimeout(onUploadSuccess, 1500);
      }
    } catch (err) {
      console.error('Error creating certificate:', err);
      const errorMsg = err.message ? JSON.parse(err.message).error : 'An unknown error occurred.';
      setError(`Failed to save certificate: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="form-group">
        <label className="form-label" htmlFor="name">Certificate Name</label>
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className="form-input" />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="issuer">Issuer</label>
        <input id="issuer" type="text" value={issuer} onChange={(e) => setIssuer(e.target.value)} required className="form-input" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="form-group">
          <label className="form-label" htmlFor="dateIssued">Date Issued (Optional)</label>
          <input id="dateIssued" type="date" value={dateIssued} onChange={(e) => setDateIssued(e.target.value)} className="form-input" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="tags">Tags (comma-separated)</label>
          <input id="tags" type="text" value={tags} onChange={e => setTags(e.target.value)} className="form-input" />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Certificate File (PDF, PNG, JPG)</label>
        <div 
          className={`file-upload-container ${dragOver ? 'drag-over' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <div className="mt-4 flex text-sm leading-6 text-gray-600">
              <label htmlFor="file-upload" className="file-upload-label">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="file-upload-input" onChange={handleFileChange} required />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs leading-5 text-gray-600">PNG, JPG, PDF up to 10MB</p>
            {file && <p className="text-sm text-gray-500 mt-2">Selected file: {file.name}</p>}
          </div>
        </div>
        {filePreview && !thumbnail && <img src={filePreview} alt="Preview" className="mt-4 max-h-40 mx-auto" />}
        {thumbnail && <img src={thumbnail} alt="Thumbnail" className="mt-4 max-h-40 mx-auto" />}
      </div>
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? 'Uploading...' : 'Upload Certificate'}
      </button>
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {success && <p className="text-green-500 text-center mt-4">{success}</p>}
    </form>
  );
}

export default CertificateUploader;