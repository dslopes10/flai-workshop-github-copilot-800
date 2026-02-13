import React, { useState, useEffect } from 'react';

function Teams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME;
        const apiUrl = codespace 
          ? `https://${codespace}-8000.app.github.dev/api/teams/`
          : 'http://localhost:8000/api/teams/';
        
        console.log('Fetching teams from:', apiUrl);
        
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Teams API response:', data);
        
        // Handle both paginated (.results) and plain array responses
        const teamsData = data.results || data;
        console.log('Teams data:', teamsData);
        
        setTeams(teamsData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching teams:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTeams();
  }, []);

  if (loading) return <div className="container mt-5"><h2>Loading teams...</h2></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">OctoFit Teams</h1>
      <div className="row">
        {teams.map((team, index) => (
          <div key={team._id} className="col-md-6 mb-4">
            <div className="team-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="team-card-header">
                <div className="team-icon">🤝</div>
                <h3 className="team-name">{team.name}</h3>
                <div className="team-member-count">
                  <span className="count-badge">{team.members?.length || 0}</span>
                  <span className="count-label">Members</span>
                </div>
              </div>
              <div className="team-card-body">
                <h5 className="team-section-title">Team Members</h5>
                <div className="team-members-grid">
                  {team.members && team.members.map((member, idx) => (
                    <div key={idx} className="team-member-item">
                      <div className="member-avatar">{member.charAt(0).toUpperCase()}</div>
                      <span className="member-name">{member}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="team-count">Total teams: {teams.length}</p>
    </div>
  );
}

export default Teams;
