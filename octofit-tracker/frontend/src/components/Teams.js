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
        {teams.map((team) => (
          <div key={team._id} className="col-md-6 mb-4">
            <div className="card shadow">
              <div className="card-header bg-primary text-white">
                <h3 className="mb-0">{team.name}</h3>
              </div>
              <div className="card-body">
                <h5 className="card-title">Team Members</h5>
                <ul className="list-group list-group-flush">
                  {team.members && team.members.map((member, index) => (
                    <li key={index} className="list-group-item">
                      <strong>{member}</strong>
                    </li>
                  ))}
                </ul>
                <div className="mt-3">
                  <p className="mb-1"><strong>Total Members:</strong> {team.members?.length || 0}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Teams;
