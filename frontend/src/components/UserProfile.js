import React, { useState, useEffect } from 'react';
import { fetchUserProfile, updateUserProfile, logout } from '../utils/api';
import { useNavigate } from 'react-router-dom';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [bio, setBio] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');
  const [twitter, setTwitter] = useState('');
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
        setDisplayName(userData.displayName || userData.email);
        setProfilePicture(userData.profilePicture || '');
        setBio(userData.bio || '');
        setLinkedin(userData.socialLinks?.linkedin || '');
        setGithub(userData.socialLinks?.github || '');
        setTwitter(userData.socialLinks?.twitter || '');
      } catch (e) {
        console.error('Error fetching user profile:', e);
        setError('Failed to load profile.');
        if (e.message.includes('401')) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };
    getUserProfile();
  }, [navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updatedUser = await updateUserProfile({
        displayName,
        profilePicture,
        bio,
        socialLinks: {
          linkedin,
          github,
          twitter,
        },
      });
      setUser(updatedUser.user);
      setDisplayName(updatedUser.user.displayName);
      setProfilePicture(updatedUser.user.profilePicture);
      setBio(updatedUser.user.bio);
      setLinkedin(updatedUser.user.socialLinks?.linkedin);
      setGithub(updatedUser.user.socialLinks?.github);
      setTwitter(updatedUser.user.socialLinks?.twitter);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (e) {
      console.error('Error updating user profile:', e);
      setError('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !user) {
    return <div className="loading-spinner-container"><div className="loading-spinner"></div></div>;
  }

  if (!user) {
    return <div className="container py-8 text-center">No user data found.</div>;
  }

  return (
    <div className="container py-8 fade-in-up">
      <div className="card p-8 max-w-2xl mx-auto shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-display font-bold">My Profile</h1>
        </div>

        <div className="space-y-6">
          <div className="form-group">
            <label className="form-label text-lg">Email Address</label>
            <p className="text-gray-500 bg-gray-100 p-3 rounded-lg">{user.email}</p>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="form-group">
                <label htmlFor="displayName" className="form-label text-lg">Display Name</label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="form-input text-lg"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="profilePicture" className="form-label text-lg">Profile Picture URL</label>
                <input
                  id="profilePicture"
                  type="text"
                  value={profilePicture}
                  onChange={(e) => setProfilePicture(e.target.value)}
                  className="form-input text-lg"
                />
              </div>
              <div className="form-group">
                <label htmlFor="bio" className="form-label text-lg">Bio</label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="form-input text-lg"
                />
              </div>
              <h2 className="text-2xl font-bold">Social Links</h2>
              <div className="form-group">
                <label htmlFor="linkedin" className="form-label text-lg">LinkedIn</label>
                <input
                  id="linkedin"
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="form-input text-lg"
                />
              </div>
              <div className="form-group">
                <label htmlFor="github" className="form-label text-lg">GitHub</label>
                <input
                  id="github"
                  type="text"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="form-input text-lg"
                />
              </div>
              <div className="form-group">
                <label htmlFor="twitter" className="form-label text-lg">Twitter</label>
                <input
                  id="twitter"
                  type="text"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="form-input text-lg"
                />
              </div>
              <div className="flex gap-4 mt-6">
                <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={() => setIsEditing(false)} className="btn btn-secondary w-full">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label text-lg">Display Name</label>
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-700">{user.displayName || 'Not set'}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label text-lg">Profile Picture</label>
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  {user.profilePicture ? <img src={user.profilePicture} alt="Profile" className="w-16 h-16 rounded-full" /> : <p className="text-gray-700">Not set</p>}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label text-lg">Bio</label>
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-700">{user.bio || 'Not set'}</p>
                </div>
              </div>
              <h2 className="text-2xl font-bold">Social Links</h2>
              <div className="form-group">
                <label className="form-label text-lg">LinkedIn</label>
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-700">{user.socialLinks?.linkedin || 'Not set'}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label text-lg">GitHub</label>
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-700">{user.socialLinks?.github || 'Not set'}</p>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label text-lg">Twitter</label>
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-lg">
                  <p className="text-gray-700">{user.socialLinks?.twitter || 'Not set'}</p>
                </div>
              </div>
              <button onClick={() => setIsEditing(true)} className="btn btn-secondary btn-sm">Edit</button>
            </>
          )}
        </div>

        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {success && <p className="text-green-500 text-center mt-4">{success}</p>}
      </div>
    </div>
  );
}

export default UserProfile;