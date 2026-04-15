import { useEffect, useState } from 'react';

import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

const ProfilePage = () => {
  const { token, user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await api.getProfile(token);
        setProfile(data);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      }
    };

    loadProfile();
  }, [token]);

  const display = profile || user;

  return (
    <section className="profile page-fade">
      <div className="profile-card glass">
        <h2>Profile</h2>
        {error && <div className="error-box">{error}</div>}

        <div className="profile-meta">
          <div>
            <span>Name</span>
            <strong>{display?.name || 'Loading...'}</strong>
          </div>
          <div>
            <span>Email</span>
            <strong>{display?.email || 'Loading...'}</strong>
          </div>
          <div>
            <span>Joined</span>
            <strong>
              {display?.createdAt ? new Date(display.createdAt).toLocaleDateString() : 'Just now'}
            </strong>
          </div>
        </div>

        <div className="stats-grid">
          <article>
            <h3>{profile?.stats?.noteCount ?? '-'}</h3>
            <p>Total Notes</p>
          </article>
          <article>
            <h3>{profile?.stats?.activeCount ?? '-'}</h3>
            <p>Active Notes</p>
          </article>
          <article>
            <h3>{profile?.stats?.archivedCount ?? '-'}</h3>
            <p>Archived Notes</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
