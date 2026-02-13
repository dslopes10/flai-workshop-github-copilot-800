import React, { useState, useEffect } from 'react';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespace 
          ? `https://${codespace}-8000.app.github.dev/api/users/`
          : 'http://localhost:8000/api/users/';
        
        console.log('Fetching users from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Users API response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const usersData = data.results || data;
        console.log('Users data:', usersData);
        
        setUsers(usersData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSort = (field) => {
    const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(direction);
  };

  const getSortedUsers = () => {
    const sorted = [...users].sort((a, b) => {
      let aVal, bVal;

      if (sortField === 'points') {
        aVal = a.stats?.total_points || 0;
        bVal = b.stats?.total_points || 0;
      } else if (sortField === 'activities') {
        aVal = a.stats?.activities_completed || 0;
        bVal = b.stats?.activities_completed || 0;
      } else if (sortField === 'team_id') {
        aVal = a.team_id?.toLowerCase() || '';
        bVal = b.team_id?.toLowerCase() || '';
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

  const getTeamColor = (teamId) => {
    const colors = {
      'Team Marvel': { bg: 'rgba(239, 68, 68, 0.2)', border: '#ef4444', glow: 'rgba(239, 68, 68, 0.4)' },
      'Team DC': { bg: 'rgba(59, 130, 246, 0.2)', border: '#3b82f6', glow: 'rgba(59, 130, 246, 0.4)' }
    };
    return colors[teamId] || { bg: 'rgba(99, 102, 241, 0.2)', border: '#6366f1', glow: 'rgba(99, 102, 241, 0.4)' };
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <span style={{ opacity: 0.3 }}> ⇅</span>;
    return sortDirection === 'asc' ? ' ▲' : ' ▼';
  };

  if (loading) return <div className="container mt-5"><h2>Loading users...</h2></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <div className="users-header">
        <h1 className="mb-4">👥 OctoFit Users</h1>
        <div className="sort-controls">
          <span className="sort-label">Sort by:</span>
          <select 
            className="sort-select"
            value={sortField}
            onChange={(e) => {
              handleSort(e.target.value);
            }}
          >
            <option value="username">Username</option>
            <option value="full_name">Full Name</option>
            <option value="points">Points</option>
            <option value="activities">Activities</option>
            <option value="team_id">Team</option>
          </select>
          <button 
            className="sort-direction-btn"
            onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
          >
            {sortDirection === 'asc' ? '▲ Ascending' : '▼ Descending'}
          </button>
        </div>
      </div>

      <div className="users-grid">
        {getSortedUsers().map((user, index) => {
          const teamColor = getTeamColor(user.team_id);
          return (
            <div key={user._id} className="user-card" style={{ animationDelay: `${index * 0.05}s` }}>
              <div className="user-card-header">
                <div className="user-avatar">{user.username?.charAt(0).toUpperCase()}</div>
                <div className="user-info-header">
                  <h3 className="user-username">{user.username}</h3>
                  <p className="user-fullname">{user.full_name}</p>
                </div>
              </div>
              <div className="user-card-body">
                <div className="user-email">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                  <span>{user.email}</span>
                </div>
                <div 
                  className="user-team"
                  style={{
                    background: teamColor.bg,
                    borderColor: teamColor.border,
                    boxShadow: `0 0 15px ${teamColor.glow}`
                  }}
                >
                  <span style={{ color: teamColor.border }}>{user.team_id}</span>
                </div>
                <div className="user-stats">
                  <div className="stat-box points-stat">
                    <div className="stat-icon">⭐</div>
                    <div className="stat-content">
                      <div className="stat-value">{user.stats?.total_points || 0}</div>
                      <div className="stat-label">Points</div>
                    </div>
                  </div>
                  <div className="stat-box activities-stat">
                    <div className="stat-icon">🎯</div>
                    <div className="stat-content">
                      <div className="stat-value">{user.stats?.activities_completed || 0}</div>
                      <div className="stat-label">Activities</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="users-count">Total users: {users.length}</p>
    </div>
  );
}

export default Users;
