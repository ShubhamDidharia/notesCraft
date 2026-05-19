import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="page-fade grid gap-6 md:grid-cols-2 items-start mt-20">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-primary">Your second brain, upgraded</p>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 text-balance leading-tight">
            Capture ideas. Retrieve intent.
          </h1>
          <p className="text-lg text-muted-foreground mt-6 leading-relaxed">
            NoteCraft is a MERN-based notes app designed for semantic retrieval, so your future search can go
            beyond keywords and understand meaning.
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
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
      <div className="glass p-8 rounded-3xl space-y-4 sticky top-24">
        <h3 className="text-2xl font-bold">What is ready today</h3>
        <ul className="space-y-3">
          <li className="flex gap-3 items-start">
            <span className="text-primary mt-1">✓</span>
            <span className="text-muted-foreground">Secure signup/signin with JWT authentication</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="text-primary mt-1">✓</span>
            <span className="text-muted-foreground">Create, edit, delete and browse all your notes</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="text-primary mt-1">✓</span>
            <span className="text-muted-foreground">Semantic search-ready schema with embeddings stored per note</span>
          </li>
          <li className="flex gap-3 items-start">
            <span className="text-primary mt-1">✓</span>
            <span className="text-muted-foreground">Profile analytics for your note activity</span>
          </li>
        </ul>
      </div>
    </section>
  );
};

export default LandingPage;
