import React, { useState, useEffect } from 'react';
import { fetchCertificates, deleteCertificate, logout, BASE_URL } from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import { FaShareAlt, FaPlus, FaFilter, FaTrash, FaEye, FaUniversity, FaCalendarAlt, FaTag } from 'react-icons/fa';
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
} from 'react-share';

function ShareSection({ shareUrl, title }) {
  return (
    <div className="flex space-x-2">
      <FacebookShareButton url={shareUrl} quote={title}>
        <FacebookIcon size={32} round />
      </FacebookShareButton>
      <TwitterShareButton url={shareUrl} title={title}>
        <TwitterIcon size={32} round />
      </TwitterShareButton>
      <LinkedinShareButton url={shareUrl} title={title}>
        <LinkedinIcon size={32} round />
      </LinkedinShareButton>
    </div>
  );
}

function Profile() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadCerts = async () => {
      try {
        const certs = await fetchCertificates();
        setCertificates(certs);
      } catch (e) {
        console.error('API fetch error:', e);
        if (e.message.includes('401')) {
          logout();
          navigate('/login');
        } else {
          setError('Failed to load certificates.');
        }
      } finally {
        setLoading(false);
      }
    };
    loadCerts();
  }, [navigate]);

  const handleDelete = async (certId) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) {
      return;
    }
    try {
      await deleteCertificate(certId);
      setCertificates(certs => certs.filter(c => c._id !== certId));
      alert('Certificate removed from your portfolio.');
    } catch (error) {
      console.error('Error deleting certificate:', error);
      alert('Failed to delete certificate: ' + error.message);
    }
  };

  const copyShareableLink = () => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.id;
      const shareableUrl = `${window.location.origin}/portfolio/${userId}`;
      navigator.clipboard.writeText(shareableUrl).then(() => {
        alert('Shareable link copied to clipboard!');
      }).catch(err => {
        console.error('Failed to copy link: ', err);
        prompt('Copy this link to share your portfolio:', shareableUrl);
      });
    }
  };

  

  const filteredCertificates = filterTag.trim()
    ? certificates.filter(cert =>
        (cert.tags || []).some(tag => tag.toLowerCase().includes(filterTag.trim().toLowerCase()))
      )
    : certificates;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginLeft: '1rem', marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading your certificates...</p>
      </div>
    );
  }

  return (
    <div className="container py-8 fade-in-up">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">My Certificate Portfolio</h1>
        <p className="text-lg text-gray-500">All your certifications in one place.</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="relative flex-grow w-full md:w-auto">
          <FaFilter className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Filter by tag (e.g., React, AWS)..."
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
            className="form-input pl-10 w-full"
          />
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <button onClick={copyShareableLink} className="btn btn-secondary w-full flex items-center gap-2">
            <FaShareAlt /> Share
          </button>
          <button onClick={() => navigate('/upload')} className="btn btn-primary w-full flex items-center gap-2">
            <FaPlus /> Upload New
          </button>
        </div>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {filteredCertificates.length === 0 && !loading ? (
        <div className="card p-8 text-center text-gray-600">
          <h2 className="text-2xl font-semibold mb-4">Your Portfolio is Empty</h2>
          <p className="mb-6">It looks like you haven't uploaded any certificates yet. Let's change that!</p>
          <button onClick={() => navigate('/upload')} className="btn btn-primary">Upload Your First Certificate</button>
        </div>
      ) : (
        <div className="certificates-grid">
          {filteredCertificates.map((cert) => (
            <div key={cert._id} className="card certificate-card enhanced-card fade-in-up">
              <div className="card-header">
                <h3 className="text-xl font-semibold">{cert.name}</h3>
              </div>
              <div className="card-content">
                <p className="flex items-center gap-2 text-gray-600"><FaUniversity /> <strong>Issuer:</strong> {cert.issuer}</p>
                <p className="flex items-center gap-2 text-gray-600"><FaCalendarAlt /> <strong>Issued:</strong> {cert.dateIssued ? new Date(cert.dateIssued).toLocaleDateString() : 'N/A'}</p>
                {cert.tags && cert.tags.length > 0 && (
                  <div className="tags-container mt-4 flex flex-wrap gap-2">
                    {cert.tags.map((tag, idx) => (
                      <span key={idx} className="tag flex items-center gap-1 bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                        <FaTag /> {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <div className="card-actions">
                <a href={`${BASE_URL}${cert.fileUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm flex items-center gap-1">
                  <FaEye /> View
                </a>
                <button onClick={() => handleDelete(cert._id)} className="btn btn-danger btn-sm flex items-center gap-1">
                  <FaTrash /> Delete
                </button>
                <ShareSection shareUrl={`${BASE_URL}${cert.fileUrl}`} title={cert.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;