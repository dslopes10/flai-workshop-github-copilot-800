import React, { useState, useEffect } from 'react';

function Activities() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespace 
          ? `https://${codespace}-8000.app.github.dev/api/activities/`
          : 'http://localhost:8000/api/activities/';
        
        console.log('Fetching activities from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Activities API response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const activitiesData = data.results || data;
        console.log('Activities data:', activitiesData);
        
        setActivities(activitiesData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching activities:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  const getSortedActivities = () => {
    const sorted = [...activities].sort((a, b) => {
      let aVal, bVal;

      if (sortField === 'date') {
        aVal = new Date(a.date).getTime();
        bVal = new Date(b.date).getTime();
      } else if (sortField === 'duration_minutes' || sortField === 'distance_km' || sortField === 'points') {
        aVal = a[sortField] || 0;
        bVal = b[sortField] || 0;
      } else {
        aVal = (a[sortField] || '').toString().toLowerCase();
        bVal = (b[sortField] || '').toString().toLowerCase();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  };

  const getActivityTypeIcon = (type) => {
    const icons = {
      'running': '🏃',
      'cycling': '🚴',
      'swimming': '🏊',
      'weightlifting': '🏋️',
      'yoga': '🧘',
      'cardio': '❤️'
    };
    return icons[type?.toLowerCase()] || '💪';
  };

  const getActivityTypeColor = (type) => {
    const colors = {
      'running': { bg: 'rgba(34, 197, 94, 0.2)', border: '#22c55e', glow: 'rgba(34, 197, 94, 0.4)' },
      'cycling': { bg: 'rgba(59, 130, 246, 0.2)', border: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' },
      'swimming': { bg: 'rgba(14, 165, 233, 0.2)', border: '#0ea5e9', glow: 'rgba(14, 165, 233, 0.4)' },
      'weightlifting': { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
      'yoga': { bg: 'rgba(168, 85, 247, 0.2)', border: '#a855f7', glow: 'rgba(168, 85, 247, 0.4)' },
      'cardio': { bg: 'rgba(236, 72, 153, 0.2)', border: '#ec4899', glow: 'rgba(236, 72, 153, 0.4)' }
    };
    return colors[type?.toLowerCase()] || { bg: 'rgba(99, 102, 241, 0.2)', border: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)' };
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span style={{ opacity: 0.3 }}> ⇅</span>;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  if (loading) return <div className="container mt-5"><h2>Loading activities...</h2></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <div className="activities-header">
        <h1 className="mb-4">🏃 OctoFit Activities</h1>
        <div className="sort-controls">
          <span className="sort-label">Sort by:</span>
          <select 
            className="sort-select"
            value={sortField}
            onChange={(e) => {
              handleSort(e.target.value);
            }}
          >
            <option value="date">Date</option>
            <option value="user_id">User</option>
            <option value="type">Type</option>
            <option value="duration_minutes">Duration</option>
            <option value="distance_km">Distance</option>
            <option value="points">Points</option>
          </select>
          <button 
            className="sort-direction-btn"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? '▲ Ascending' : '▼ Descending'}
          </button>
        </div>
      </div>

      <div className="activities-timeline">
        {getSortedActivities().map((activity, index) => {
          const typeColor = getActivityTypeColor(activity.type);
          const icon = getActivityTypeIcon(activity.type);
          return (
            <div key={activity._id} className="activity-card" style={{ animationDelay: `${index * 0.03}s` }}>
              <div className="activity-timeline-marker" style={{ background: typeColor.border }}></div>
              <div className="activity-content">
                <div className="activity-header">
                  <div className="activity-type-badge" style={{
                    background: typeColor.bg,
                    borderColor: typeColor.border,
                    boxShadow: `0 0 15px ${typeColor.glow}`
                  }}>
                    <span className="activity-icon">{icon}</span>
                    <span className="activity-type-label" style={{ color: typeColor.border }}>
                      {activity.type}
                    </span>
                  </div>
                  <div className="activity-user-badge">
                    <span className="user-avatar-small">{activity.user_id?.charAt(0).toUpperCase()}</span>
                    <span>{activity.user_id}</span>
                  </div>
                </div>

                <div className="activity-metrics">
                  <div className="metric-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="12 6 12 12 16 14"/>
                    </svg>
                    <span className="metric-value">{activity.duration_minutes}</span>
                    <span className="metric-unit">min</span>
                  </div>
                  {activity.distance_km && (
                    <div className="metric-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="5" y1="12" x2="19" y2="12"/>
                        <polyline points="12 5 19 12 12 19"/>
                      </svg>
                      <span className="metric-value">{activity.distance_km}</span>
                      <span className="metric-unit">km</span>
                    </div>
                  )}
                  <div className="metric-item points-metric">
                    <span className="metric-icon">⭐</span>
                    <span className="metric-value">{activity.points}</span>
                    <span className="metric-unit">pts</span>
                  </div>
                  <div className="metric-item date-metric">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    <span className="metric-value">{new Date(activity.date).toLocaleDateString()}</span>
                  </div>
                </div>

                {activity.notes && (
                  <div className="activity-notes">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    <span>{activity.notes}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <p className="activities-count">Total activities: {activities.length}</p>
    </div>
  );
}

export default Activities;
