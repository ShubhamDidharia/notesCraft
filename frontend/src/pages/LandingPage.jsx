import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="landing page-fade">
      <div className="hero-text">
        <p className="eyebrow">Your second brain, upgraded</p>
        <h1>
          Capture ideas.
          <br />
          Retrieve intent.
        </h1>
        <p>
          NoteCraft is a MERN-based notes app designed for semantic retrieval, so your future search can go
          beyond keywords and understand meaning.
        </p>
        <div className="hero-cta">
          <Link to={isAuthenticated ? '/notes' : '/auth'} className="btn solid">
            {isAuthenticated ? 'Open Notes' : 'Get Started'}
          </Link>
          <Link to="/profile" className="btn ghost">
            View Profile
          </Link>
        </div>
      </div>
      <div className="hero-card glass">
        <h3>What is ready today</h3>
        <ul>
          <li>Secure signup/signin with JWT authentication</li>
          <li>Create, edit, delete and browse all your notes</li>
          <li>Semantic search-ready schema with embeddings stored per note</li>
          <li>Profile analytics for your note activity</li>
        </ul>
      </div>
    </section>
  );
};

export default LandingPage;
