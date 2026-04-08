import { Link } from 'react-router';

import { ROUTES, BUTTONS, FEATURES } from '@/constants';
import { useAppSelector } from '@/store/store';
import './styles/Home.css';

export const Home = () => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content-wrapper">
          <div className="hero-text">
            <h1 className="hero-title">Argent Bank</h1>
            <p className="hero-subtitle">Experience the future of digital banking with Argent Bank. Secure, fast, and designed for you.</p>
            <Link to={isAuthenticated ? ROUTES.PROFILE : ROUTES.LOGIN} className="cta-button">
              {isAuthenticated ? BUTTONS.VIEW_PROFILE : BUTTONS.SIGN_IN}
            </Link>
          </div>
          <div className="hero-visual">
            <div className="gradient-orb"></div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="features-header">
          <h2>Why Choose Argent Bank?</h2>
          <p>Everything you need for modern money management</p>
        </div>
        <div className="features-grid">
          {FEATURES.map((feature) => {
            const FeatureIcon = feature.icon;
            return (
              <div key={feature.title} className="feature-card">
                <div className="feature-icon-wrapper">
                  <FeatureIcon className="feature-icon" />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
                <div className="feature-accent"></div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="trust-section">
        <div className="trust-content">
          <h2>Trusted by Thousands</h2>
          <div className="trust-stats">
            <div className="stat">
              <span className="stat-number">100K+</span>
              <span className="stat-label">Active Users</span>
            </div>
            <div className="stat">
              <span className="stat-number">$50B+</span>
              <span className="stat-label">Managed</span>
            </div>
            <div className="stat">
              <span className="stat-number">99.9%</span>
              <span className="stat-label">Uptime</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
