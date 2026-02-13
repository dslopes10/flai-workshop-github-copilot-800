import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const navigationCards = [
    {
      title: 'Users',
      icon: '👥',
      description: 'View and manage user profiles, track points and activities',
      path: '/users',
      color: { bg: 'rgba(99, 102, 241, 0.2)', border: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)' }
    },
    {
      title: 'Teams',
      icon: '🤝',
      description: 'Explore teams, view members and team achievements',
      path: '/teams',
      color: { bg: 'rgba(139, 92, 246, 0.2)', border: '#8b5cf6', glow: 'rgba(139, 92, 246, 0.4)' }
    },
    {
      title: 'Activities',
      icon: '🏃',
      description: 'Browse all activities, track performance metrics',
      path: '/activities',
      color: { bg: 'rgba(236, 72, 153, 0.2)', border: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' }
    },
    {
      title: 'Workouts',
      icon: '💪',
      description: 'Discover workout plans and exercise routines',
      path: '/workouts',
      color: { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)' }
    },
    {
      title: 'Leaderboard',
      icon: '🏆',
      description: 'See top performers and team rankings',
      path: '/leaderboard',
      color: { bg: 'rgba(234, 179, 8, 0.2)', border: '#eab308', glow: 'rgba(234, 179, 8, 0.4)' }
    }
  ];

  return (
    <div className="home-container">
      <div className="home-hero">
        <h1 className="home-title">
          <span className="title-icon">🏋️</span>
          Welcome to OctoFit Tracker
        </h1>
        <p className="home-subtitle">
          Your ultimate fitness companion for tracking workouts, competing with teams, and achieving your fitness goals
        </p>
      </div>

      <div className="home-grid">
        {navigationCards.map((card, index) => (
          <Link 
            key={index} 
            to={card.path} 
            className="home-nav-card"
            style={{
              borderColor: card.color.border,
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div 
              className="nav-card-glow"
              style={{
                background: `radial-gradient(circle at center, ${card.color.glow}, transparent)`
              }}
            ></div>
            <div className="nav-card-icon">{card.icon}</div>
            <h3 
              className="nav-card-title"
              style={{ color: card.color.border }}
            >
              {card.title}
            </h3>
            <p className="nav-card-description">{card.description}</p>
            <div 
              className="nav-card-arrow"
              style={{ color: card.color.border }}
            >
              →
            </div>
          </Link>
        ))}
      </div>

      <div className="home-stats">
        <div className="stat-item">
          <div className="stat-icon">👤</div>
          <div className="stat-value">12</div>
          <div className="stat-label">Active Users</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">👥</div>
          <div className="stat-value">2</div>
          <div className="stat-label">Teams</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">66</div>
          <div className="stat-label">Activities</div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">💪</div>
          <div className="stat-value">5</div>
          <div className="stat-label">Workouts</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
