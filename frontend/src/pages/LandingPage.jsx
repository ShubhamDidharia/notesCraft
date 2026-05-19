import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="page-fade" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start', marginTop: '5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <p style={{ fontSize: '0.875rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#d14d36' }}>Your second brain, upgraded</p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 'bold', marginTop: '1rem', lineHeight: '1.2' }}>
            Capture ideas. Retrieve intent.
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#5a584f', marginTop: '1.5rem', lineHeight: '1.6' }}>
            NoteCraft is a MERN-based notes app designed for semantic retrieval, so your future search can go
            beyond keywords and understand meaning.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Link 
            to={isAuthenticated ? '/notes' : '/auth'} 
            className="btn btn-primary"
          >
            {isAuthenticated ? 'Open Notes' : 'Get Started'}
          </Link>
          <Link 
            to="/profile" 
            className="btn btn-ghost"
          >
            View Profile
          </Link>
        </div>
      </div>
      <div className="glass" style={{ padding: '2rem', borderRadius: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '6rem' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>What is ready today</h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ color: '#d14d36', marginTop: '0.25rem' }}>✓</span>
            <span style={{ color: '#5a584f' }}>Secure signup/signin with JWT authentication</span>
          </li>
          <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ color: '#d14d36', marginTop: '0.25rem' }}>✓</span>
            <span style={{ color: '#5a584f' }}>Create, edit, delete and browse all your notes</span>
          </li>
          <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ color: '#d14d36', marginTop: '0.25rem' }}>✓</span>
            <span style={{ color: '#5a584f' }}>Semantic search-ready schema with embeddings stored per note</span>
          </li>
          <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ color: '#d14d36', marginTop: '0.25rem' }}>✓</span>
            <span style={{ color: '#5a584f' }}>Profile analytics for your note activity</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default LandingPage;
