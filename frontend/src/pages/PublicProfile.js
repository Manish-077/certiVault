import React, { useState, useEffect } from 'react';
import { fetchPublicCertificates, fetchPublicProfile, BASE_URL } from '../utils/api';
import { useParams } from 'react-router-dom';
import { FaLinkedin, FaGithub, FaTwitter, FaUserCircle } from 'react-icons/fa';
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
    <div className="flex space-x-2 mt-4">
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

function PublicProfile() {
  const [userProfile, setUserProfile] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { userId } = useParams();

  useEffect(() => {
    const loadPublicData = async () => {
      try {
        const [user, certs] = await Promise.all([
          fetchPublicProfile(userId),
          fetchPublicCertificates(userId),
        ]);
        setUserProfile(user);
        setCertificates(certs);
      } catch (e) {
        console.error('API fetch error:', e);
        setError('Failed to load public profile.');
      } finally {
        setLoading(false);
      }
    };
    loadPublicData();
  }, [userId]);

  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown';
    try {
      return new Date(timestamp).toLocaleDateString();
    } catch (error) {
      return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <div className="loading-spinner"></div>
        <p style={{ marginLeft: '1rem', marginTop: '1rem', color: 'var(--color-text-muted)' }}>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return <div className="container py-8 text-center text-red-500">{error}</div>;
  }
  
  if (!userProfile) {
    return <div className="container py-8 text-center">User not found.</div>;
  }

  return (
    <div className="container py-8 fade-in-up">
      <div className="card p-8 max-w-4xl mx-auto shadow-lg mb-8">
        <div className="flex flex-col md:flex-row items-center md:space-x-8">
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4 md:mb-0">
            {userProfile.profilePicture ? (
              <img src={userProfile.profilePicture} alt={userProfile.displayName} className="w-32 h-32 rounded-full" />
            ) : (
              <FaUserCircle className="text-6xl text-gray-400" />
            )}
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-2">{userProfile.displayName}</h1>
            <p className="text-gray-600 mb-4">{userProfile.bio}</p>
            <div className="flex justify-center md:justify-start space-x-4 mb-4">
              {userProfile.socialLinks?.linkedin && (
                <a href={userProfile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-500">
                  <FaLinkedin size={24} />
                </a>
              )}
              {userProfile.socialLinks?.github && (
                <a href={userProfile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-800">
                  <FaGithub size={24} />
                </a>
              )}
              {userProfile.socialLinks?.twitter && (
                <a href={userProfile.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400">
                  <FaTwitter size={24} />
                </a>
              )}
            </div>
            <ShareSection shareUrl={window.location.href} title={`${userProfile.displayName}'s Certificate Portfolio`} />
          </div>
        </div>
      </div>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Certificates</h2>
      </div>

      {certificates.length === 0 ? (
        <div className="card p-8 text-center text-gray-600">
          <p>This user has not uploaded any certificates yet.</p>
        </div>
      ) : (
        <div className="certificates-grid">
          {certificates.map((cert) => (
            <div key={cert._id} className="card certificate-card fade-in-up">
              {cert.thumbnailUrl && (
                <img src={cert.thumbnailUrl} alt={`${cert.name} thumbnail`} className="w-full h-48 object-cover" />
              )}
              <div className="card-content">
                <h3 className="text-xl font-semibold mb-2">{cert.name}</h3>
                <p className="text-gray-600"><strong>Issuer:</strong> {cert.issuer}</p>
                <p className="text-gray-600"><strong>Issued:</strong> {cert.dateIssued ? new Date(cert.dateIssued).toLocaleDateString() : 'N/A'}</p>
                <p className="text-gray-500 text-sm"><strong>Uploaded:</strong> {formatDate(cert.createdAt)}</p>
                {cert.tags && cert.tags.length > 0 && (
                  <div className="tags-container mt-4">
                    {cert.tags.map((tag, idx) => (
                      <span key={idx} className="tag bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="card-actions">
                <a href={`${BASE_URL}${cert.fileUrl}`} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">View Certificate</a>
                <ShareSection shareUrl={`${BASE_URL}${cert.fileUrl}`} title={cert.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PublicProfile;