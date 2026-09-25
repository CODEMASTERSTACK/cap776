import React from 'react';

export default function Footer({ meta }) {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-left">
          <span className="footer-brand">{meta.title}</span>
          <span className="footer-sep">•</span>
          <span className="footer-sub">{meta.subject}</span>
        </div>
        <div className="footer-right">
          <span>{meta.academicSession}</span>
          <span className="footer-sep">•</span>
          <span>{meta.department}</span>
        </div>
      </div>
    </footer>
  );
}
