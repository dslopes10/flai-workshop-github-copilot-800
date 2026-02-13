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

  const getRankClass = (rank) => {
    if (rank === 1) return 'rank-gold';
    if (rank === 2) return 'rank-silver';
    if (rank === 3) return 'rank-bronze';
    return 'rank-normal';
  };

  if (loading) return <div className="container mt-5"><h2>Loading leaderboard...</h2></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">Error: {error}</div></div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">🏆 OctoFit Leaderboard</h1>
      
      <div className="row">
        {/* Individual Leaderboard */}
        <div className="col-lg-6 mb-4">
          <div className="leaderboard-card">
            <div className="leaderboard-header individual-header">
              <div className="header-icon">👤</div>
              <h3 className="leaderboard-title">Individual Rankings</h3>
            </div>
            <div className="leaderboard-body">
              <div className="table-responsive">
                <table className="table table-dark leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>User</th>
                      <th className="text-end">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {individualLeaderboard.map((entry) => (
                      <tr key={entry._id} className={getRankClass(entry.rank)}>
                        <td className="rank-cell">
                          <span className="rank-badge">{getMedalIcon(entry.rank)}</span>
                        </td>
                        <td className="user-cell">
                          <div className="user-info">
                            <strong className="user-name">{entry.user_id}</strong>
                            {entry.team_id && (
                              <small className="team-tag">{entry.team_id}</small>
                            )}
                          </div>
                        </td>
                        <td className="points-cell text-end">
                          <span className="points-value">{entry.points}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Team Leaderboard */}
        <div className="col-lg-6 mb-4">
          <div className="leaderboard-card">
            <div className="leaderboard-header team-header">
              <div className="header-icon">🤝</div>
              <h3 className="leaderboard-title">Team Rankings</h3>
            </div>
            <div className="leaderboard-body">
              <div className="table-responsive">
                <table className="table table-dark leaderboard-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Team</th>
                      <th className="text-end">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {teamLeaderboard.map((entry) => (
                      <tr key={entry._id} className={getRankClass(entry.rank)}>
                        <td className="rank-cell">
                          <span className="rank-badge">{getMedalIcon(entry.rank)}</span>
                        </td>
                        <td className="team-cell">
                          <strong className="team-name">{entry.team_id}</strong>
                        </td>
                        <td className="points-cell text-end">
                          <span className="points-value">{entry.points}</span>
                        </td>
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
