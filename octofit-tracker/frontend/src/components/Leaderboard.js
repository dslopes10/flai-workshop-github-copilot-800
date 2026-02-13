import React, { useState, useEffect } from 'react';

function Leaderboard() {
  const [individualLeaderboard, setIndividualLeaderboard] = useState([]);
  const [teamLeaderboard, setTeamLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const codespace = process.env.REACT_APP_CODESPACE_NAME;
        const baseUrl = codespace 
          ? `https://${codespace}-8000.app.github.dev/api/leaderboard`
          : 'http://localhost:8000/api/leaderboard';
        
        const individualUrl = `${baseUrl}/individual/`;
        const teamUrl = `${baseUrl}/team/`;
        
        console.log('Fetching individual leaderboard from:', individualUrl);
        console.log('Fetching team leaderboard from:', teamUrl);
        
        // Fetch individual leaderboard
        const individualResponse = await fetch(individualUrl);
        if (!individualResponse.ok) {
          throw new Error(`HTTP error! status: ${individualResponse.status}`);
        }
        const individualData = await individualResponse.json();
        console.log('Individual leaderboard API response:', individualData);
        
        // Handle both paginated (.results) and plain array responses
        const individualArray = individualData.results || individualData;
        console.log('Individual leaderboard data:', individualArray);
        setIndividualLeaderboard(individualArray);
        
        // Fetch team leaderboard
        const teamResponse = await fetch(teamUrl);
        if (!teamResponse.ok) {
          throw new Error(`HTTP error! status: ${teamResponse.status}`);
        }
        const teamData = await teamResponse.json();
        console.log('Team leaderboard API response:', teamData);
        
        // Handle both paginated (.results) and plain array responses
        const teamArray = teamData.results || teamData;
        console.log('Team leaderboard data:', teamArray);
        setTeamLeaderboard(teamArray);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboards:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchLeaderboards();
  }, []);

  const getMedalIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  if (loading) return <div className="container mt-5"><h2>Loading leaderboard...</h2></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">OctoFit Leaderboard</h1>
      
      <div className="row">
        {/* Individual Leaderboard */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Individual Rankings</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>User</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {individualLeaderboard.map((entry) => (
                      <tr key={entry._id}>
                        <td className="fs-4">{getMedalIcon(entry.rank)}</td>
                        <td>
                          <strong>{entry.user_id}</strong>
                          {entry.team_id && (
                            <div><small className="text-muted">{entry.team_id}</small></div>
                          )}
                        </td>
                        <td><strong>{entry.points}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Team Leaderboard */}
        <div className="col-md-6 mb-4">
          <div className="card shadow">
            <div className="card-header bg-success text-white">
              <h3 className="mb-0">Team Rankings</h3>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Team</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamLeaderboard.map((entry) => (
                      <tr key={entry._id}>
                        <td className="fs-4">{getMedalIcon(entry.rank)}</td>
                        <td><strong>{entry.team_id}</strong></td>
                        <td><strong>{entry.points}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
