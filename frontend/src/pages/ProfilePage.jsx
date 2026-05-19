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
    <section className="page-fade" style={{ display: 'grid', placeItems: 'center', minHeight: '100vh', padding: '2rem' }}>
      <div className="glass" style={{ borderRadius: '1.5rem', width: '100%', maxWidth: '56rem', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold' }}>Profile</h2>
        {error && (
          <div className="error-box" style={{ padding: '1rem', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', color: '#7f1d1d', borderRadius: '0.5rem' }}>
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid #e6e1d4', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingY: '1rem', borderBottom: '1px dashed #e6e1d4' }}>
            <span style={{ color: '#5a584f', fontWeight: '500' }}>Name</span>
            <strong style={{ color: '#1f1f1b' }}>{display?.name || 'Loading...'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingY: '1rem', borderBottom: '1px dashed #e6e1d4' }}>
            <span style={{ color: '#5a584f', fontWeight: '500' }}>Email</span>
            <strong style={{ color: '#1f1f1b' }}>{display?.email || 'Loading...'}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingY: '1rem' }}>
            <span style={{ color: '#5a584f', fontWeight: '500' }}>Member Since</span>
            <strong style={{ color: '#1f1f1b' }}>
              {display?.createdAt ? new Date(display.createdAt).toLocaleDateString() : 'Just now'}
            </strong>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '1rem' }}>
          <article style={{ border: '1px solid #e6e1d4', borderRadius: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.56)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#d14d36' }}>{profile?.stats?.noteCount ?? '-'}</h3>
            <p style={{ fontSize: '0.875rem', color: '#5a584f', marginTop: '0.5rem' }}>Total Notes</p>
          </article>
          <article style={{ border: '1px solid #e6e1d4', borderRadius: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.56)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#d14d36' }}>{profile?.stats?.activeCount ?? '-'}</h3>
            <p style={{ fontSize: '0.875rem', color: '#5a584f', marginTop: '0.5rem' }}>Active Notes</p>
          </article>
          <article style={{ border: '1px solid #e6e1d4', borderRadius: '1rem', padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.56)', textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#d14d36' }}>{profile?.stats?.archivedCount ?? '-'}</h3>
            <p style={{ fontSize: '0.875rem', color: '#5a584f', marginTop: '0.5rem' }}>Archived Notes</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
