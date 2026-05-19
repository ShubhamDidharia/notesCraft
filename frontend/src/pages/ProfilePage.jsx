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
    <section className="page-fade grid place-items-center min-h-screen py-8">
      <div className="glass rounded-3xl w-full max-w-2xl p-8 space-y-8">
        <h2 className="text-4xl font-bold">Profile</h2>
        {error && (
          <div className="error-box border border-destructive/30 bg-destructive/10 text-destructive rounded-lg p-4">
            {error}
          </div>
        )}

        <div className="space-y-4 border-t border-border pt-6">
          <div className="flex justify-between items-center py-4 border-b border-dashed border-border/50">
            <span className="text-muted-foreground font-medium">Name</span>
            <strong className="text-foreground">{display?.name || 'Loading...'}</strong>
          </div>
          <div className="flex justify-between items-center py-4 border-b border-dashed border-border/50">
            <span className="text-muted-foreground font-medium">Email</span>
            <strong className="text-foreground">{display?.email || 'Loading...'}</strong>
          </div>
          <div className="flex justify-between items-center py-4">
            <span className="text-muted-foreground font-medium">Member Since</span>
            <strong className="text-foreground">
              {display?.createdAt ? new Date(display.createdAt).toLocaleDateString() : 'Just now'}
            </strong>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <article className="stats-item border border-border rounded-2xl p-4 bg-white/56 text-center">
            <h3 className="text-3xl font-bold text-primary">{profile?.stats?.noteCount ?? '-'}</h3>
            <p className="text-sm text-muted-foreground mt-2">Total Notes</p>
          </article>
          <article className="stats-item border border-border rounded-2xl p-4 bg-white/56 text-center">
            <h3 className="text-3xl font-bold text-primary">{profile?.stats?.activeCount ?? '-'}</h3>
            <p className="text-sm text-muted-foreground mt-2">Active Notes</p>
          </article>
          <article className="stats-item border border-border rounded-2xl p-4 bg-white/56 text-center">
            <h3 className="text-3xl font-bold text-primary">{profile?.stats?.archivedCount ?? '-'}</h3>
            <p className="text-sm text-muted-foreground mt-2">Archived Notes</p>
          </article>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
