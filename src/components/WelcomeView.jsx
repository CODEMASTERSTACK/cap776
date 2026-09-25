import React, { useEffect } from 'react';

export default function WelcomeView({ onAccessProject }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter') {
        onAccessProject();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onAccessProject]);

  return (
    <div className="editorial-welcome-hero" onClick={onAccessProject} style={{ cursor: 'pointer' }}>
      <div className="editorial-hero-container">
        <p className="editorial-hero-subtext">
          We technically advise writing this from scratch, but since your sanity called in a favor, here you go.
        </p>
        <h1 className="editorial-hero-cap776" title="Click to Access Project">
          CAP776
        </h1>
        <p className="editorial-hero-note">
          Free code, zero liability. Double-check before submitting. If it crashes or costs you grades, don’t look at us.
        </p>
      </div>
    </div>
  );
}
